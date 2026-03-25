import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { query } from "@/lib/db"
import { generateJSON } from "@/lib/claude"
import { getClientContext } from "@/lib/client-context"
import { trackServer } from "@/lib/tracking"
import { buildPostSocialPrompt } from "@/lib/prompts/post-social"
import { buildAnnonceStorytellingPrompt } from "@/lib/prompts/annonce-storytelling"
import { buildArticleSeoPrompt } from "@/lib/prompts/article-seo"
// Prompts codes par @ia en parallele — imports a activer quand disponibles
// import { buildScriptVideoPrompt } from "@/lib/prompts/script-video"
// import { buildNewsletterPrompt } from "@/lib/prompts/newsletter"
// import { buildEmailProspectionPrompt } from "@/lib/prompts/email-prospection"

interface PackMensuelBody {
  client_id: string
  mois: string // ex: "2026-04"
}

interface DeliverableRow {
  id: string
}

/**
 * POST /api/generate/pack-mensuel
 * Genere le pack mensuel complet pour un client.
 * Admin-only.
 */
export async function POST(request: NextRequest) {
  // Admin check
  const user = await currentUser()
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user?.emailAddresses[0]?.emailAddress
  if (!userEmail || userEmail !== adminEmail) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
  }

  let body: PackMensuelBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { client_id, mois } = body
  if (!client_id || !mois) {
    return NextResponse.json(
      { error: "client_id et mois sont requis" },
      { status: 400 }
    )
  }

  // Fetch client context
  let ctx
  try {
    ctx = await getClientContext(client_id)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Client context error"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  // Fetch client email for tracking and deliverables
  const { rows: clientRows } = await query<{ email: string }>(
    "SELECT email FROM clients WHERE id = $1",
    [client_id]
  )
  const clientEmail = clientRows[0]?.email
  if (!clientEmail) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  await trackServer("production_started", userEmail, {
    client_id,
    pack_type: "mensuel",
    mois,
  })

  const deliverableIds: string[] = []
  const moisLabel = formatMoisLabel(mois)

  try {
    // M1 : 12 posts reseaux sociaux (sequentiel)
    const postsPrompt = buildPostSocialPrompt({
      ...ctx,
      plateforme: "mix",
      nombre_posts: 12,
      mois_cible: moisLabel,
    })
    const postsResult = await generateJSON<{ posts: Array<{ plateforme: string; type: string; texte: string; hashtags: string[]; brief_visuel: string; hook: string }> }>(
      { ...postsPrompt, maxTokens: 8192 }
    )
    for (const post of postsResult.data.posts) {
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "post",
        title: post.hook || `Post ${post.plateforme}`,
        content: post.texte,
        metadata: { hashtags: post.hashtags, brief_visuel: post.brief_visuel, plateforme: post.plateforme, type_post: post.type },
        month: mois,
      })
      deliverableIds.push(id)
    }

    // M5 : 4 annonces personnalisees
    const annoncesPrompt = buildAnnonceStorytellingPrompt({
      ...ctx,
      nombre_annonces: 4,
    })
    const annoncesResult = await generateJSON<{ annonces: Array<{ bien_titre: string; annonce_complete: string; accroche_courte: string; titre_annonce: string; mots_cles_seo: string[] }> }>(
      { ...annoncesPrompt, maxTokens: 8192 }
    )
    for (const annonce of annoncesResult.data.annonces) {
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "annonce",
        title: annonce.titre_annonce,
        content: annonce.annonce_complete,
        metadata: { accroche_courte: annonce.accroche_courte, mots_cles_seo: annonce.mots_cles_seo },
        month: mois,
      })
      deliverableIds.push(id)
    }

    // M3 : 2 articles SEO
    const articlesPrompt = buildArticleSeoPrompt({
      ...ctx,
      nombre_articles: 2,
      mois_cible: moisLabel,
    })
    const articlesResult = await generateJSON<{ articles: Array<{ frontmatter: { title: string; meta_description: string; slug: string }; contenu_markdown: string; liens_internes_suggeres: string[] }> }>(
      { ...articlesPrompt, maxTokens: 8192 }
    )
    for (const article of articlesResult.data.articles) {
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "article_seo",
        title: article.frontmatter.title,
        content: article.contenu_markdown,
        metadata: { meta_description: article.frontmatter.meta_description, slug: article.frontmatter.slug, liens_internes: article.liens_internes_suggeres },
        month: mois,
      })
      deliverableIds.push(id)
    }

    // M2 : 4 scripts video
    // [PROVISOIRE — a activer quand @ia livre buildScriptVideoPrompt]
    // Pour l'instant, generer via un prompt inline simple
    const scriptsResult = await generateScriptsVideo(ctx, 4, moisLabel)
    for (const script of scriptsResult) {
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "script_video",
        title: script.title,
        content: script.content,
        metadata: {},
        month: mois,
      })
      deliverableIds.push(id)
    }

    // M4 : 1 newsletter
    // [PROVISOIRE — a activer quand @ia livre buildNewsletterPrompt]
    const newsletterResult = await generateNewsletter(ctx, moisLabel)
    const newsletterId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "newsletter",
      title: newsletterResult.title,
      content: newsletterResult.content,
      metadata: {},
      month: mois,
    })
    deliverableIds.push(newsletterId)

    // M6 : 1 email prospection
    // [PROVISOIRE — a activer quand @ia livre buildEmailProspectionPrompt]
    const emailResult = await generateEmailProspection(ctx, moisLabel)
    const emailId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "email_prospection",
      title: emailResult.title,
      content: emailResult.content,
      metadata: {},
      month: mois,
    })
    deliverableIds.push(emailId)

  } catch (err) {
    console.error("Error generating pack mensuel:", err)
    return NextResponse.json(
      {
        error: "Erreur lors de la generation",
        details: err instanceof Error ? err.message : String(err),
        deliverable_ids: deliverableIds,
      },
      { status: 500 }
    )
  }

  await trackServer("production_completed", userEmail, {
    client_id,
    pack_type: "mensuel",
    mois,
    deliverables_count: deliverableIds.length,
  })

  return NextResponse.json({
    deliverable_ids: deliverableIds,
    status: "completed",
    count: deliverableIds.length,
  })
}

// --- Helpers ---

function formatMoisLabel(mois: string): string {
  const [year, month] = mois.split("-")
  const monthNames = [
    "janvier", "fevrier", "mars", "avril", "mai", "juin",
    "juillet", "aout", "septembre", "octobre", "novembre", "decembre",
  ]
  const idx = parseInt(month, 10) - 1
  return `${monthNames[idx] || month} ${year}`
}

interface InsertDeliverableParams {
  clientEmail: string
  clientId: string
  type: string
  title: string
  content: string
  metadata: Record<string, unknown>
  month: string
}

async function insertDeliverable(params: InsertDeliverableParams): Promise<string> {
  const { rows } = await query<DeliverableRow>(
    `INSERT INTO deliverables (client_email, client_id, type, title, content, metadata, month, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', NOW())
     RETURNING id`,
    [
      params.clientEmail,
      params.clientId,
      params.type,
      params.title,
      params.content,
      JSON.stringify(params.metadata),
      params.month,
    ]
  )
  return rows[0].id
}

// --- Prompts provisoires pour les types non encore codes par @ia ---

import { generate } from "@/lib/claude"
import type { ClientContext } from "@/lib/client-context"

async function generateScriptsVideo(
  ctx: ClientContext,
  count: number,
  moisLabel: string
): Promise<Array<{ title: string; content: string }>> {
  const result = await generate({
    system: `Tu es un redacteur specialise en scripts video courts (Reels/TikTok) pour mandataires immobiliers. Reponds en JSON valide uniquement.`,
    user: `Genere ${count} scripts video pour ${ctx.prenom} ${ctx.nom}, mandataire chez ${ctx.reseau} a ${ctx.zone_geo.ville}.
Specialite: ${ctx.specialite}. Ton: ${ctx.ton}. Mois: ${moisLabel}.
Format JSON: {"scripts": [{"title": "titre", "content": "script complet scene par scene"}]}`,
    maxTokens: 4096,
  })
  try {
    const parsed = JSON.parse(result.content.match(/\{[\s\S]*\}/)?.[0] || "{}")
    return (parsed.scripts || []).map((s: { title: string; content: string }) => ({
      title: s.title || "Script video",
      content: s.content || "",
    }))
  } catch {
    return [{ title: "Script video", content: result.content }]
  }
}

async function generateNewsletter(
  ctx: ClientContext,
  moisLabel: string
): Promise<{ title: string; content: string }> {
  const result = await generate({
    system: `Tu es un redacteur de newsletters immobilieres. Reponds en JSON valide uniquement.`,
    user: `Redige 1 newsletter pour ${ctx.prenom} ${ctx.nom}, mandataire chez ${ctx.reseau} a ${ctx.zone_geo.ville}.
Mois: ${moisLabel}. Ton: ${ctx.ton}. Specialite: ${ctx.specialite}.
Format JSON: {"title": "objet email", "content": "newsletter complete en HTML"}`,
    maxTokens: 4096,
  })
  try {
    const parsed = JSON.parse(result.content.match(/\{[\s\S]*\}/)?.[0] || "{}")
    return { title: parsed.title || `Newsletter ${moisLabel}`, content: parsed.content || result.content }
  } catch {
    return { title: `Newsletter ${moisLabel}`, content: result.content }
  }
}

async function generateEmailProspection(
  ctx: ClientContext,
  moisLabel: string
): Promise<{ title: string; content: string }> {
  const result = await generate({
    system: `Tu es un redacteur d'emails de prospection immobiliere. Reponds en JSON valide uniquement.`,
    user: `Redige 1 email de prospection vendeurs pour ${ctx.prenom} ${ctx.nom}, mandataire chez ${ctx.reseau} a ${ctx.zone_geo.ville}.
Mois: ${moisLabel}. Ton: ${ctx.ton}. Ce qui la differencie: ${ctx.ce_qui_differencie}.
Format JSON: {"title": "objet email", "content": "email complet"}`,
    maxTokens: 2048,
  })
  try {
    const parsed = JSON.parse(result.content.match(/\{[\s\S]*\}/)?.[0] || "{}")
    return { title: parsed.title || "Email prospection", content: parsed.content || result.content }
  } catch {
    return { title: "Email prospection", content: result.content }
  }
}

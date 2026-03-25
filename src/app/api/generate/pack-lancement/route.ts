import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { query } from "@/lib/db"
import { generate, generateJSON } from "@/lib/claude"
import { getClientContext, type ClientContext } from "@/lib/client-context"
import { trackServer } from "@/lib/tracking"
import { buildPostSocialPrompt } from "@/lib/prompts/post-social"
import { buildAnnonceStorytellingPrompt } from "@/lib/prompts/annonce-storytelling"
import { buildArticleSeoPrompt } from "@/lib/prompts/article-seo"
// Prompts codes par @ia — imports a activer quand disponibles
// import { buildPositioningStatementPrompt } from "@/lib/prompts/positioning-statement"
// import { buildBioMultiformatPrompt } from "@/lib/prompts/bio-multiformat"
// import { buildScriptVideoPrompt } from "@/lib/prompts/script-video"

interface PackLancementBody {
  client_id: string
}

interface DeliverableRow {
  id: string
}

/**
 * POST /api/generate/pack-lancement
 * Genere le pack lancement complet pour un client.
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

  let body: PackLancementBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { client_id } = body
  if (!client_id) {
    return NextResponse.json({ error: "client_id requis" }, { status: 400 })
  }

  let ctx: ClientContext
  try {
    ctx = await getClientContext(client_id)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Client context error"
    return NextResponse.json({ error: message }, { status: 400 })
  }

  const { rows: clientRows } = await query<{ email: string }>(
    "SELECT email FROM clients WHERE id = $1",
    [client_id]
  )
  const clientEmail = clientRows[0]?.email
  if (!clientEmail) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  const month = new Date().toISOString().slice(0, 7) // YYYY-MM actuel

  await trackServer("production_started", userEmail, {
    client_id,
    pack_type: "lancement",
  })

  const deliverableIds: string[] = []

  try {
    // L1 : Positionnement + mise en avant expertise
    // [PROVISOIRE — a activer quand @ia livre buildPositioningStatementPrompt]
    const positioningResult = await generatePositioning(ctx)
    const posId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "article_seo", // type le plus proche en attendant un type dedie
      title: `Positionnement — ${ctx.prenom} ${ctx.nom}`,
      content: positioningResult,
      metadata: { sub_type: "positioning_statement" },
      month,
    })
    deliverableIds.push(posId)

    // L2 : Bio optimisee multiformat
    // [PROVISOIRE — a activer quand @ia livre buildBioMultiformatPrompt]
    const bioResult = await generateBioMultiformat(ctx)
    const bioId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "post", // type le plus proche
      title: `Bio optimisee — ${ctx.prenom} ${ctx.nom}`,
      content: bioResult,
      metadata: { sub_type: "bio_multiformat" },
      month,
    })
    deliverableIds.push(bioId)

    // L3 : 5 annonces storytelling
    const annoncesPrompt = buildAnnonceStorytellingPrompt({
      ...ctx,
      nombre_annonces: 5,
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
        month,
      })
      deliverableIds.push(id)
    }

    // L4 : 5 articles SEO local
    const articlesPrompt = buildArticleSeoPrompt({
      ...ctx,
      nombre_articles: 5,
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
        metadata: { meta_description: article.frontmatter.meta_description, slug: article.frontmatter.slug },
        month,
      })
      deliverableIds.push(id)
    }

    // L6 : 20 posts prets a publier
    const postsPrompt = buildPostSocialPrompt({
      ...ctx,
      plateforme: "mix",
      nombre_posts: 20,
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
        metadata: { hashtags: post.hashtags, brief_visuel: post.brief_visuel, plateforme: post.plateforme },
        month,
      })
      deliverableIds.push(id)
    }

    // L7 : 10 scripts Reels
    // [PROVISOIRE — a activer quand @ia livre buildScriptVideoPrompt]
    const scriptsResult = await generateScriptsVideo(ctx, 10)
    for (const script of scriptsResult) {
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "script_video",
        title: script.title,
        content: script.content,
        metadata: {},
        month,
      })
      deliverableIds.push(id)
    }

    // Design brief (L8 preparation)
    const designBriefId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "post",
      title: `Brief graphique — ${ctx.prenom} ${ctx.nom}`,
      content: `Brief pour kit graphique personalise.\nCouleurs et style a definir avec le client.\nReseau: ${ctx.reseau}\nZone: ${ctx.zone_geo.ville}\nTon: ${ctx.ton}\nValeurs: ${ctx.valeurs}`,
      metadata: { sub_type: "design_brief" },
      month,
    })
    deliverableIds.push(designBriefId)

  } catch (err) {
    console.error("Error generating pack lancement:", err)
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
    pack_type: "lancement",
    deliverables_count: deliverableIds.length,
  })

  return NextResponse.json({
    deliverable_ids: deliverableIds,
    status: "completed",
    count: deliverableIds.length,
  })
}

// --- Helpers ---

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

// --- Prompts provisoires ---

async function generatePositioning(ctx: ClientContext): Promise<string> {
  const result = await generate({
    system: `Tu es un stratege en personal branding pour les professionnels de l'immobilier en France. Tu rediges des documents de positionnement clairs et actionnables.`,
    user: `Redige un document de positionnement pour ${ctx.prenom} ${ctx.nom}, mandataire chez ${ctx.reseau} a ${ctx.zone_geo.ville} (${ctx.zone_geo.departement}).
Specialite: ${ctx.specialite}. Experience: ${ctx.annees_experience} ans. Transactions/an: ${ctx.nb_transactions_an}.
Valeurs: ${ctx.valeurs}. Ce qui la differencie: ${ctx.ce_qui_differencie}. Ton: ${ctx.ton}.
Cible clients: ${ctx.cible_clients}. Gamme prix: ${ctx.gamme_prix}.
Inclure: differenciateurs cles, proposition de valeur, accroche principale.`,
    maxTokens: 2048,
  })
  return result.content
}

async function generateBioMultiformat(ctx: ClientContext): Promise<string> {
  const result = await generate({
    system: `Tu es un expert en bio et profils de reseaux sociaux pour les professionnels de l'immobilier. Reponds en JSON valide uniquement.`,
    user: `Genere 4 versions de bio pour ${ctx.prenom} ${ctx.nom}, mandataire chez ${ctx.reseau} a ${ctx.zone_geo.ville}.
Specialite: ${ctx.specialite}. Ton: ${ctx.ton}. Valeurs: ${ctx.valeurs}.
Format JSON: {"instagram": "bio 150 car max", "linkedin": "bio 300 car max", "google": "bio 750 car max", "general": "presentation generale"}`,
    maxTokens: 2048,
  })
  return result.content
}

async function generateScriptsVideo(
  ctx: ClientContext,
  count: number
): Promise<Array<{ title: string; content: string }>> {
  const result = await generate({
    system: `Tu es un redacteur specialise en scripts video courts (Reels/TikTok) pour mandataires immobiliers. Reponds en JSON valide uniquement.`,
    user: `Genere ${count} scripts video pour ${ctx.prenom} ${ctx.nom}, mandataire chez ${ctx.reseau} a ${ctx.zone_geo.ville}.
Specialite: ${ctx.specialite}. Ton: ${ctx.ton}. Quartiers: ${ctx.zone_geo.quartiers.join(", ") || ctx.zone_geo.ville}.
Format JSON: {"scripts": [{"title": "titre", "content": "script complet scene par scene"}]}`,
    maxTokens: 8192,
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

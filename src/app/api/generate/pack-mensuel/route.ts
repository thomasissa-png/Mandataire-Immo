import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { query } from "@/lib/db"
import { generateJSON } from "@/lib/claude"
import { getClientContext } from "@/lib/client-context"
import { trackServer } from "@/lib/tracking"
import { buildPostSocialPrompt } from "@/lib/prompts/post-social"
import { buildAnnonceStorytellingPrompt } from "@/lib/prompts/annonce-storytelling"
import { buildArticleSeoPrompt } from "@/lib/prompts/article-seo"
import { buildScriptVideoPrompt } from "@/lib/prompts/script-video"
import { buildNewsletterPrompt } from "@/lib/prompts/newsletter"
import { buildEmailProspectionPrompt } from "@/lib/prompts/email-prospection"
import { buildEditorialCalendarPrompt } from "@/lib/prompts/editorial-calendar"

interface PackMensuelBody {
  client_id: string
  mois: string // ex: "2026-04"
}

interface DeliverableRow {
  id: string
}

/**
 * POST /api/generate/pack-mensuel
 * Genere le pack mensuel complet pour un client :
 * M1: 12 posts, M2: 4 scripts video, M3: 2 articles SEO,
 * M4: 1 newsletter, M5: 4 annonces, M6: 1 email prospection.
 * Admin-only.
 */
export async function POST(request: NextRequest) {
  // Admin check
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
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

  await trackServer("production_started", "admin", {
    client_id,
    pack_type: "mensuel",
    mois,
  })

  const deliverableIds: string[] = []
  const moisLabel = formatMoisLabel(mois)

  try {
    // M1 : 12 posts reseaux sociaux
    const postsPrompt = buildPostSocialPrompt({
      ...ctx,
      plateforme: "mix",
      nombre_posts: 12,
      mois_cible: moisLabel,
    })
    const postsResult = await generateJSON<{ posts: Array<{ plateforme: string; type: string; texte: string; hashtags: string[]; brief_visuel: string; hook: string }> }>(
      { ...postsPrompt, maxTokens: 16384 }
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
      { ...annoncesPrompt, maxTokens: 16384 }
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
      { ...articlesPrompt, maxTokens: 16384 }
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
    const scriptsPrompt = buildScriptVideoPrompt({
      ...ctx,
      nombre_scripts: 4,
      format: "mix",
      confort_camera: ctx.confort_camera || "debutant",
      type_video: "face_camera",
    })
    const scriptsResult = await generateJSON<{ scripts: Array<{ titre: string; format: string; duree_cible: string; scenes: Array<{ numero: number; duree: string; voix_off: string; indication_visuelle: string }>; musique_suggeree: string; hook: string }> }>(
      { ...scriptsPrompt, maxTokens: 16384 }
    )
    for (const script of scriptsResult.data.scripts) {
      const scenesText = script.scenes
        .map((s) => `Scene ${s.numero} (${s.duree}):\nVoix off: ${s.voix_off}\nVisuel: ${s.indication_visuelle}`)
        .join("\n\n")
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "script_video",
        title: script.titre || script.hook,
        content: `${script.titre}\nFormat: ${script.format} | Duree: ${script.duree_cible}\nMusique: ${script.musique_suggeree}\n\n${scenesText}`,
        metadata: { format: script.format, duree_cible: script.duree_cible, hook: script.hook },
        month: mois,
      })
      deliverableIds.push(id)
    }

    // M4 : 1 newsletter
    const newsletterPrompt = buildNewsletterPrompt({
      ...ctx,
      mois_cible: moisLabel,
      bien_du_mois: ctx.biens[0] || undefined,
    })
    const newsletterResult = await generateJSON<{ objet_email: string; html: string; texte_brut: string; sections: Array<{ titre: string; contenu: string }> }>(
      { ...newsletterPrompt, maxTokens: 4096 }
    )
    const nlData = newsletterResult.data
    const newsletterId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "newsletter",
      title: nlData.objet_email,
      content: nlData.html || nlData.texte_brut,
      metadata: { objet_email: nlData.objet_email, sections: nlData.sections },
      month: mois,
    })
    deliverableIds.push(newsletterId)

    // M6 : 1 email prospection vendeurs
    const emailPrompt = buildEmailProspectionPrompt({
      ...ctx,
      type_email: "prospection_vendeurs",
      email_contact: clientEmail,
      telephone_contact: ctx.telephone,
    })
    const emailResult = await generateJSON<{ objet_email: string; html: string; texte_brut: string; cta_principal: string }>(
      { ...emailPrompt, maxTokens: 2048 }
    )
    const emailData = emailResult.data
    const emailId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "email_prospection",
      title: emailData.objet_email,
      content: emailData.html || emailData.texte_brut,
      metadata: { objet_email: emailData.objet_email, cta: emailData.cta_principal },
      month: mois,
    })
    deliverableIds.push(emailId)

    // M7 : 1 calendrier de publication mensuel (quand et ou publier chaque livrable)
    const calendarPrompt = buildEditorialCalendarPrompt({
      ...ctx,
      nb_transactions_an: ctx.nb_transactions_an || 5,
      annees_experience: ctx.annees_experience || 2,
      cible_clients: ctx.cible_clients || "acheteurs et vendeurs",
    })
    const calendarData = await generateJSON(calendarPrompt)
    const calendarId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "calendrier",
      title: `Calendrier de publication — ${formatMoisLabel(mois)}`,
      content: JSON.stringify(calendarData, null, 2),
      metadata: { mois, type_calendrier: "mensuel" },
      month: mois,
    })
    deliverableIds.push(calendarId)

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

  await trackServer("production_completed", "admin", {
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
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'delivered', NOW())
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

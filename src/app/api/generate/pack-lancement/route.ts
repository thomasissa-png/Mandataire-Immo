import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { query } from "@/lib/db"
import { generateJSON } from "@/lib/claude"
import { getClientContext } from "@/lib/client-context"
import { trackServer } from "@/lib/tracking"
import { buildPostSocialPrompt } from "@/lib/prompts/post-social"
import { buildAnnonceStorytellingPrompt } from "@/lib/prompts/annonce-storytelling"
import { buildArticleSeoPrompt } from "@/lib/prompts/article-seo"
import { buildScriptVideoPrompt } from "@/lib/prompts/script-video"
import { buildPositioningStatementPrompt } from "@/lib/prompts/positioning-statement"
import { buildBioMultiformatPrompt } from "@/lib/prompts/bio-multiformat"
import { buildEditorialCalendarPrompt } from "@/lib/prompts/editorial-calendar"

interface PackLancementBody {
  client_id: string
}

interface DeliverableRow {
  id: string
}

/**
 * POST /api/generate/pack-lancement
 * Genere le pack lancement complet pour un client :
 * L1: positionnement, L2: bio multiformat, L3: 5 annonces,
 * L4: 5 articles SEO, L6: 20 posts, L7: 10 scripts, design brief.
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

  let ctx
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

  const month = new Date().toISOString().slice(0, 7)

  await trackServer("production_started", userEmail, {
    client_id,
    pack_type: "lancement",
  })

  const deliverableIds: string[] = []

  try {
    // L1 : Positionnement + mise en avant expertise
    const posPrompt = buildPositioningStatementPrompt(ctx)
    const posResult = await generateJSON<{ positionnement: string; accroche_principale: string; proposition_valeur: string; piliers_differenciation: string[]; accroche_identitaire: string }>(
      { ...posPrompt, maxTokens: 4096 }
    )
    const posData = posResult.data
    const posId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "article_seo",
      title: `Positionnement — ${ctx.prenom} ${ctx.nom}`,
      content: posData.positionnement,
      metadata: { sub_type: "positioning_statement", accroche_principale: posData.accroche_principale, proposition_valeur: posData.proposition_valeur, piliers: posData.piliers_differenciation },
      month,
    })
    deliverableIds.push(posId)

    // L2 : Bio optimisee multiformat
    const bioPrompt = buildBioMultiformatPrompt({
      ...ctx,
      accroche_identitaire: posData.accroche_identitaire,
      piliers_differenciation: posData.piliers_differenciation,
    })
    const bioResult = await generateJSON<{ instagram: string; linkedin: string; google: string; general: string }>(
      { ...bioPrompt, maxTokens: 2048 }
    )
    const bioData = bioResult.data
    const bioContent = `## Instagram (150 car.)\n${bioData.instagram}\n\n## LinkedIn (300 car.)\n${bioData.linkedin}\n\n## Google Business (750 car.)\n${bioData.google}\n\n## Presentation generale\n${bioData.general}`
    const bioId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "post",
      title: `Bio optimisee — ${ctx.prenom} ${ctx.nom}`,
      content: bioContent,
      metadata: { sub_type: "bio_multiformat", instagram: bioData.instagram, linkedin: bioData.linkedin, google: bioData.google },
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
    const scriptsPrompt = buildScriptVideoPrompt({
      ...ctx,
      nombre_scripts: 10,
      format: "mix",
      confort_camera: ctx.confort_camera || "debutant",
      type_video: "face_camera",
    })
    const scriptsResult = await generateJSON<{ scripts: Array<{ titre: string; format: string; duree_cible: string; scenes: Array<{ numero: number; duree: string; voix_off: string; indication_visuelle: string }>; musique_suggeree: string; hook: string }> }>(
      { ...scriptsPrompt, maxTokens: 8192 }
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
        month,
      })
      deliverableIds.push(id)
    }

    // L5 : Calendrier editorial 30 jours
    const calendarPrompt = buildEditorialCalendarPrompt({
      ...ctx,
      frequence_hebdo: 5,
    })
    const calendarResult = await generateJSON<{ calendrier: Array<{ jour: number; date: string; plateforme: string; type: string; sujet: string; angle: string; hashtags: string[]; heure_suggeree: string }> }>(
      { ...calendarPrompt, maxTokens: 8192 }
    )
    const calendarContent = calendarResult.data.calendrier
      .map((entry) => `**Jour ${entry.jour} (${entry.date})** — ${entry.plateforme}\nType: ${entry.type} | ${entry.heure_suggeree}\nSujet: ${entry.sujet}\nAngle: ${entry.angle}\nHashtags: ${entry.hashtags.join(", ")}`)
      .join("\n\n")
    const calendarId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "post",
      title: `Calendrier editorial 30 jours — ${ctx.prenom} ${ctx.nom}`,
      content: calendarContent,
      metadata: { sub_type: "editorial_calendar", entries_count: calendarResult.data.calendrier.length },
      month,
    })
    deliverableIds.push(calendarId)

    // Design brief (L8 preparation — non automatisable)
    const designBriefId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "post",
      title: `Brief graphique — ${ctx.prenom} ${ctx.nom}`,
      content: `Brief pour kit graphique personalise.\nPositionnement: ${posData.accroche_principale}\nProposition de valeur: ${posData.proposition_valeur}\nReseau: ${ctx.reseau}\nZone: ${ctx.zone_geo.ville}\nTon: ${ctx.ton}\nValeurs: ${ctx.valeurs}`,
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

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
 * Génère le pack lancement complet pour un client :
 * L1: positionnement, L2: bio multiformat, L3: 5 annonces,
 * L4: 5 articles SEO, L6: 20 posts, L7: 10 scripts, design brief.
 * Admin-only.
 */
export async function POST(request: NextRequest) {
  // Admin check
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
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

  await trackServer("production_started", "admin", {
    client_id,
    pack_type: "lancement",
  })

  // Vérifier que la clé API est configurée avant de lancer 7 appels Claude
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error: "ANTHROPIC_API_KEY non configurée",
        details: "La clé API Anthropic est absente des variables d'environnement. Ajoute-la dans les Secrets Replit.",
      },
      { status: 500 }
    )
  }

  const deliverableIds: string[] = []
  let currentStep = ""

  try {
    // L1 : Positionnement + mise en avant expertise
    currentStep = "L1-positionnement"
    const posPrompt = buildPositioningStatementPrompt(ctx)
    const posResult = await generateJSON<{
      positionnement: {
        accroche_identitaire: string
        proposition_valeur: string
        piliers_differenciation: Array<{ titre: string; explication: string }>
        histoire_personnelle: string
        clients_ideaux: string
        tonalite: { adjectifs: string[]; phrases_a_utiliser: string[]; phrases_a_eviter: string[] }
        mots_cles_identitaires: string[]
        document_complet_markdown: string
      }
    }>(
      { ...posPrompt, maxTokens: 4096 }
    )
    const posData = posResult.data.positionnement
    const posId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "positionnement",
      title: `Positionnement — ${ctx.prenom} ${ctx.nom}`,
      content: posData.document_complet_markdown || posData.proposition_valeur,
      metadata: { sub_type: "positioning_statement", accroche_identitaire: posData.accroche_identitaire, proposition_valeur: posData.proposition_valeur, piliers: posData.piliers_differenciation.map(p => p.titre) },
      month,
    })
    deliverableIds.push(posId)

    // L2 : Bio optimisée multiformat
    currentStep = "L2-bio"
    const bioPrompt = buildBioMultiformatPrompt({
      ...ctx,
      accroche_identitaire: posData.accroche_identitaire,
      piliers_differenciation: posData.piliers_differenciation.map(p => p.titre),
    })
    const bioResult = await generateJSON<{
      bios: {
        instagram: { texte: string; nombre_caracteres: number }
        linkedin: { texte: string; nombre_caracteres: number }
        google_business: { texte: string; nombre_caracteres: number }
        general: { texte: string; nombre_mots: number }
      }
    }>(
      { ...bioPrompt, maxTokens: 2048 }
    )
    const bioData = bioResult.data.bios
    const bioContent = `## Instagram (150 car.)\n${bioData.instagram.texte}\n\n## LinkedIn (300 car.)\n${bioData.linkedin.texte}\n\n## Google Business (750 car.)\n${bioData.google_business.texte}\n\n## Presentation generale\n${bioData.general.texte}`
    const bioId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "bio",
      title: `Bio optimisée — ${ctx.prenom} ${ctx.nom}`,
      content: bioContent,
      metadata: { sub_type: "bio_multiformat", instagram: bioData.instagram.texte, linkedin: bioData.linkedin.texte, google: bioData.google_business.texte },
      month,
    })
    deliverableIds.push(bioId)

    // L3 : 5 annonces storytelling — uniquement si le client a des biens réels
    currentStep = "L3-annonces"
    if (ctx.biens && ctx.biens.length > 0) {
      const annoncesPrompt = buildAnnonceStorytellingPrompt({
        ...ctx,
        nombre_annonces: Math.min(ctx.biens.length, 5),
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
          metadata: { accroche_courte: annonce.accroche_courte, mots_cles_seo: annonce.mots_cles_seo, bien_titre: annonce.bien_titre },
          month,
        })
        deliverableIds.push(id)
      }
    }

    // L4 : 5 articles SEO local
    currentStep = "L4-articles"
    const articlesPrompt = buildArticleSeoPrompt({
      ...ctx,
      nombre_articles: 5,
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
        metadata: { meta_description: article.frontmatter.meta_description, slug: article.frontmatter.slug },
        month,
      })
      deliverableIds.push(id)
    }

    // L6 : 20 posts prets a publier
    currentStep = "L6-posts"
    const postsPrompt = buildPostSocialPrompt({
      ...ctx,
      plateforme: "mix",
      nombre_posts: 20,
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
        metadata: { hashtags: post.hashtags, brief_visuel: post.brief_visuel, plateforme: post.plateforme },
        month,
      })
      deliverableIds.push(id)
    }

    // L7 : 10 scripts Reels
    currentStep = "L7-scripts"
    const scriptsPrompt = buildScriptVideoPrompt({
      ...ctx,
      nombre_scripts: 10,
      format: "mix",
      confort_camera: ctx.confort_camera || "debutant",
      type_video: (ctx.confort_camera === "a_laise" || ctx.confort_camera === "expert") ? "face_camera" : "diaporama",
    })
    const scriptsResult = await generateJSON<{ scripts: Array<{
      titre: string; type: string; duree_totale_secondes: number; hook: string;
      scenes: Array<{ numero: number; duree_secondes: number; visuel: string; texte_ecran: string | null; voix_off: string | null; indication_tournage: string }>;
      musique_suggeree: string; cta_final: string; brief_tournage: string
    }> }>(
      { ...scriptsPrompt, maxTokens: 16384 }
    )
    for (const script of scriptsResult.data.scripts) {
      const content = formatScriptContent(script)
      const id = await insertDeliverable({
        clientEmail,
        clientId: client_id,
        type: "script_video",
        title: script.titre || script.hook || "Script vidéo",
        content,
        metadata: { format: "reel", duree_secondes: script.duree_totale_secondes, hook: script.hook, type_video: script.type, brief_tournage: script.brief_tournage },
        month,
      })
      deliverableIds.push(id)
    }

    // L5 : Calendrier éditorial 30 jours
    currentStep = "L5-calendrier"
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
      type: "calendrier",
      title: `Calendrier éditorial 30 jours — ${ctx.prenom} ${ctx.nom}`,
      content: calendarContent,
      metadata: { sub_type: "editorial_calendar", entries_count: calendarResult.data.calendrier.length },
      month,
    })
    deliverableIds.push(calendarId)

    // Design brief (L8 preparation — non automatisable)
    currentStep = "L8-design-brief"
    const designBriefId = await insertDeliverable({
      clientEmail,
      clientId: client_id,
      type: "brief_graphique",
      title: `Brief graphique — ${ctx.prenom} ${ctx.nom}`,
      content: `Brief pour kit graphique personnalisé.\nPositionnement: ${posData.accroche_identitaire}\nProposition de valeur: ${posData.proposition_valeur}\nRéseau : ${ctx.reseau}\nZone: ${ctx.zone_geo.ville}\nTon: ${ctx.ton}\nValeurs: ${ctx.valeurs}`,
      metadata: { sub_type: "design_brief" },
      month,
    })
    deliverableIds.push(designBriefId)

  } catch (err) {
    console.error(`Error generating pack lancement at step ${currentStep}:`, err)
    return NextResponse.json(
      {
        error: `Erreur lors de la generation (etape: ${currentStep})`,
        details: err instanceof Error ? err.message : String(err),
        deliverable_ids: deliverableIds,
        step: currentStep,
      },
      { status: 500 }
    )
  }

  await trackServer("production_completed", "admin", {
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

function formatScriptContent(script: {
  titre: string; type?: string; duree_totale_secondes?: number;
  brief_tournage?: string; scenes?: Array<{ numero: number; duree_secondes?: number; visuel?: string; texte_ecran?: string | null; voix_off?: string | null; indication_tournage?: string }>;
  cta_final?: string; musique_suggeree?: string;
}): string {
  const lines: string[] = []
  lines.push(`# ${script.titre}`)
  lines.push("")
  lines.push(`**Durée :** ~${script.duree_totale_secondes || 30} secondes`)
  if (script.type) lines.push(`**Type :** ${script.type}`)
  lines.push("")
  if (script.brief_tournage) {
    lines.push("## 📍 Où et quand filmer")
    lines.push(script.brief_tournage)
    lines.push("")
  }
  lines.push("## 🎬 Le script (scène par scène)")
  lines.push("")
  for (const scene of script.scenes || []) {
    lines.push(`### Scène ${scene.numero} — ${scene.duree_secondes || 5}s`)
    if (scene.indication_tournage) lines.push(`📱 **Comment filmer :** ${scene.indication_tournage}`)
    if (scene.texte_ecran && scene.texte_ecran !== "null" && scene.texte_ecran !== "undefined") lines.push(`📝 **Texte à l'écran :** ${scene.texte_ecran}`)
    if (scene.voix_off && scene.voix_off !== "null" && scene.voix_off !== "undefined") lines.push(`🗣️ **Ce que tu dis :** « ${scene.voix_off} »`)
    if (scene.visuel && !scene.indication_tournage) lines.push(`👁️ **Ce qu'on voit :** ${scene.visuel}`)
    lines.push("")
  }
  if (script.cta_final) { lines.push("## ✅ Fin de la vidéo"); lines.push(script.cta_final); lines.push("") }
  if (script.musique_suggeree) lines.push(`🎵 **Musique suggérée :** ${script.musique_suggeree}`)
  return lines.join("\n")
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

import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { generateJSON } from "@/lib/claude"
import { getClientContext } from "@/lib/client-context"
import { buildPostSocialPrompt } from "@/lib/prompts/post-social"
import { buildArticleSeoPrompt } from "@/lib/prompts/article-seo"
import { buildScriptVideoPrompt } from "@/lib/prompts/script-video"
import { buildNewsletterPrompt } from "@/lib/prompts/newsletter"
import { buildEmailProspectionPrompt } from "@/lib/prompts/email-prospection"
import { buildAnnonceStorytellingPrompt } from "@/lib/prompts/annonce-storytelling"
import { generatePostVisual, canAutoGenerate } from "@/lib/generate-post-visual"

interface WeeklyBatchBody {
  client_id: string
  week_key: string      // "2026-W14"
  week_number: number   // 1-4 dans le cycle mensuel
  job_id: string        // ID du generation_job pour tracking
}

interface DeliverableRow {
  id: string
}

/**
 * POST /api/generate/weekly-batch
 * Génère la tranche hebdomadaire de contenus pour un client.
 *
 * Semaine type :
 * - 3 posts (chaque semaine)
 * - 1 article SEO (chaque semaine)
 * - 1 script vidéo (chaque semaine)
 * - 1 newsletter (semaine 1 uniquement)
 * - 1 email prospection (semaine 2 uniquement)
 * - annonces (semaine 1 uniquement, si biens existants)
 *
 * Sécurisé par CRON_SECRET (appelé uniquement par le cron weekly-produce).
 */
export async function POST(request: NextRequest) {
  // Auth : CRON_SECRET ou admin
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get("authorization")
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY manquante" }, { status: 500 })
  }

  let body: WeeklyBatchBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { client_id, week_key, week_number, job_id } = body
  if (!client_id || !week_key || !week_number || !job_id) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
  }

  // Marquer le job comme "running"
  await query(
    `UPDATE generation_jobs SET status = 'running', started_at = NOW(), attempts = attempts + 1 WHERE id = $1`,
    [job_id]
  )

  // Contexte client
  let ctx
  try {
    ctx = await getClientContext(client_id)
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Client context error"
    await markJobFailed(job_id, msg)
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { rows: clientRows } = await query<{ email: string }>(
    "SELECT email FROM clients WHERE id = $1",
    [client_id]
  )
  const clientEmail = clientRows[0]?.email
  if (!clientEmail) {
    await markJobFailed(job_id, "Client introuvable")
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 })
  }

  // Calculer le mois au format "YYYY-MM" depuis week_key
  const mois = weekKeyToMonth(week_key)
  const moisLabel = formatMoisLabel(mois)
  const deliverableIds: string[] = []
  const errors: string[] = []

  // ─── Génération par type avec fallback individuel ───────────────

  // 1. 3 posts (chaque semaine)
  try {
    const postsPrompt = buildPostSocialPrompt({
      ...ctx,
      plateforme: "mix",
      nombre_posts: 3,
      mois_cible: moisLabel,
    })
    const result = await generateJSON<{ posts: Array<{ plateforme: string; type: string; texte: string; hashtags: string[]; brief_visuel: string; hook: string }> }>(
      { ...postsPrompt, maxTokens: 8192 }
    )
    for (const post of result.data.posts) {
      const id = await insertDeliverable({
        clientEmail, clientId: client_id, type: "post",
        title: post.hook || `Post ${post.plateforme}`,
        content: post.texte,
        metadata: { hashtags: post.hashtags, brief_visuel: post.brief_visuel, plateforme: post.plateforme, type_post: post.type },
        month: mois, weekKey: week_key,
      })
      deliverableIds.push(id)

      // Générer un visuel IA si le brief le permet (fire-and-forget, ne bloque pas)
      if (post.brief_visuel && canAutoGenerate(post.brief_visuel)) {
        try {
          const visual = await generatePostVisual({
            briefVisuel: post.brief_visuel,
            postContent: post.texte,
            titre: post.hook || `Post ${post.plateforme}`,
            plateforme: post.plateforme,
            mandatairePrenom: ctx.prenom,
            ville: ctx.zone_geo.ville,
          }, id)
          if (visual) {
            // Mettre à jour le metadata du deliverable avec l'URL du visuel
            await query(
              `UPDATE deliverables SET metadata = jsonb_set(metadata, '{visual_key}', $1::jsonb) WHERE id = $2`,
              [JSON.stringify(visual.key), id]
            )
          }
        } catch {
          // Pas bloquant — le post est livré sans visuel
        }
      }
    }
  } catch (err) {
    errors.push(`posts: ${err instanceof Error ? err.message : "erreur"}`)
  }

  // 2. 1 article SEO (chaque semaine)
  try {
    const articlePrompt = buildArticleSeoPrompt({
      ...ctx,
      nombre_articles: 1,
      mois_cible: moisLabel,
    })
    const result = await generateJSON<{ articles: Array<{ frontmatter: { title: string; meta_description: string; slug: string }; contenu_markdown: string }> }>(
      { ...articlePrompt, maxTokens: 8192 }
    )
    for (const article of result.data.articles) {
      const id = await insertDeliverable({
        clientEmail, clientId: client_id, type: "article_seo",
        title: article.frontmatter.title,
        content: article.contenu_markdown,
        metadata: { meta_description: article.frontmatter.meta_description, slug: article.frontmatter.slug },
        month: mois, weekKey: week_key,
      })
      deliverableIds.push(id)
    }
  } catch (err) {
    errors.push(`article_seo: ${err instanceof Error ? err.message : "erreur"}`)
  }

  // 3. 1 script vidéo (chaque semaine)
  try {
    const scriptPrompt = buildScriptVideoPrompt({
      ...ctx,
      nombre_scripts: 1,
      format: "mix",
      confort_camera: ctx.confort_camera || "debutant",
      type_video: (ctx.confort_camera === "a_laise" || ctx.confort_camera === "expert") ? "face_camera" : "diaporama",
    })
    const result = await generateJSON<{ scripts: Array<{
      titre: string; type: string; duree_totale_secondes: number; hook: string;
      scenes: Array<{ numero: number; duree_secondes: number; visuel: string; texte_ecran: string | null; voix_off: string | null; indication_tournage: string }>;
      musique_suggeree: string; cta_final: string; brief_tournage: string
    }> }>(
      { ...scriptPrompt, maxTokens: 4096 }
    )
    for (const script of result.data.scripts) {
      const content = formatScriptContent(script)
      const id = await insertDeliverable({
        clientEmail, clientId: client_id, type: "script_video",
        title: script.titre || script.hook || "Script vidéo",
        content,
        metadata: { format: "reel", duree_secondes: script.duree_totale_secondes, hook: script.hook, type_video: script.type, brief_tournage: script.brief_tournage },
        month: mois, weekKey: week_key,
      })
      deliverableIds.push(id)
    }
  } catch (err) {
    errors.push(`script_video: ${err instanceof Error ? err.message : "erreur"}`)
  }

  // 4. Newsletter (semaine 1 uniquement)
  if (week_number === 1) {
    try {
      const nlPrompt = buildNewsletterPrompt({ ...ctx, mois_cible: moisLabel, bien_du_mois: ctx.biens?.[0] || undefined })
      const result = await generateJSON<{ objet_email: string; html: string; texte_brut: string; sections: Array<{ titre: string; contenu: string }> }>(
        { ...nlPrompt, maxTokens: 4096 }
      )
      const nlData = result.data
      const id = await insertDeliverable({
        clientEmail, clientId: client_id, type: "newsletter",
        title: nlData.objet_email,
        content: nlData.html || nlData.texte_brut,
        metadata: { objet_email: nlData.objet_email, sections: nlData.sections },
        month: mois, weekKey: week_key,
      })
      deliverableIds.push(id)
    } catch (err) {
      errors.push(`newsletter: ${err instanceof Error ? err.message : "erreur"}`)
    }
  }

  // 5. Email prospection (semaine 2 uniquement)
  if (week_number === 2) {
    try {
      const emailPrompt = buildEmailProspectionPrompt({ ...ctx, type_email: "prospection_vendeurs", email_contact: clientEmail, telephone_contact: ctx.telephone })
      const result = await generateJSON<{ objet_email: string; html: string; texte_brut: string; cta_principal: string }>(
        { ...emailPrompt, maxTokens: 2048 }
      )
      const emailData = result.data
      const id = await insertDeliverable({
        clientEmail, clientId: client_id, type: "email_prospection",
        title: emailData.objet_email,
        content: emailData.texte_brut,
        metadata: { objet: emailData.objet_email, html: emailData.html, cta: emailData.cta_principal },
        month: mois, weekKey: week_key,
      })
      deliverableIds.push(id)
    } catch (err) {
      errors.push(`email_prospection: ${err instanceof Error ? err.message : "erreur"}`)
    }
  }

  // 6. Annonces (semaine 1 uniquement, si biens existants)
  if (week_number === 1 && ctx.biens && ctx.biens.length > 0) {
    try {
      const annoncesPrompt = buildAnnonceStorytellingPrompt({
        ...ctx,
        nombre_annonces: Math.min(ctx.biens.length, 4),
      })
      const result = await generateJSON<{ annonces: Array<{ bien_titre: string; annonce_complete: string; accroche_courte: string; titre_annonce: string; mots_cles_seo: string[] }> }>(
        { ...annoncesPrompt, maxTokens: 16384 }
      )
      for (const annonce of result.data.annonces) {
        const id = await insertDeliverable({
          clientEmail, clientId: client_id, type: "annonce",
          title: annonce.titre_annonce,
          content: annonce.annonce_complete,
          metadata: { accroche_courte: annonce.accroche_courte, mots_cles_seo: annonce.mots_cles_seo, bien_titre: annonce.bien_titre },
          month: mois, weekKey: week_key,
        })
        deliverableIds.push(id)
      }
    } catch (err) {
      errors.push(`annonces: ${err instanceof Error ? err.message : "erreur"}`)
    }
  }

  // ─── Finaliser le job ──────────────────────────────────────────

  if (errors.length > 0 && deliverableIds.length === 0) {
    // Tout a échoué → retry
    await markJobFailed(job_id, errors.join("; "))
    return NextResponse.json({ error: "Génération échouée", errors, deliverableIds }, { status: 500 })
  }

  if (errors.length > 0) {
    // Partiel : certains types ont échoué, d'autres OK
    // On marque comme completed mais on log les erreurs
    await query(
      `UPDATE generation_jobs SET status = 'completed', completed_at = NOW(), deliverable_ids = $1, error_message = $2 WHERE id = $3`,
      [deliverableIds, `Partiel: ${errors.join("; ")}`, job_id]
    )
    return NextResponse.json({ status: "partial", deliverableIds, errors })
  }

  // Tout OK
  await query(
    `UPDATE generation_jobs SET status = 'completed', completed_at = NOW(), deliverable_ids = $1, error_message = NULL WHERE id = $2`,
    [deliverableIds, job_id]
  )

  return NextResponse.json({ status: "completed", deliverableIds, count: deliverableIds.length })
}

// ─── Helpers ─────────────────────────────────────────────────────

async function markJobFailed(jobId: string, error: string) {
  // Calculer le prochain retry avec backoff exponentiel (5min, 15min, 45min)
  await query(
    `UPDATE generation_jobs
     SET status = 'failed',
         error_message = $1,
         next_retry_at = NOW() + (POWER(3, LEAST(attempts, 3)) * INTERVAL '5 minutes')
     WHERE id = $2`,
    [error, jobId]
  )
}

/** Formate un script vidéo en markdown lisible pour Sophie */
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
  weekKey: string
}

async function insertDeliverable(params: InsertDeliverableParams): Promise<string> {
  const { rows } = await query<{ id: string }>(
    `INSERT INTO deliverables (client_email, client_id, type, title, content, metadata, month, week_key, status, created_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'delivered', NOW())
     RETURNING id`,
    [
      params.clientEmail,
      params.clientId,
      params.type,
      params.title,
      params.content,
      JSON.stringify(params.metadata),
      params.month,
      params.weekKey,
    ]
  )
  return rows[0].id
}

function weekKeyToMonth(weekKey: string): string {
  // "2026-W14" → calculer la date du lundi de cette semaine → extraire YYYY-MM
  const match = weekKey.match(/^(\d{4})-W(\d{1,2})$/)
  if (!match) return new Date().toISOString().slice(0, 7)
  const year = parseInt(match[1], 10)
  const week = parseInt(match[2], 10)
  // ISO week 1 = semaine contenant le 4 janvier
  const jan4 = new Date(year, 0, 4)
  const dayOfWeek = jan4.getDay() || 7 // 1=lundi, 7=dimanche
  const monday = new Date(jan4)
  monday.setDate(jan4.getDate() - dayOfWeek + 1 + (week - 1) * 7)
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}`
}

function formatMoisLabel(mois: string): string {
  const [yearStr, monthStr] = mois.split("-")
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
  const idx = parseInt(monthStr, 10) - 1
  return `${months[idx]} ${yearStr}`
}

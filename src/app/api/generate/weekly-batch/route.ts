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
    })
    const result = await generateJSON<{ scripts: Array<{ titre: string; script_complet: string; format: string; duree_estimee: string; brief_visuel: string }> }>(
      { ...scriptPrompt, maxTokens: 4096 }
    )
    for (const script of result.data.scripts) {
      const id = await insertDeliverable({
        clientEmail, clientId: client_id, type: "script_video",
        title: script.titre,
        content: script.script_complet,
        metadata: { format: script.format, duree: script.duree_estimee, brief_visuel: script.brief_visuel },
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
      const nlPrompt = buildNewsletterPrompt({ ...ctx, mois_cible: moisLabel })
      const result = await generateJSON<{ newsletter: { objet: string; contenu_html: string; contenu_texte: string } }>(
        { ...nlPrompt, maxTokens: 4096 }
      )
      const nl = result.data.newsletter
      const id = await insertDeliverable({
        clientEmail, clientId: client_id, type: "newsletter",
        title: nl.objet,
        content: nl.contenu_texte,
        metadata: { objet: nl.objet, html: nl.contenu_html },
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
      const emailPrompt = buildEmailProspectionPrompt({ ...ctx })
      const result = await generateJSON<{ email: { objet: string; corps_texte: string; corps_html: string } }>(
        { ...emailPrompt, maxTokens: 4096 }
      )
      const email = result.data.email
      const id = await insertDeliverable({
        clientEmail, clientId: client_id, type: "email_prospection",
        title: email.objet,
        content: email.corps_texte,
        metadata: { objet: email.objet, html: email.corps_html },
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

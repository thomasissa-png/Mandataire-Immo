import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

/**
 * POST /api/cron/weekly-produce
 * Cron hebdomadaire (chaque lundi) :
 * 1. Trouve tous les abonnés actifs (pack mensuel)
 * 2. Crée un generation_job pour chaque client sans job cette semaine
 * 3. Relance les jobs failed dont le retry est dû
 * 4. Dispatche les jobs pending/failed vers /api/generate/weekly-batch
 *
 * Sécurisé par CRON_SECRET.
 */
export async function POST(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get("authorization")
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const now = new Date()
  const weekKey = getISOWeekKey(now)
  const weekNumber = getWeekOfMonth(now)

  // 1. Trouver les abonnés actifs sans job pour cette semaine
  const { rows: activeClients } = await query<{ id: string; email: string }>(
    `SELECT c.id, c.email FROM clients c
     WHERE c.pack = 'mensuel' AND c.status = 'active'
     AND NOT EXISTS (
       SELECT 1 FROM generation_jobs gj
       WHERE gj.client_id = c.id AND gj.week_key = $1
     )`,
    [weekKey]
  )

  // Créer les jobs pour les nouveaux clients de la semaine
  const newJobIds: string[] = []
  for (const client of activeClients) {
    const { rows } = await query<{ id: string }>(
      `INSERT INTO generation_jobs (client_id, week_key, week_number, status)
       VALUES ($1, $2, $3, 'pending')
       ON CONFLICT (client_id, week_key) DO NOTHING
       RETURNING id`,
      [client.id, weekKey, weekNumber]
    )
    if (rows[0]) newJobIds.push(rows[0].id)
  }

  // 2. Trouver les jobs à lancer (pending + failed avec retry dû)
  const { rows: pendingJobs } = await query<{
    id: string
    client_id: string
    week_key: string
    week_number: number
    attempts: number
    max_attempts: number
  }>(
    `SELECT id, client_id, week_key, week_number, attempts, max_attempts
     FROM generation_jobs
     WHERE (status = 'pending' OR (status = 'failed' AND next_retry_at <= NOW() AND attempts < max_attempts))
     ORDER BY created_at ASC
     LIMIT 10`,
    []
  )

  // 3. Dispatcher chaque job vers weekly-batch (fire-and-forget via localhost)
  const port = process.env.PORT || "3000"
  const baseUrl = `http://127.0.0.1:${port}`
  const results: { job_id: string; status: string; error?: string }[] = []

  for (const job of pendingJobs) {
    try {
      const res = await fetch(`${baseUrl}/api/generate/weekly-batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cronSecret}`,
        },
        body: JSON.stringify({
          client_id: job.client_id,
          week_key: job.week_key,
          week_number: job.week_number,
          job_id: job.id,
        }),
        signal: AbortSignal.timeout(10 * 60 * 1000), // 10 min timeout
      })

      if (res.ok) {
        const data = await res.json()
        results.push({ job_id: job.id, status: data.status || "completed" })
      } else {
        const errorText = await res.text().catch(() => "Unknown error")
        results.push({ job_id: job.id, status: "failed", error: errorText.slice(0, 200) })
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Network error"
      // Le job a été marqué failed par weekly-batch, ou timeout
      results.push({ job_id: job.id, status: "error", error: msg })
    }
  }

  return NextResponse.json({
    weekKey,
    weekNumber,
    newJobsCreated: newJobIds.length,
    jobsDispatched: results.length,
    results,
  })
}

/**
 * Retourne la clé de semaine ISO au format "YYYY-WNN"
 */
function getISOWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(weekNo).padStart(2, "0")}`
}

/**
 * Retourne le numéro de semaine dans le mois (1-5).
 * Semaine 1 = 1er au 7, semaine 2 = 8 au 14, etc.
 */
function getWeekOfMonth(date: Date): number {
  return Math.ceil(date.getDate() / 7)
}

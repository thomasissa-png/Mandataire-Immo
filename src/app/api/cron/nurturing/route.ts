import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { sendEmail, buildUnsubscribeUrl } from "@/lib/email"
import { nurturingJ2, nurturingJ7, nurturingJ14 } from "@/lib/email-templates"

/**
 * GET /api/cron/nurturing
 *
 * Route cron protégée par CRON_SECRET.
 * Envoie les emails nurturing J+2, J+7, J+14 aux clients éligibles.
 * Idempotent : email_logs empêche les doubles envois.
 *
 * Appelée 1x/jour par un cron externe (Replit ou cron-job.org).
 */
export async function GET(request: NextRequest) {
  // --- Auth ---
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error("[cron/nurturing] CRON_SECRET non configuré")
    return NextResponse.json(
      { error: "CRON_SECRET non configuré sur le serveur" },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 })
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://immocrew.fr"

  const results = {
    j2_sent: 0,
    j7_sent: 0,
    j14_sent: 0,
    j2_skipped: 0,
    j7_skipped: 0,
    j14_skipped: 0,
    errors: [] as string[],
  }

  try {
    // ------------------------------------------------------------------
    // J+2 — Clients Pack Lancement inscrits il y a >= 2 jours
    // ------------------------------------------------------------------
    await processNurturing({
      label: "j2",
      emailType: "nurturing_j2",
      sqlWhere: `
        c.created_at <= NOW() - INTERVAL '2 days'
        AND c.pack = 'lancement'
        AND c.status != 'pending'
        AND (c.email_unsubscribed = FALSE OR c.email_unsubscribed IS NULL)
        AND c.id NOT IN (
          SELECT el.client_id FROM email_logs el WHERE el.email_type = 'nurturing_j2' AND el.status = 'sent'
        )
      `,
      buildTemplate: (prenom: string, email: string) =>
        nurturingJ2({
          prenom,
          email,
          dashboardUrl: `${baseUrl}/dashboard`,
          pricingUrl: `${baseUrl}/#pricing`,
          unsubscribeUrl: buildUnsubscribeUrl(email),
        }),
      results,
    })

    // ------------------------------------------------------------------
    // J+7 — Tous les clients inscrits il y a >= 7 jours
    // ------------------------------------------------------------------
    await processNurturing({
      label: "j7",
      emailType: "nurturing_j7",
      sqlWhere: `
        c.created_at <= NOW() - INTERVAL '7 days'
        AND c.status != 'pending'
        AND (c.email_unsubscribed = FALSE OR c.email_unsubscribed IS NULL)
        AND c.id NOT IN (
          SELECT el.client_id FROM email_logs el WHERE el.email_type = 'nurturing_j7' AND el.status = 'sent'
        )
      `,
      buildTemplate: (prenom: string, email: string) =>
        nurturingJ7({
          prenom,
          email,
          dashboardUrl: `${baseUrl}/dashboard`,
          pricingUrl: `${baseUrl}/#pricing`,
          unsubscribeUrl: buildUnsubscribeUrl(email),
        }),
      results,
    })

    // ------------------------------------------------------------------
    // J+14 — Clients Pack Lancement sans abonnement mensuel, >= 14 jours
    // ------------------------------------------------------------------
    await processNurturing({
      label: "j14",
      emailType: "nurturing_j14",
      sqlWhere: `
        c.created_at <= NOW() - INTERVAL '14 days'
        AND c.pack = 'lancement'
        AND c.stripe_subscription_id IS NULL
        AND c.status != 'pending'
        AND (c.email_unsubscribed = FALSE OR c.email_unsubscribed IS NULL)
        AND c.id NOT IN (
          SELECT el.client_id FROM email_logs el WHERE el.email_type = 'nurturing_j14' AND el.status = 'sent'
        )
      `,
      buildTemplate: (prenom: string, email: string) =>
        nurturingJ14({
          prenom,
          email,
          dashboardUrl: `${baseUrl}/dashboard`,
          pricingUrl: `${baseUrl}/#pricing`,
          unsubscribeUrl: buildUnsubscribeUrl(email),
        }),
      results,
    })
  } catch (err) {
    console.error("[cron/nurturing] Erreur globale:", err)
    results.errors.push(err instanceof Error ? err.message : String(err))
  }

  return NextResponse.json({
    success: results.errors.length === 0,
    ...results,
  })
}

// ---------------------------------------------------------------------------
// Helper — traitement générique d'une étape de nurturing
// ---------------------------------------------------------------------------

interface ClientRow {
  id: string
  email: string
  first_name: string | null
}

interface ProcessNurturingParams {
  label: "j2" | "j7" | "j14"
  emailType: string
  sqlWhere: string
  buildTemplate: (prenom: string, email: string) => { subject: string; html: string; text: string }
  results: {
    j2_sent: number
    j7_sent: number
    j14_sent: number
    j2_skipped: number
    j7_skipped: number
    j14_skipped: number
    errors: string[]
  }
}

async function processNurturing({
  label,
  emailType,
  sqlWhere,
  buildTemplate,
  results,
}: ProcessNurturingParams): Promise<void> {
  const sentKey = `${label}_sent` as keyof typeof results
  const skippedKey = `${label}_skipped` as keyof typeof results

  const { rows: clients } = await query<ClientRow>(
    `SELECT c.id, c.email, c.first_name
     FROM clients c
     WHERE ${sqlWhere}
     ORDER BY c.created_at ASC
     LIMIT 50`
  )

  for (const client of clients) {
    if (!client.email) continue

    const prenom = client.first_name ?? "toi"
    const template = buildTemplate(prenom, client.email)

    const result = await sendEmail({
      to: client.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      clientId: client.id,
      emailType,
    })

    if (result.status === "sent") {
      ;(results[sentKey] as number)++
    } else if (result.status === "skipped") {
      ;(results[skippedKey] as number)++
    } else {
      results.errors.push(`${emailType} échoué pour ${client.id}: ${result.message}`)
    }
  }
}

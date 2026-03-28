/**
 * Utilitaire d'envoi d'emails — ImmoCrew
 *
 * Mode "log only" par défaut : enregistre dans email_logs + console.log.
 * Quand EMAIL_PROVIDER est configuré (ex: "resend"), l'envoi réel sera branché ici.
 */

import { query } from "@/lib/db"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SendEmailParams {
  to: string
  subject: string
  html: string
  text: string
  /** ID client pour le tracking dans email_logs */
  clientId: string
  /** Type d'email pour l'idempotence (ex: 'nurturing_j2') */
  emailType: string
  /** Métadonnées supplémentaires stockées dans email_logs.metadata */
  metadata?: Record<string, unknown>
}

export interface SendEmailResult {
  success: boolean
  /** 'sent' | 'skipped' | 'failed' */
  status: "sent" | "skipped" | "failed"
  message: string
}

// ---------------------------------------------------------------------------
// Idempotence — vérifier si un email a déjà été envoyé
// ---------------------------------------------------------------------------

/**
 * Vérifie si un email de ce type a déjà été envoyé à ce client.
 * Retourne true si un enregistrement existe avec status = 'sent'.
 */
export async function isEmailSent(
  clientId: string,
  emailType: string
): Promise<boolean> {
  const { rows } = await query<{ count: string }>(
    "SELECT COUNT(*)::TEXT AS count FROM email_logs WHERE client_id = $1 AND email_type = $2 AND status = 'sent'",
    [clientId, emailType]
  )
  return parseInt(rows[0]?.count ?? "0", 10) > 0
}

// ---------------------------------------------------------------------------
// Envoi d'email
// ---------------------------------------------------------------------------

/**
 * Envoie un email (ou le log en mode développement).
 *
 * - Vérifie l'idempotence via email_logs avant d'envoyer.
 * - En mode "log only" (pas de EMAIL_PROVIDER), log dans la console + email_logs.
 * - Prêt pour Resend/Postmark : ajouter le provider dans le switch ci-dessous.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const { to, subject, html, text, clientId, emailType, metadata = {} } = params

  // 1. Idempotence : ne pas renvoyer un email déjà envoyé
  const alreadySent = await isEmailSent(clientId, emailType)
  if (alreadySent) {
    return {
      success: true,
      status: "skipped",
      message: `Email ${emailType} déjà envoyé au client ${clientId}`,
    }
  }

  const provider = process.env.EMAIL_PROVIDER

  try {
    // 2. Dispatch selon le provider
    switch (provider) {
      // Quand Resend sera configuré :
      // case "resend":
      //   await sendViaResend({ to, subject, html, text })
      //   break

      default:
        // Mode "log only" — pas de SMTP réel
        console.log("─────────────────────────────────────────")
        console.log(`[EMAIL] Mode log only — pas d'envoi réel`)
        console.log(`  To:      ${to}`)
        console.log(`  Subject: ${subject}`)
        console.log(`  Type:    ${emailType}`)
        console.log(`  Client:  ${clientId}`)
        console.log(`  Text preview: ${text.substring(0, 200)}...`)
        console.log("─────────────────────────────────────────")
        break
    }

    // 3. Enregistrer dans email_logs
    await query(
      `INSERT INTO email_logs (client_id, email_type, status, metadata)
       VALUES ($1, $2, 'sent', $3)`,
      [clientId, emailType, JSON.stringify({ to, subject, provider: provider ?? "log_only", ...metadata })]
    )

    return {
      success: true,
      status: "sent",
      message: `Email ${emailType} envoyé à ${to}${!provider ? " (log only)" : ""}`,
    }
  } catch (err) {
    console.error(`[EMAIL] Erreur envoi ${emailType} à ${to}:`, err)

    // Enregistrer l'échec dans email_logs
    try {
      await query(
        `INSERT INTO email_logs (client_id, email_type, status, metadata)
         VALUES ($1, $2, 'failed', $3)`,
        [
          clientId,
          emailType,
          JSON.stringify({
            to,
            subject,
            error: err instanceof Error ? err.message : String(err),
          }),
        ]
      )
    } catch (logErr) {
      console.error("[EMAIL] Impossible de logger l'échec dans email_logs:", logErr)
    }

    return {
      success: false,
      status: "failed",
      message: `Erreur envoi ${emailType} : ${err instanceof Error ? err.message : String(err)}`,
    }
  }
}

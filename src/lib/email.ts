/**
 * Utilitaire d'envoi d'emails — ImmoCrew
 *
 * Si RESEND_API_KEY est configuré : envoi réel via Resend.
 * Sinon : mode "log only" — console.log + enregistrement dans email_logs.
 */

import { Resend } from "resend"
import { query } from "@/lib/db"

// ---------------------------------------------------------------------------
// Resend client — instancié uniquement si la clé API est présente
// ---------------------------------------------------------------------------

const DEFAULT_SENDER = "ImmoCrew <contact@immocrew.fr>"

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return null
  return new Resend(apiKey)
}

// ---------------------------------------------------------------------------
// Utilitaire — URL de désinscription
// ---------------------------------------------------------------------------

/**
 * Génère l'URL de désinscription pour un email donné.
 * Le token est l'email encodé en base64 (V1).
 */
export function buildUnsubscribeUrl(email: string): string {
  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://immocrew.fr"
  const token = Buffer.from(email).toString("base64")
  return `${baseUrl}/api/unsubscribe?token=${token}`
}

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
 * Envoie un email via Resend (ou log en console si RESEND_API_KEY absent).
 *
 * - Vérifie l'idempotence via email_logs avant d'envoyer.
 * - Sender par défaut : ImmoCrew <contact@immocrew.fr>
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

  const resend = getResendClient()

  try {
    // 2. Envoi via Resend ou mode "log only"
    if (resend) {
      const { error } = await resend.emails.send({
        from: DEFAULT_SENDER,
        to,
        subject,
        html,
        text,
      })

      if (error) {
        throw new Error(`Resend error: ${error.message}`)
      }
    } else {
      // Mode "log only" — pas de clé Resend configurée
      console.log("─────────────────────────────────────────")
      console.log(`[EMAIL] Mode log only — RESEND_API_KEY absent`)
      console.log(`  To:      ${to}`)
      console.log(`  Subject: ${subject}`)
      console.log(`  Type:    ${emailType}`)
      console.log(`  Client:  ${clientId}`)
      console.log(`  Text preview: ${text.substring(0, 200)}...`)
      console.log("─────────────────────────────────────────")
    }

    // 3. Enregistrer dans email_logs
    await query(
      `INSERT INTO email_logs (client_id, email_type, status, metadata)
       VALUES ($1, $2, 'sent', $3)`,
      [clientId, emailType, JSON.stringify({ to, subject, provider: resend ? "resend" : "log_only", ...metadata })]
    )

    return {
      success: true,
      status: "sent",
      message: `Email ${emailType} envoyé à ${to}${!resend ? " (log only)" : ""}`,
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

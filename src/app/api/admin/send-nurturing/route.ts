import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { query } from "@/lib/db"
import { sendEmail, isEmailSent } from "@/lib/email"
import { nurturingJ2, nurturingJ7, nurturingJ14 } from "@/lib/email-templates"

/**
 * POST /api/admin/send-nurturing
 *
 * Déclenche manuellement l'envoi des emails nurturing.
 * Auth : cookie admin (ADMIN_PASSWORD).
 *
 * Body :
 * - { client_id?: string } — si fourni, envoie uniquement à ce client
 * - {} ou absent — batch tous les clients éligibles
 */
export async function POST(request: NextRequest) {
  // --- Auth admin ---
  const isAdmin = await isAdminAuthenticated()
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 401 })
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "https://immocrew.fr"

  let body: { client_id?: string } = {}
  try {
    body = await request.json()
  } catch {
    // Body vide ou invalide — on continue en mode batch
  }

  const results: {
    sent: Array<{ clientId: string; email: string; type: string; status: string }>
    errors: string[]
  } = { sent: [], errors: [] }

  try {
    if (body.client_id) {
      // --- Mode client unique ---
      await sendNurturingForClient(body.client_id, baseUrl, results)
    } else {
      // --- Mode batch ---
      const { rows: clients } = await query<{ id: string }>(
        "SELECT id FROM clients WHERE status != 'pending' AND email IS NOT NULL ORDER BY created_at ASC LIMIT 100"
      )
      for (const client of clients) {
        await sendNurturingForClient(client.id, baseUrl, results)
      }
    }
  } catch (err) {
    console.error("[admin/send-nurturing] Erreur:", err)
    results.errors.push(err instanceof Error ? err.message : String(err))
  }

  return NextResponse.json({
    success: results.errors.length === 0,
    total_sent: results.sent.filter((s) => s.status === "sent").length,
    total_skipped: results.sent.filter((s) => s.status === "skipped").length,
    details: results.sent,
    errors: results.errors,
  })
}

// ---------------------------------------------------------------------------
// Helper — envoyer tous les emails nurturing éligibles pour un client
// ---------------------------------------------------------------------------

interface ClientRow {
  id: string
  email: string
  first_name: string | null
  pack: string | null
  stripe_subscription_id: string | null
  created_at: string
}

async function sendNurturingForClient(
  clientId: string,
  baseUrl: string,
  results: {
    sent: Array<{ clientId: string; email: string; type: string; status: string }>
    errors: string[]
  }
): Promise<void> {
  const { rows } = await query<ClientRow>(
    "SELECT id, email, first_name, pack, stripe_subscription_id, created_at::TEXT FROM clients WHERE id = $1 LIMIT 1",
    [clientId]
  )

  if (rows.length === 0) {
    results.errors.push(`Client ${clientId} introuvable`)
    return
  }

  const client = rows[0]
  if (!client.email) {
    results.errors.push(`Client ${clientId} n'a pas d'email`)
    return
  }

  const prenom = client.first_name ?? "toi"
  const createdAt = new Date(client.created_at)
  const now = new Date()
  const daysSinceCreation = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

  const templateParams = {
    prenom,
    email: client.email,
    dashboardUrl: `${baseUrl}/dashboard`,
    pricingUrl: `${baseUrl}/#pricing`,
  }

  // J+2 : Pack Lancement, >= 2 jours
  if (daysSinceCreation >= 2 && client.pack === "lancement") {
    const alreadySent = await isEmailSent(clientId, "nurturing_j2")
    if (!alreadySent) {
      const template = nurturingJ2(templateParams)
      const result = await sendEmail({
        to: client.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        clientId,
        emailType: "nurturing_j2",
      })
      results.sent.push({ clientId, email: client.email, type: "nurturing_j2", status: result.status })
    } else {
      results.sent.push({ clientId, email: client.email, type: "nurturing_j2", status: "skipped" })
    }
  }

  // J+7 : Tous les clients, >= 7 jours
  if (daysSinceCreation >= 7) {
    const alreadySent = await isEmailSent(clientId, "nurturing_j7")
    if (!alreadySent) {
      const template = nurturingJ7(templateParams)
      const result = await sendEmail({
        to: client.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        clientId,
        emailType: "nurturing_j7",
      })
      results.sent.push({ clientId, email: client.email, type: "nurturing_j7", status: result.status })
    } else {
      results.sent.push({ clientId, email: client.email, type: "nurturing_j7", status: "skipped" })
    }
  }

  // J+14 : Pack Lancement sans mensuel, >= 14 jours
  if (daysSinceCreation >= 14 && client.pack === "lancement" && !client.stripe_subscription_id) {
    const alreadySent = await isEmailSent(clientId, "nurturing_j14")
    if (!alreadySent) {
      const template = nurturingJ14(templateParams)
      const result = await sendEmail({
        to: client.email,
        subject: template.subject,
        html: template.html,
        text: template.text,
        clientId,
        emailType: "nurturing_j14",
      })
      results.sent.push({ clientId, email: client.email, type: "nurturing_j14", status: result.status })
    } else {
      results.sent.push({ clientId, email: client.email, type: "nurturing_j14", status: "skipped" })
    }
  }
}

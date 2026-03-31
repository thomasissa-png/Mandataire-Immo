// SSR — Auth required. Retourne le code parrainage du client connecte.
// Genere le code s'il n'existe pas encore.

import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import {
  generateReferralCode,
  generateFallbackCode,
} from "@/lib/referral"

interface ClientRow {
  id: string
  first_name: string | null
  pack: string | null
  status: string | null
  client_context: Record<string, unknown> | null
  referral_credit_months_remaining: number
}

interface ReferralCodeRow {
  code: string
}

interface StatsRow {
  total_referrals: string
  converted: string
  pending: string
}

/**
 * Extrait le prenom du client depuis first_name ou client_context.profile.prenom.
 */
function extractPrenom(client: ClientRow): string {
  if (client.first_name) return client.first_name

  const ctx = client.client_context as Record<string, unknown> | null
  if (ctx) {
    const profile = ctx.profile as Record<string, unknown> | undefined
    if (profile?.prenom && typeof profile.prenom === "string") {
      return profile.prenom
    }
  }

  return "USER"
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 }
    )
  }

  // Recuperer le client et verifier l'abonnement actif
  const { rows: clients } = await query<ClientRow>(
    `SELECT id, first_name, pack, status, client_context, referral_credit_months_remaining
     FROM clients WHERE id = $1`,
    [user.id]
  )

  if (clients.length === 0) {
    return NextResponse.json(
      { error: "client_not_found" },
      { status: 404 }
    )
  }

  const client = clients[0]

  // Seuls les abonnes Pack Mensuel actifs peuvent parrainer
  const isActiveMensuel =
    client.status === "active" &&
    (client.pack === "mensuel" || client.pack === "mensuel-trimestriel")

  if (!isActiveMensuel) {
    return NextResponse.json(
      { error: "subscription_required" },
      { status: 403 }
    )
  }

  // Verifier si un code existe deja
  const { rows: existingCodes } = await query<ReferralCodeRow>(
    `SELECT code FROM referral_codes WHERE user_id = $1 AND is_active = TRUE LIMIT 1`,
    [user.id]
  )

  let code: string

  if (existingCodes.length > 0) {
    code = existingCodes[0].code
  } else {
    // Generer un nouveau code avec gestion des collisions (max 5 tentatives)
    const prenom = extractPrenom(client)
    let generated = false

    for (let attempt = 0; attempt < 5; attempt++) {
      const candidate = generateReferralCode(prenom)
      const { rowCount } = await query(
        `SELECT 1 FROM referral_codes WHERE code = $1`,
        [candidate]
      )

      if (rowCount === 0) {
        await query(
          `INSERT INTO referral_codes (user_id, code) VALUES ($1, $2)`,
          [user.id, candidate]
        )
        code = candidate
        generated = true
        break
      }
    }

    if (!generated) {
      // Fallback apres 5 collisions
      const fallback = generateFallbackCode(user.id)
      await query(
        `INSERT INTO referral_codes (user_id, code) VALUES ($1, $2)
         ON CONFLICT (code) DO NOTHING`,
        [user.id, fallback]
      )
      code = fallback
    }
  }

  // Recuperer les stats de parrainage
  const { rows: stats } = await query<StatsRow>(
    `SELECT
       COUNT(*) AS total_referrals,
       COUNT(*) FILTER (WHERE r.status = 'converted') AS converted,
       COUNT(*) FILTER (WHERE r.status = 'pending') AS pending
     FROM referrals r
     JOIN referral_codes rc ON rc.id = r.referral_code_id
     WHERE rc.user_id = $1`,
    [user.id]
  )

  const statsRow = stats[0]

  return NextResponse.json({
    code: code!,
    stats: {
      total_referrals: parseInt(statsRow.total_referrals, 10),
      converted: parseInt(statsRow.converted, 10),
      pending: parseInt(statsRow.pending, 10),
      credit_months_remaining: client.referral_credit_months_remaining,
    },
  })
}

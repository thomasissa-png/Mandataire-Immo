// SSR — Auth required. Retourne la liste des parrainages du client connecte.
// Emails masques pour conformite RGPD.

import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { maskEmail } from "@/lib/referral"

interface ReferralRow {
  id: string
  referee_email: string | null
  status: string
  converted_at: string | null
  created_at: string
}

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json(
      { error: "Non authentifié" },
      { status: 401 }
    )
  }

  const { rows } = await query<ReferralRow>(
    `SELECT r.id, r.referee_email, r.status, r.converted_at, r.created_at
     FROM referrals r
     JOIN referral_codes rc ON rc.id = r.referral_code_id
     WHERE rc.user_id = $1
     ORDER BY r.created_at DESC`,
    [user.id]
  )

  const referrals = rows.map((row) => ({
    id: row.id,
    referee_email: row.referee_email ? maskEmail(row.referee_email) : null,
    status: row.status,
    converted_at: row.converted_at,
    created_at: row.created_at,
  }))

  return NextResponse.json({ referrals })
}

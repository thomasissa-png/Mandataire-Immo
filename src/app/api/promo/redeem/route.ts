import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

/**
 * POST /api/promo/redeem
 * Consomme un code promo (appelé après validation Stripe réussie).
 * Incrémente current_uses et enregistre la rédemption.
 */
export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: { code: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const code = body.code?.trim().toUpperCase()
  if (!code) {
    return NextResponse.json({ error: "Code requis" }, { status: 400 })
  }

  // Vérifier que le code est valide et pas déjà utilisé par ce client
  const { rows } = await query<{ id: string; max_uses: number | null; current_uses: number }>(
    `SELECT pc.id, pc.max_uses, pc.current_uses
     FROM promo_codes pc
     WHERE pc.code = $1 AND pc.active = TRUE
       AND NOT EXISTS (
         SELECT 1 FROM promo_redemptions pr
         WHERE pr.promo_code_id = pc.id AND pr.client_email = $2
       )
     LIMIT 1`,
    [code, user.email]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Code invalide ou déjà utilisé" }, { status: 400 })
  }

  const promo = rows[0]

  // Vérifier la limite
  if (promo.max_uses !== null && promo.current_uses >= promo.max_uses) {
    return NextResponse.json({ error: "Ce code a atteint sa limite" }, { status: 400 })
  }

  // Consommer le code
  await query(
    `UPDATE promo_codes SET current_uses = current_uses + 1 WHERE id = $1`,
    [promo.id]
  )

  await query(
    `INSERT INTO promo_redemptions (promo_code_id, client_email) VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [promo.id, user.email]
  )

  return NextResponse.json({ status: "redeemed" })
}

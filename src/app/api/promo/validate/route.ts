import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"

/**
 * POST /api/promo/validate
 * Valide un code promo et retourne les détails (type, valeur, pack).
 * Ne consomme PAS le code — juste vérification.
 * La consommation se fait au moment du checkout.
 */
export async function POST(request: NextRequest) {
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

  const { rows } = await query<{
    id: string
    code: string
    type: string
    value: number
    pack: string
    max_uses: number | null
    current_uses: number
    valid_until: string | null
    active: boolean
  }>(
    `SELECT id, code, type, value, pack, max_uses, current_uses, valid_until, active
     FROM promo_codes
     WHERE code = $1 AND active = TRUE
     LIMIT 1`,
    [code]
  )

  if (rows.length === 0) {
    return NextResponse.json({ valid: false, error: "Code invalide ou expiré" })
  }

  const promo = rows[0]

  // Vérifier les limites d'utilisation
  if (promo.max_uses !== null && promo.current_uses >= promo.max_uses) {
    return NextResponse.json({ valid: false, error: "Ce code a atteint sa limite d'utilisation" })
  }

  // Vérifier la date d'expiration
  if (promo.valid_until && new Date(promo.valid_until) < new Date()) {
    return NextResponse.json({ valid: false, error: "Ce code a expiré" })
  }

  // Formater la description pour l'UI
  let description = ""
  if (promo.type === "trial_month") {
    description = `${promo.value} jours d'essai gratuit`
  } else if (promo.type === "discount_percent") {
    description = `${promo.value}% de réduction`
  } else if (promo.type === "discount_amount") {
    description = `${(promo.value / 100).toFixed(0)}€ de réduction`
  }

  return NextResponse.json({
    valid: true,
    code: promo.code,
    type: promo.type,
    value: promo.value,
    pack: promo.pack,
    description,
  })
}

import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { query } from "@/lib/db"

/**
 * POST /api/admin/set-status
 * Change le pack et/ou le status d'un client.
 * Admin-only — utile pour tester les différents états de compte.
 *
 * Body : { email: string, pack?: string, status?: string }
 * Exemples :
 *   { "email": "sophie@test.fr", "pack": "mensuel", "status": "active" }
 *   { "email": "sophie@test.fr", "pack": "trimestriel" }
 *   { "email": "sophie@test.fr", "status": "frozen" }
 */
export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await request.json()
  const { email, pack, status } = body as {
    email?: string
    pack?: string
    status?: string
  }

  if (!email) {
    return NextResponse.json(
      { error: "Le champ email est requis." },
      { status: 400 }
    )
  }

  if (!pack && !status) {
    return NextResponse.json(
      { error: "Au moins un champ pack ou status est requis." },
      { status: 400 }
    )
  }

  const validPacks = ["mensuel", "trimestriel", "annuel", "boost", null]
  const validStatuses = ["pending", "active", "frozen", "cancelled", null]

  if (pack && !validPacks.includes(pack)) {
    return NextResponse.json(
      { error: `Pack invalide. Valeurs acceptées : ${validPacks.filter(Boolean).join(", ")}` },
      { status: 400 }
    )
  }

  if (status && !validStatuses.includes(status)) {
    return NextResponse.json(
      { error: `Status invalide. Valeurs acceptées : ${validStatuses.filter(Boolean).join(", ")}` },
      { status: 400 }
    )
  }

  // Build dynamic SET clause
  const setClauses: string[] = []
  const values: (string | null)[] = []
  let paramIdx = 1

  if (pack !== undefined) {
    setClauses.push(`pack = $${paramIdx++}`)
    values.push(pack)
  }
  if (status !== undefined) {
    setClauses.push(`status = $${paramIdx++}`)
    values.push(status)
  }

  values.push(email)

  const { rowCount } = await query(
    `UPDATE clients SET ${setClauses.join(", ")} WHERE email = $${paramIdx}`,
    values
  )

  if (rowCount === 0) {
    return NextResponse.json(
      { error: `Aucun client trouvé avec l'email ${email}` },
      { status: 404 }
    )
  }

  return NextResponse.json({
    ok: true,
    message: `Client ${email} mis à jour.`,
    updated: { ...(pack !== undefined && { pack }), ...(status !== undefined && { status }) },
  })
}

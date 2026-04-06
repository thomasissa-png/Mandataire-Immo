import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

interface DeliverableRow {
  id: string
  content: string
  client_email: string
}

/**
 * GET /api/deliverables/[id]
 * Retourne le contenu complet d'un livrable.
 * Authentification requise : seul le propriétaire peut accéder à son livrable.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  const { rows } = await query<DeliverableRow>(
    "SELECT id, content, client_email FROM deliverables WHERE id = $1 LIMIT 1",
    [id]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Livrable introuvable" }, { status: 404 })
  }

  const deliverable = rows[0]

  // Vérifier que le livrable appartient bien à l'utilisateur connecté
  if (deliverable.client_email !== user.email) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  return NextResponse.json({
    id: deliverable.id,
    content: deliverable.content,
  })
}

/**
 * PATCH /api/deliverables/[id]
 * Modifie le contenu d'un livrable (édition par Sophie).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  let body: { content?: string; title?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Vérifier ownership
  const { rows } = await query<{ id: string; client_email: string }>(
    "SELECT id, client_email FROM deliverables WHERE id = $1 LIMIT 1",
    [id]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Livrable introuvable" }, { status: 404 })
  }

  if (rows[0].client_email !== user.email) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  // Mettre à jour
  const updates: string[] = []
  const values: unknown[] = []
  let paramIdx = 1

  if (body.content !== undefined) {
    updates.push(`content = $${paramIdx++}`)
    values.push(body.content)
  }
  if (body.title !== undefined) {
    updates.push(`title = $${paramIdx++}`)
    values.push(body.title)
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: "Rien à modifier" }, { status: 400 })
  }

  updates.push(`updated_at = NOW()`)
  values.push(id)

  await query(
    `UPDATE deliverables SET ${updates.join(", ")} WHERE id = $${paramIdx}`,
    values
  )

  return NextResponse.json({ status: "updated" })
}

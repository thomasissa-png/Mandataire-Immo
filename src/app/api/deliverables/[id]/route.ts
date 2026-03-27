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

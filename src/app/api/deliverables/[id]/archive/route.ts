import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

interface DeliverableRow {
  id: string
  status: string
  client_email: string
}

/**
 * PATCH /api/deliverables/[id]/archive
 * Bascule le statut entre "delivered" et "archived".
 * Authentification requise + vérification de propriété.
 */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  // Récupérer le livrable
  const { rows } = await query<DeliverableRow>(
    "SELECT id, status, client_email FROM deliverables WHERE id = $1 LIMIT 1",
    [id]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Livrable introuvable" }, { status: 404 })
  }

  const deliverable = rows[0]

  // Vérifier la propriété
  if (deliverable.client_email !== user.email) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  // Seuls les livrables "delivered" ou "archived" peuvent être basculés
  if (deliverable.status !== "delivered" && deliverable.status !== "archived") {
    return NextResponse.json(
      { error: "Seuls les livrables livrés peuvent être archivés" },
      { status: 400 }
    )
  }

  const newStatus = deliverable.status === "archived" ? "delivered" : "archived"

  await query(
    "UPDATE deliverables SET status = $1 WHERE id = $2",
    [newStatus, id]
  )

  return NextResponse.json({ id, status: newStatus })
}

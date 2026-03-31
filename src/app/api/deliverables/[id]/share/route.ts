import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

interface DeliverableRow {
  id: string
  client_email: string
  share_token: string | null
  type: string
}

/**
 * POST /api/deliverables/[id]/share
 * Génère (ou retourne) un lien de partage public pour une annonce.
 * Authentification requise : seul le propriétaire peut partager son annonce.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  // Récupérer le livrable et vérifier ownership
  const { rows } = await query<DeliverableRow>(
    "SELECT id, client_email, share_token, type FROM deliverables WHERE id = $1 LIMIT 1",
    [id]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Livrable introuvable" }, { status: 404 })
  }

  const deliverable = rows[0]

  if (deliverable.client_email !== user.email) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  if (deliverable.type !== "annonce") {
    return NextResponse.json(
      { error: "Seules les annonces peuvent être partagées" },
      { status: 400 }
    )
  }

  // Si un token existe déjà, le retourner
  if (deliverable.share_token) {
    const url = buildShareUrl(request, deliverable.share_token)
    return NextResponse.json({ shareUrl: url, token: deliverable.share_token })
  }

  // Générer un nouveau token
  const token = crypto.randomUUID()

  await query(
    "UPDATE deliverables SET share_token = $1 WHERE id = $2",
    [token, id]
  )

  const url = buildShareUrl(request, token)
  return NextResponse.json({ shareUrl: url, token })
}

function buildShareUrl(request: NextRequest, token: string): string {
  const origin = request.headers.get("x-forwarded-host")
    ? `${request.headers.get("x-forwarded-proto") || "https"}://${request.headers.get("x-forwarded-host")}`
    : request.nextUrl.origin
  return `${origin}/annonce/${token}`
}

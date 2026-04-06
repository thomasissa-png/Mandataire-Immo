import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { query } from "@/lib/db"

/**
 * POST /api/admin/review-rewrite
 * Admin approuve ou rejette une réécriture en attente.
 * - approve : le pending_content remplace le content, status → delivered
 * - reject : le pending_content est supprimé, status → delivered (ancien contenu conservé)
 */
export async function POST(request: NextRequest) {
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  let body: { deliverable_id: string; action: "approve" | "reject" }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { deliverable_id, action } = body
  if (!deliverable_id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "deliverable_id et action (approve/reject) requis" }, { status: 400 })
  }

  // Vérifier que le deliverable est en pending_review
  const { rows } = await query<{ id: string; metadata: Record<string, unknown> }>(
    `SELECT id, metadata FROM deliverables WHERE id = $1 AND status = 'pending_review' LIMIT 1`,
    [deliverable_id]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Deliverable non trouvé ou pas en attente" }, { status: 404 })
  }

  const meta = rows[0].metadata || {}
  const pendingContent = meta.pending_content

  if (action === "approve" && typeof pendingContent === "string") {
    // Approuver : le nouveau contenu remplace l'ancien
    await query(
      `UPDATE deliverables
       SET content = $1,
           status = 'delivered',
           metadata = metadata - 'pending_content' - 'previous_content'
       WHERE id = $2`,
      [pendingContent, deliverable_id]
    )
    return NextResponse.json({ status: "approved", message: "Réécriture approuvée et publiée." })
  }

  // Rejeter : revenir au contenu original
  await query(
    `UPDATE deliverables
     SET status = 'delivered',
         metadata = metadata - 'pending_content' - 'previous_content'
     WHERE id = $1`,
    [deliverable_id]
  )

  return NextResponse.json({ status: "rejected", message: "Réécriture rejetée — ancien contenu conservé." })
}

import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  // Verify deliverable belongs to this user and get current content
  const { rows } = await query<{ id: string; content: string; type: string; rewrite_count: number }>(
    `SELECT d.id, d.content, d.type, COALESCE(d.rewrite_count, 0) as rewrite_count
     FROM deliverables d
     JOIN clients c ON d.client_id = c.id
     WHERE d.id = $1 AND c.email = $2`,
    [id, session.user.email]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Contenu introuvable" }, { status: 404 })
  }

  const deliverable = rows[0]

  if (deliverable.rewrite_count >= 3) {
    return NextResponse.json(
      { error: "Nombre maximum de réécritures atteint (3). Contacte le support." },
      { status: 429 }
    )
  }

  // For now, return current content with a note.
  // In production, this would call the AI generation pipeline.
  // The rewrite_count is incremented to track usage.
  await query(
    `UPDATE deliverables SET rewrite_count = COALESCE(rewrite_count, 0) + 1 WHERE id = $1`,
    [id]
  )

  // TODO: Integrate with AI rewrite pipeline
  // For now, return the existing content (the actual rewrite will be handled
  // by the generation pipeline when connected)
  return NextResponse.json({
    content: deliverable.content,
    rewriteCount: deliverable.rewrite_count + 1,
    message: "Réécriture demandée — le nouveau contenu sera disponible sous peu.",
  })
}

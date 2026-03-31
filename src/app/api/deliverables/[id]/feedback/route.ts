import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { query } from "@/lib/db"

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  let body: { feedback: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  const { feedback } = body
  if (!feedback || !["like", "dislike"].includes(feedback)) {
    return NextResponse.json({ error: "Feedback invalide (like ou dislike)" }, { status: 400 })
  }

  // Verify deliverable belongs to this user
  const rows = await query<{ id: string }>(
    `SELECT d.id FROM deliverables d
     JOIN clients c ON d.client_id = c.id
     WHERE d.id = $1 AND c.email = $2`,
    [id, session.user.email]
  )

  if (rows.length === 0) {
    return NextResponse.json({ error: "Contenu introuvable" }, { status: 404 })
  }

  // Store feedback (upsert pattern — one feedback per deliverable)
  await query(
    `INSERT INTO deliverable_feedback (deliverable_id, feedback, created_at)
     VALUES ($1, $2, NOW())
     ON CONFLICT (deliverable_id) DO UPDATE SET feedback = $2, created_at = NOW()`,
    [id, feedback]
  )

  return NextResponse.json({ ok: true })
}

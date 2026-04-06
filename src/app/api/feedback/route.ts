import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"

/**
 * POST /api/feedback
 * Enregistre un retour client (amélioration, bug, question).
 * Stocké en DB + tracking Umami.
 */
export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: { type: string; message: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { type, message } = body
  if (!type || !message?.trim()) {
    return NextResponse.json({ error: "Type et message requis" }, { status: 400 })
  }

  // Stocker en DB (table feedback si elle existe, sinon log)
  try {
    await query(
      `INSERT INTO feedback (client_email, type, message, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [user.email, type, message.trim()]
    )
  } catch {
    // Table n'existe peut-être pas encore — log en console
    console.log(`[feedback] ${user.email} | ${type} | ${message.trim()}`)
  }

  await trackServer("client_feedback", user.email, { type })

  return NextResponse.json({ status: "received" })
}

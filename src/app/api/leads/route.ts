import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"

interface LeadPayload {
  email: string
  name?: string
  city?: string
  source?: string
}

export async function POST(request: NextRequest) {
  let body: LeadPayload

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const { email, name, city, source } = body

  // Basic email validation
  if (!email || !email.includes("@") || !email.includes(".")) {
    return NextResponse.json(
      { error: "Email invalide" },
      { status: 400 }
    )
  }

  try {
    await query(
      `INSERT INTO leads (email, name, city, source, created_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email) DO UPDATE SET
         name = EXCLUDED.name,
         city = EXCLUDED.city,
         source = EXCLUDED.source,
         created_at = EXCLUDED.created_at`,
      [
        email.toLowerCase().trim(),
        name || null,
        city || null,
        source || "landing_hero",
        new Date().toISOString(),
      ]
    )
  } catch (err) {
    console.error("Error capturing lead:", err)
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    )
  }

  await trackServer("lead_form_submit", email.toLowerCase().trim(), {
    city: city || null,
    source: source || "landing_hero",
  })

  return NextResponse.json({ success: true })
}

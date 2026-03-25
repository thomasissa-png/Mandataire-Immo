import { NextRequest, NextResponse } from "next/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

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

  const supabase = createAdminSupabaseClient()

  const { error } = await supabase.from("leads").upsert(
    {
      email: email.toLowerCase().trim(),
      name: name || null,
      city: city || null,
      source: source || "landing_hero",
      created_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  )

  if (error) {
    console.error("Error capturing lead:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement" },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}

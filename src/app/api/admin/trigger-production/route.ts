import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { trackServer } from "@/lib/tracking"

interface TriggerBody {
  client_id: string
  pack_type: "mensuel" | "lancement" | "boost"
  mois?: string
  bien?: {
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }
}

/**
 * POST /api/admin/trigger-production
 * Dispatche la generation vers la bonne route de pack.
 * Admin-only.
 */
export async function POST(request: NextRequest) {
  // Admin check
  const user = await getSessionUser()
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user?.email
  if (!userEmail || userEmail !== adminEmail) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
  }

  let body: TriggerBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { client_id, pack_type, mois, bien } = body
  if (!client_id || !pack_type) {
    return NextResponse.json(
      { error: "client_id et pack_type sont requis" },
      { status: 400 }
    )
  }

  // Valider les parametres selon le type de pack
  if (pack_type === "mensuel" && !mois) {
    return NextResponse.json(
      { error: "mois requis pour le pack mensuel (format YYYY-MM)" },
      { status: 400 }
    )
  }
  if (pack_type === "boost" && !bien) {
    return NextResponse.json(
      { error: "bien requis pour le boost mandat" },
      { status: 400 }
    )
  }

  await trackServer("admin_trigger_production", userEmail, {
    client_id,
    pack_type,
    mois: mois || null,
  })

  // Construire l'URL interne de la route de generation
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  let targetUrl: string
  let targetBody: Record<string, unknown>

  switch (pack_type) {
    case "mensuel":
      targetUrl = `${baseUrl}/api/generate/pack-mensuel`
      targetBody = { client_id, mois }
      break
    case "lancement":
      targetUrl = `${baseUrl}/api/generate/pack-lancement`
      targetBody = { client_id }
      break
    case "boost":
      targetUrl = `${baseUrl}/api/generate/boost-mandat`
      targetBody = { client_id, bien }
      break
    default:
      return NextResponse.json(
        { error: "pack_type invalide" },
        { status: 400 }
      )
  }

  // Forward la requete vers la route de generation
  // On passe les cookies pour maintenir l'auth NextAuth
  try {
    const cookieHeader = request.headers.get("cookie") || ""
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(targetBody),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json({
      ...data,
      triggered_by: userEmail,
      pack_type,
    })
  } catch (err) {
    console.error("Error triggering production:", err)
    return NextResponse.json(
      {
        error: "Erreur lors du declenchement de la production",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

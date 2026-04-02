import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { trackServer } from "@/lib/tracking"

interface TriggerBody {
  client_id: string
  pack_type: "mensuel" | "setup" | "boost"
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
  // Admin check via cookie mot de passe
  const authenticated = await isAdminAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  // Vérifier que la clé API Claude est configurée avant de lancer
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error: "ANTHROPIC_API_KEY non configurée. Ajoute-la dans les Secrets Replit pour générer du contenu.",
      },
      { status: 500 }
    )
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

  await trackServer("admin_trigger_production", "admin", {
    client_id,
    pack_type,
    mois: mois || null,
  })

  // URL INTERNE localhost — bypass le proxy Replit qui coupe les requêtes longues
  // Le proxy externe (Replit/Cloudflare) a un timeout de ~30-60s.
  // Un setup mois 1 = 7 appels Claude = 3-7 min → le proxy coupe et retourne "upstream request timeout".
  // En passant par localhost, on reste dans le process Node.js sans proxy.
  const port = process.env.PORT || "3000"
  const baseUrl = `http://127.0.0.1:${port}`

  let targetUrl: string
  let targetBody: Record<string, unknown>

  switch (pack_type) {
    case "mensuel":
      targetUrl = `${baseUrl}/api/generate/pack-mensuel`
      targetBody = { client_id, mois }
      break
    case "setup":
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
  // Timeout 10 min : setup mois 1 = 7 appels Claude = 3-7 minutes
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 10 * 60 * 1000)

  try {
    const cookieHeader = request.headers.get("cookie") || ""
    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(targetBody),
      signal: controller.signal,
    })

    // Protéger contre les réponses non-JSON (proxy error, HTML error pages)
    const responseText = await response.text()
    let data: Record<string, unknown>
    try {
      data = JSON.parse(responseText)
    } catch {
      console.error("[trigger-production] Non-JSON response:", responseText.slice(0, 500))
      return NextResponse.json(
        {
          error: "La route de génération a retourné une réponse invalide.",
          details: responseText.slice(0, 200),
          hint: `URL appelée : ${targetUrl}`,
        },
        { status: 502 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json({
      ...data,
      triggered_by: "admin",
      pack_type,
    })
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      console.error("Production timeout after 10 minutes:", targetUrl)
      return NextResponse.json(
        {
          error: "La génération a dépassé le délai maximum de 10 minutes. Réessaie ou vérifie les logs serveur.",
        },
        { status: 504 }
      )
    }

    console.error("Error triggering production:", err)
    return NextResponse.json(
      {
        error: "Erreur lors du déclenchement de la production",
        details: err instanceof Error ? err.message : String(err),
        hint: `URL appelée : ${targetUrl} — vérifie que NEXT_PUBLIC_APP_URL est correcte ou que le serveur est accessible.`,
      },
      { status: 500 }
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

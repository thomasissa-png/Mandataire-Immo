import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"

/**
 * POST /api/auto-produce
 * Déclenche automatiquement la production de livrables pour le client connecté.
 * Appelé après l'onboarding — Sophie n'attend pas, la production tourne en background.
 *
 * Détecte le pack du client et appelle la route de génération correspondante.
 */
export async function POST() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    // Trouver le client et son pack
    const { rows } = await query<{ id: string; pack: string | null }>(
      "SELECT id, pack FROM clients WHERE email = $1 LIMIT 1",
      [user.email]
    )

    const client = rows[0]
    if (!client) {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 })
    }

    const pack = client.pack || "lancement"
    const mois = new Date().toISOString().slice(0, 7) // ex: "2026-04"
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

    // Déclencher la production via fetch interne (non-bloquant)
    const routeMap: Record<string, string> = {
      lancement: "/api/generate/pack-lancement",
      mensuel: "/api/generate/pack-mensuel",
    }

    const route = routeMap[pack] || routeMap.lancement

    // Fire-and-forget : on ne bloque pas Sophie
    fetch(`${appUrl}${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: client.id,
        mois,
      }),
    }).catch((err) => {
      console.error("[auto-produce] Error triggering production:", err)
    })

    await trackServer("production_started", user.email, {
      pack,
      client_id: client.id,
      mois,
      trigger: "auto_post_onboarding",
    })

    console.log(`[auto-produce] Production triggered for ${user.email} (pack: ${pack})`)

    return NextResponse.json({
      success: true,
      message: "Production déclenchée. Les livrables arrivent dans quelques minutes.",
      pack,
    })
  } catch (err) {
    console.error("[auto-produce] Error:", err)
    return NextResponse.json(
      { error: "Erreur lors du déclenchement de la production" },
      { status: 500 }
    )
  }
}

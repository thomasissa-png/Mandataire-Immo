/**
 * PATCH /api/agent/[slug]
 * Permet au mandataire propriétaire de modifier sa landing page.
 * Auth requise, vérification de propriété, guard edition_locked.
 */
import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

// ─── Types ──────────────────────────────────────────────────────────

interface AgentOwnerRow {
  id: string
  edition_locked: boolean
  client_id: string
}

interface RouteContext {
  params: Promise<{ slug: string }>
}

// ─── Champs éditables (whitelist stricte) ───────────────────────────

const EDITABLE_AGENT_FIELDS = ["bio_generee", "indexation"] as const
const EDITABLE_CONTEXT_FIELDS = ["bio_personnelle"] as const

// ─── Handler ────────────────────────────────────────────────────────

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { slug } = await context.params

  // Parse body
  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  try {
    // 1. Vérifier propriété : le client connecté est-il le propriétaire du slug ?
    const { rows } = await query<AgentOwnerRow>(
      `SELECT ap.id, ap.edition_locked, ap.client_id
       FROM agent_pages ap
       JOIN clients c ON ap.client_id = c.id
       WHERE c.email = $1 AND ap.slug = $2
       LIMIT 1`,
      [user.email, slug]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Page introuvable ou tu n'es pas propriétaire de cette page." },
        { status: 404 }
      )
    }

    const agentPage = rows[0]

    // 2. Guard edition_locked
    if (agentPage.edition_locked) {
      return NextResponse.json(
        { error: "Ton accès en édition a expiré — passe au Pack Mensuel pour continuer à modifier ta page." },
        { status: 403 }
      )
    }

    // 3. Appliquer les modifications agent_pages
    const agentUpdates: string[] = []
    const agentValues: unknown[] = []
    let paramIndex = 1

    for (const field of EDITABLE_AGENT_FIELDS) {
      if (field in body) {
        const value = body[field]
        // indexation est un booléen, les autres champs sont des strings
        if (field === "indexation" ? typeof value === "boolean" : typeof value === "string") {
          agentUpdates.push(`${field} = $${paramIndex}`)
          agentValues.push(value)
          paramIndex++
        }
      }
    }

    if (agentUpdates.length > 0) {
      agentUpdates.push(`updated_at = NOW()`)
      agentValues.push(agentPage.id)
      await query(
        `UPDATE agent_pages SET ${agentUpdates.join(", ")} WHERE id = $${paramIndex}`,
        agentValues
      )
    }

    // 4. Appliquer les modifications client_context
    const contextUpdates: Record<string, string> = {}
    for (const field of EDITABLE_CONTEXT_FIELDS) {
      if (field in body && typeof body[field] === "string") {
        contextUpdates[field] = body[field] as string
      }
    }

    if (Object.keys(contextUpdates).length > 0) {
      // Merge JSONB : on utilise || pour fusionner avec l'existant
      await query(
        `UPDATE clients
         SET client_context = COALESCE(client_context, '{}'::jsonb) || $1::jsonb
         WHERE id = $2`,
        [JSON.stringify(contextUpdates), agentPage.client_id]
      )
    }

    if (agentUpdates.length === 0 && Object.keys(contextUpdates).length === 0) {
      return NextResponse.json({ message: "Aucune modification envoyée." }, { status: 200 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error("PATCH /api/agent/[slug] error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de ta page mandataire." },
      { status: 500 }
    )
  }
}

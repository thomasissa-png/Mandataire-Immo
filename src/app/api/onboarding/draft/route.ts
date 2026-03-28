import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

/**
 * GET /api/onboarding/draft
 * Récupère le brouillon d'onboarding de l'utilisateur connecté.
 * Retourne { step, data, updated_at } ou { step: 0, data: {} } si pas de brouillon.
 */
export async function GET() {
  const user = await getSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    const { rows } = await query<{
      onboarding_draft: Record<string, unknown> | null
      onboarding_draft_step: number | null
      onboarding_draft_updated_at: string | null
    }>(
      `SELECT onboarding_draft, onboarding_draft_step, onboarding_draft_updated_at
       FROM clients
       WHERE email = $1`,
      [user.email]
    )

    if (rows.length === 0 || !rows[0].onboarding_draft) {
      return NextResponse.json({ step: 0, data: {} })
    }

    return NextResponse.json({
      step: rows[0].onboarding_draft_step ?? 0,
      data: rows[0].onboarding_draft,
      updated_at: rows[0].onboarding_draft_updated_at,
    })
  } catch (err) {
    console.error("Error fetching onboarding draft:", err)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du brouillon" },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/onboarding/draft
 * Sauvegarde (merge) le brouillon d'onboarding.
 * Body : { step: number, data: Record<string, unknown> }
 * Idempotent : peut être appelé N fois sans problème.
 */
export async function PATCH(request: NextRequest) {
  const user = await getSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: { step: number; data: Record<string, unknown> }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (typeof body.step !== "number" || typeof body.data !== "object" || body.data === null) {
    return NextResponse.json(
      { error: "step (number) et data (object) sont requis" },
      { status: 400 }
    )
  }

  try {
    // UPSERT : si le client existe, merge le data dans onboarding_draft via || (JSONB concat).
    // Si onboarding_draft est NULL, COALESCE le transforme en {} avant le merge.
    await query(
      `UPDATE clients
       SET onboarding_draft = COALESCE(onboarding_draft, '{}'::jsonb) || $1::jsonb,
           onboarding_draft_step = $2,
           onboarding_draft_updated_at = NOW()
       WHERE email = $3`,
      [JSON.stringify(body.data), body.step, user.email]
    )

    return NextResponse.json({ step: body.step, data: body.data })
  } catch (err) {
    console.error("Error saving onboarding draft:", err)
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde du brouillon" },
      { status: 500 }
    )
  }
}

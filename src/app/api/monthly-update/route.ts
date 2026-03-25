import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"

interface BienPayload {
  titre: string
  type: string
  adresse: string
  prix: string
  surface: string
  points_forts: string
  dpe: string
}

interface MonthlyUpdatePayload {
  biens: BienPayload[]
  anecdote_mois: string
  evenements_locaux: string
  tendance_marche: string
  tendance_detail: string
  sujets_prioritaires: string[]
}

/**
 * GET /api/monthly-update?action=get-biens
 * Retourne les biens existants depuis client_context.
 */
export async function GET(request: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = user.emailAddresses[0]?.emailAddress
  if (!email) {
    return NextResponse.json({ error: "No email" }, { status: 400 })
  }

  const action = request.nextUrl.searchParams.get("action")

  if (action === "get-biens") {
    const { rows } = await query<{ client_context: Record<string, unknown> | null }>(
      "SELECT client_context FROM clients WHERE email = $1 LIMIT 1",
      [email]
    )

    if (rows.length === 0 || !rows[0].client_context) {
      return NextResponse.json({ biens: [] })
    }

    const ctx = rows[0].client_context
    const rawBiens = ctx.biens_actuels ?? ctx.biens

    if (!Array.isArray(rawBiens)) {
      return NextResponse.json({ biens: [] })
    }

    const biens = rawBiens.map((b: unknown) => {
      if (typeof b === "object" && b !== null) {
        const bien = b as Record<string, unknown>
        return {
          titre: String(bien.titre ?? ""),
          type: String(bien.type ?? ""),
          adresse: String(bien.adresse ?? ""),
          prix: String(bien.prix ?? ""),
          surface: String(bien.surface ?? ""),
          points_forts: String(bien.points_forts ?? ""),
          dpe: String(bien.dpe ?? ""),
        }
      }
      return {
        titre: String(b),
        type: "",
        adresse: "",
        prix: "",
        surface: "",
        points_forts: "",
        dpe: "",
      }
    })

    return NextResponse.json({ biens })
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 })
}

/**
 * POST /api/monthly-update
 * Merge les donnees mensuelles dans client_context JSONB.
 * Ne pas ecraser les autres champs -- merge uniquement les champs recurrents.
 */
export async function POST(request: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const email = user.emailAddresses[0]?.emailAddress
  if (!email) {
    return NextResponse.json({ error: "No email" }, { status: 400 })
  }

  let body: MonthlyUpdatePayload
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Validation basique des champs
  if (!Array.isArray(body.biens)) {
    return NextResponse.json({ error: "biens must be an array" }, { status: 400 })
  }
  if (!Array.isArray(body.sujets_prioritaires)) {
    return NextResponse.json(
      { error: "sujets_prioritaires must be an array" },
      { status: 400 }
    )
  }

  // Nettoyer les biens (garder seulement ceux avec un titre)
  const cleanBiens = body.biens
    .filter((b) => b.titre && b.titre.trim() !== "")
    .map((b) => ({
      titre: String(b.titre).trim(),
      type: String(b.type || "").trim(),
      adresse: String(b.adresse || "").trim(),
      prix: String(b.prix || "").trim(),
      surface: String(b.surface || "").trim(),
      points_forts: String(b.points_forts || "").trim(),
      dpe: String(b.dpe || "").trim(),
    }))

  // Construire le patch JSONB a merger
  const patch = {
    biens: cleanBiens,
    anecdote_mois: String(body.anecdote_mois || "").trim(),
    evenements_locaux: String(body.evenements_locaux || "").trim(),
    tendance_marche: String(body.tendance_marche || "").trim(),
    tendance_detail: String(body.tendance_detail || "").trim(),
    sujets_prioritaires: body.sujets_prioritaires.filter(
      (s) => typeof s === "string" && s.trim() !== ""
    ),
    last_monthly_update: new Date().toISOString(),
  }

  // Merge dans client_context via jsonb_concat (||) -- ne pas ecraser les champs existants
  const { rowCount } = await query(
    `UPDATE clients
     SET client_context = COALESCE(client_context, '{}'::jsonb) || $1::jsonb,
         updated_at = NOW()
     WHERE email = $2`,
    [JSON.stringify(patch), email]
  )

  if (rowCount === 0) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 })
  }

  // Track server-side
  await trackServer("monthly_update_completed", user.id, {
    nb_biens: cleanBiens.length,
    has_anecdote: body.anecdote_mois.trim() !== "",
    nb_sujets: body.sujets_prioritaires.length,
  })

  return NextResponse.json({ ok: true })
}

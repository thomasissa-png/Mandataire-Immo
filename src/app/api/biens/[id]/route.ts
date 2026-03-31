/**
 * GET /api/biens/[id] → Détail d'un bien pour le mandataire connecté
 * PATCH /api/biens/[id] → Modifier les infos d'un bien
 *
 * Rendu : SSR (données dynamiques, auth requise)
 */

import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import type { PropertyPage } from "@/types/property"
import { z } from "zod"

const patchBienSchema = z.object({
  titre: z.string().min(1, "Le titre est requis").optional(),
  type_bien: z.string().min(1).optional(),
  adresse: z.string().min(1, "L'adresse est requise").optional(),
  prix: z.number().positive("Le prix doit être positif").optional(),
  surface: z.number().nonnegative().optional(),
  pieces: z.number().int().nonnegative().optional(),
  points_forts: z.string().nullable().optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "ID du bien manquant" }, { status: 400 })
  }

  try {
    const { rows } = await query<PropertyPage>(
      `SELECT id, client_id, client_email, titre, type_bien, adresse, prix, surface, pieces,
              points_forts, description_detaillee, annonce_longue, annonce_courte,
              titre_annonce, accroche_courte, photos_originales, photos_staging,
              email_contact, telephone_contact, nom_mandataire,
              lat, lon, city, postcode,
              dvf_prix_m2_moyen, dvf_transactions,
              dpe_classe, dpe_ges_classe, dpe_valeur_energie, dpe_valeur_ges,
              status, slug, published_at, created_at, updated_at
       FROM property_pages
       WHERE id = $1 AND client_id = $2
       LIMIT 1`,
      [id, user.id]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ bien: rows[0] })
  } catch (err) {
    console.error("[GET /api/biens/[id]] Erreur:", err)
    return NextResponse.json(
      { error: "Impossible de charger ce bien" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: "ID du bien manquant" }, { status: 400 })
  }

  try {
    const body = await request.json()
    const parsed = patchBienSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Données invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const data = parsed.data
    const fields = Object.keys(data) as (keyof typeof data)[]

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "Aucun champ à modifier" },
        { status: 400 }
      )
    }

    // Vérifier que le bien appartient au user
    const { rows: existing } = await query(
      "SELECT id FROM property_pages WHERE id = $1 AND client_id = $2 LIMIT 1",
      [id, user.id]
    )

    if (existing.length === 0) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 })
    }

    // Construire le SET dynamique
    const setClauses: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    for (const field of fields) {
      setClauses.push(`${field} = $${paramIndex}`)
      values.push(data[field])
      paramIndex++
    }

    setClauses.push(`updated_at = NOW()`)
    values.push(id, user.id)

    const { rows: updated } = await query<PropertyPage>(
      `UPDATE property_pages
       SET ${setClauses.join(", ")}
       WHERE id = $${paramIndex} AND client_id = $${paramIndex + 1}
       RETURNING id, titre, type_bien, adresse, prix, surface, pieces, points_forts, updated_at`,
      values
    )

    return NextResponse.json({ bien: updated[0] })
  } catch (err) {
    console.error("[PATCH /api/biens/[id]] Erreur:", err)
    return NextResponse.json(
      { error: "Impossible de modifier ce bien" },
      { status: 500 }
    )
  }
}

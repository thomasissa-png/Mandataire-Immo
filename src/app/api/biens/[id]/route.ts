/**
 * GET /api/biens/[id] → Détail d'un bien pour le mandataire connecté
 *
 * Rendu : SSR (données dynamiques, auth requise)
 */

import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import type { PropertyPage } from "@/types/property"

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

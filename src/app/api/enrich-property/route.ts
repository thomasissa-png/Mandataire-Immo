import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { query } from "@/lib/db"
import { enrichProperty } from "@/lib/enrich-property"

interface EnrichBody {
  adresse: string
  client_id?: string
}

/**
 * POST /api/enrich-property
 * Geocode une adresse et recupere le prix median au m2 via APIs publiques.
 * Si client_id est fourni, met a jour donnees_locales.prix_m2_moyen dans le client_context.
 * Protege par Clerk (utilisateur connecte requis).
 */
export async function POST(request: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Connexion requise" }, { status: 401 })
  }

  let body: EnrichBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps de requete invalide" }, { status: 400 })
  }

  const adresse = body.adresse?.trim()
  if (!adresse) {
    return NextResponse.json({ error: "L'adresse est requise" }, { status: 400 })
  }

  const result = await enrichProperty(adresse)
  if (!result) {
    return NextResponse.json(
      { error: "Adresse introuvable. Verifiez et reessayez." },
      { status: 404 }
    )
  }

  // Mise a jour automatique du client_context si client_id fourni et prix_m2 disponible
  if (body.client_id && result.prix_m2_moyen !== null) {
    try {
      await query(
        `UPDATE clients
         SET client_context = jsonb_set(
           COALESCE(client_context, '{}'::jsonb),
           '{prix_m2_moyen}',
           $1::jsonb
         ),
         updated_at = NOW()
         WHERE id = $2`,
        [JSON.stringify(result.prix_m2_moyen), body.client_id]
      )
    } catch (err) {
      // Ne pas bloquer la reponse si la mise a jour echoue
      console.error("Failed to update client_context prix_m2_moyen:", err)
    }
  }

  return NextResponse.json(result)
}

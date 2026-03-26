import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"

interface OnboardingPayload {
  // Etape 1 — Identite
  prenom: string
  nom: string
  telephone: string
  // Etape 2 — Reseau
  reseau: string
  experience_annees: string
  nb_transactions_an: string
  // Etape 3 — Zone
  ville: string
  quartiers: string
  departement: string
  // Etape 4 — Specialite
  type_biens: string
  gamme_prix: string
  cible_clients: string
  // Etape 5 — Style
  ton_communication: string
  valeurs: string
  ce_qui_te_differencie: string
  // Etape 6 — Quartier en detail
  prix_m2_moyen: string
  commerces_reference: string
  ecoles_reference: string
  transports: string
  ambiance_quartier: string
  // Etape 7 — Histoire (facultatif)
  parcours_avant_immo: string
  pourquoi_immobilier: string
  anecdote_memorable: string
  // Etape 8 — Biens (facultatif, JSON string)
  biens: string
  // Etape 9 — Video (facultatif)
  confort_camera: string
  // Etape 10 — Comptes (facultatif)
  instagram: string
  facebook: string
  linkedin: string
  site_web: string
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
  }

  let body: OnboardingPayload

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Valider les champs obligatoires minimaux
  if (!body.prenom || !body.nom || !body.ville) {
    return NextResponse.json(
      { error: "Prenom, nom et ville sont requis" },
      { status: 400 }
    )
  }

  // Parser les biens depuis le JSON string
  let parsedBiens: Array<Record<string, unknown>> = []
  if (body.biens) {
    try {
      const biensArray = JSON.parse(body.biens)
      if (Array.isArray(biensArray)) {
        parsedBiens = biensArray
      }
    } catch {
      // Si le JSON est invalide, ignorer les biens
      parsedBiens = []
    }
  }

  // Mapper les champs du wizard vers la structure client_context JSONB
  const clientContext = {
    // Identite
    prenom: body.prenom.trim(),
    nom: body.nom.trim(),
    telephone: body.telephone?.trim() || "",
    // Reseau
    reseau: body.reseau?.trim() || "",
    experience_annees: body.experience_annees?.trim() || "",
    nb_transactions_an: body.nb_transactions_an?.trim() || "",
    // Zone
    ville: body.ville.trim(),
    quartiers: body.quartiers?.trim() || "",
    departement: body.departement?.trim() || "",
    // Specialite
    type_biens: body.type_biens?.trim() || "",
    gamme_prix: body.gamme_prix?.trim() || "",
    cible_clients: body.cible_clients?.trim() || "",
    // Style
    ton_communication: body.ton_communication?.trim() || "",
    valeurs: body.valeurs?.trim() || "",
    ce_qui_te_differencie: body.ce_qui_te_differencie?.trim() || "",
    // Quartier en detail
    prix_m2_moyen: body.prix_m2_moyen?.trim() || "",
    commerces_reference: body.commerces_reference?.trim() || "",
    ecoles_reference: body.ecoles_reference?.trim() || "",
    transports: body.transports?.trim() || "",
    ambiance_quartier: body.ambiance_quartier?.trim() || "",
    // Histoire
    parcours_avant_immo: body.parcours_avant_immo?.trim() || "",
    pourquoi_immobilier: body.pourquoi_immobilier?.trim() || "",
    anecdote_memorable: body.anecdote_memorable?.trim() || "",
    // Biens (array structure)
    biens: parsedBiens,
    // Video
    confort_camera: body.confort_camera?.trim() || "",
    // Comptes
    instagram: body.instagram?.trim() || "",
    facebook: body.facebook?.trim() || "",
    linkedin: body.linkedin?.trim() || "",
    site_web: body.site_web?.trim() || "",
  }

  try {
    // UPSERT : si le client existe (par email), update client_context.
    // Sinon, creer une nouvelle ligne.
    await query(
      `INSERT INTO clients (email, first_name, last_name, client_context, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (email) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         client_context = EXCLUDED.client_context`,
      [
        user.email,
        clientContext.prenom,
        clientContext.nom,
        JSON.stringify(clientContext),
      ]
    )
  } catch (err) {
    console.error("Error saving onboarding data:", err)
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    )
  }

  // Track onboarding_complete server-side
  await trackServer("onboarding_complete", user.id, {
    ville: clientContext.ville,
    reseau: clientContext.reseau,
  })

  return NextResponse.json({ success: true })
}

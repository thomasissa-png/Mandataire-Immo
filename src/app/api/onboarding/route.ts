import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"

interface OnboardingPayload {
  prenom: string
  nom: string
  telephone: string
  reseau: string
  experience_annees: string
  nb_transactions_an: string
  ville: string
  quartiers: string
  departement: string
  type_biens: string
  gamme_prix: string
  cible_clients: string
  ton_communication: string
  valeurs: string
  ce_qui_te_differencie: string
  biens_actuels: string
  instagram: string
  facebook: string
  linkedin: string
  site_web: string
}

export async function POST(request: NextRequest) {
  const { userId } = await auth()

  if (!userId) {
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

  // Mapper les champs du wizard vers la structure client_context JSONB
  const clientContext = {
    prenom: body.prenom.trim(),
    nom: body.nom.trim(),
    telephone: body.telephone?.trim() || "",
    reseau: body.reseau?.trim() || "",
    experience_annees: body.experience_annees?.trim() || "",
    nb_transactions_an: body.nb_transactions_an?.trim() || "",
    ville: body.ville.trim(),
    quartiers: body.quartiers?.trim() || "",
    departement: body.departement?.trim() || "",
    type_biens: body.type_biens?.trim() || "",
    gamme_prix: body.gamme_prix?.trim() || "",
    cible_clients: body.cible_clients?.trim() || "",
    ton_communication: body.ton_communication?.trim() || "",
    valeurs: body.valeurs?.trim() || "",
    ce_qui_te_differencie: body.ce_qui_te_differencie?.trim() || "",
    biens_actuels: body.biens_actuels?.trim() || "",
    instagram: body.instagram?.trim() || "",
    facebook: body.facebook?.trim() || "",
    linkedin: body.linkedin?.trim() || "",
    site_web: body.site_web?.trim() || "",
  }

  try {
    // UPSERT : si le client existe (par clerk_user_id), update client_context.
    // Sinon, creer une nouvelle ligne.
    await query(
      `INSERT INTO clients (clerk_user_id, first_name, last_name, client_context, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       ON CONFLICT (clerk_user_id) DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         client_context = EXCLUDED.client_context`,
      [
        userId,
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
  await trackServer("onboarding_complete", userId, {
    ville: clientContext.ville,
    reseau: clientContext.reseau,
  })

  return NextResponse.json({ success: true })
}

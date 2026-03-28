/**
 * API Profile — GET et PATCH
 * SSR : le GET direct via query() est utilisé par la page server-side.
 * Cette route sert le PATCH pour les mises à jour partielles depuis ProfileForm.
 */
import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

// ---------- Validation PATCH ----------

/** Champs autorisés pour la mise à jour du profil */
const ALLOWED_FIELDS = new Set([
  "prenom", "nom", "telephone", "ville", "quartiers", "departement",
  "reseau", "specialites", "type_biens", "gamme_prix", "cible_clients",
  "ton_communication", "ce_qui_te_differencie", "valeurs",
  "linkedin_url", "instagram", "facebook", "site_web",
  "bio_personnelle", "photo_profil_key", "confort_camera",
  "experience_annees", "nb_transactions_an",
])

/** Champs obligatoires — si envoyés, ne peuvent pas être vides */
const REQUIRED_IF_PRESENT: Record<string, string> = {
  prenom: "Le prénom est requis",
  nom: "Le nom est requis",
  ville: "La ville est requise",
}

function validatePatch(body: unknown): { data: Record<string, string>; error: string | null } {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return { data: {}, error: "Données invalides" }
  }

  const raw = body as Record<string, unknown>
  const data: Record<string, string> = {}

  for (const [key, value] of Object.entries(raw)) {
    if (!ALLOWED_FIELDS.has(key)) continue
    if (typeof value !== "string") continue
    data[key] = value
  }

  // Vérifier les champs obligatoires si envoyés
  for (const [field, message] of Object.entries(REQUIRED_IF_PRESENT)) {
    if (field in data && !data[field].trim()) {
      return { data: {}, error: message }
    }
  }

  if (Object.keys(data).length === 0) {
    return { data: {}, error: "Aucun champ à mettre à jour" }
  }

  return { data, error: null }
}

// ---------- Types ----------

interface ClientRow {
  email: string
  first_name: string | null
  last_name: string | null
  client_context: Record<string, unknown> | null
}

// ---------- GET ----------

export async function GET() {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  try {
    const { rows } = await query<ClientRow>(
      "SELECT email, first_name, last_name, client_context FROM clients WHERE email = $1",
      [user.email]
    )

    if (rows.length === 0) {
      return NextResponse.json({ profile: null })
    }

    const client = rows[0]
    const ctx = (client.client_context ?? {}) as Record<string, unknown>

    return NextResponse.json({
      profile: {
        prenom: ctx.prenom ?? client.first_name ?? "",
        nom: ctx.nom ?? client.last_name ?? "",
        telephone: ctx.telephone ?? "",
        ville: ctx.ville ?? "",
        quartiers: ctx.quartiers ?? "",
        departement: ctx.departement ?? "",
        reseau: ctx.reseau ?? "",
        type_biens: ctx.type_biens ?? "",
        gamme_prix: ctx.gamme_prix ?? "",
        cible_clients: ctx.cible_clients ?? "",
        specialites: ctx.specialites ?? "",
        ton_communication: ctx.ton_communication ?? "",
        ce_qui_te_differencie: ctx.ce_qui_te_differencie ?? "",
        valeurs: ctx.valeurs ?? "",
        linkedin_url: ctx.linkedin_url ?? "",
        instagram: ctx.instagram ?? "",
        facebook: ctx.facebook ?? "",
        site_web: ctx.site_web ?? "",
        bio_personnelle: ctx.bio_personnelle ?? "",
        photo_profil_key: ctx.photo_profil_key ?? "",
        confort_camera: ctx.confort_camera ?? "",
        experience_annees: ctx.experience_annees ?? "",
        nb_transactions_an: ctx.nb_transactions_an ?? "",
      },
    })
  } catch (err) {
    console.error("GET /api/profile error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du profil" },
      { status: 500 }
    )
  }
}

// ---------- PATCH ----------

export async function PATCH(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  const { data: updates, error: validationError } = validatePatch(body)
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  try {
    // Récupérer le client_context actuel
    const { rows } = await query<ClientRow>(
      "SELECT client_context FROM clients WHERE email = $1",
      [user.email]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Profil introuvable" },
        { status: 404 }
      )
    }

    const currentCtx = (rows[0].client_context ?? {}) as Record<string, unknown>

    // Merger les champs envoyés dans le context existant
    const updatedCtx = { ...currentCtx }
    for (const [key, value] of Object.entries(updates)) {
      updatedCtx[key] = value.trim()
    }

    // Mettre à jour aussi first_name / last_name si envoyés
    const firstName = updates.prenom
      ? updates.prenom.trim()
      : (currentCtx.prenom as string) ?? ""
    const lastName = updates.nom
      ? updates.nom.trim()
      : (currentCtx.nom as string) ?? ""

    await query(
      `UPDATE clients
       SET client_context = $1,
           first_name = $2,
           last_name = $3
       WHERE email = $4`,
      [JSON.stringify(updatedCtx), firstName, lastName, user.email]
    )

    // Retourner le profil complet après update
    const ctx = updatedCtx
    return NextResponse.json({
      success: true,
      profile: {
        prenom: ctx.prenom ?? "",
        nom: ctx.nom ?? "",
        telephone: ctx.telephone ?? "",
        ville: ctx.ville ?? "",
        quartiers: ctx.quartiers ?? "",
        departement: ctx.departement ?? "",
        reseau: ctx.reseau ?? "",
        type_biens: ctx.type_biens ?? "",
        gamme_prix: ctx.gamme_prix ?? "",
        cible_clients: ctx.cible_clients ?? "",
        specialites: ctx.specialites ?? "",
        ton_communication: ctx.ton_communication ?? "",
        ce_qui_te_differencie: ctx.ce_qui_te_differencie ?? "",
        valeurs: ctx.valeurs ?? "",
        linkedin_url: ctx.linkedin_url ?? "",
        instagram: ctx.instagram ?? "",
        facebook: ctx.facebook ?? "",
        site_web: ctx.site_web ?? "",
        bio_personnelle: ctx.bio_personnelle ?? "",
        photo_profil_key: ctx.photo_profil_key ?? "",
        confort_camera: ctx.confort_camera ?? "",
        experience_annees: ctx.experience_annees ?? "",
        nb_transactions_an: ctx.nb_transactions_an ?? "",
      },
    })
  } catch (err) {
    console.error("PATCH /api/profile error:", err)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    )
  }
}

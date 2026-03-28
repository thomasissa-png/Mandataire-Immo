/**
 * API Profile — GET et PATCH
 * SSR : le GET direct via query() est utilisé par la page server-side.
 * Cette route sert le PATCH pour les mises à jour partielles depuis ProfileForm.
 */
import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { z } from "zod"

// ---------- Schéma de validation PATCH ----------

const profilePatchSchema = z.object({
  prenom: z.string().min(1, "Le prénom est requis").optional(),
  nom: z.string().min(1, "Le nom est requis").optional(),
  telephone: z.string().optional(),
  ville: z.string().min(1, "La ville est requise").optional(),
  quartiers: z.string().optional(),
  reseau: z.string().optional(),
  specialites: z.string().optional(),
  type_biens: z.string().optional(),
  gamme_prix: z.string().optional(),
  cible_clients: z.string().optional(),
  ton_communication: z.string().optional(),
  ce_qui_te_differencie: z.string().optional(),
  valeurs: z.string().optional(),
  linkedin_url: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  site_web: z.string().optional(),
  bio_personnelle: z.string().optional(),
  photo_profil_key: z.string().optional(),
  confort_camera: z.string().optional(),
  experience_annees: z.string().optional(),
  nb_transactions_an: z.string().optional(),
  departement: z.string().optional(),
})

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

  const parsed = profilePatchSchema.safeParse(body)
  if (!parsed.success) {
    const firstError = parsed.error.errors[0]
    return NextResponse.json(
      { error: firstError?.message ?? "Données invalides" },
      { status: 400 }
    )
  }

  const updates = parsed.data

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
      if (value !== undefined) {
        updatedCtx[key] = (value as string).trim()
      }
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

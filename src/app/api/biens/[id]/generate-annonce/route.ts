/**
 * POST /api/biens/[id]/generate-annonce
 * Génère l'annonce complète pour un bien (version longue storytelling + courte portails).
 * Self-service : authentification Sophie, pas admin-only.
 *
 * Comportement :
 * 1. Vérifie ownership + au moins 1 photo
 * 2. Récupère le client_context de Sophie
 * 3. Appelle buildAnnonceStorytellingPrompt() pour la version longue (600-900 mots)
 * 4. Appelle buildAnnonceEnrichiePrompt() pour la version courte (≤1500 car.)
 * 5. Sauvegarde annonce_longue, annonce_courte, titre_annonce, accroche_courte, annonce_generated_at
 * 6. Passe le bien en status='published', published_at=NOW()
 * 7. Retourne { annonce_longue, annonce_courte, titre_annonce, accroche_courte, page_url }
 *
 * Rendu : SSR (mutation authentifiée, appel LLM)
 */

import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { getClientContext } from "@/lib/client-context"
import { buildAnnonceStorytellingPrompt } from "@/lib/prompts/annonce-storytelling"
import { buildAnnonceEnrichiePrompt } from "@/lib/prompts/annonce-enrichie"
import { generateJSON } from "@/lib/claude"
import type { PropertyPage, PropertyPhoto } from "@/types/property"

// Timeout de 30 secondes par appel LLM
const LLM_TIMEOUT_MS = 30_000

interface StorytellingResponse {
  annonces: Array<{
    bien_titre: string
    annonce_complete: string
    accroche_courte: string
    titre_annonce: string
    mots_cles_seo: string[]
  }>
}

interface EnrichieResponse {
  version_longue: {
    titre: string
    texte: string
    mentions_legales: string
  }
  version_courte: {
    titre: string
    texte: string
    caracteres: number
  }
  mots_cles_seo: string[]
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: propertyId } = await params

  // Auth
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  // Récupérer le bien avec vérification ownership
  const { rows: propertyRows } = await query<PropertyPage>(
    `SELECT id, client_id, client_email, titre, type_bien, adresse, prix, surface, pieces,
            points_forts, description_detaillee, photos_originales,
            lat, lon, city, postcode,
            dvf_prix_m2_moyen, dvf_transactions,
            dpe_classe, dpe_ges_classe, dpe_valeur_energie, dpe_valeur_ges,
            email_contact, telephone_contact, nom_mandataire,
            slug, status
     FROM property_pages
     WHERE id = $1 LIMIT 1`,
    [propertyId]
  )

  if (propertyRows.length === 0) {
    return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 })
  }

  const bien = propertyRows[0]

  if (bien.client_id !== user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  // Vérifier qu'au moins 1 photo est uploadée
  const photos: PropertyPhoto[] = bien.photos_originales || []
  if (photos.length === 0) {
    return NextResponse.json(
      { error: "Ajoute au moins une photo avant de générer l'annonce." },
      { status: 400 }
    )
  }

  // Récupérer le contexte client de Sophie
  let clientContext
  try {
    clientContext = await getClientContext(bien.client_id)
  } catch (err) {
    console.error(`[generate-annonce] Erreur getClientContext:`, err)
    return NextResponse.json(
      { error: "Profil mandataire incomplet. Termine ton onboarding avant de générer une annonce." },
      { status: 400 }
    )
  }

  // Préparer les données locales DVF
  const donneesLocales = bien.dvf_prix_m2_moyen
    ? {
        prix_m2_moyen: bien.dvf_prix_m2_moyen,
        lat: bien.lat,
        lon: bien.lon,
        postcode: bien.postcode || "",
        dernieres_transactions: Array.isArray(bien.dvf_transactions)
          ? bien.dvf_transactions
          : [],
      }
    : undefined

  // URL de la page publique
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://immocrew.fr"
  const pageUrl = bien.slug ? `${baseUrl}/bien/${bien.slug}` : null

  // ─── Appel 1 : Annonce storytelling (version longue 600-900 mots) ───

  const storytellingPrompt = buildAnnonceStorytellingPrompt({
    prenom: clientContext.prenom,
    nom: clientContext.nom,
    reseau: clientContext.reseau,
    specialite: clientContext.specialite,
    zone_geo: clientContext.zone_geo,
    ton: clientContext.ton,
    valeurs: clientContext.valeurs,
    ce_qui_differencie: clientContext.ce_qui_differencie,
    biens: [],
    cible_clients: clientContext.cible_clients,
    gamme_prix: clientContext.gamme_prix,
    donnees_locales: donneesLocales,
    bien_unique: {
      titre: bien.titre,
      type: bien.type_bien,
      adresse: bien.adresse,
      prix: bien.prix,
      surface: bien.surface,
      pieces: bien.pieces,
      points_forts: bien.points_forts || "",
      description_detaillee: bien.description_detaillee || undefined,
      dpe: bien.dpe_classe || undefined,
    },
    nombre_annonces: 1,
    telephone_contact: clientContext.telephone || bien.telephone_contact || undefined,
    email_contact: bien.client_email || undefined,
  })

  // ─── Appel 2 : Annonce enrichie (version courte portails ≤1500 car.) ───

  const enrichiePrompt = buildAnnonceEnrichiePrompt({
    prenom: clientContext.prenom,
    nom: clientContext.nom,
    reseau: clientContext.reseau,
    specialite: clientContext.specialite,
    zone_geo: clientContext.zone_geo,
    ton: clientContext.ton,
    valeurs: clientContext.valeurs,
    ce_qui_differencie: clientContext.ce_qui_differencie,
    cible_clients: clientContext.cible_clients,
    telephone_contact: clientContext.telephone || bien.telephone_contact || undefined,
    email_contact: bien.client_email || undefined,
    bien: {
      titre: bien.titre,
      type: bien.type_bien,
      adresse: bien.adresse,
      prix: bien.prix,
      surface: bien.surface,
      pieces: bien.pieces,
      points_forts: bien.points_forts || "",
      description_detaillee: bien.description_detaillee || undefined,
    },
    dvf: {
      prix_median_m2: bien.dvf_prix_m2_moyen || 0,
      periode: "2024-2025",
      nb_transactions: Array.isArray(bien.dvf_transactions)
        ? bien.dvf_transactions.length
        : 0,
      source: "DVF open data — base DGFiP",
    },
    dpe: {
      classe_dpe: (bien.dpe_classe as "A" | "B" | "C" | "D" | "E" | "F" | "G") || "D",
      classe_ges: (bien.dpe_ges_classe as "A" | "B" | "C" | "D" | "E" | "F" | "G") || "D",
      consommation_kwh: bien.dpe_valeur_energie || undefined,
      emissions_co2: bien.dpe_valeur_ges || undefined,
      source: "ADEME — base DPE",
    },
    coordonnees: {
      latitude: bien.lat || 0,
      longitude: bien.lon || 0,
      adresse_ban: bien.adresse,
      code_insee: "",
      code_postal: bien.postcode || "",
    },
    donnees_locales: donneesLocales,
  })

  // Appeler les deux prompts en parallèle avec timeout
  let storytellingResult: StorytellingResponse
  let enrichieResult: EnrichieResponse

  try {
    const [storytellingRes, enrichieRes] = await Promise.all([
      Promise.race([
        generateJSON<StorytellingResponse>({
          system: storytellingPrompt.system,
          user: storytellingPrompt.user,
          maxTokens: 4096,
          temperature: 0.7,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout génération storytelling")), LLM_TIMEOUT_MS)
        ),
      ]),
      Promise.race([
        generateJSON<EnrichieResponse>({
          system: enrichiePrompt.system,
          user: enrichiePrompt.user,
          maxTokens: 4096,
          temperature: 0.7,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout génération enrichie")), LLM_TIMEOUT_MS)
        ),
      ]),
    ])

    storytellingResult = storytellingRes.data
    enrichieResult = enrichieRes.data
  } catch (err) {
    console.error(`[generate-annonce] Erreur LLM:`, err)
    const message =
      err instanceof Error && err.message.includes("Timeout")
        ? "La génération a pris trop longtemps — réessaie dans quelques instants."
        : "Erreur lors de la génération de l'annonce. Réessaie."
    return NextResponse.json({ error: message }, { status: 504 })
  }

  // Extraire les données des réponses
  const annonce = storytellingResult.annonces?.[0]
  if (!annonce) {
    return NextResponse.json(
      { error: "La génération n'a pas produit d'annonce. Réessaie." },
      { status: 500 }
    )
  }

  const annonceLongue = annonce.annonce_complete
  const annonceCourte = enrichieResult.version_courte.texte
  const titreAnnonce = annonce.titre_annonce || enrichieResult.version_longue.titre
  const accrocheCourte = annonce.accroche_courte

  // Injecter le lien vers la page publique dans les annonces si slug disponible
  const ctaLien = pageUrl
    ? `\n\nVoir la fiche complète avec photos : ${pageUrl}`
    : ""
  const annonceLongueAvecLien = annonceLongue + ctaLien
  const annonceCourteAvecLien = annonceCourte + ctaLien

  // Sauvegarder et passer en published
  await query(
    `UPDATE property_pages SET
      annonce_longue = $1,
      annonce_courte = $2,
      titre_annonce = $3,
      accroche_courte = $4,
      annonce_generated_at = NOW(),
      status = 'published',
      published_at = COALESCE(published_at, NOW()),
      updated_at = NOW()
    WHERE id = $5`,
    [annonceLongueAvecLien, annonceCourteAvecLien, titreAnnonce, accrocheCourte, propertyId]
  )

  return NextResponse.json({
    annonce_longue: annonceLongueAvecLien,
    annonce_courte: annonceCourteAvecLien,
    titre_annonce: titreAnnonce,
    accroche_courte: accrocheCourte,
    page_url: pageUrl,
  })
}

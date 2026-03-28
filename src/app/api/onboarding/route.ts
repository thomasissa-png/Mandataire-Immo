import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"
import { enrichProperty } from "@/lib/enrich-property"

// ─── Slug helper (mirrored from /api/biens/route.ts) ─────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80)
}

async function generateUniqueSlug(adresse: string): Promise<string> {
  const base = slugify(adresse)
  if (!base) return `bien-${Date.now()}`

  const { rows } = await query<{ slug: string }>(
    "SELECT slug FROM property_pages WHERE slug LIKE $1",
    [`${base}%`]
  )

  if (rows.length === 0) return base

  const existingSlugs = new Set(rows.map((r) => r.slug))
  if (!existingSlugs.has(base)) return base

  let counter = 2
  while (existingSlugs.has(`${base}-${counter}`)) {
    counter++
  }
  return `${base}-${counter}`
}

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
  // Etape 6 — Profil (facultatif)
  linkedin_url: string
  bio_personnelle: string
  // Photo (cle Object Storage)
  photo_profil_key: string
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

  // Enrichissement automatique du quartier via APIs publiques
  const villeStr = body.ville.trim()
  const quartiersStr = body.quartiers?.trim() || ""
  const adresseRecherche = quartiersStr
    ? `${quartiersStr}, ${villeStr}`
    : villeStr
  const enrichment = await enrichProperty(adresseRecherche)

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
    ville: villeStr,
    quartiers: quartiersStr,
    departement: body.departement?.trim() || "",
    // Specialite
    type_biens: body.type_biens?.trim() || "",
    gamme_prix: body.gamme_prix?.trim() || "",
    cible_clients: body.cible_clients?.trim() || "",
    // Style
    ton_communication: body.ton_communication?.trim() || "",
    valeurs: body.valeurs?.trim() || "",
    ce_qui_te_differencie: body.ce_qui_te_differencie?.trim() || "",
    // Quartier (enrichi automatiquement)
    prix_m2_moyen: enrichment?.prix_m2_moyen ? String(enrichment.prix_m2_moyen) : "",
    donnees_locales: {
      lat: enrichment?.lat ?? null,
      lon: enrichment?.lon ?? null,
      postcode: enrichment?.postcode ?? "",
      dernieres_transactions: enrichment?.dernieres_transactions ?? [],
    },
    // Profil
    linkedin_url: body.linkedin_url?.trim() || "",
    bio_personnelle: body.bio_personnelle?.trim() || "",
    // Photo
    photo_profil_key: body.photo_profil_key?.trim() || "",
    // Biens (array structure)
    biens: parsedBiens,
    // Video
    confort_camera: body.confort_camera?.trim() || "",
    // Comptes (linkedin_url sert aussi de champ linkedin reseau social)
    instagram: body.instagram?.trim() || "",
    facebook: body.facebook?.trim() || "",
    linkedin: body.linkedin_url?.trim() || "",
    site_web: body.site_web?.trim() || "",
  }

  try {
    // UPSERT : si le client existe (par email), update client_context.
    // Sinon, creer une nouvelle ligne.
    // Nettoie aussi le brouillon d'onboarding (plus nécessaire une fois terminé).
    await query(
      `INSERT INTO clients (email, first_name, last_name, client_context, onboarding_draft, onboarding_draft_step, onboarding_draft_updated_at, created_at)
       VALUES ($1, $2, $3, $4, NULL, 0, NULL, NOW())
       ON CONFLICT (email) WHERE email IS NOT NULL DO UPDATE SET
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name,
         client_context = EXCLUDED.client_context,
         onboarding_draft = NULL,
         onboarding_draft_step = 0,
         onboarding_draft_updated_at = NULL`,
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

  // ─── Créer les property_pages pour chaque bien saisi ───────────

  if (parsedBiens.length > 0) {
    // Récupérer le client_id fraîchement inséré/mis à jour
    const { rows: clientRows } = await query<{ id: string }>(
      "SELECT id FROM clients WHERE email = $1",
      [user.email]
    )
    const clientId = clientRows[0]?.id

    if (clientId) {
      for (const bien of parsedBiens) {
        const adresse = typeof bien.adresse === "string" ? bien.adresse.trim() : ""
        if (!adresse) continue

        // Ne pas créer de doublon si un bien avec le même client_id + adresse existe déjà
        const { rows: existing } = await query<{ id: string }>(
          "SELECT id FROM property_pages WHERE client_id = $1 AND adresse = $2 LIMIT 1",
          [clientId, adresse]
        )
        if (existing.length > 0) continue

        const titre = typeof bien.titre === "string" && bien.titre.trim()
          ? bien.titre.trim()
          : adresse
        const typeBien = typeof bien.type === "string" ? bien.type.trim() : ""
        const prix = typeof bien.prix === "string" ? parseFloat(bien.prix) || 0 : (typeof bien.prix === "number" ? bien.prix : 0)
        const surface = typeof bien.surface === "string" ? parseFloat(bien.surface) || 0 : (typeof bien.surface === "number" ? bien.surface : 0)
        const pieces = typeof bien.pieces === "string" ? parseInt(bien.pieces, 10) || 0 : (typeof bien.pieces === "number" ? bien.pieces : 0)
        const pointsForts = typeof bien.points_forts === "string" ? bien.points_forts.trim() : ""

        const slug = await generateUniqueSlug(adresse)

        try {
          await query(
            `INSERT INTO property_pages (
              client_id, client_email, titre, type_bien, adresse, prix, surface, pieces,
              points_forts, slug, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'draft')`,
            [
              clientId,
              user.email,
              titre,
              typeBien,
              adresse,
              prix,
              surface,
              pieces,
              pointsForts,
              slug,
            ]
          )
        } catch (bienErr) {
          // Log mais ne pas bloquer l'onboarding pour un bien en erreur
          console.error(`[Onboarding] Erreur création property_page pour "${adresse}":`, bienErr)
        }
      }
    }
  }

  // Track onboarding_complete server-side
  await trackServer("onboarding_complete", user.id, {
    ville: clientContext.ville,
    reseau: clientContext.reseau,
  })

  return NextResponse.json({ success: true })
}

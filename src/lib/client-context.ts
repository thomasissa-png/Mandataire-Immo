import { query } from "@/lib/db"

export interface ClientContext {
  prenom: string
  nom: string
  reseau: string
  annees_experience: number
  specialite: string
  zone_geo: { ville: string; departement: string; quartiers: string[] }
  ton: string
  valeurs: string
  ce_qui_differencie: string
  biens: Array<{
    titre: string
    type: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string
  }>
  reseaux_sociaux: {
    instagram?: string
    facebook?: string
    linkedin?: string
    site_web?: string
  }
  nb_transactions_an: number
  gamme_prix: string
  cible_clients: string
}

interface ClientRow {
  id: string
  email: string
  client_context: Record<string, unknown> | null
}

/**
 * Recupere et type le contexte client depuis la colonne JSONB `client_context`.
 * Throws si le client n'existe pas ou si le contexte est vide.
 */
export async function getClientContext(clientId: string): Promise<ClientContext> {
  const { rows } = await query<ClientRow>(
    "SELECT id, email, client_context FROM clients WHERE id = $1 LIMIT 1",
    [clientId]
  )

  if (rows.length === 0) {
    throw new Error(`Client not found: ${clientId}`)
  }

  const raw = rows[0].client_context
  if (!raw) {
    throw new Error(
      `Client context is empty for client ${clientId}. The client must complete onboarding first.`
    )
  }

  return parseClientContext(raw)
}

/**
 * Parse le JSONB brut en ClientContext type.
 * Fournit des valeurs par defaut pour les champs optionnels.
 */
function parseClientContext(raw: Record<string, unknown>): ClientContext {
  const getString = (key: string, fallback = ""): string =>
    typeof raw[key] === "string" ? (raw[key] as string) : fallback

  const getNumber = (key: string, fallback = 0): number => {
    const val = raw[key]
    if (typeof val === "number") return val
    if (typeof val === "string") {
      const parsed = parseInt(val, 10)
      return isNaN(parsed) ? fallback : parsed
    }
    return fallback
  }

  // Parse quartiers : peut etre un array ou une string separee par des virgules
  const rawQuartiers = raw.quartiers
  let quartiers: string[] = []
  if (Array.isArray(rawQuartiers)) {
    quartiers = rawQuartiers.filter((q): q is string => typeof q === "string")
  } else if (typeof rawQuartiers === "string" && rawQuartiers.trim()) {
    quartiers = rawQuartiers.split(",").map((q) => q.trim()).filter(Boolean)
  }

  // Parse biens : peut etre un array d'objets ou une string (depuis le textarea onboarding)
  const rawBiens = raw.biens_actuels ?? raw.biens
  let biens: ClientContext["biens"] = []
  if (Array.isArray(rawBiens)) {
    biens = rawBiens.map((b) => {
      if (typeof b === "object" && b !== null) {
        const bien = b as Record<string, unknown>
        return {
          titre: String(bien.titre ?? ""),
          type: String(bien.type ?? ""),
          adresse: String(bien.adresse ?? ""),
          prix: Number(bien.prix ?? 0),
          surface: Number(bien.surface ?? 0),
          pieces: Number(bien.pieces ?? 0),
          points_forts: String(bien.points_forts ?? ""),
        }
      }
      return {
        titre: String(b),
        type: "",
        adresse: "",
        prix: 0,
        surface: 0,
        pieces: 0,
        points_forts: "",
      }
    })
  } else if (typeof rawBiens === "string" && rawBiens.trim()) {
    // Textarea libre : un bien par ligne
    biens = rawBiens
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => ({
        titre: line.trim(),
        type: "",
        adresse: "",
        prix: 0,
        surface: 0,
        pieces: 0,
        points_forts: "",
      }))
  }

  // Parse reseaux sociaux
  const rawReseaux =
    typeof raw.reseaux_sociaux === "object" && raw.reseaux_sociaux !== null
      ? (raw.reseaux_sociaux as Record<string, unknown>)
      : raw

  return {
    prenom: getString("prenom"),
    nom: getString("nom"),
    reseau: getString("reseau"),
    annees_experience: getNumber("experience_annees", getNumber("annees_experience")),
    specialite: getString("type_biens", getString("specialite")),
    zone_geo: {
      ville: getString("ville"),
      departement: getString("departement"),
      quartiers,
    },
    ton: getString("ton_communication", getString("ton")),
    valeurs: getString("valeurs"),
    ce_qui_differencie: getString("ce_qui_te_differencie", getString("ce_qui_differencie")),
    biens,
    reseaux_sociaux: {
      instagram:
        typeof rawReseaux.instagram === "string" ? rawReseaux.instagram : undefined,
      facebook:
        typeof rawReseaux.facebook === "string" ? rawReseaux.facebook : undefined,
      linkedin:
        typeof rawReseaux.linkedin === "string" ? rawReseaux.linkedin : undefined,
      site_web:
        typeof rawReseaux.site_web === "string" ? rawReseaux.site_web : undefined,
    },
    nb_transactions_an: getNumber(
      "nb_transactions_an",
      getNumber("nb_transactions_an")
    ),
    gamme_prix: getString("gamme_prix"),
    cible_clients: getString("cible_clients"),
  }
}

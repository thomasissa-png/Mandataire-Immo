/**
 * Types partages pour les pages bien (/bien/[id]).
 * Utilises par : API home-staging, page bien, enrichissement.
 */

// ─── Photo types ────────────────────────────────────────────────────

export interface PropertyPhoto {
  key: string          // cle Replit Object Storage
  url: string          // URL publique ou chemin API
  piece: string        // "salon", "chambre", "cuisine", etc.
  ordre: number
}

export interface StagingPhoto extends PropertyPhoto {
  style: string                // "moderne", "scandinave", "classique", etc.
  photo_originale_key: string  // reference a la photo source
}

// ─── DPE ────────────────────────────────────────────────────────────

export interface DPEData {
  classe: string | null           // A-G
  ges_classe: string | null       // A-G
  valeur_energie: number | null   // kWh/m2/an
  valeur_ges: number | null       // kgCO2/m2/an
}

// ─── Property Page (DB row) ─────────────────────────────────────────

export interface PropertyPage {
  id: string
  client_id: string
  client_email: string

  // Bien
  titre: string
  type_bien: string
  transaction_type: "vente" | "location"
  adresse: string
  prix: number
  surface: number
  pieces: number
  points_forts: string | null
  description_detaillee: string | null

  // Geo
  lat: number | null
  lon: number | null
  city: string | null
  postcode: string | null

  // DVF / DPE
  dvf_prix_m2_moyen: number | null
  dvf_transactions: DVFTransactionRow[]
  dpe_classe: string | null
  dpe_ges_classe: string | null
  dpe_valeur_energie: number | null
  dpe_valeur_ges: number | null

  // Annonces
  annonce_longue: string | null
  annonce_courte: string | null
  titre_annonce: string | null
  accroche_courte: string | null

  // Visuels
  photos_originales: PropertyPhoto[]
  photos_staging: StagingPhoto[]

  // Contact
  email_contact: string | null
  telephone_contact: string | null
  nom_mandataire: string | null

  // Status
  status: "draft" | "published" | "archived"
  slug: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface DVFTransactionRow {
  date: string
  prix: number
  surface: number
  prix_m2: number
  type: string
}

// ─── Home Staging API ───────────────────────────────────────────────

export interface HomeStagingRequest {
  property_page_id: string
  photo_key: string           // cle de la photo originale dans Object Storage
  piece: string               // type de piece
  style: string               // style de mobilier
}

export interface HomeStagingResult {
  original_key: string
  staging_key: string
  piece: string
  style: string
}

// ─── Enrichissement etendu ──────────────────────────────────────────

export interface EnrichedPropertyExtended {
  lat: number
  lon: number
  city: string
  postcode: string
  prix_m2_moyen: number | null
  dernieres_transactions: DVFTransactionRow[]
  dpe: DPEData | null
}

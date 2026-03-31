/**
 * Types pour les landing pages mandataires (/agent/[slug]).
 */

export interface AgentPage {
  id: string
  client_id: string
  slug: string
  status: "active" | "inactive" | "frozen"
  indexation: boolean
  bio_generee: string | null
  edition_locked: boolean
  activated_at: string | null
}

export interface AgentProfile {
  prenom: string
  nom: string
  telephone: string
  photo_profil_key: string
  reseau: string
  ville: string
  quartiers: string
  departement: string
  specialites: string
  type_biens: string
  gamme_prix: string
  bio_personnelle: string
  bio_generee: string | null
  ce_qui_te_differencie: string
  valeurs: string
  experience_annees: string
  nb_transactions_an: string
  linkedin_url: string
  instagram: string
  facebook: string
  site_web: string
  temoignages: AgentTemoignage[]
  methode_etapes: string[]
}

export interface AgentTemoignage {
  nom: string
  texte: string
  contexte: string
}

export interface AgentBienSummary {
  id: string
  slug: string | null
  titre: string
  titre_annonce: string | null
  city: string | null
  prix: number
  type_bien: string
  surface: number
  pieces: number
  photos_staging: { url: string }[]
  photos_originales: { url: string }[]
}

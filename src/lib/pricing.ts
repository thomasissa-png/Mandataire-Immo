/**
 * Source unique de vérité pour tous les prix ImmoCrew.
 *
 * Chaque composant, page et route API doit importer depuis ce fichier.
 * Ne JAMAIS hardcoder un prix ailleurs dans src/.
 *
 * Restructuration pricing validée le 2026-04-02 :
 * - Pack Lancement SUPPRIMÉ (remplacé par setup mois 1 inclus)
 * - 3 formules d'abonnement : Mensuel, Trimestriel (featured), Annuel
 * - Boost Mandat inchangé (100€/bien, réservé abonnés)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PackId = "mensuel" | "trimestriel" | "annuel" | "boost"

export interface Pack {
  id: PackId
  name: string
  /** Prix affiché (en euros TTC) — prix par mois pour les abonnements */
  price: number
  /** Montant en centimes pour Stripe (par période de facturation) */
  stripeCents: number
  /** Suffixe affiché après le prix (ex: "/mois", "/bien") */
  unit: string
  /** Sous-titre marketing court */
  subtitle: string
  /** Mention de réassurance (garantie, engagement…) */
  mention: string
  /** Libellé du CTA principal */
  cta: string
  /** Href du CTA (checkout) */
  ctaHref: string
  /** Type de paiement pour le checkout */
  paymentType: "one_time" | "recurring"
  /** Carte mise en avant visuellement */
  featured: boolean
  /** Badge optionnel (ex: "Recommandé") */
  badge?: string
  /** Liste des features incluses */
  features: readonly string[]
  /** Engagement en mois */
  engagementMonths?: number
  /** Prix total pour la période d'engagement (en euros TTC) */
  totalPrice?: number
  /** Montant total en centimes pour Stripe */
  totalStripeCents?: number
  /** Pourcentage d'économie par rapport au mensuel */
  savings?: string
  /** Équivalent mensuel (pour trimestriel/annuel) */
  pricePerMonth?: number
  /** Accroche complémentaire (ex: "4 mois offerts") */
  highlight?: string
}

// ---------------------------------------------------------------------------
// Features communes à toutes les formules d'abonnement
// ---------------------------------------------------------------------------

const ABONNEMENT_FEATURES = [
  "Setup mois 1 inclus : positionnement, bio, charte visuelle",
  "12 posts personnalisés pour tes réseaux",
  "4 scripts vidéo pour tes Reels",
  "4 articles SEO local",
  "1 newsletter pour tes contacts",
  "4 annonces qui donnent envie de visiter",
  "1 email de prospection vendeurs",
  "Calendrier de publication mensuel",
] as const

// ---------------------------------------------------------------------------
// Données
// ---------------------------------------------------------------------------

export const PACK_MENSUEL: Pack = {
  id: "mensuel",
  name: "Mensuel",
  price: 150,
  stripeCents: 15_000,
  unit: "/mois",
  subtitle: "Idéal pour tester. Sans engagement, résiliation libre.",
  mention: "Sans engagement. Résiliation libre en 1 clic.",
  cta: "Commencer ce mois-ci",
  ctaHref: "/api/checkout?pack=mensuel",
  paymentType: "recurring",
  featured: false,
  features: ABONNEMENT_FEATURES,
} as const

export const PACK_TRIMESTRIEL: Pack = {
  id: "trimestriel",
  name: "Trimestriel",
  price: 120,
  stripeCents: 36_000,
  unit: "/mois",
  subtitle: "Le choix malin. 120€/mois, facturé 360€ tous les 3 mois.",
  mention: "Engagement 3 mois. Résiliation à chaque échéance.",
  cta: "Économiser 20%",
  ctaHref: "/api/checkout?pack=trimestriel",
  paymentType: "recurring",
  featured: true,
  badge: "Recommandé",
  engagementMonths: 3,
  totalPrice: 360,
  totalStripeCents: 36_000,
  savings: "90€ sur 3 mois",
  pricePerMonth: 120,
  features: ABONNEMENT_FEATURES,
} as const

export const PACK_ANNUEL: Pack = {
  id: "annuel",
  name: "Annuel",
  price: 100,
  stripeCents: 120_000,
  unit: "/mois",
  subtitle: "Le meilleur tarif. 100€/mois, facturé 1 200€/an.",
  mention: "Engagement 12 mois. 4 mois offerts vs le mensuel.",
  cta: "Économiser 33%",
  ctaHref: "/api/checkout?pack=annuel",
  paymentType: "recurring",
  featured: false,
  engagementMonths: 12,
  totalPrice: 1_200,
  totalStripeCents: 120_000,
  savings: "600€/an — 4 mois offerts",
  pricePerMonth: 100,
  highlight: "4 mois offerts",
  features: ABONNEMENT_FEATURES,
} as const

export const PACK_BOOST: Pack = {
  id: "boost",
  name: "Boost Mandat",
  price: 100,
  stripeCents: 10_000,
  unit: "/bien",
  subtitle: "Déjà abonné ? Ton nouveau bien mérite ses propres posts.",
  mention: "Réservé aux abonnés",
  cta: "Booster mon prochain bien",
  ctaHref: "/api/checkout?pack=boost",
  paymentType: "one_time",
  featured: false,
  features: [
    "1 annonce + 3 posts + 1 Reel",
    "1 page web du bien + 1 email acheteurs",
  ],
} as const

/** Les 3 formules d'abonnement affichées dans la grille Pricing */
export const ABONNEMENT_PACKS = [PACK_MENSUEL, PACK_TRIMESTRIEL, PACK_ANNUEL] as const

/** Tous les packs indexés par id */
export const PACKS: Record<PackId, Pack> = {
  mensuel: PACK_MENSUEL,
  trimestriel: PACK_TRIMESTRIEL,
  annuel: PACK_ANNUEL,
  boost: PACK_BOOST,
} as const

/** Prix minimum affiché (formule annuelle) */
export const PRIX_MIN_MENSUEL = PACK_ANNUEL.price

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formate le prix d'un pack pour affichage.
 * Ex: "150€/mois", "100€/bien"
 */
export function formatPrice(pack: Pick<Pack, "price" | "unit">): string {
  return `${pack.price}€${pack.unit}`
}

/**
 * Formate le prix avec mention TTC.
 * Ex: "150€/mois TTC"
 */
export function formatPriceTTC(pack: Pick<Pack, "price" | "unit">): string {
  return `${formatPrice(pack)} TTC`
}

/**
 * Récupère le prix d'un pack par son id.
 * Utile dans les routes API / server actions.
 */
export function getPackPrice(id: PackId): number {
  return PACKS[id].price
}

/**
 * Formate "À partir de X€/mois" avec le prix le plus bas.
 */
export function formatStartingPrice(): string {
  return `À partir de ${PRIX_MIN_MENSUEL}€/mois`
}

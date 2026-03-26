/**
 * Source unique de vérité pour tous les prix ImmoCrew.
 *
 * Chaque composant, page et route API doit importer depuis ce fichier.
 * Ne JAMAIS hardcoder un prix ailleurs dans src/.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PackId = "lancement" | "mensuel" | "mensuel-trimestriel" | "boost"

export interface Pack {
  id: PackId
  name: string
  /** Prix affiché (en euros TTC) */
  price: number
  /** Montant en centimes pour Stripe */
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
  /** Badge optionnel (ex: "Le choix de la plupart des mandataires") */
  badge?: string
  /** Liste des features incluses */
  features: readonly string[]
  /** Engagement en mois (ex: 3 pour trimestriel) */
  engagementMonths?: number
  /** Prix total pour la période d'engagement (en euros TTC) */
  totalPrice?: number
  /** Montant total en centimes pour Stripe */
  totalStripeCents?: number
  /** Pourcentage d'économie par rapport au mensuel sans engagement */
  savings?: string
}

// ---------------------------------------------------------------------------
// Données
// ---------------------------------------------------------------------------

export const PACK_LANCEMENT: Pack = {
  id: "lancement",
  name: "Pack Lancement",
  price: 400,
  stripeCents: 40_000,
  unit: "",
  subtitle: "Ce qu'un freelance te facturerait 2 000€ — livré en une semaine.",
  mention: "Satisfait ou remboursé 14 jours. Zéro risque.",
  cta: "Démarrer mon lancement",
  ctaHref: "/api/checkout?pack=lancement",
  paymentType: "one_time",
  featured: false,
  features: [
    "Ce qui te rend unique sur ta zone — formulé clairement",
    "Bio optimisée pour tous tes profils",
    "5 annonces rédigées pour mettre en valeur chaque bien",
    "5 articles SEO local (quartier + ville)",
    "Plan de publication sur 30 jours",
    "20 posts prêts à publier",
    "10 scripts Reels",
    "Charte visuelle : couleurs, police, mise en page",
  ],
} as const

export const PACK_MENSUEL: Pack = {
  id: "mensuel",
  name: "Pack Mensuel",
  price: 150,
  stripeCents: 15_000,
  unit: "/mois",
  subtitle: "12 posts, 4 scripts, 2 articles, 4 annonces — prêts à publier le 1er du mois.",
  mention: "Sans engagement. Résiliation libre en 1 clic.",
  cta: "Commencer ce mois-ci",
  ctaHref: "/api/checkout?pack=mensuel",
  paymentType: "recurring",
  featured: true,
  badge: "Le choix de la plupart des mandataires",
  features: [
    "12 posts personnalisés pour tes réseaux",
    "4 scripts vidéo pour tes Reels",
    "2 articles SEO local",
    "1 newsletter pour tes contacts",
    "4 annonces qui donnent envie de visiter",
    "1 email de prospection vendeurs",
    "Calendrier de publication mensuel",
  ],
} as const

export const PACK_BOOST: Pack = {
  id: "boost",
  name: "Boost Mandat",
  price: 100,
  stripeCents: 10_000,
  unit: "/bien",
  subtitle: "Déjà abonné ? Ton nouveau bien mérite ses propres posts.",
  mention: "Réservé aux abonnés Pack Mensuel",
  cta: "Booster mon prochain bien",
  ctaHref: "/api/checkout?pack=boost",
  paymentType: "one_time",
  featured: false,
  features: [
    "1 annonce + 3 posts + 1 Reel",
    "1 page web du bien + 1 email acheteurs",
  ],
} as const

// ---------------------------------------------------------------------------
// Option trimestrielle — même pack mensuel, engagement 3 mois, -10%
// ---------------------------------------------------------------------------

export const PACK_MENSUEL_TRIMESTRIEL: Pack = {
  ...PACK_MENSUEL,
  id: "mensuel-trimestriel",
  price: 135,
  stripeCents: 13_500,
  unit: "/mois",
  subtitle: "135€/mois — engagement 3 mois, économise 45€.",
  mention: "Engagement 3 mois. Résiliation à chaque échéance.",
  cta: "Commencer ce trimestre",
  ctaHref: "/api/checkout?pack=mensuel-trimestriel",
  engagementMonths: 3,
  totalPrice: 405,
  totalStripeCents: 40_500,
  savings: "10%",
} as const

/** Les 4 packs indexés par id */
export const PACKS: Record<PackId, Pack> = {
  lancement: PACK_LANCEMENT,
  mensuel: PACK_MENSUEL,
  "mensuel-trimestriel": PACK_MENSUEL_TRIMESTRIEL,
  boost: PACK_BOOST,
} as const

/** Les 2 packs principaux affichés côte à côte dans la grille Pricing */
export const MAIN_PACKS = [PACK_LANCEMENT, PACK_MENSUEL] as const

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Formate le prix d'un pack pour affichage.
 * Ex: "150€/mois", "400€", "100€/bien"
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

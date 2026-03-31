/**
 * Utilitaire d'images pour les articles de blog.
 *
 * Deux stratégies :
 * 1. Articles géolocalisés (ville/quartier dans le titre ou slug)
 *    → photo de la ville via Unsplash (IDs curatés, pas d'API key nécessaire)
 * 2. Articles génériques (pas de ville détectée)
 *    → photo thématique liée à la catégorie de l'article
 *
 * Les URLs Unsplash directes (images.unsplash.com/photo-{id}) sont stables
 * et ne nécessitent pas de clé API. On utilise les paramètres w/h/fit/q
 * pour le redimensionnement côté CDN Unsplash.
 */

/** Photo Unsplash curatée : ID + crédit photographe */
interface UnsplashPhoto {
  id: string
  photographer: string
}

/**
 * Mapping des grandes villes françaises vers des photos Unsplash curatées.
 * Chaque photo est sélectionnée pour montrer un paysage urbain reconnaissable.
 */
const CITY_PHOTOS: Record<string, UnsplashPhoto> = {
  paris: {
    id: "photo-1502602898657-3e91760cbb34",
    photographer: "Chris Karidis",
  },
  lyon: {
    id: "photo-1524396309943-e03f5249f002",
    photographer: "Ludovic Charlet",
  },
  marseille: {
    id: "photo-1589810264340-0ce27bfbf751",
    photographer: "Nick Fewings",
  },
  bordeaux: {
    id: "photo-1573812195421-60a0eaae1538",
    photographer: "Jonathan Music",
  },
  toulouse: {
    id: "photo-1582764509690-1f90a2068f68",
    photographer: "Pierre-Selim",
  },
  nantes: {
    id: "photo-1584469096800-f5aad18c9a52",
    photographer: "Axel Houmadi",
  },
  lille: {
    id: "photo-1559619437-97e00b208806",
    photographer: "Yeo Khee",
  },
  strasbourg: {
    id: "photo-1575379573715-d4f33a65dcf4",
    photographer: "Moïse Bloch",
  },
  montpellier: {
    id: "photo-1592906209472-a36b1f3782ef",
    photographer: "Léonard Cotte",
  },
  nice: {
    id: "photo-1585208798174-6cedd86e019a",
    photographer: "Luca Bravo",
  },
  rennes: {
    id: "photo-1600585154340-be6161a56a0c",
    photographer: "Sébastien Goldberg",
  },
  grenoble: {
    id: "photo-1588668214407-6ea9a6d8c272",
    photographer: "Gauthier Delecroix",
  },
  dijon: {
    id: "photo-1601128583068-1f31be7e6e52",
    photographer: "Miltiadis Fragkidis",
  },
  angers: {
    id: "photo-1600596542815-ffad4c1539a9",
    photographer: "Guillaume Meurice",
  },
  toulon: {
    id: "photo-1599483324530-1fe4e0e3d62a",
    photographer: "Tanguy Sauvin",
  },
}

/**
 * Photos thématiques par catégorie d'article.
 * Utilisées quand aucune ville n'est détectée dans le titre/slug.
 */
const CATEGORY_PHOTOS: Record<string, UnsplashPhoto> = {
  "Annonces": {
    id: "photo-1560518883-ce09059eeffa",
    photographer: "Tierra Mallorca",
  },
  "Stratégie": {
    id: "photo-1454165804606-c3d57bc86b40",
    photographer: "Scott Graham",
  },
  "SEO local": {
    id: "photo-1432888498266-38ffec3eaf0a",
    photographer: "Henry Perks",
  },
  "Marketing digital": {
    id: "photo-1460925895917-afdab827c52f",
    photographer: "Carlos Muza",
  },
  "Réseaux sociaux": {
    id: "photo-1611162617213-7d7a39e9b1d7",
    photographer: "Alexander Shatov",
  },
  "Image pro": {
    id: "photo-1507003211169-0a1dd7228f2d",
    photographer: "Joseph Gonzalez",
  },
  "Vidéo": {
    id: "photo-1492691527719-9d1e07e534b4",
    photographer: "Sam McGhee",
  },
}

/** Photo par défaut (immobilier générique) */
const DEFAULT_PHOTO: UnsplashPhoto = {
  id: "photo-1560518883-ce09059eeffa",
  photographer: "Tierra Mallorca",
}

/**
 * Liste des villes françaises connues pour la détection.
 * Inclut les grandes villes et quelques villes moyennes fréquentes dans l'immobilier.
 */
const KNOWN_CITIES = [
  "paris",
  "lyon",
  "marseille",
  "bordeaux",
  "toulouse",
  "nantes",
  "lille",
  "strasbourg",
  "montpellier",
  "nice",
  "rennes",
  "grenoble",
  "dijon",
  "angers",
  "toulon",
  "aix-en-provence",
  "saint-etienne",
  "le havre",
  "clermont-ferrand",
  "reims",
  "villeurbanne",
  "perpignan",
  "orléans",
  "caen",
  "metz",
  "besançon",
  "rouen",
  "mulhouse",
  "brest",
  "limoges",
  "amiens",
  "tours",
  "avignon",
  "pau",
  "poitiers",
  "la rochelle",
  "nancy",
  "cannes",
  "antibes",
  "versailles",
  "boulogne-billancourt",
  "neuilly-sur-seine",
]

/**
 * Normalise un texte pour la comparaison : minuscules, suppression des accents.
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

/**
 * Extrait le nom d'une ville depuis le titre et/ou le slug d'un article.
 *
 * Stratégie :
 * 1. Chercher les noms de villes connues dans le titre (ex: "immobilier à Lyon")
 * 2. Chercher dans le slug (ex: "marche-immobilier-lyon")
 *
 * @returns Le nom de la ville en minuscules normalisées, ou null si non détecté
 */
export function extractCityFromArticle(
  title: string,
  slug: string
): string | null {
  const normalizedTitle = normalize(title)
  const normalizedSlug = normalize(slug)

  for (const city of KNOWN_CITIES) {
    const normalizedCity = normalize(city)

    // Chercher dans le titre — vérifier que c'est un mot complet
    // (éviter "nicely" → "nice", "parisien" → "paris")
    const cityRegex = new RegExp(`\\b${normalizedCity.replace(/-/g, "[\\s-]")}\\b`)
    if (cityRegex.test(normalizedTitle)) {
      return normalizedCity
    }

    // Chercher dans le slug (séparé par des tirets)
    const slugParts = normalizedSlug.split("-")
    const cityParts = normalizedCity.split("-")

    // Vérifier si tous les mots de la ville apparaissent consécutivement dans le slug
    if (cityParts.length === 1) {
      if (slugParts.includes(cityParts[0])) {
        return normalizedCity
      }
    } else {
      // Ville multi-mots (ex: "aix-en-provence", "saint-etienne")
      for (let i = 0; i <= slugParts.length - cityParts.length; i++) {
        const slice = slugParts.slice(i, i + cityParts.length)
        if (slice.join("-") === normalizedCity) {
          return normalizedCity
        }
      }
    }
  }

  return null
}

/**
 * Génère l'URL Unsplash d'une photo de ville.
 * Les URLs images.unsplash.com sont stables et ne nécessitent pas de clé API.
 *
 * @param photoId - L'ID Unsplash de la photo (ex: "photo-1502602898657-3e91760cbb34")
 * @param width - Largeur souhaitée en pixels
 * @param height - Hauteur souhaitée en pixels
 * @param quality - Qualité JPEG (1-100)
 */
function buildUnsplashUrl(
  photoId: string,
  width: number = 1200,
  height: number = 400,
  quality: number = 80
): string {
  return `https://images.unsplash.com/${photoId}?w=${width}&h=${height}&fit=crop&q=${quality}&auto=format`
}

export interface ArticleImage {
  /** URL de l'image (Unsplash CDN) */
  url: string
  /** Texte alternatif pour l'accessibilité */
  alt: string
  /** Crédit photographe */
  photographer: string
  /** Type d'image : ville détectée ou catégorie thématique */
  type: "city" | "category"
  /** Nom de la ville si type === "city" */
  cityName?: string
}

/**
 * Retourne l'image appropriée pour un article de blog.
 *
 * @param title - Titre de l'article
 * @param slug - Slug de l'article
 * @param category - Catégorie de l'article
 * @param width - Largeur souhaitée (défaut 1200)
 * @param height - Hauteur souhaitée (défaut 400)
 */
export function getArticleImage(
  title: string,
  slug: string,
  category: string,
  width: number = 1200,
  height: number = 400
): ArticleImage {
  // 1. Essayer de détecter une ville
  const city = extractCityFromArticle(title, slug)

  if (city) {
    // Chercher la photo curatée pour cette ville
    const normalizedCity = normalize(city)
    const photo = CITY_PHOTOS[normalizedCity]

    if (photo) {
      // Capitaliser le nom de la ville pour l'affichage
      const displayName = city
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("-")

      return {
        url: buildUnsplashUrl(photo.id, width, height),
        alt: `Vue de ${displayName}, France`,
        photographer: photo.photographer,
        type: "city",
        cityName: displayName,
      }
    }
  }

  // 2. Pas de ville → utiliser la photo thématique de la catégorie
  const categoryPhoto = CATEGORY_PHOTOS[category] || DEFAULT_PHOTO
  const categoryAltTexts: Record<string, string> = {
    "Annonces": "Maison avec panneau à vendre — rédaction d'annonces immobilières",
    "Stratégie": "Plan de travail avec documents de stratégie marketing",
    "SEO local": "Écran affichant des résultats de recherche Google",
    "Marketing digital": "Tableau de bord d'analytics marketing",
    "Réseaux sociaux": "Applications de réseaux sociaux sur smartphone",
    "Image pro": "Portrait professionnel pour personal branding",
    "Vidéo": "Caméra filmant une scène — vidéo immobilière",
  }

  return {
    url: buildUnsplashUrl(categoryPhoto.id, width, height),
    alt: categoryAltTexts[category] || "Illustration immobilier et marketing digital",
    photographer: categoryPhoto.photographer,
    type: "category",
  }
}

/**
 * Retourne l'URL d'une image en format vignette (pour les grilles d'articles).
 */
export function getArticleThumbnail(
  title: string,
  slug: string,
  category: string
): ArticleImage {
  return getArticleImage(title, slug, category, 400, 300)
}

/**
 * Génère l'URL d'un visuel branded pour un post social.
 * Utilise l'API interne /api/visuals/post-card (Next.js ImageResponse).
 *
 * Analyse le brief_visuel pour déterminer le type de visuel :
 * - "texte sur fond" / "citation" → type=citation
 * - "stat" / "chiffre" / "prix" → type=stat
 * - "conseil" / "tip" / "astuce" → type=tip
 * - "témoignage" / "avis" → type=quote
 */

interface GenerateVisualParams {
  briefVisuel: string
  titre: string
  hashtags?: string[]
  plateforme?: string
}

interface VisualResult {
  url: string
  type: "citation" | "stat" | "tip" | "quote"
  format: "square" | "portrait" | "landscape"
  canAutoGenerate: boolean
}

/**
 * Détermine si un brief visuel peut être auto-généré
 * (pas besoin de photo personnelle / bien).
 */
export function canAutoGenerate(briefVisuel: string): boolean {
  const brief = briefVisuel.toLowerCase()
  const requiresPhoto = [
    "selfie", "photo de toi", "photo du bien", "photo de la",
    "photo avec", "photo devant", "capture d'écran",
    "avant/après", "home staging",
  ]
  return !requiresPhoto.some((kw) => brief.includes(kw))
}

/**
 * Génère l'URL du visuel à partir du brief.
 */
export function generatePostVisualUrl(
  params: GenerateVisualParams,
  baseUrl: string = ""
): VisualResult | null {
  const { briefVisuel, titre, plateforme } = params
  const brief = briefVisuel.toLowerCase()

  if (!canAutoGenerate(briefVisuel)) return null

  // Déterminer le type
  let type: VisualResult["type"] = "citation"
  if (brief.includes("stat") || brief.includes("chiffre") || brief.includes("prix") || brief.includes("nombre") || brief.includes("%")) {
    type = "stat"
  } else if (brief.includes("conseil") || brief.includes("tip") || brief.includes("astuce") || brief.includes("erreur")) {
    type = "tip"
  } else if (brief.includes("témoignage") || brief.includes("avis") || brief.includes("citation client")) {
    type = "quote"
  }

  // Format selon la plateforme
  let format: VisualResult["format"] = "square"
  if (plateforme === "linkedin") format = "landscape"
  if (plateforme === "instagram") format = "portrait"

  // Thème : alterner pour varier
  const themes = ["orange", "navy", "white"]
  const themeIndex = titre.length % themes.length
  const theme = themes[themeIndex]

  // Extraire le texte principal du brief ou du titre
  let text = titre
  let subtitle = ""

  // Si le brief contient des guillemets, utiliser le texte entre guillemets
  const quotedMatch = briefVisuel.match(/[«"'"]([^»"'"]+)[»"'"]/)
  if (quotedMatch) {
    text = quotedMatch[1]
    subtitle = titre
  }

  // Tronquer le texte si trop long
  if (text.length > 120) text = text.slice(0, 117) + "..."

  const searchParams = new URLSearchParams({
    type,
    text,
    format,
    theme,
    ...(subtitle ? { subtitle } : {}),
  })

  return {
    url: `${baseUrl}/api/visuals/post-card?${searchParams.toString()}`,
    type,
    format,
    canAutoGenerate: true,
  }
}

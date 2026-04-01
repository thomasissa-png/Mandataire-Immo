/**
 * Génération de visuels branded pour les posts sociaux.
 *
 * LOGIQUE : un visuel est auto-genérable UNIQUEMENT si le brief
 * recommande explicitement un visuel texte/graphique (pas une photo).
 * Approche whitelist (pas blacklist) pour éviter les faux positifs.
 */

interface GenerateVisualParams {
  briefVisuel: string
  postContent: string  // Le texte du post (pour extraire la phrase clé)
  titre: string
  plateforme?: string
}

interface VisualResult {
  url: string
  type: "citation" | "stat" | "tip" | "quote"
  format: "square" | "portrait" | "landscape"
}

/**
 * Détermine si un brief visuel peut être auto-généré.
 * Whitelist : SEULS les briefs qui décrivent un visuel texte/graphique sont acceptés.
 */
export function canAutoGenerate(briefVisuel: string): boolean {
  const brief = briefVisuel.toLowerCase()
  const autoGenerableKeywords = [
    "texte sur fond",
    "texte animé",
    "citation sur fond",
    "chiffre sur fond",
    "stat ",
    "statistique",
    "graphique simple",
    "fond coloré",
    "fond orange",
    "fond bleu",
    "infographie",
    "carte avec texte",
    "sans photo",
    "pas de photo",
  ]
  return autoGenerableKeywords.some((kw) => brief.includes(kw))
}

/**
 * Génère l'URL du visuel branded.
 * Le texte principal est extrait du CONTENU DU POST (pas du brief).
 */
export function generatePostVisualUrl(
  params: GenerateVisualParams,
  baseUrl: string = ""
): VisualResult | null {
  const { briefVisuel, postContent, titre, plateforme } = params
  const brief = briefVisuel.toLowerCase()

  if (!canAutoGenerate(briefVisuel)) return null

  // Déterminer le type
  let type: VisualResult["type"] = "citation"
  if (brief.includes("stat") || brief.includes("chiffre") || brief.includes("%")) {
    type = "stat"
  } else if (brief.includes("conseil") || brief.includes("tip") || brief.includes("astuce")) {
    type = "tip"
  } else if (brief.includes("témoignage") || brief.includes("avis") || brief.includes("citation client")) {
    type = "quote"
  }

  // Format selon la plateforme
  let format: VisualResult["format"] = "square"
  if (plateforme?.toLowerCase() === "linkedin") format = "landscape"
  if (plateforme?.toLowerCase() === "instagram") format = "portrait"

  // Thème alterné
  const themes = ["orange", "navy", "white"]
  const themeIndex = titre.length % themes.length
  const theme = themes[themeIndex]

  // Extraire le texte principal du CONTENU du post (première phrase percutante)
  // PAS du brief visuel !
  let text = ""
  let subtitle = ""

  // Chercher dans le brief s'il y a du texte entre guillemets (c'est le texte voulu)
  const quotedMatch = briefVisuel.match(/[«"'"]([^»"'"]{10,})[»"'"]/)
  if (quotedMatch) {
    text = quotedMatch[1]
    subtitle = titre
  } else {
    // Extraire la première phrase du post (le hook)
    const lines = postContent.split("\n").filter((l) => l.trim() && !l.startsWith("#"))
    const firstLine = lines[0] || titre
    // Nettoyer le markdown
    text = firstLine
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/^[🏠📱💡🎯📊🔑✅❌→•\-]\s*/g, "")
      .trim()
    if (!text || text.length < 10) text = titre
  }

  // Tronquer
  if (text.length > 100) text = text.slice(0, 97) + "..."
  if (subtitle && subtitle.length > 80) subtitle = subtitle.slice(0, 77) + "..."

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
  }
}

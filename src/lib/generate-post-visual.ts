/**
 * Génération de visuels pour les posts sociaux via OpenAI gpt-image-1.
 *
 * Deux modes :
 * 1. Auto-générable (texte/stat/citation) → prompt IA pour un visuel branded
 * 2. Photo recommandée → Sophie prend la photo, pas de génération
 *
 * Coût estimé : ~0.04 USD/image en medium 1024x1024
 */

import { generateImage } from "@/lib/openai"
import { uploadFile } from "@/lib/storage"

interface GenerateVisualParams {
  briefVisuel: string
  postContent: string
  titre: string
  plateforme?: string
  mandatairePrenom?: string
  ville?: string
}

interface VisualResult {
  key: string       // Clé dans Object Storage
  url: string       // URL publique /api/images/[key]
  prompt: string    // Prompt utilisé
}

/**
 * Détermine si un brief visuel peut être auto-généré via IA.
 * Whitelist : SEULS les briefs qui décrivent un visuel texte/graphique.
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
 * Génère un visuel via OpenAI gpt-image-1 et le stocke dans Object Storage.
 * Retourne null si OPENAI_API_KEY n'est pas configurée (mode dégradé).
 */
export async function generatePostVisual(
  params: GenerateVisualParams,
  deliverableId: string,
): Promise<VisualResult | null> {
  if (!process.env.OPENAI_API_KEY) return null
  if (!canAutoGenerate(params.briefVisuel)) return null

  const { briefVisuel, postContent, titre, plateforme, mandatairePrenom, ville } = params

  // Extraire la phrase clé du post
  const lines = postContent.split("\n").filter((l) => l.trim() && !l.startsWith("#"))
  const keyPhrase = lines[0]
    ?.replace(/\*\*(.+?)\*\*/g, "$1")
    ?.replace(/\*(.+?)\*/g, "$1")
    ?.replace(/^[🏠📱💡🎯📊🔑✅❌→•\-]\s*/g, "")
    ?.trim() || titre

  // Construire le prompt pour gpt-image-1
  const prompt = buildVisualPrompt({
    briefVisuel,
    keyPhrase,
    titre,
    plateforme: plateforme || "instagram",
    mandatairePrenom: mandatairePrenom || "",
    ville: ville || "",
  })

  try {
    // Format selon la plateforme
    const size = plateforme?.toLowerCase() === "linkedin"
      ? "1536x1024" as const  // Paysage
      : "1024x1024" as const  // Carré (Instagram par défaut)

    const result = await generateImage({
      prompt,
      size,
      quality: "medium",
    })

    // Stocker dans Object Storage
    const buffer = Buffer.from(result.b64_json, "base64")
    const key = `visuals/posts/${deliverableId}.png`
    await uploadFile(key, buffer)

    return {
      key,
      url: `/api/images/${encodeURIComponent(key)}`,
      prompt,
    }
  } catch (err) {
    console.error("[generate-post-visual] Error:", err)
    return null
  }
}

/**
 * Construit le prompt pour gpt-image-1.
 * Style : minimaliste, professionnel, couleurs ImmoCrew.
 */
function buildVisualPrompt(params: {
  briefVisuel: string
  keyPhrase: string
  titre: string
  plateforme: string
  mandatairePrenom: string
  ville: string
}): string {
  const { briefVisuel, keyPhrase, plateforme, mandatairePrenom, ville } = params

  // Déterminer le style selon le brief
  const brief = briefVisuel.toLowerCase()
  let styleInstructions = ""

  if (brief.includes("stat") || brief.includes("chiffre") || brief.includes("%")) {
    styleInstructions = `Crée une infographie minimaliste et professionnelle avec un gros chiffre ou pourcentage au centre. Style : fond sombre avec accents orange (#F27A1A). Typographie moderne et bold.`
  } else if (brief.includes("conseil") || brief.includes("tip") || brief.includes("astuce")) {
    styleInstructions = `Crée un visuel pour un conseil immobilier. Style : fond élégant avec une icône symbolique (ampoule, clé, maison). Couleurs : bleu marine (#1B2A4A) et orange (#F27A1A). Pas de texte — juste le visuel.`
  } else if (brief.includes("témoignage") || brief.includes("citation")) {
    styleInstructions = `Crée un visuel pour un témoignage client. Style : fond sobre et chaleureux, guillemets graphiques élégants. Couleurs : tons chauds avec accent orange (#F27A1A).`
  } else {
    styleInstructions = `Crée un visuel élégant et professionnel pour un post de mandataire immobilier. Style : minimaliste, moderne, couleurs bleu marine (#1B2A4A) et orange (#F27A1A).`
  }

  return `${styleInstructions}

Contexte : post ${plateforme} pour ${mandatairePrenom || "un mandataire immobilier"}${ville ? ` à ${ville}` : ""}.
Sujet du post : "${keyPhrase}"

RÈGLES STRICTES :
- Format carré (1:1) pour Instagram, paysage (3:2) pour LinkedIn
- PAS de texte écrit dans l'image (le texte sera dans le post)
- Style premium, professionnel — pas de clipart, pas de stock photo générique
- Ambiance : confiance, proximité, expertise locale
- Couleurs dominantes : bleu marine #1B2A4A, orange #F27A1A, blanc
- Minimaliste : peu d'éléments, beaucoup d'espace
- Le logo ImmoCrew NE DOIT PAS apparaître dans l'image`
}

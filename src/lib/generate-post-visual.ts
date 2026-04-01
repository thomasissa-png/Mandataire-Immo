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
 *
 * Whitelist élargie : tous les types de visuels que gpt-image-1.5 peut
 * produire avec un niveau de qualité professionnel. Seuls les briefs
 * demandant explicitement une vraie photo du mandataire ou d'un bien réel
 * spécifique sont exclus (Sophie doit prendre la photo elle-même).
 */
export function canAutoGenerate(briefVisuel: string): boolean {
  const brief = briefVisuel.toLowerCase()

  // Exclusions : briefs qui NÉCESSITENT une vraie photo
  const requiresRealPhoto = [
    "photo de toi",
    "selfie",
    "ta photo",
    "photo réelle",
    "photo du bien",
    "photo de l'appartement",
    "photo de la maison",
    "prends une photo",
  ]
  if (requiresRealPhoto.some((kw) => brief.includes(kw))) return false

  // Tout le reste est auto-générable — le prompt adaptera le style
  // selon le type détecté (conseil, quartier, marché, témoignage, etc.)
  return true
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
 * Détecte le type de visuel à partir du brief et du contenu du post.
 *
 * Types supportés :
 *   - "conseil"    → Conseil immobilier, astuce, tip pratique
 *   - "quartier"   → Découverte de quartier, vie locale, ambiance de rue
 *   - "marche"     → Tendance marché, statistiques, chiffres, infographie
 *   - "temoignage" → Témoignage client, citation, satisfaction
 *   - "citation"   → Citation motivante, inspiration, phrase-clé
 *   - "bien"       → Mise en valeur d'un bien immobilier
 *   - "generic"    → Fallback élégant pour tout le reste
 */
type VisualType = "conseil" | "quartier" | "marche" | "temoignage" | "citation" | "bien" | "generic"

function detectVisualType(briefVisuel: string, keyPhrase: string): VisualType {
  const text = `${briefVisuel} ${keyPhrase}`.toLowerCase()

  if (text.match(/stat|chiffre|%|pourcentage|tendance|marché|prix|évolution|baromètre|hausse|baisse/)) {
    return "marche"
  }
  if (text.match(/quartier|ville|rue|commune|local|voisinage|découv/)) {
    return "quartier"
  }
  if (text.match(/témoignage|avis|client satisfait|retour client|expérience client|recommand/)) {
    return "temoignage"
  }
  if (text.match(/citation|motivation|inspir|proverbe|phrase/)) {
    return "citation"
  }
  if (text.match(/bien|appartement|maison|villa|annonce|vente|mandat|propriété/)) {
    return "bien"
  }
  if (text.match(/conseil|tip|astuce|erreur|piège|guide|comment|clé/)) {
    return "conseil"
  }
  return "generic"
}

/**
 * Construit le prompt pour gpt-image-1.5.
 *
 * Architecture du prompt :
 *   1. Phrase d'intention (mood sentence) — donne le ton émotionnel au modèle
 *   2. Description de scène détaillée — adaptée au type de visuel
 *   3. Directives photographiques / graphiques — profondeur, éclairage, composition
 *   4. Palette de couleurs — cohérente ImmoCrew (#1B2A4A, #F27A1A, blancs chauds)
 *   5. Négatifs stricts — aucun texte, logo, filigrane, clipart
 *
 * Exemples de prompts par type (pour référence lors du debug) :
 *
 * CONSEIL (bureau moderne) :
 *   "A warm, inviting scene that radiates expertise and approachability.
 *    A modern home office desk seen from a 45-degree overhead angle. On the
 *    desk: a single brass house-shaped paperweight, a warm cup of coffee with
 *    latte art, and a small potted succulent. Soft morning light streaming
 *    through sheer linen curtains, casting gentle shadows. Shallow depth of
 *    field, f/2.8. Color palette: deep navy blue (#1B2A4A) desk accessories,
 *    warm orange (#F27A1A) ceramic mug, cream white surfaces. Shot on a
 *    full-frame camera, editorial lifestyle photography style."
 *
 * QUARTIER (vue de rue) :
 *   "A cinematic street-level scene evoking the charm of a French neighborhood.
 *    A quiet cobblestone street in a typical French town, early morning golden
 *    hour. Pastel-colored building facades with wooden shutters, a small café
 *    with a terrace, flower boxes on windowsills. One warm light glowing from
 *    a ground-floor window. No people visible. Atmospheric perspective, soft
 *    bokeh in the background. Color grading: warm tones with deep navy blue
 *    (#1B2A4A) shadows and touches of warm orange (#F27A1A) in the morning
 *    light. Shot on 35mm lens, f/4, cinematic film photography."
 *
 * MARCHE (infographie abstraite) :
 *   "An elegant, abstract data visualization conveying market confidence.
 *    Smooth 3D geometric shapes — spheres, rounded cubes, and gentle curves —
 *    floating in a dark navy (#1B2A4A) space. A subtle upward-trending arc
 *    made of translucent orange (#F27A1A) glass ribbons weaves through the
 *    composition. Soft studio lighting from above, volumetric light rays.
 *    Frosted glass material on some shapes, metallic gold accents on others.
 *    Clean, minimal, no grid lines, no axis labels. Inspired by high-end
 *    editorial illustrations in The Economist or Bloomberg."
 *
 * TEMOIGNAGE (remise de clés) :
 *   "A heartfelt moment of achievement and new beginnings. Close-up of two
 *    hands — one giving, one receiving a set of house keys with a small
 *    house-shaped keychain. Warm indoor lighting, slightly blurred French
 *    apartment background with moving boxes, Haussmann moldings, and natural
 *    light from tall French windows. Shallow depth of field, f/1.8, focus on
 *    the keys. Color temperature: warm golden. Accent color: the keychain has
 *    an orange (#F27A1A) detail. Documentary photography style, natural, unposed."
 *
 * CITATION (fond texturé minimaliste) :
 *   "A serene, textured background that evokes calm determination. An abstract
 *    composition: a single vertical brushstroke of warm orange (#F27A1A) on a
 *    deep navy (#1B2A4A) textured plaster wall. The brushstroke is slightly
 *    imperfect, organic. Subtle light coming from the left side, creating a
 *    soft gradient. The rest of the frame is quiet negative space. Fine art
 *    photography, studio lighting, minimal, meditative."
 */
function buildVisualPrompt(params: {
  briefVisuel: string
  keyPhrase: string
  titre: string
  plateforme: string
  mandatairePrenom: string
  ville: string
}): string {
  const { briefVisuel, keyPhrase, plateforme, ville } = params
  const type = detectVisualType(briefVisuel, keyPhrase)

  // --- Mood sentence par type (intention émotionnelle) ---
  const moodSentences: Record<VisualType, string> = {
    conseil:
      "A warm, inviting scene that radiates real estate expertise and approachability — the feeling of getting trusted advice from a knowledgeable friend.",
    quartier:
      "A cinematic, emotionally rich scene that captures the soul of a French neighborhood — the charm, the light, the quiet pride of living there.",
    marche:
      "An elegant, confident composition that makes complex market data feel clear, authoritative, and visually stunning — like a Bloomberg cover illustration.",
    temoignage:
      "A heartfelt, authentic moment of human connection and achievement — the joy of a successful real estate transaction, warm and genuine.",
    citation:
      "A serene, contemplative atmosphere that invites reflection — quiet strength, refined simplicity, artistic calm.",
    bien:
      "A magazine-worthy interior or exterior that makes you want to live there immediately — aspirational yet realistic, warm yet polished.",
    generic:
      "A premium, modern visual that communicates professionalism, trust, and warmth in the real estate industry.",
  }

  // --- Description de scène par type ---
  const sceneDescriptions: Record<VisualType, string> = {
    conseil: [
      "A modern, minimalist home office desk photographed from a 45-degree overhead angle.",
      "On the desk: a single elegant brass house-shaped paperweight, a warm ceramic coffee cup with latte art, a small potted succulent in a terracotta pot, and a partially visible French property floor plan (plan de masse) with clean architectural lines.",
      "Soft morning light streaming through sheer linen curtains, casting gentle diagonal shadows across a light oak wood surface.",
      "Shallow depth of field, f/2.8, the background softly blurred showing a hint of French rooftops through the window.",
      "One single subject focal point — the house-shaped paperweight — everything else supports it.",
    ].join(" "),

    quartier: [
      `A quiet cobblestone street in a charming French town${ville ? ` reminiscent of ${ville}` : ""}, captured during early morning golden hour.`,
      "Pastel-colored building facades — cream, soft yellow, pale blue — with traditional wooden shutters, half open.",
      "A small café terrace with two classic Parisian bistro chairs and a round marble-top table, a chalkboard menu propped by the door, flower boxes overflowing with red geraniums on second-floor windowsills.",
      "One warm amber light glowing softly from a ground-floor boulangerie window, a wicker bread basket barely visible inside.",
      "No people visible. Atmospheric perspective with soft bokeh in the far background, leading the eye down the street.",
      "Shot on a 35mm prime lens, f/4, cinematic documentary style.",
    ].join(" "),

    marche: [
      "An abstract 3D data visualization rendered in a dark studio environment.",
      "Smooth geometric shapes — frosted glass spheres, rounded cubes, and translucent cylinders — float in organized clusters against a deep navy (#1B2A4A) background.",
      "A graceful upward-trending arc made of translucent orange (#F27A1A) glass ribbons weaves through the center of the composition, suggesting positive market momentum.",
      "Volumetric studio lighting from above creates soft caustics through the glass shapes.",
      "Some shapes have a brushed metallic gold finish, others are matte white ceramic.",
      "No grid lines, no axis labels, no numbers, no charts — purely abstract and sculptural.",
      "Inspired by editorial illustrations in premium financial publications.",
    ].join(" "),

    temoignage: [
      "Close-up shot of two hands in the act of passing a set of house keys.",
      "The giving hand extends confidently; the receiving hand opens with visible emotion — fingertips just touching the keys.",
      "The keychain has a small house-shaped pendant with a warm orange (#F27A1A) enamel detail.",
      `Background: a softly blurred sunlit living room${ville ? ` in a typical ${ville} apartment` : " in a French apartment"} with a few moving boxes, a vase of fresh peonies on a marble windowsill, Haussmann-style moldings visible in the blur, natural light pouring in through tall French windows.`,
      "Shallow depth of field, f/1.8, focus precisely on the keys and fingertips.",
      "Warm golden color temperature, documentary photography style — natural, unposed, authentic.",
    ].join(" "),

    citation: [
      "An abstract fine-art composition on a textured surface.",
      "A single bold vertical brushstroke of warm orange (#F27A1A) paint on a deep navy (#1B2A4A) hand-plastered wall.",
      "The brushstroke is organic, slightly imperfect, with visible bristle marks and subtle paint drips.",
      "Soft directional light from the left creates a gentle gradient across the textured wall surface, highlighting the plaster grain.",
      "The rest of the frame is generous negative space — quiet, meditative, balanced.",
      "Fine art photography, studio-quality directional lighting, large format camera feel.",
    ].join(" "),

    bien: [
      `A stunning interior photograph of a bright, contemporary French apartment${ville ? ` in ${ville}` : ""}.`,
      "Wide-angle view (24mm equivalent) of an open-plan living area with high ceilings and large French windows letting in abundant natural light.",
      "Warm hardwood parquet floors, a mid-century modern sofa in warm cream fabric, a statement pendant lamp, and a few carefully placed decor items.",
      "One accent wall in deep navy (#1B2A4A), a terracotta vase with dried pampas grass, and a woven throw blanket in warm orange tones.",
      "Golden hour light streaming in, casting long warm shadows.",
      "Interior architecture photography, f/5.6, perfectly straight verticals, magazine editorial quality.",
    ].join(" "),

    generic: [
      "A refined still-life composition evoking the craft of French real estate.",
      "On a weathered marble mantelpiece: a vintage brass skeleton key standing upright against a small stack of navy (#1B2A4A) leather-bound notebooks, a rolled-up architectural blueprint tied with an orange (#F27A1A) linen ribbon, and a sprig of dried lavender in a tiny ceramic vase.",
      "Behind them, a softly blurred antique gilded mirror reflects warm afternoon light.",
      "Shallow depth of field, f/2.8, focus on the brass key and ribbon.",
      "Soft natural light from a tall window to the right, subtle dust motes visible in the light beam.",
      "Editorial still-life photography, warm color temperature, Cereal Magazine aesthetic, unmistakably French.",
    ].join(" "),
  }

  // --- Palette couleur (commune, avec variations par type) ---
  const colorDirectives: Record<VisualType, string> = {
    conseil:
      "Color palette: deep navy blue (#1B2A4A) desk accessories, warm orange (#F27A1A) ceramic mug accent, cream and warm white surfaces (#F8F6F2), natural wood tones. Warm color temperature overall (5500K).",
    quartier:
      "Color grading: warm cinematic tones. Deep navy blue (#1B2A4A) in shadows and architectural details. Warm orange (#F27A1A) accents in the morning sunlight on building facades. Creamy highlights (#F8F6F2). Desaturated greens in foliage.",
    marche:
      "Color palette: dominant deep navy (#1B2A4A) background. Vibrant warm orange (#F27A1A) as the primary accent for the trend line and key shapes. White (#F8F6F2) and gold metallic as supporting tones. High contrast, moody lighting.",
    temoignage:
      "Color palette: warm golden tones throughout. Deep navy (#1B2A4A) clothing on one person. Orange (#F27A1A) accent on the keychain. Soft cream (#F8F6F2) walls in the background. Natural, ungraded warmth.",
    citation:
      "Color palette: dominant deep navy (#1B2A4A) textured wall. Single bold orange (#F27A1A) brushstroke accent. Subtle warm cream (#F8F6F2) highlights where light hits the plaster texture. Strictly two-tone plus light.",
    bien:
      "Color palette: warm neutrals dominate — cream, oak, warm white (#F8F6F2). Deep navy (#1B2A4A) accent wall. Warm orange (#F27A1A) accents in decor objects (vase, throw, cushion). Golden hour warm light. Interior design magazine color grading.",
    generic:
      "Color palette: deep navy (#1B2A4A), warm orange (#F27A1A) accent, warm white (#F8F6F2) background. Warm, approachable, professional. Never cold or clinical.",
  }

  // --- Directives photographiques / composition ---
  const compositionDirective = [
    "Composition: rule of thirds, single clear focal point, generous negative space around the subject.",
    "The image must feel like it was shot by a professional photographer for an editorial magazine — not a stock photo, not AI-generated looking.",
    "Lighting must feel natural and intentional — never flat, never overexposed.",
  ].join(" ")

  // --- Négatifs stricts ---
  const negatives = [
    "STRICT NEGATIVE CONSTRAINTS (do NOT include any of these):",
    "- No text, no letters, no words, no numbers, no typography of any kind anywhere in the image",
    "- No watermarks, no logos, no brand marks, no stamps, no signatures",
    "- No clipart, no cartoons, no illustrations, no icons, no emojis, no infographic elements",
    "- No stock photo clichés (no handshakes, no pointing at screens, no thumbs up, no people in suits posing, no happy business people, no group meetings around a table)",
    "- No computer screens, no phones, no tablets, no UI mockups, no dashboards",
    "- No busy or cluttered compositions — if in doubt, remove elements",
    "- No cold blue-white lighting — always warm",
    "- No AI artifacts: no deformed hands, no extra fingers, no melted objects, no unrealistic eyes, no uncanny valley faces, no distorted architecture, no impossible reflections",
    "- No American-style elements: no yard signs, no white picket fences, no mailboxes, no brownstones — all visual cues must read as French/European",
  ].join("\n")

  // --- Format selon plateforme ---
  const formatDirective = plateforme.toLowerCase() === "linkedin"
    ? "Aspect ratio: landscape 3:2 (1536x1024). Compose for a wide horizontal frame."
    : "Aspect ratio: square 1:1 (1024x1024). Compose for a perfectly balanced square frame."

  // --- Assemblage du prompt ---
  return [
    moodSentences[type],
    "",
    sceneDescriptions[type],
    "",
    compositionDirective,
    "",
    colorDirectives[type],
    "",
    formatDirective,
    "",
    negatives,
  ].join("\n")
}

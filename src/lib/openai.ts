/**
 * Client OpenAI — utilise uniquement pour la generation d'images (gpt-image-1).
 * Le texte est genere via Claude (src/lib/claude.ts).
 */

const OPENAI_API_URL = "https://api.openai.com/v1/images/generations"
const TIMEOUT_MS = 60_000 // 60s pour la generation d'images

interface ImageGenerationOptions {
  prompt: string
  size?: "1024x1024" | "1536x1024" | "1024x1536"
  quality?: "low" | "medium" | "high"
  n?: number
}

interface OpenAIImageResponse {
  created: number
  data: Array<{
    b64_json?: string
    url?: string
    revised_prompt?: string
  }>
}

/**
 * Genere une image via gpt-image-1.
 * Retourne l'image en base64 (format PNG).
 *
 * Cout estime : ~0.04-0.08 USD/image en qualite medium 1024x1024.
 *
 * @throws Error si OPENAI_API_KEY manquante ou si l'API echoue
 */
export async function generateImage(
  options: ImageGenerationOptions
): Promise<{ b64_json: string; revised_prompt: string | null }> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set")
  }

  const { prompt, size = "1024x1024", quality = "medium", n = 1 } = options

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt,
      size,
      quality,
      n,
      output_format: "png",
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "Unknown error")
    throw new Error(
      `OpenAI image generation failed (${res.status}): ${errorBody}`
    )
  }

  const data = (await res.json()) as OpenAIImageResponse

  if (!data.data?.[0]?.b64_json) {
    throw new Error("OpenAI response missing b64_json data")
  }

  console.log(
    `[OpenAI] Image generated. Size: ${size}, Quality: ${quality}, Prompt length: ${prompt.length}`
  )

  return {
    b64_json: data.data[0].b64_json,
    revised_prompt: data.data[0].revised_prompt ?? null,
  }
}

/**
 * Construit le prompt de home staging pour gpt-image-1.
 * Le prompt est precis pour eviter les problemes de proportion signales par Sophie.
 */
export function buildHomeStagingPrompt(params: {
  piece: string
  style: string
  description?: string
}): string {
  const { piece, style, description } = params

  return `Home staging virtuel professionnel d'une piece immobiliere.

Type de piece : ${piece}
Style de mobilier : ${style}
${description ? `Description : ${description}` : ""}

Instructions :
- Ajouter du mobilier ${style} realiste et bien proportionne a la piece
- Les meubles doivent respecter les dimensions reelles de la piece (pas de canape trop grand pour un petit salon)
- Garder les murs, sols, fenetres et elements architecturaux existants intacts
- Eclairage naturel et chaleureux
- Rendu photoréaliste de qualite professionnelle
- Ne pas modifier la structure de la piece
- Ajouter des elements de decoration (plantes, coussins, tableaux) de facon subtile
- Le resultat doit ressembler a une photo immobiliere reelle, pas a un rendu 3D`
}

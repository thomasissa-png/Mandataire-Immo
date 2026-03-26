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

// Le prompt de home staging est dans src/lib/prompts/home-staging.ts
// Utiliser buildHomeStagingPrompt depuis ce fichier pour beneficier
// des garde-fous de proportions et de la personnalisation par piece.

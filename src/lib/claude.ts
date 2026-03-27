import Anthropic from "@anthropic-ai/sdk"

// Initialisation lazy — ne crash pas au boot si la clé manque,
// mais retourne une erreur claire à l'appel
let _client: Anthropic | null = null

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "ANTHROPIC_API_KEY non configurée. Ajoute cette clé dans les Secrets Replit (Onglet Secrets → New Secret → ANTHROPIC_API_KEY → ta clé)."
    )
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  }
  return _client
}

/** Modele utilise pour la generation de contenu (bon ratio qualite/cout) */
const MODEL = "claude-sonnet-4-6" as const

/** Delai entre les tentatives en ms (backoff exponentiel : 1s, 2s, 4s) */
const RETRY_BASE_DELAY = 1000
const MAX_RETRIES = 3

interface GenerateOptions {
  system: string
  user: string
  maxTokens?: number
  temperature?: number
}

interface GenerateResult {
  content: string
  inputTokens: number
  outputTokens: number
  model: string
}

/**
 * Appelle Claude API avec retry et backoff exponentiel.
 * Un seul appel a la fois (pas de parallelisation).
 */
export async function generate(options: GenerateOptions): Promise<GenerateResult> {
  const { system, user, maxTokens = 4096, temperature = 0.7 } = options

  let lastError: Error | null = null

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await getClient().messages.create({
        model: MODEL,
        max_tokens: maxTokens,
        temperature,
        system,
        messages: [{ role: "user", content: user }],
      })

      const textBlock = response.content.find((block) => block.type === "text")
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("No text content in Claude response")
      }

      const result: GenerateResult = {
        content: textBlock.text,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        model: response.model,
      }

      // Log token usage pour suivi des couts
      console.log(
        `[Claude] model=${result.model} input=${result.inputTokens} output=${result.outputTokens} total=${result.inputTokens + result.outputTokens}`
      )

      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Ne pas retry sur les erreurs 4xx (sauf 429 rate limit)
      if (
        error instanceof Anthropic.APIError &&
        error.status !== undefined &&
        error.status >= 400 &&
        error.status < 500 &&
        error.status !== 429
      ) {
        throw lastError
      }

      // Backoff exponentiel avant retry
      if (attempt < MAX_RETRIES - 1) {
        const delay = RETRY_BASE_DELAY * Math.pow(2, attempt)
        console.warn(
          `[Claude] Attempt ${attempt + 1} failed, retrying in ${delay}ms: ${lastError.message}`
        )
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  throw new Error(
    `Claude API failed after ${MAX_RETRIES} attempts: ${lastError?.message}`
  )
}

/**
 * Appelle Claude et parse la reponse comme JSON.
 * Extrait automatiquement le JSON si la reponse contient du texte autour.
 */
export async function generateJSON<T>(options: GenerateOptions): Promise<{
  data: T
  inputTokens: number
  outputTokens: number
}> {
  // Forcer Claude à retourner du JSON pur (pas de backticks markdown)
  const jsonOptions = {
    ...options,
    system: options.system + "\n\nIMPORTANT: Retourne UNIQUEMENT du JSON brut. Pas de backticks markdown (```), pas de texte avant ou après. La réponse doit commencer par { et finir par }.",
  }
  const result = await generate(jsonOptions)

  // Tenter d'extraire le JSON de la reponse
  let jsonStr = result.content.trim()

  // Stripper les backticks markdown (```json ... ``` ou ``` ... ```)
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*\n?([\s\S]*?)```/)
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim()
  }

  // Si la reponse contient du texte autour du JSON, extraire le bloc JSON
  const jsonMatch = jsonStr.match(/\{[\s\S]*\}/)
  if (jsonMatch) {
    jsonStr = jsonMatch[0]
  }

  try {
    const data = JSON.parse(jsonStr) as T
    return {
      data,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
    }
  } catch {
    throw new Error(
      `Failed to parse Claude response as JSON. Raw content: ${result.content.slice(0, 500)}`
    )
  }
}

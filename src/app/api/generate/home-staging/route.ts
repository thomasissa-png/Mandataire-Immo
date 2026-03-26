import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { query } from "@/lib/db"
import { generateImage, buildHomeStagingPrompt } from "@/lib/openai"
import { uploadFile, getFileContent } from "@/lib/storage"
import { trackServer } from "@/lib/tracking"
import type { PropertyPage, StagingPhoto } from "@/types/property"

const MAX_IMAGES_PER_PROPERTY = 5

interface HomeStagingBody {
  property_page_id: string
  items: Array<{
    photo_key: string   // cle de la photo originale dans Object Storage
    piece: string       // "salon", "chambre", "cuisine", etc.
    style: string       // "moderne", "scandinave", "classique", etc.
  }>
}

/**
 * POST /api/generate/home-staging
 * Genere des visuels home staging a partir de photos uploadees.
 * Utilise gpt-image-1 (OpenAI). Max 5 images par bien.
 * Admin-only.
 */
export async function POST(request: NextRequest) {
  // ─── Auth ───────────────────────────────────────────────────────
  const user = await currentUser()
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user?.emailAddresses[0]?.emailAddress
  if (!userEmail || userEmail !== adminEmail) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
  }

  // ─── Parse body ─────────────────────────────────────────────────
  let body: HomeStagingBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { property_page_id, items } = body
  if (!property_page_id || !items || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "property_page_id et items (array non vide) sont requis" },
      { status: 400 }
    )
  }

  if (items.length > MAX_IMAGES_PER_PROPERTY) {
    return NextResponse.json(
      { error: `Maximum ${MAX_IMAGES_PER_PROPERTY} images par bien` },
      { status: 400 }
    )
  }

  // ─── Valider chaque item ────────────────────────────────────────
  for (const item of items) {
    if (!item.photo_key || !item.piece || !item.style) {
      return NextResponse.json(
        { error: "Chaque item doit avoir photo_key, piece et style" },
        { status: 400 }
      )
    }
  }

  // ─── Verifier que le bien existe ────────────────────────────────
  const { rows: propertyRows } = await query<PropertyPage>(
    "SELECT id, photos_staging FROM property_pages WHERE id = $1",
    [property_page_id]
  )
  if (propertyRows.length === 0) {
    return NextResponse.json({ error: "Bien non trouve" }, { status: 404 })
  }

  const existingStagingPhotos = (propertyRows[0].photos_staging || []) as StagingPhoto[]
  const totalAfter = existingStagingPhotos.length + items.length
  if (totalAfter > MAX_IMAGES_PER_PROPERTY) {
    return NextResponse.json(
      {
        error: `Ce bien a deja ${existingStagingPhotos.length} visuels. Maximum ${MAX_IMAGES_PER_PROPERTY} au total. Vous pouvez en ajouter ${MAX_IMAGES_PER_PROPERTY - existingStagingPhotos.length}.`,
      },
      { status: 400 }
    )
  }

  await trackServer("home_staging_started", userEmail, {
    property_page_id,
    items_count: items.length,
  })

  // ─── Generer les images une par une ─────────────────────────────
  const results: StagingPhoto[] = []
  const errors: Array<{ photo_key: string; error: string }> = []

  for (const item of items) {
    try {
      // Verifier que la photo originale existe
      const originalContent = await getFileContent(item.photo_key)
      if (!originalContent) {
        errors.push({ photo_key: item.photo_key, error: "Photo originale non trouvee" })
        continue
      }

      // Construire le prompt
      const prompt = buildHomeStagingPrompt({
        piece: item.piece,
        style: item.style,
      })

      // Generer l'image via OpenAI gpt-image-1
      const imageResult = await generateImage({
        prompt,
        size: "1024x1024",
        quality: "medium",
      })

      // Sauvegarder dans Object Storage
      const stagingKey = `properties/${property_page_id}/staging/${Date.now()}-${item.piece}-${item.style}.png`
      const imageBuffer = Buffer.from(imageResult.b64_json, "base64")
      await uploadFile(stagingKey, imageBuffer)

      const stagingPhoto: StagingPhoto = {
        key: stagingKey,
        url: `/api/images/${encodeURIComponent(stagingKey)}`,
        piece: item.piece,
        style: item.style,
        photo_originale_key: item.photo_key,
        ordre: existingStagingPhotos.length + results.length + 1,
      }

      results.push(stagingPhoto)

      console.log(
        `[Home Staging] Generated: ${item.piece} (${item.style}) -> ${stagingKey}`
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.error(`[Home Staging] Error for ${item.photo_key}:`, message)
      errors.push({ photo_key: item.photo_key, error: message })
    }
  }

  // ─── Mettre a jour la DB ────────────────────────────────────────
  if (results.length > 0) {
    const allStagingPhotos = [...existingStagingPhotos, ...results]
    await query(
      "UPDATE property_pages SET photos_staging = $1, updated_at = NOW() WHERE id = $2",
      [JSON.stringify(allStagingPhotos), property_page_id]
    )
  }

  await trackServer("home_staging_completed", userEmail, {
    property_page_id,
    generated: results.length,
    errors: errors.length,
  })

  return NextResponse.json({
    status: errors.length === 0 ? "completed" : "partial",
    generated: results.length,
    errors,
    staging_photos: results,
  })
}

/**
 * POST /api/biens/[id]/photos
 * Upload une photo pour un bien (base64).
 * Vérifie ownership, valide format/taille, stocke dans Object Storage,
 * ajoute au JSONB photos_originales.
 *
 * Rendu : SSR (mutation authentifiée)
 */

import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { uploadFile } from "@/lib/storage"
import type { PropertyPhoto } from "@/types/property"

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 Mo
const MAX_PHOTOS_PER_BIEN = 10
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
const EXT_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/heic": "heic",
  "image/heif": "heif",
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: propertyId } = await params

  // Auth
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  // Vérifier ownership
  const { rows: propertyRows } = await query<{
    client_id: string
    photos_originales: PropertyPhoto[] | null
  }>(
    "SELECT client_id, photos_originales FROM property_pages WHERE id = $1 LIMIT 1",
    [propertyId]
  )

  if (propertyRows.length === 0) {
    return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 })
  }

  if (propertyRows[0].client_id !== user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  // Vérifier la limite de photos
  const existingPhotos = propertyRows[0].photos_originales || []
  if (existingPhotos.length >= MAX_PHOTOS_PER_BIEN) {
    return NextResponse.json(
      { error: "Maximum 10 photos par bien" },
      { status: 409 }
    )
  }

  // Parser le body
  let body: { photo: string; piece?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide" }, { status: 400 })
  }

  if (!body.photo) {
    return NextResponse.json(
      { error: "Le champ \"photo\" est requis (base64)" },
      { status: 400 }
    )
  }

  // Extraire base64 et MIME type
  let base64Data = body.photo
  let mimeType = "image/jpeg"

  const dataUriMatch = base64Data.match(
    /^data:(image\/(jpeg|png|webp));base64,(.+)$/
  )
  if (dataUriMatch) {
    mimeType = dataUriMatch[1]
    base64Data = dataUriMatch[3]
  }

  // Valider le type MIME
  if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilise JPG, PNG ou WebP." },
      { status: 400 }
    )
  }

  // Décoder et vérifier la taille
  let buffer: Buffer
  try {
    buffer = Buffer.from(base64Data, "base64")
  } catch {
    return NextResponse.json(
      { error: "Données base64 invalides" },
      { status: 400 }
    )
  }

  if (buffer.length > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Cette photo dépasse 5 Mo — réduis sa taille avant upload." },
      { status: 400 }
    )
  }

  // Déterminer l'extension et construire la clé
  const ext = EXT_MAP[mimeType] || "jpg"
  const ordre = existingPhotos.length + 1
  const timestamp = Date.now()
  const key = `clients/${user.email}/biens/${propertyId}/${ordre}_${timestamp}.${ext}`

  // Upload vers Object Storage
  try {
    await uploadFile(key, buffer)
  } catch (err) {
    console.error(`[Photo upload] Erreur pour bien ${propertyId}:`, err)
    return NextResponse.json(
      { error: "Erreur lors de l'upload. Réessaie." },
      { status: 500 }
    )
  }

  // Construire l'objet photo
  const photo: PropertyPhoto = {
    key,
    url: `/api/photos/${key}`,
    piece: body.piece || "",
    ordre,
  }

  // Ajouter au JSONB photos_originales
  await query(
    `UPDATE property_pages
     SET photos_originales = COALESCE(photos_originales, '[]'::jsonb) || $1::jsonb,
         updated_at = NOW()
     WHERE id = $2`,
    [JSON.stringify([photo]), propertyId]
  )

  return NextResponse.json({ key, url: photo.url })
}

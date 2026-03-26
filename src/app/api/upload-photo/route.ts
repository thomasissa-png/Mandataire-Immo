import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { uploadFile } from "@/lib/storage"

const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  const user = await getSessionUser()

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: { photo: string; email: string }

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body.photo || !body.email) {
    return NextResponse.json(
      { error: "photo et email sont requis" },
      { status: 400 }
    )
  }

  // Valider que l'email correspond a l'utilisateur connecte
  if (body.email !== user.email) {
    return NextResponse.json({ error: "Email non autorisé" }, { status: 403 })
  }

  // Extraire le contenu base64 (supporte avec ou sans data URI prefix)
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
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
  if (!allowedTypes.includes(mimeType)) {
    return NextResponse.json(
      { error: "Format non supporté. Utilise JPG, PNG ou WebP." },
      { status: 400 }
    )
  }

  // Decoder et verifier la taille
  const buffer = Buffer.from(base64Data, "base64")
  if (buffer.length > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "La photo dépasse 5 Mo. Réduis sa taille et réessaie." },
      { status: 400 }
    )
  }

  // Determiner l'extension
  const extMap: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }
  const ext = extMap[mimeType] || "jpg"

  const key = `clients/${body.email}/photo.${ext}`

  try {
    await uploadFile(key, buffer)
  } catch (err) {
    console.error("Photo upload error:", err)
    return NextResponse.json(
      { error: "Erreur lors de l'upload. Réessaie." },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, key })
}

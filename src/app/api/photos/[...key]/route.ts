/**
 * GET /api/photos/[...key]
 * Proxy photos depuis Replit Object Storage.
 * - Biens publiés : accès public, cache immutable 1 an
 * - Biens draft : accès réservé au propriétaire (session auth)
 *
 * Rendu : SSR (données dynamiques, auth conditionnelle)
 */

import { NextRequest, NextResponse } from "next/server"
import { getFileContent } from "@/lib/storage"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"

const MIME_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key: keyParts } = await params
  const key = keyParts.join("/")

  if (!key) {
    return NextResponse.json({ error: "Clé de fichier manquante" }, { status: 400 })
  }

  // Déduire le Content-Type depuis l'extension
  const ext = key.split(".").pop()?.toLowerCase() || ""
  const contentType = MIME_TYPES[ext]

  if (!contentType) {
    return NextResponse.json(
      { error: "Format de fichier non supporté" },
      { status: 400 }
    )
  }

  // Vérifier si la photo appartient à un bien draft
  // Pattern de clé : clients/{email}/biens/{id}/{fichier}
  const bienMatch = key.match(/^clients\/[^/]+\/biens\/([^/]+)\//)
  if (bienMatch) {
    const propertyId = bienMatch[1]

    const { rows } = await query<{ status: string; client_id: string }>(
      "SELECT status, client_id FROM property_pages WHERE id = $1 LIMIT 1",
      [propertyId]
    )

    if (rows.length === 0) {
      return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 })
    }

    const property = rows[0]

    // Si le bien est en draft, vérifier que l'utilisateur est le propriétaire
    if (property.status === "draft") {
      const user = await getSessionUser()
      if (!user || user.id !== property.client_id) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
      }
    }
  }

  // Récupérer le contenu depuis Object Storage
  const content = await getFileContent(key)
  if (!content) {
    return NextResponse.json({ error: "Photo non trouvée" }, { status: 404 })
  }

  // Cache immutable pour biens publiés, pas de cache pour drafts
  const isPublished = bienMatch
    ? (await query<{ status: string }>(
        "SELECT status FROM property_pages WHERE id = $1 LIMIT 1",
        [bienMatch[1]]
      )).rows[0]?.status === "published"
    : false

  const cacheControl = isPublished
    ? "public, max-age=31536000, immutable"
    : "private, no-cache"

  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": cacheControl,
    },
  })
}

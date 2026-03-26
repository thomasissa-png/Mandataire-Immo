import { NextRequest, NextResponse } from "next/server"
import { getFileContent } from "@/lib/storage"

/**
 * GET /api/images/[key]
 * Sert une image depuis Replit Object Storage.
 * Le key est URL-encoded dans le path.
 * Cache: 1 an (images generees sont immuables).
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { key: string } }
) {
  const key = decodeURIComponent(params.key)

  // Securite : valider que le key cible un prefixe autorise
  const ALLOWED_PREFIXES = ["properties/"]
  const isAllowed = ALLOWED_PREFIXES.some((prefix) => key.startsWith(prefix))
  if (!isAllowed || key.includes("..") || key.includes("//")) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 })
  }

  const content = await getFileContent(key)
  if (!content) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 })
  }

  // Detecter le content-type depuis l'extension
  const ext = key.split(".").pop()?.toLowerCase()
  const contentTypes: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
  }
  const contentType = contentTypes[ext || ""] || "application/octet-stream"

  return new NextResponse(content as unknown as BodyInit, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Length": content.length.toString(),
    },
  })
}

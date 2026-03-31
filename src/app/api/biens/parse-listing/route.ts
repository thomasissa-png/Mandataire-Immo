/**
 * POST /api/biens/parse-listing
 * Scrape une annonce SeLoger, LeBonCoin ou Bien'ici pour pré-remplir le formulaire.
 * Retourne les infos extraites + les URLs de photos trouvées.
 */
import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import * as cheerio from "cheerio"

// ─── Types ──────────────────────────────────────────────────────────

interface ParsedListing {
  type_bien: string
  adresse: string
  prix: string
  surface: string
  pieces: string
  description: string
  points_forts: string
  photos: string[]
}

// ─── Détection plateforme ───────────────────────────────────────────

function detectPlatform(url: string): "seloger" | "leboncoin" | "bienici" | "unknown" {
  const host = new URL(url).hostname.toLowerCase()
  if (host.includes("seloger")) return "seloger"
  if (host.includes("leboncoin")) return "leboncoin"
  if (host.includes("bienici") || host.includes("bien-ici")) return "bienici"
  return "unknown"
}

// ─── Helpers ────────────────────────────────────────────────────────

function cleanText(text: string): string {
  return text.replace(/\s+/g, " ").trim()
}

function extractNumber(text: string): string {
  const match = text.replace(/\s/g, "").match(/[\d]+[.,]?[\d]*/)
  return match ? match[0].replace(",", ".") : ""
}

function detectTypeBien(text: string): string {
  const t = text.toLowerCase()
  if (t.includes("appartement")) return "Appartement"
  if (t.includes("maison")) return "Maison"
  if (t.includes("studio")) return "Studio"
  if (t.includes("terrain")) return "Terrain"
  if (t.includes("local commercial") || t.includes("commerce")) return "Local commercial"
  return ""
}

// ─── Parsers par plateforme ─────────────────────────────────────────

function parseSeLoger(html: string, $: cheerio.CheerioAPI): ParsedListing {
  const result: ParsedListing = {
    type_bien: "",
    adresse: "",
    prix: "",
    surface: "",
    pieces: "",
    description: "",
    points_forts: "",
    photos: [],
  }

  // Titre — contient souvent le type de bien
  const title = $("h1").first().text() || $('[data-test="detail-title"]').text()
  result.type_bien = detectTypeBien(title)

  // Prix
  const priceEl = $('[data-test="detail-price"]').text() || $(".detail-price").text() || $('[class*="Price"]').first().text()
  result.prix = extractNumber(priceEl)

  // Adresse
  result.adresse = cleanText(
    $('[data-test="detail-summary-city"]').text() ||
    $(".detail-summary__city").text() ||
    $('[class*="Localisation"]').first().text() ||
    ""
  )

  // Surface et pièces depuis les critères
  $('[data-test="detail-summary-criterion"], .detail-summary__criterion, [class*="Criterion"]').each((_, el) => {
    const text = $(el).text().toLowerCase()
    if (text.includes("m²") || text.includes("m2")) {
      result.surface = extractNumber(text)
    }
    if (text.includes("pièce") || text.includes("piece")) {
      result.pieces = extractNumber(text)
    }
  })

  // Fallback : chercher dans le titre
  if (!result.surface) {
    const surfMatch = title.match(/([\d]+)\s*m[²2]/i)
    if (surfMatch) result.surface = surfMatch[1]
  }
  if (!result.pieces) {
    const piecesMatch = title.match(/([\d]+)\s*pièce/i)
    if (piecesMatch) result.pieces = piecesMatch[1]
  }

  // Description
  const desc = $('[data-test="detail-description"] p, .detail-description p, [class*="Description"] p').first().text()
  result.description = cleanText(desc).slice(0, 500)

  // Photos — SeLoger utilise des images dans un carousel
  $('img[src*="ubiflow"], img[src*="seloger"], img[data-src], [class*="Carousel"] img, [class*="gallery"] img').each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src")
    if (src && src.startsWith("http") && !src.includes("logo") && !src.includes("icon")) {
      result.photos.push(src)
    }
  })

  // Fallback photos : og:image
  if (result.photos.length === 0) {
    const ogImage = $('meta[property="og:image"]').attr("content")
    if (ogImage) result.photos.push(ogImage)
  }

  return result
}

function parseLeBonCoin(html: string, $: cheerio.CheerioAPI): ParsedListing {
  const result: ParsedListing = {
    type_bien: "",
    adresse: "",
    prix: "",
    surface: "",
    pieces: "",
    description: "",
    points_forts: "",
    photos: [],
  }

  // Titre
  const title = $("h1").first().text() || $('[data-qa-id="adview_title"]').text()
  result.type_bien = detectTypeBien(title)

  // Prix
  const priceEl = $('[data-qa-id="adview_price"]').text() || $('[class*="Price"]').first().text()
  result.prix = extractNumber(priceEl)

  // Localisation
  result.adresse = cleanText(
    $('[data-qa-id="adview_location_informations"]').text() ||
    $('[class*="Location"]').first().text() ||
    ""
  )

  // Critères (surface, pièces)
  $('[data-qa-id="criteria_item"], [class*="criteria"] li, [class*="Criterion"]').each((_, el) => {
    const text = $(el).text().toLowerCase()
    if (text.includes("m²") || text.includes("m2") || text.includes("surface")) {
      const num = extractNumber(text)
      if (num) result.surface = num
    }
    if (text.includes("pièce") || text.includes("piece")) {
      const num = extractNumber(text)
      if (num) result.pieces = num
    }
    if (!result.type_bien && (text.includes("appartement") || text.includes("maison"))) {
      result.type_bien = detectTypeBien(text)
    }
  })

  // Description
  const desc = $('[data-qa-id="adview_description_container"]').text() || $('[class*="Description"]').first().text()
  result.description = cleanText(desc).slice(0, 500)

  // Photos
  $('[data-qa-id="adview_spotlight_container"] img, [class*="gallery"] img, [class*="Gallery"] img, [class*="Carousel"] img').each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src")
    if (src && src.startsWith("http") && !src.includes("logo") && !src.includes("icon") && !src.includes("avatar")) {
      result.photos.push(src)
    }
  })

  // Fallback : og:image
  if (result.photos.length === 0) {
    const ogImage = $('meta[property="og:image"]').attr("content")
    if (ogImage) result.photos.push(ogImage)
  }

  return result
}

function parseBienIci(html: string, $: cheerio.CheerioAPI): ParsedListing {
  const result: ParsedListing = {
    type_bien: "",
    adresse: "",
    prix: "",
    surface: "",
    pieces: "",
    description: "",
    points_forts: "",
    photos: [],
  }

  // Titre
  const title = $("h1").first().text()
  result.type_bien = detectTypeBien(title)

  // Prix
  const priceEl = $('[class*="price"], [class*="Price"]').first().text()
  result.prix = extractNumber(priceEl)

  // Adresse
  result.adresse = cleanText($('[class*="location"], [class*="Location"], [class*="city"]').first().text() || "")

  // Critères
  $('[class*="feature"], [class*="Feature"], [class*="detail-item"]').each((_, el) => {
    const text = $(el).text().toLowerCase()
    if (text.includes("m²") || text.includes("surface")) {
      result.surface = extractNumber(text)
    }
    if (text.includes("pièce")) {
      result.pieces = extractNumber(text)
    }
  })

  // Description
  const desc = $('[class*="description"], [class*="Description"]').first().text()
  result.description = cleanText(desc).slice(0, 500)

  // Photos
  $('[class*="gallery"] img, [class*="Gallery"] img, [class*="photo"] img, [class*="carousel"] img').each((_, el) => {
    const src = $(el).attr("data-src") || $(el).attr("src")
    if (src && src.startsWith("http") && !src.includes("logo") && !src.includes("icon")) {
      result.photos.push(src)
    }
  })

  if (result.photos.length === 0) {
    const ogImage = $('meta[property="og:image"]').attr("content")
    if (ogImage) result.photos.push(ogImage)
  }

  return result
}

// ─── Fallback : extraction générique par meta tags ──────────────────

function parseGeneric(html: string, $: cheerio.CheerioAPI): ParsedListing {
  const result: ParsedListing = {
    type_bien: "",
    adresse: "",
    prix: "",
    surface: "",
    pieces: "",
    description: "",
    points_forts: "",
    photos: [],
  }

  // OpenGraph / meta data
  const ogTitle = $('meta[property="og:title"]').attr("content") || $("title").text()
  const ogDesc = $('meta[property="og:description"]').attr("content") || $('meta[name="description"]').attr("content")

  if (ogTitle) result.type_bien = detectTypeBien(ogTitle)
  if (ogDesc) result.description = cleanText(ogDesc).slice(0, 500)

  // Prix depuis le texte de la page
  const bodyText = $("body").text()
  const priceMatch = bodyText.match(/([\d\s]{3,10})\s*€/)
  if (priceMatch) result.prix = extractNumber(priceMatch[1])

  // Surface
  const surfMatch = bodyText.match(/([\d]+(?:[.,][\d]+)?)\s*m[²2]/i)
  if (surfMatch) result.surface = extractNumber(surfMatch[1])

  // Pièces
  const piecesMatch = bodyText.match(/([\d]+)\s*pièce/i)
  if (piecesMatch) result.pieces = piecesMatch[1]

  // Photos og:image
  const ogImage = $('meta[property="og:image"]').attr("content")
  if (ogImage) result.photos.push(ogImage)

  return result
}

// ─── Téléchargement des photos → storage ────────────────────────────

async function downloadPhotos(photos: string[], clientEmail: string): Promise<string[]> {
  const { uploadFile } = await import("@/lib/storage")
  const savedKeys: string[] = []
  const maxPhotos = Math.min(photos.length, 10)

  for (let i = 0; i < maxPhotos; i++) {
    try {
      const response = await fetch(photos[i], {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; ImmoCrew/1.0)",
          "Accept": "image/*",
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) continue

      const contentType = response.headers.get("content-type") || ""
      if (!contentType.startsWith("image/")) continue

      const buffer = Buffer.from(await response.arrayBuffer())
      if (buffer.length < 1000) continue // Skip tiny images (icons, etc.)

      const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg"
      const key = `biens/${clientEmail}/import-${Date.now()}-${i}.${ext}`

      await uploadFile(key, buffer)
      savedKeys.push(key)
    } catch {
      // Skip failed downloads silently
      continue
    }
  }

  return savedKeys
}

// ─── Handler ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  let body: { url: string }
  try {
    body = (await request.json()) as { url: string }
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 })
  }

  const { url } = body
  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL manquante" }, { status: 400 })
  }

  // Validate URL
  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Protocol invalide")
    }
  } catch {
    return NextResponse.json({ error: "URL invalide" }, { status: 400 })
  }

  try {
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.5",
      },
      signal: AbortSignal.timeout(15000),
      redirect: "follow",
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Impossible de charger la page (${response.status}). Vérifie que le lien est accessible.` },
        { status: 422 }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)
    const platform = detectPlatform(url)

    // Parse selon la plateforme
    let parsed: ParsedListing
    switch (platform) {
      case "seloger":
        parsed = parseSeLoger(html, $)
        break
      case "leboncoin":
        parsed = parseLeBonCoin(html, $)
        break
      case "bienici":
        parsed = parseBienIci(html, $)
        break
      default:
        parsed = parseGeneric(html, $)
    }

    // Dédupliquer les photos
    parsed.photos = Array.from(new Set(parsed.photos))

    // Télécharger et stocker les photos
    let photoKeys: string[] = []
    if (parsed.photos.length > 0) {
      photoKeys = await downloadPhotos(parsed.photos, user.email)
    }

    return NextResponse.json({
      platform,
      listing: {
        type_bien: parsed.type_bien,
        adresse: parsed.adresse,
        prix: parsed.prix,
        surface: parsed.surface,
        pieces: parsed.pieces,
        description: parsed.description,
        points_forts: parsed.points_forts,
      },
      photos: photoKeys,
      photo_urls: parsed.photos.slice(0, 10),
    })
  } catch (err) {
    console.error("POST /api/biens/parse-listing error:", err)
    return NextResponse.json(
      { error: "Erreur lors de l'extraction des données. Le site est peut-être protégé ou indisponible." },
      { status: 500 }
    )
  }
}

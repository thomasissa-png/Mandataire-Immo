#!/usr/bin/env node
/**
 * Script de génération des favicons PNG à partir des sources SVG.
 *
 * Inputs :
 *   - src/app/icon.svg (32x32 logo compact)
 *   - src/app/apple-icon.svg (180x180 logo avec padding)
 *
 * Outputs (dans public/) :
 *   - favicon.ico (32x32)
 *   - favicon-16x16.png
 *   - favicon-32x32.png
 *   - apple-touch-icon.png (180x180)
 *   - android-chrome-192x192.png + icon-192x192.png (alias PWA)
 *   - android-chrome-512x512.png + icon-512x512.png (alias PWA)
 *   - mstile-150x150.png (fond plein #1B2A4A)
 *   - og-image.png (1200x630)
 *   - twitter-image.png (1200x600)
 *
 * Idempotent : relançable sans effet de bord (overwrite).
 */

import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import sharp from "sharp"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, "..")
const PUBLIC_DIR = path.join(ROOT, "public")

const BRAND = {
  primary: "#1B2A4A",
  accent: "#F27A1A",
  background: "#F8F6F2",
  name: "ImmoCrew",
  tagline: "Marketing digital pour mandataires immobiliers",
}

/**
 * Construit un SVG logo avec padding (pour favicon-32, favicon-16 etc.)
 * en se basant sur le design source. On ré-embed pour garantir un rendu
 * net quelle que soit la taille de sortie.
 */
function buildLogoSvg(size) {
  // Reproduit le design ImmoCrew : rond fond marine + maison orange
  // viewBox 180 pour rester proche de apple-icon.svg (meilleur rendu)
  const radius = 40
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="${size}" height="${size}">
  <rect width="180" height="180" rx="${radius}" fill="${BRAND.primary}"/>
  <path d="M45 124V79l45-34 45 34v45" stroke="${BRAND.accent}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M73 124v-28h34v28" stroke="${BRAND.accent}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
}

/**
 * Construit un SVG compact sans radius (pour petites tailles 16/32).
 */
function buildCompactLogoSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="${size}" height="${size}">
  <rect width="32" height="32" rx="6" fill="${BRAND.primary}"/>
  <path d="M8 22V14l8-6 8 6v8" stroke="${BRAND.accent}" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M13 22v-5h6v5" stroke="${BRAND.accent}" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`
}

/**
 * mstile 150x150 : fond plein marine, logo centré sans radius
 * (Windows utilise les coins natifs de la tile).
 */
function buildMstileSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 150 150" width="150" height="150">
  <rect width="150" height="150" fill="${BRAND.primary}"/>
  <g transform="translate(30, 30)">
    <path d="M8 68V38l30-22 30 22v30" stroke="${BRAND.accent}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="scale(1.3)"/>
    <path d="M24 68v-18h22v18" stroke="${BRAND.accent}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="scale(1.3)"/>
  </g>
</svg>`
}

/**
 * Template OG/Twitter : fond marine + bloc logo + titre + tagline
 * Dimensions : width x height (1200x630 pour OG, 1200x600 pour Twitter)
 */
function buildSocialCardSvg(width, height) {
  const logoSize = 140
  const logoX = 80
  const logoY = height / 2 - logoSize / 2 - 40
  const titleY = logoY + logoSize + 80
  const taglineY = titleY + 60

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${BRAND.primary}"/>
      <stop offset="100%" stop-color="#0F1B33"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#bg)"/>

  <!-- Accent bar gauche -->
  <rect x="0" y="0" width="12" height="${height}" fill="${BRAND.accent}"/>

  <!-- Logo ImmoCrew -->
  <g transform="translate(${logoX}, ${logoY})">
    <rect width="${logoSize}" height="${logoSize}" rx="28" fill="${BRAND.accent}"/>
    <g transform="translate(${logoSize / 2 - 45}, ${logoSize / 2 - 45}) scale(1.0)">
      <path d="M10 68V40l35-28 35 28v28" stroke="${BRAND.primary}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M32 68v-20h26v20" stroke="${BRAND.primary}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </g>

  <!-- Titre -->
  <text x="${logoX}" y="${titleY}" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif" font-size="84" font-weight="800" fill="#FFFFFF">${BRAND.name}</text>

  <!-- Tagline -->
  <text x="${logoX}" y="${taglineY}" font-family="system-ui, -apple-system, Helvetica, Arial, sans-serif" font-size="32" font-weight="500" fill="#F8F6F2" opacity="0.9">${BRAND.tagline}</text>

  <!-- Decoration : cercle orange en bas à droite -->
  <circle cx="${width - 120}" cy="${height - 120}" r="60" fill="${BRAND.accent}" opacity="0.15"/>
  <circle cx="${width - 180}" cy="${height - 80}" r="30" fill="${BRAND.accent}" opacity="0.25"/>
</svg>`
}

/**
 * Écrit un PNG depuis un SVG string.
 */
async function svgToPng(svgString, width, height, outputPath) {
  const buffer = Buffer.from(svgString)
  await sharp(buffer, { density: 384 })
    .resize(width, height, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(outputPath)
}

async function fileSize(filePath) {
  const stat = await fs.stat(filePath)
  return stat.size
}

async function main() {
  console.log("Génération des favicons ImmoCrew...")
  console.log(`Source : ${path.join(ROOT, "src/app/icon.svg")}`)
  console.log(`Output : ${PUBLIC_DIR}\n`)

  await fs.mkdir(PUBLIC_DIR, { recursive: true })

  const generated = []

  // 1. favicon-16x16.png (compact)
  {
    const out = path.join(PUBLIC_DIR, "favicon-16x16.png")
    await svgToPng(buildCompactLogoSvg(16), 16, 16, out)
    generated.push({ file: "favicon-16x16.png", size: await fileSize(out) })
  }

  // 2. favicon-32x32.png
  {
    const out = path.join(PUBLIC_DIR, "favicon-32x32.png")
    await svgToPng(buildCompactLogoSvg(32), 32, 32, out)
    generated.push({ file: "favicon-32x32.png", size: await fileSize(out) })
  }

  // 3. favicon.ico (32x32 PNG renommé — accepté par tous les navigateurs modernes)
  {
    const out = path.join(PUBLIC_DIR, "favicon.ico")
    const pngBuffer = await sharp(Buffer.from(buildCompactLogoSvg(32)), { density: 384 })
      .resize(32, 32, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer()
    await fs.writeFile(out, pngBuffer)
    generated.push({ file: "favicon.ico", size: await fileSize(out) })
  }

  // 4. apple-touch-icon.png (180x180)
  {
    const out = path.join(PUBLIC_DIR, "apple-touch-icon.png")
    await svgToPng(buildLogoSvg(180), 180, 180, out)
    generated.push({ file: "apple-touch-icon.png", size: await fileSize(out) })
  }

  // 5. android-chrome-192x192.png + icon-192x192.png (alias pour manifest)
  {
    const svg = buildLogoSvg(192)
    const out1 = path.join(PUBLIC_DIR, "android-chrome-192x192.png")
    await svgToPng(svg, 192, 192, out1)
    generated.push({ file: "android-chrome-192x192.png", size: await fileSize(out1) })

    const out2 = path.join(PUBLIC_DIR, "icon-192x192.png")
    await svgToPng(svg, 192, 192, out2)
    generated.push({ file: "icon-192x192.png", size: await fileSize(out2) })
  }

  // 6. android-chrome-512x512.png + icon-512x512.png
  {
    const svg = buildLogoSvg(512)
    const out1 = path.join(PUBLIC_DIR, "android-chrome-512x512.png")
    await svgToPng(svg, 512, 512, out1)
    generated.push({ file: "android-chrome-512x512.png", size: await fileSize(out1) })

    const out2 = path.join(PUBLIC_DIR, "icon-512x512.png")
    await svgToPng(svg, 512, 512, out2)
    generated.push({ file: "icon-512x512.png", size: await fileSize(out2) })
  }

  // 7. mstile-150x150.png
  {
    const out = path.join(PUBLIC_DIR, "mstile-150x150.png")
    await svgToPng(buildMstileSvg(), 150, 150, out)
    generated.push({ file: "mstile-150x150.png", size: await fileSize(out) })
  }

  // 8. og-image.png (1200x630)
  {
    const out = path.join(PUBLIC_DIR, "og-image.png")
    await svgToPng(buildSocialCardSvg(1200, 630), 1200, 630, out)
    generated.push({ file: "og-image.png", size: await fileSize(out) })
  }

  // 9. twitter-image.png (1200x600)
  {
    const out = path.join(PUBLIC_DIR, "twitter-image.png")
    await svgToPng(buildSocialCardSvg(1200, 600), 1200, 600, out)
    generated.push({ file: "twitter-image.png", size: await fileSize(out) })
  }

  // Résumé
  console.log("Fichiers générés :")
  console.log("─".repeat(60))
  for (const { file, size } of generated) {
    const sizeKb = (size / 1024).toFixed(1).padStart(7)
    console.log(`  ${file.padEnd(40)} ${sizeKb} KB`)
  }
  console.log("─".repeat(60))
  const total = generated.reduce((sum, g) => sum + g.size, 0)
  console.log(`Total : ${generated.length} fichiers, ${(total / 1024).toFixed(1)} KB\n`)
}

main().catch((err) => {
  console.error("Erreur génération favicons :", err)
  process.exit(1)
})

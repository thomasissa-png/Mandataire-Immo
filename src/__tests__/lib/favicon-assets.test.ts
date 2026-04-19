/**
 * Tests de présence des favicons, icônes et metadata SEO.
 *
 * Pourquoi ces tests existent :
 * Un site sans favicons/OG images perd en crédibilité (onglet navigateur vide,
 * partages LinkedIn/Twitter sans image, tiles Windows vides). Ces tests vérifient
 * que tous les assets requis existent et que les metadata sont complètes.
 *
 * Session 12 : création initiale.
 */

import { describe, test, expect, beforeAll } from "vitest"
import * as fs from "fs"
import * as path from "path"

const ROOT = path.resolve(__dirname, "../../..")

describe("Favicon & Assets — Fichiers requis", () => {
  const requiredFiles = [
    // Next.js App Router file-based metadata
    { path: "src/app/icon.svg", desc: "Favicon SVG principal" },
    { path: "src/app/apple-icon.tsx", desc: "Apple Touch Icon (PNG generator)" },
    { path: "src/app/opengraph-image.tsx", desc: "OG Image (1200x630 PNG generator)" },
    { path: "src/app/twitter-image.tsx", desc: "Twitter Card Image (1200x630 PNG generator)" },
    { path: "src/app/manifest.ts", desc: "PWA Web Manifest" },
    { path: "src/app/robots.ts", desc: "Robots.txt dynamique" },
    { path: "src/app/sitemap.ts", desc: "Sitemap XML dynamique" },

    // Public static assets
    { path: "public/browserconfig.xml", desc: "Windows/Bing tiles config" },
    { path: "public/safari-pinned-tab.svg", desc: "Safari pinned tab monochrome" },
  ]

  for (const file of requiredFiles) {
    test(`${file.desc} (${file.path}) existe`, () => {
      const fullPath = path.join(ROOT, file.path)
      expect(fs.existsSync(fullPath)).toBe(true)
    })
  }
})

describe("Favicon & Assets — Contenu metadata layout.tsx", () => {
  const layoutPath = path.join(ROOT, "src/app/layout.tsx")
  let layoutContent: string

  beforeAll(() => {
    layoutContent = fs.readFileSync(layoutPath, "utf-8")
  })

  test("layout.tsx existe", () => {
    expect(fs.existsSync(layoutPath)).toBe(true)
  })

  test("icons metadata présent", () => {
    expect(layoutContent).toContain("icons:")
    expect(layoutContent).toContain("icon.svg")
  })

  test("apple icon metadata présent", () => {
    expect(layoutContent).toContain("apple:")
    expect(layoutContent).toContain("apple-icon")
  })

  test("manifest reference présente", () => {
    expect(layoutContent).toContain("manifest:")
  })

  test("theme-color meta présent", () => {
    expect(layoutContent).toContain("theme-color")
    expect(layoutContent).toContain("#1B2A4A")
  })

  test("msapplication-TileColor présent", () => {
    expect(layoutContent).toContain("msapplication-TileColor")
  })

  test("msapplication-config présent", () => {
    expect(layoutContent).toContain("msapplication-config")
    expect(layoutContent).toContain("browserconfig.xml")
  })

  test("openGraph metadata présent", () => {
    expect(layoutContent).toContain("openGraph:")
    expect(layoutContent).toContain("fr_FR")
    expect(layoutContent).toContain("immocrew.fr")
  })

  test("twitter card metadata présent", () => {
    expect(layoutContent).toContain("twitter:")
    expect(layoutContent).toContain("summary_large_image")
  })

  test("JSON-LD Organization présent", () => {
    expect(layoutContent).toContain("Organization")
    expect(layoutContent).toContain("logo")
    expect(layoutContent).toContain("icon.svg")
  })

  test("safari-pinned-tab reference présente", () => {
    expect(layoutContent).toContain("mask-icon")
    expect(layoutContent).toContain("safari-pinned-tab.svg")
  })
})

describe("Favicon & Assets — Contenu manifest.ts", () => {
  const manifestPath = path.join(ROOT, "src/app/manifest.ts")
  let manifestContent: string

  beforeAll(() => {
    manifestContent = fs.readFileSync(manifestPath, "utf-8")
  })

  test("manifest.ts existe", () => {
    expect(fs.existsSync(manifestPath)).toBe(true)
  })

  test("contient les 3 formats d'icônes (SVG, 192, 512)", () => {
    expect(manifestContent).toContain("icon.svg")
    expect(manifestContent).toContain("icon-192x192.png")
    expect(manifestContent).toContain("icon-512x512.png")
  })

  test("theme_color ImmoCrew présent", () => {
    expect(manifestContent).toContain("#1B2A4A")
  })

  test("background_color ImmoCrew présent", () => {
    expect(manifestContent).toContain("#F8F6F2")
  })
})

describe("Favicon & Assets — browserconfig.xml valide", () => {
  const browserconfigPath = path.join(ROOT, "public/browserconfig.xml")
  let content: string

  beforeAll(() => {
    content = fs.readFileSync(browserconfigPath, "utf-8")
  })

  test("browserconfig.xml existe", () => {
    expect(fs.existsSync(browserconfigPath)).toBe(true)
  })

  test("contient TileColor ImmoCrew", () => {
    expect(content).toContain("#1B2A4A")
  })

  test("contient une référence d'icône tile", () => {
    expect(content).toContain("square150x150logo")
  })
})

describe("Favicon & Assets — safari-pinned-tab.svg monochrome", () => {
  const svgPath = path.join(ROOT, "public/safari-pinned-tab.svg")
  let content: string

  beforeAll(() => {
    content = fs.readFileSync(svgPath, "utf-8")
  })

  test("safari-pinned-tab.svg existe", () => {
    expect(fs.existsSync(svgPath)).toBe(true)
  })

  test("est monochrome (stroke #000 uniquement, pas de couleurs)", () => {
    // Safari pinned tab DOIT être monochrome (noir uniquement)
    expect(content).toContain('stroke="#000"')
    expect(content).not.toContain("#F27A1A")
    expect(content).not.toContain("#1B2A4A")
  })
})

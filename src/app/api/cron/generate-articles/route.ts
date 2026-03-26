import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { EDITORIAL_TOPICS } from "@/lib/editorial-calendar"
import { generateArticleFromTopic } from "@/lib/article-generator"

const ARTICLES_DIR = path.join(process.cwd(), "docs", "seo", "articles")

/**
 * GET /api/cron/generate-articles
 * Route cron protegee par CRON_SECRET.
 * Genere le prochain article planifie du calendrier editorial.
 * Appelee 2x/semaine par un cron externe (Replit ou cron-job.org).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret) {
    console.error("[cron/generate-articles] CRON_SECRET non configure")
    return NextResponse.json(
      { error: "CRON_SECRET non configure sur le serveur" },
      { status: 500 }
    )
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 401 })
  }

  // Trouver le prochain sujet a generer (par scan fichiers, pas etat memoire)
  const existingSlugs = getExistingSlugs()
  const nextTopic = EDITORIAL_TOPICS.find(
    (t) => t.statut === "planifie" && !existingSlugs.has(t.slug)
  )

  if (!nextTopic) {
    return NextResponse.json({
      success: true,
      message: "Aucun sujet planifie restant. Tous les articles sont generes ou publies.",
      generated: null,
    })
  }

  try {
    const result = await generateArticleFromTopic(nextTopic)

    // Persister le suivi
    updateTrackingFile(nextTopic.slug, result.filename)

    return NextResponse.json({
      success: true,
      message: `Article genere avec succes : ${result.title}`,
      generated: result,
    })
  } catch (err) {
    console.error("[cron/generate-articles] Error:", err)
    return NextResponse.json(
      {
        error: "Erreur lors de la generation",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

function getExistingSlugs(): Set<string> {
  try {
    const files = fs.readdirSync(ARTICLES_DIR).filter(
      (f: string) => f.startsWith("article-") && f.endsWith(".md")
    )
    const slugs = new Set<string>()
    for (const file of files) {
      const match = file.match(/^article-\d+-(.+)\.md$/)
      if (match) slugs.add(match[1])
    }
    return slugs
  } catch {
    return new Set()
  }
}

function updateTrackingFile(slug: string, filename: string) {
  const trackingPath = path.join(ARTICLES_DIR, "_generation-tracking.json")

  interface TrackingEntry {
    slug: string
    filename: string
    generated_at: string
  }

  let tracking: TrackingEntry[] = []
  try {
    const raw = fs.readFileSync(trackingPath, "utf-8")
    tracking = JSON.parse(raw)
  } catch {
    // Fichier inexistant — on repart de zero
  }

  tracking.push({
    slug,
    filename,
    generated_at: new Date().toISOString(),
  })

  fs.writeFileSync(trackingPath, JSON.stringify(tracking, null, 2), "utf-8")
}

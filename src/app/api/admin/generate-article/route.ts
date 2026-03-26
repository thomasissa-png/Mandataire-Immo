import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import {
  getNextPlannedTopic,
  getTopicByIndex,
} from "@/lib/editorial-calendar"
import { generateArticleFromTopic } from "@/lib/article-generator"

interface GenerateArticleBody {
  topic_index?: number
  auto?: boolean
}

/**
 * POST /api/admin/generate-article
 * Genere un article SEO depuis le calendrier editorial.
 * Accepte { auto: true } (prochain sujet planifie) ou { topic_index: N }.
 * Admin-only.
 */
export async function POST(request: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifie" }, { status: 401 })
  }

  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user.emailAddresses[0]?.emailAddress
  if (adminEmail && userEmail !== adminEmail) {
    return NextResponse.json({ error: "Non autorise" }, { status: 403 })
  }

  try {
    const body: GenerateArticleBody = await request.json()

    const topic = body.auto
      ? getNextPlannedTopic()
      : body.topic_index !== undefined
        ? getTopicByIndex(body.topic_index)
        : undefined

    if (!topic) {
      return NextResponse.json(
        {
          error: body.auto
            ? "Tous les sujets sont deja publies ou generes"
            : "Index de sujet invalide",
        },
        { status: 400 }
      )
    }

    const result = await generateArticleFromTopic(topic)

    return NextResponse.json(result)
  } catch (err) {
    console.error("[generate-article] Error:", err)
    return NextResponse.json(
      {
        error: "Erreur lors de la generation de l'article",
        details: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    )
  }
}

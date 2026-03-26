import { NextRequest, NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import fs from "fs"
import path from "path"
import { generateJSON } from "@/lib/claude"
import {
  EDITORIAL_TOPICS,
  getNextPlannedTopic,
  getTopicByIndex,
  getPublishedTitles,
} from "@/lib/editorial-calendar"
import type { EditorialTopic } from "@/lib/editorial-calendar"
import { invalidateArticleCache } from "@/lib/blog"

interface GenerateArticleBody {
  topic_index?: number
  auto?: boolean
}

interface ArticleGenerated {
  articles: Array<{
    frontmatter: {
      title: string
      meta_description: string
      slug: string
      mot_cle_principal: string
      mots_cles_secondaires: string[]
    }
    contenu_markdown: string
    liens_internes_suggeres: string[]
    nombre_mots: number
  }>
}

/**
 * POST /api/admin/generate-article
 * Genere un article SEO a partir du calendrier editorial.
 * Admin-only.
 */
export async function POST(request: NextRequest) {
  // Admin check
  const user = await currentUser()
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user?.emailAddresses[0]?.emailAddress
  if (!userEmail || userEmail !== adminEmail) {
    return NextResponse.json({ error: "Acces refuse" }, { status: 403 })
  }

  let body: GenerateArticleBody
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  // Determiner le sujet
  let topic: EditorialTopic | undefined

  if (body.auto) {
    topic = getNextPlannedTopic()
    if (!topic) {
      return NextResponse.json(
        { error: "Aucun sujet planifie disponible. Tous les sujets sont deja publies ou generes." },
        { status: 404 }
      )
    }
  } else if (body.topic_index !== undefined) {
    topic = getTopicByIndex(body.topic_index)
    if (!topic) {
      return NextResponse.json(
        { error: `Sujet introuvable a l'index ${body.topic_index}` },
        { status: 404 }
      )
    }
  } else {
    return NextResponse.json(
      { error: "Parametre requis : { auto: true } ou { topic_index: number }" },
      { status: 400 }
    )
  }

  try {
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

/**
 * Genere un article SEO a partir d'un sujet du calendrier editorial.
 * Utilise le prompt article-seo.ts adapte pour le blog ImmoCrew (pas pour un client).
 */
async function generateArticleFromTopic(topic: EditorialTopic) {
  const publishedTitles = getPublishedTitles()

  // Construire le prompt specifique au blog ImmoCrew
  const system = `Tu es un redacteur SEO specialise dans le marketing digital pour mandataires immobiliers en France. Tu rediges des articles de blog pour ImmoCrew, un service qui fournit du contenu marketing personnalise aux mandataires immobiliers independants pour 150 EUR/mois.

## Regles absolues
- Ecrire en francais, tutoyer le lecteur
- Zero jargon marketing inaccessible
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, les algorithmes
- Ne JAMAIS citer de concurrent par nom (pas de nom de marque concurrente)
- L'annee courante est 2026
- Chaque article fait entre 900 et 1200 mots
- Le mot-cle principal doit apparaitre dans le titre H1, le premier paragraphe, au moins 2 sous-titres H2, et dans la meta description
- Densite de mots-cles naturelle : 1-2% max. Pas de keyword stuffing
- Tutoie le lecteur (le mandataire immobilier)
- Le ton est expert mais accessible — un pro qui partage son savoir
- Inclure un CTA naturel en fin d'article vers ImmoCrew (150 EUR/mois, equipe marketing dediee)
- Le maillage interne : inserer 2-3 liens vers les articles deja publies du blog ImmoCrew (format markdown)

Articles deja publies sur le blog (pour le maillage interne) :
${publishedTitles.map((t, i) => `- Article ${i + 1} : "${t}"`).join("\n")}

STRUCTURE JSON DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide, sans texte avant ni apres :
{
  "articles": [
    {
      "frontmatter": {
        "title": "Titre H1 optimise SEO (50-65 caracteres)",
        "meta_description": "Meta description (max 155 caracteres)",
        "slug": "slug-url-optimise",
        "mot_cle_principal": "requete cible principale",
        "mots_cles_secondaires": ["requete 2", "requete 3"]
      },
      "contenu_markdown": "Article complet en Markdown avec titres H2/H3",
      "liens_internes_suggeres": ["Titre article lie 1", "Titre article lie 2"],
      "nombre_mots": 1050
    }
  ]
}`

  const userPrompt = `Redige 1 article SEO de 900-1200 mots pour le blog ImmoCrew.

SUJET :
- Titre prevu : ${topic.titre}
- Mot-cle principal : ${topic.mot_cle_principal}
- Mots-cles secondaires : ${topic.mots_cles_secondaires.join(", ")}
- Categorie : ${topic.categorie}
- Angle editorial : ${topic.angle}

CONTEXTE IMMOCREW :
- ImmoCrew est une equipe marketing dediee aux mandataires immobiliers independants
- Prix : 150 EUR/mois pour 12 posts/mois, 4 scripts video, 2 articles SEO, 1 newsletter, 4 annonces personnalisees
- Cible : mandataires chez IAD, SAFTI, Capifrance qui n'ont ni le temps ni les competences marketing
- Promesse : tout le contenu est personnalise (zone geo, biens, ton) — pas des templates generiques
- Le CTA final doit etre naturel et pointer vers ImmoCrew comme solution

CONSIGNES :
- L'article s'adresse aux mandataires immobiliers (pas aux acheteurs/vendeurs)
- Apporter une vraie valeur : conseils actionnables, pas du remplissage
- Varier la structure : listes, paragraphes, sous-titres, exemples concrets
- Inserer 2-3 liens internes vers les articles deja publies du blog
- Le slug doit etre : ${topic.slug}`

  const { data, inputTokens, outputTokens } =
    await generateJSON<ArticleGenerated>({
      system,
      user: userPrompt,
      maxTokens: 4096,
      temperature: 0.7,
    })

  if (!data.articles || data.articles.length === 0) {
    throw new Error("Aucun article genere dans la reponse")
  }

  const article = data.articles[0]

  // Determiner le numero du prochain article
  const articlesDir = path.join(process.cwd(), "docs", "seo", "articles")
  const existingFiles = fs
    .readdirSync(articlesDir)
    .filter((f: string) => f.startsWith("article-") && f.endsWith(".md"))
  const nextNumber = existingFiles.length + 1

  // Construire le contenu markdown avec frontmatter
  const today = new Date().toISOString().split("T")[0]
  const readingMinutes = Math.max(3, Math.ceil(article.nombre_mots / 200))

  const markdownContent = `# ${article.frontmatter.title}

> Meta description : ${article.frontmatter.meta_description}
> Mot-cle principal : ${article.frontmatter.mot_cle_principal}
> Mots-cles secondaires : ${article.frontmatter.mots_cles_secondaires.join(", ")}
> Temps de lecture : ${readingMinutes} min
> Date : ${today}
> Categorie : ${topic.categorie}

---

${article.contenu_markdown}`

  // Sauvegarder le fichier
  const filename = `article-${nextNumber}-${topic.slug}.md`
  const filePath = path.join(articlesDir, filename)
  fs.writeFileSync(filePath, markdownContent, "utf-8")

  // Invalider le cache du blog pour que le nouvel article soit servi
  invalidateArticleCache()

  // Mettre a jour le statut en memoire (pas persistant — le fichier editorial-calendar.ts n'est pas modifie)
  const topicIndex = EDITORIAL_TOPICS.findIndex(
    (t) => t.slug === topic.slug
  )
  if (topicIndex !== -1) {
    EDITORIAL_TOPICS[topicIndex].statut = "genere"
  }

  console.log(
    `[generate-article] Article genere : ${filename} (${inputTokens}+${outputTokens} tokens)`
  )

  return {
    success: true,
    filename,
    slug: topic.slug,
    title: article.frontmatter.title,
    meta_description: article.frontmatter.meta_description,
    category: topic.categorie,
    word_count: article.nombre_mots,
    tokens: { input: inputTokens, output: outputTokens },
    preview: article.contenu_markdown.slice(0, 300) + "...",
  }
}

/** Export pour appel interne depuis la route cron */
export { generateArticleFromTopic }

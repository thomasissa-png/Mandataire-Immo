import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { generateJSON } from "@/lib/claude"
import {
  EDITORIAL_TOPICS,
  getPublishedTitles,
} from "@/lib/editorial-calendar"
import type { EditorialTopic } from "@/lib/editorial-calendar"
import { invalidateArticleCache } from "@/lib/blog"

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

const ARTICLES_DIR = path.join(process.cwd(), "docs", "seo", "articles")

/**
 * GET /api/cron/generate-articles
 * Route cron protegee par CRON_SECRET.
 * Genere le prochain article planifie du calendrier editorial.
 * Appelee 2x/semaine par un cron externe (Replit ou cron-job.org).
 */
export async function GET(request: NextRequest) {
  // Verification du secret cron
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

  // Trouver le prochain sujet a generer
  // On verifie les fichiers deja existants pour determiner ce qui a ete genere
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
    const result = await generateArticleForCron(nextTopic)

    // Mettre a jour le statut JSON de suivi
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

/**
 * Retourne l'ensemble des slugs deja presents dans le dossier articles.
 */
function getExistingSlugs(): Set<string> {
  try {
    const files = fs.readdirSync(ARTICLES_DIR).filter(
      (f) => f.startsWith("article-") && f.endsWith(".md")
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

/**
 * Genere un article depuis le calendrier editorial (identique a la route admin).
 */
async function generateArticleForCron(topic: EditorialTopic) {
  const publishedTitles = getPublishedTitles()

  const system = `Tu es un redacteur SEO specialise dans le marketing digital pour mandataires immobiliers en France. Tu rediges des articles de blog pour ImmoCrew, un service qui fournit du contenu marketing personnalise aux mandataires immobiliers independants pour 150 EUR/mois.

## Regles absolues
- Ecrire en francais, tutoyer le lecteur
- Zero jargon marketing inaccessible
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, les algorithmes
- Ne JAMAIS citer de concurrent par nom (pas de nom de marque concurrente)
- L'annee courante est 2026
- Chaque article fait entre 900 et 1200 mots
- Le mot-cle principal doit apparaitre dans le titre H1, le premier paragraphe, au moins 2 sous-titres H2, et dans la meta description
- Densite de mots-cles naturelle : 1-2% max
- Tutoie le lecteur (le mandataire immobilier)
- Le ton est expert mais accessible
- Inclure un CTA naturel en fin d'article vers ImmoCrew (150 EUR/mois, equipe marketing dediee)
- Inserer 2-3 liens internes vers les articles deja publies du blog

Articles deja publies sur le blog (pour le maillage interne) :
${publishedTitles.map((t, i) => `- Article ${i + 1} : "${t}"`).join("\n")}

STRUCTURE JSON DE SORTIE :
Reponds UNIQUEMENT avec un JSON valide :
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
      "liens_internes_suggeres": ["Titre article lie 1"],
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
- Equipe marketing dediee aux mandataires immobiliers independants
- Prix : 150 EUR/mois pour 12 posts, 4 scripts video, 2 articles SEO, 1 newsletter, 4 annonces
- Cible : mandataires chez IAD, SAFTI, Capifrance
- Promesse : contenu 100% personnalise, pas des templates generiques
- Le CTA final pointe vers ImmoCrew comme solution

CONSIGNES :
- L'article s'adresse aux mandataires immobiliers
- Valeur actionnable, pas du remplissage
- Inserer 2-3 liens internes vers les articles existants
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

  // Determiner le numero
  const existingFiles = fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.startsWith("article-") && f.endsWith(".md"))
  const nextNumber = existingFiles.length + 1

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

  const filename = `article-${nextNumber}-${topic.slug}.md`
  const filePath = path.join(ARTICLES_DIR, filename)
  fs.writeFileSync(filePath, markdownContent, "utf-8")

  // Invalider le cache
  invalidateArticleCache()

  console.log(
    `[cron/generate-articles] Article genere : ${filename} (${inputTokens}+${outputTokens} tokens)`
  )

  return {
    filename,
    slug: topic.slug,
    title: article.frontmatter.title,
    meta_description: article.frontmatter.meta_description,
    category: topic.categorie,
    word_count: article.nombre_mots,
    tokens: { input: inputTokens, output: outputTokens },
  }
}

/**
 * Met a jour le fichier de suivi JSON pour persister les statuts entre les redemarrages.
 */
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
    // Fichier inexistant ou invalide — on repart de zero
  }

  tracking.push({
    slug,
    filename,
    generated_at: new Date().toISOString(),
  })

  fs.writeFileSync(trackingPath, JSON.stringify(tracking, null, 2), "utf-8")
}

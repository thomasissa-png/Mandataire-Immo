import fs from "fs"
import path from "path"
import { generateJSON } from "@/lib/claude"
import {
  EDITORIAL_TOPICS,
  getPublishedTitles,
} from "@/lib/editorial-calendar"
import type { EditorialTopic } from "@/lib/editorial-calendar"
import { invalidateArticleCache } from "@/lib/blog"
import { uploadFile } from "@/lib/storage"

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
 * Genere un article SEO a partir d'un sujet du calendrier editorial.
 * Utilise le prompt article-seo.ts adapte pour le blog ImmoCrew (pas pour un client).
 */
export async function generateArticleFromTopic(topic: EditorialTopic) {
  const publishedTitles = getPublishedTitles()

  const system = `Tu es un rédacteur SEO spécialisé dans le marketing digital pour mandataires immobiliers en France. Tu rédiges des articles de blog pour ImmoCrew, un service qui fournit du contenu marketing personnalisé aux mandataires immobiliers indépendants pour 150 EUR/mois.

## Règles absolues
- Écrire en français, tutoyer le lecteur
- Zéro jargon marketing inaccessible
- L'IA est INVISIBLE : ne jamais mentionner l'IA, l'intelligence artificielle, les algorithmes
- Ne JAMAIS citer de concurrent par nom (pas de nom de marque concurrente)
- L'année courante est 2026
- Chaque article fait entre 900 et 1200 mots
- Le mot-clé principal doit apparaître dans le titre H1, le premier paragraphe, au moins 2 sous-titres H2, et dans la meta description
- Densité de mots-clés naturelle : 1-2% max. Pas de keyword stuffing
- Tutoie le lecteur (le mandataire immobilier)
- Le ton est expert mais accessible — un pro qui partage son savoir
- Inclure un CTA naturel en fin d'article vers ImmoCrew (150 EUR/mois, équipe marketing dédiée)
- Le maillage interne : insérer 2-3 liens vers les articles déjà publiés du blog ImmoCrew (format markdown)

Articles déjà publiés sur le blog (pour le maillage interne) :
${publishedTitles.map((t, i) => `- Article ${i + 1} : "${t}"`).join("\n")}

STRUCTURE JSON DE SORTIE :
Réponds UNIQUEMENT avec un JSON valide, sans texte avant ni après :
{
  "articles": [
    {
      "frontmatter": {
        "title": "Titre H1 optimisé SEO (50-65 caractères)",
        "meta_description": "Meta description (max 155 caractères)",
        "slug": "slug-url-optimisé",
        "mot_cle_principal": "requête cible principale",
        "mots_cles_secondaires": ["requête 2", "requête 3"]
      },
      "contenu_markdown": "Article complet en Markdown avec titres H2/H3",
      "liens_internes_suggeres": ["Titre article lié 1", "Titre article lié 2"],
      "nombre_mots": 1050
    }
  ]
}`

  const userPrompt = `Rédige 1 article SEO de 900-1200 mots pour le blog ImmoCrew.

SUJET :
- Titre prévu : ${topic.titre}
- Mot-clé principal : ${topic.mot_cle_principal}
- Mots-clés secondaires : ${topic.mots_cles_secondaires.join(", ")}
- Catégorie : ${topic.categorie}
- Angle éditorial : ${topic.angle}

CONTEXTE IMMOCREW :
- ImmoCrew est une équipe marketing dédiée aux mandataires immobiliers indépendants
- Prix : 150 EUR/mois pour 12 posts/mois, 4 scripts vidéo, 4 articles SEO, 1 newsletter, 4 annonces personnalisées
- Cible : mandataires chez IAD, SAFTI, Capifrance qui n'ont ni le temps ni les compétences marketing
- Promesse : tout le contenu est personnalisé (zone géo, biens, ton) — pas des templates génériques
- Le CTA final doit être naturel et pointer vers ImmoCrew comme solution

CONSIGNES :
- L'article s'adresse aux mandataires immobiliers (pas aux acheteurs/vendeurs)
- Apporter une vraie valeur : conseils actionnables, pas du remplissage
- Varier la structure : listes, paragraphes, sous-titres, exemples concrets
- Insérer 2-3 liens internes vers les articles déjà publiés du blog
- Le slug doit être : ${topic.slug}`

  const { data, inputTokens, outputTokens } =
    await generateJSON<ArticleGenerated>({
      system,
      user: userPrompt,
      maxTokens: 4096,
      temperature: 0.7,
    })

  if (!data.articles || data.articles.length === 0) {
    throw new Error("Aucun article généré dans la réponse")
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
> Mot-clé principal : ${article.frontmatter.mot_cle_principal}
> Mots-clés secondaires : ${article.frontmatter.mots_cles_secondaires.join(", ")}
> Temps de lecture : ${readingMinutes} min
> Date : ${today}
> Catégorie : ${topic.categorie}

---

${article.contenu_markdown}`

  // Sauvegarder le fichier (filesystem + Object Storage pour persistance)
  const filename = `article-${nextNumber}-${topic.slug}.md`
  const filePath = path.join(articlesDir, filename)
  fs.writeFileSync(filePath, markdownContent, "utf-8")

  // Persister dans Object Storage (survit aux redeploiements)
  try {
    await uploadFile(`blog/articles/${filename}`, markdownContent)
    console.log(`[generate-article] Persisted to Object Storage: blog/articles/${filename}`)
  } catch (storageErr) {
    console.error("[generate-article] Object Storage upload failed:", storageErr)
  }

  // Invalider le cache du blog pour que le nouvel article soit servi
  invalidateArticleCache()

  // Mettre a jour le statut en memoire
  const topicIndex = EDITORIAL_TOPICS.findIndex(
    (t) => t.slug === topic.slug
  )
  if (topicIndex !== -1) {
    EDITORIAL_TOPICS[topicIndex].statut = "genere"
  }

  console.log(
    `[generate-article] Article généré : ${filename} (${inputTokens}+${outputTokens} tokens)`
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

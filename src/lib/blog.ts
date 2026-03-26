import fs from "fs"
import path from "path"

export interface Article {
  slug: string
  title: string
  description: string
  content: string
  date: string
  readingTime: string
  category: string
  metaTitle: string
  metaDescription: string
  keywords: string[]
}

interface ArticleMeta {
  slug: string
  file: string
  date: string
  category: string
}

const ARTICLE_MAP: ArticleMeta[] = [
  {
    slug: "comment-rediger-annonce-immobiliere",
    file: "article-1-annonce.md",
    date: "2026-03-20",
    category: "Annonces",
  },
  {
    slug: "calendrier-editorial-agent-immobilier",
    file: "article-2-calendrier.md",
    date: "2026-03-21",
    category: "Strat\u00E9gie",
  },
  {
    slug: "se-differencier-mandataire-immobilier",
    file: "article-3-differencier.md",
    date: "2026-03-22",
    category: "Strat\u00E9gie",
  },
  {
    slug: "google-business-profile-mandataire",
    file: "article-4-google-business.md",
    date: "2026-03-23",
    category: "SEO local",
  },
  {
    slug: "marketing-digital-mandataire-immobilier",
    file: "article-5-marketing-digital.md",
    date: "2026-03-25",
    category: "Marketing digital",
  },
]

/**
 * Convert simple markdown to HTML.
 * Handles: h2, h3, paragraphs, bold, links, lists, blockquotes, hrs.
 */
function markdownToHtml(md: string): string {
  const lines = md.split("\n")
  const html: string[] = []
  let inList = false
  let listType: "ul" | "ol" = "ul"

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      if (inList) {
        html.push(listType === "ul" ? "</ul>" : "</ol>")
        inList = false
      }
      continue
    }

    // Skip horizontal rules
    if (trimmed === "---") continue

    // H2
    if (trimmed.startsWith("## ")) {
      if (inList) { html.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false }
      html.push(`<h2>${formatInline(trimmed.slice(3))}</h2>`)
      continue
    }

    // H3
    if (trimmed.startsWith("### ")) {
      if (inList) { html.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false }
      html.push(`<h3>${formatInline(trimmed.slice(4))}</h3>`)
      continue
    }

    // Unordered list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { html.push("<ul>"); inList = true; listType = "ul" }
      html.push(`<li>${formatInline(trimmed.slice(2))}</li>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) { html.push("<ol>"); inList = true; listType = "ol" }
      html.push(`<li>${formatInline(trimmed.replace(/^\d+\.\s/, ""))}</li>`)
      continue
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      if (inList) { html.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false }
      html.push(`<blockquote><p>${formatInline(trimmed.slice(2))}</p></blockquote>`)
      continue
    }

    // Regular paragraph
    if (inList) { html.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false }
    html.push(`<p>${formatInline(trimmed)}</p>`)
  }

  if (inList) html.push(listType === "ul" ? "</ul>" : "</ol>")
  return html.join("\n")
}

/** Format inline markdown: bold, italic, links */
function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
}

function parseArticle(meta: ArticleMeta): Article {
  const filePath = path.join(process.cwd(), "docs", "seo", "articles", meta.file)
  const raw = fs.readFileSync(filePath, "utf-8")

  // Extract frontmatter from > lines
  const lines = raw.split("\n")
  let title = ""
  let metaDescription = ""
  let keywords: string[] = []
  let readingTime = "5 min"
  let contentStart = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line.startsWith("# ") && !title) {
      title = line.slice(2)
      continue
    }
    if (line.startsWith("> Meta description :")) {
      metaDescription = line.replace("> Meta description :", "").trim()
      continue
    }
    if (line.startsWith("> Mots-cl\u00E9s secondaires :") || line.startsWith("> Mots-cles secondaires :")) {
      keywords = line.replace(/> Mots-cl[eé]s secondaires\s*:\s*/i, "").split(",").map((k) => k.trim())
      continue
    }
    if (line.startsWith("> Temps de lecture :")) {
      readingTime = line.replace("> Temps de lecture :", "").trim()
      continue
    }
    if (line === "---" && i > 5) {
      contentStart = i + 1
      break
    }
  }

  const contentMd = lines.slice(contentStart).join("\n")
  const content = markdownToHtml(contentMd)

  return {
    slug: meta.slug,
    title,
    description: metaDescription,
    content,
    date: meta.date,
    readingTime,
    category: meta.category,
    metaTitle: `${title} | ImmoCrew`,
    metaDescription,
    keywords,
  }
}

let _cache: Article[] | null = null

export function getAllArticles(): Article[] {
  if (_cache) return _cache
  _cache = ARTICLE_MAP.map(parseArticle).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  return _cache
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug)
}

export function getRelatedArticles(
  currentSlug: string,
  limit = 3
): Article[] {
  const current = getArticleBySlug(currentSlug)
  if (!current) return getAllArticles().slice(0, limit)

  const sameCategory = getAllArticles().filter(
    (a) => a.slug !== currentSlug && a.category === current.category
  )
  const others = getAllArticles()
    .filter((a) => a.slug !== currentSlug && a.category !== current.category)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return [...sameCategory, ...others].slice(0, limit)
}

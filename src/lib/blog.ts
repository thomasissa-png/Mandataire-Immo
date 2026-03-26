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

/**
 * Articles declares manuellement (legacy) — sert de fallback pour les metadonnees
 * date et category quand le fichier markdown ne les contient pas.
 */
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

const ARTICLES_DIR = path.join(process.cwd(), "docs", "seo", "articles")

let _restoredFromStorage = false

/**
 * Restaure les articles depuis Object Storage si le filesystem est vide
 * (cas redeploiement Replit — le filesystem ephemere est vide mais Object Storage persiste).
 */
async function restoreFromObjectStorage(): Promise<void> {
  if (_restoredFromStorage) return
  _restoredFromStorage = true

  try {
    const { storage } = await import("@/lib/storage")
    const result = await storage.list("blog/articles/")
    if (!result.ok || !result.value) return

    const keys = result.value.filter((k: { key: string }) => k.key.endsWith(".md"))
    if (keys.length === 0) return

    // Ensure directory exists
    if (!fs.existsSync(ARTICLES_DIR)) {
      fs.mkdirSync(ARTICLES_DIR, { recursive: true })
    }

    for (const { key } of keys) {
      const filename = key.replace("blog/articles/", "")
      const filePath = path.join(ARTICLES_DIR, filename)
      if (fs.existsSync(filePath)) continue // Already on filesystem

      const content = await storage.downloadAsBytes(key)
      if (content.ok) {
        fs.writeFileSync(filePath, content.value[0])
        console.log(`[blog] Restored from Object Storage: ${filename}`)
      }
    }
  } catch {
    // Object Storage not available — no-op
  }
}

/**
 * Scanne le dossier docs/seo/articles/ pour trouver tous les fichiers article-*.md.
 * Fusionne avec ARTICLE_MAP pour les metadonnees legacy.
 * Les nouveaux articles generes sont detectes automatiquement par leur nom de fichier.
 */
function discoverArticles(): ArticleMeta[] {
  const legacyByFile = new Map(ARTICLE_MAP.map((m) => [m.file, m]))

  let files: string[]
  try {
    files = fs
      .readdirSync(ARTICLES_DIR)
      .filter((f: string) => f.startsWith("article-") && f.endsWith(".md"))
      .sort()
  } catch {
    // Dossier introuvable — retourner la liste legacy
    return ARTICLE_MAP
  }

  const result: ArticleMeta[] = []

  for (const file of files) {
    const legacy = legacyByFile.get(file)
    if (legacy) {
      result.push(legacy)
      continue
    }

    // Nouveau fichier genere — extraire slug et date depuis le contenu
    const slug = extractSlugFromFilename(file)
    const filePath = path.join(ARTICLES_DIR, file)
    const raw = fs.readFileSync(filePath, "utf-8")
    const date = extractDateFromContent(raw, file)
    const category = extractCategoryFromContent(raw)

    result.push({ slug, file, date, category })
  }

  return result
}

/**
 * Extrait le slug depuis le nom de fichier.
 * Format attendu : article-{N}-{slug}.md
 */
function extractSlugFromFilename(filename: string): string {
  // article-6-instagram-mandataire-immobilier-guide.md -> instagram-mandataire-immobilier-guide
  const match = filename.match(/^article-\d+-(.+)\.md$/)
  if (match) return match[1]
  // Fallback : retirer l'extension
  return filename.replace(/\.md$/, "")
}

/**
 * Extrait la date depuis le contenu markdown (ligne "> Date : YYYY-MM-DD").
 * Fallback : date de modification du fichier.
 */
function extractDateFromContent(raw: string, filename: string): string {
  const dateMatch = raw.match(/^>\s*Date\s*:\s*(\d{4}-\d{2}-\d{2})/m)
  if (dateMatch) return dateMatch[1]

  // Fallback : utiliser la date de modification du fichier
  try {
    const stat = fs.statSync(path.join(ARTICLES_DIR, filename))
    return stat.mtime.toISOString().split("T")[0]
  } catch {
    return new Date().toISOString().split("T")[0]
  }
}

/**
 * Extrait la categorie depuis le contenu markdown (ligne "> Categorie : ...").
 * Fallback : "Blog"
 */
function extractCategoryFromContent(raw: string): string {
  const catMatch = raw.match(/^>\s*Cat[eé]gorie\s*:\s*(.+)/m)
  if (catMatch) return catMatch[1].trim()
  return "Blog"
}

/**
 * Convert simple markdown to HTML.
 * Handles: h2, h3, paragraphs, bold, links, lists, blockquotes, hrs, tables.
 */
function markdownToHtml(md: string): string {
  const lines = md.split("\n")
  const html: string[] = []
  let inList = false
  let listType: "ul" | "ol" = "ul"
  let inTable = false

  for (const line of lines) {
    const trimmed = line.trim()

    // Skip empty lines
    if (!trimmed) {
      if (inList) { html.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false }
      if (inTable) { html.push("</tbody></table>"); inTable = false }
      continue
    }

    // Skip horizontal rules
    if (trimmed === "---") continue

    // Table rows
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (/^\|[\s\-:|]+\|$/.test(trimmed)) continue // skip separator
      const cells = trimmed.split("|").filter((c) => c.trim() !== "").map((c) => formatInline(c.trim()))
      if (!inTable) {
        html.push('<table class="w-full text-body-sm border-collapse my-4"><thead><tr>')
        cells.forEach((c) => html.push(`<th class="border border-border px-3 py-2 text-left font-semibold bg-neutral-50">${c}</th>`))
        html.push("</tr></thead><tbody>")
        inTable = true
        continue
      }
      html.push("<tr>")
      cells.forEach((c) => html.push(`<td class="border border-border px-3 py-2">${c}</td>`))
      html.push("</tr>")
      continue
    }
    if (inTable) { html.push("</tbody></table>"); inTable = false }

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
  if (inTable) html.push("</tbody></table>")
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
  const filePath = path.join(ARTICLES_DIR, meta.file)
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
      keywords = line.replace(/> Mots-cl[eé]s secondaires\s*:\s*/i, "").split(",").map((k: string) => k.trim())
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

/** Invalide le cache — a appeler apres generation d'un nouvel article */
export function invalidateArticleCache(): void {
  _cache = null
}

export function getAllArticles(): Article[] {
  if (_cache) return _cache
  // Trigger async restore from Object Storage (fire-and-forget on first call)
  restoreFromObjectStorage().then(() => {
    // Re-discover after restore — invalidate cache to pick up restored files
    if (!_restoredFromStorage) return
    _cache = null
  }).catch(() => {})
  const metas = discoverArticles()
  _cache = metas.map(parseArticle).sort(
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

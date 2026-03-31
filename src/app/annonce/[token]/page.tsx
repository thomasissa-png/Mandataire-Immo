/**
 * Page publique d'annonce partagée — SSR sans authentification.
 * Accessible via /annonce/[token] où token = share_token du deliverable.
 * Rendu côté serveur pour SEO et partage social (og:title, og:description).
 */

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import Link from "next/link"

interface AnnonceRow {
  id: string
  title: string
  content: string
  metadata: Record<string, unknown>
  created_at: string
  client_email: string
}

interface PageProps {
  params: Promise<{ token: string }>
}

async function getAnnonceByToken(token: string): Promise<AnnonceRow | null> {
  const { rows } = await query<AnnonceRow>(
    `SELECT id, title, content, metadata, created_at, client_email
     FROM deliverables
     WHERE share_token = $1 AND type = 'annonce' AND status = 'delivered'
     LIMIT 1`,
    [token]
  )
  return rows[0] || null
}

/**
 * Extrait les premières lignes du contenu markdown comme description.
 */
function extractDescription(content: string): string {
  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#") && !l.startsWith("---"))
  const text = lines.slice(0, 3).join(" ")
  // Nettoyage markdown basique
  const clean = text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
  return clean.length > 160 ? clean.slice(0, 157) + "..." : clean
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params
  const annonce = await getAnnonceByToken(token)

  if (!annonce) {
    return { title: "Annonce introuvable — ImmoCrew" }
  }

  const description = extractDescription(annonce.content)

  return {
    title: `${annonce.title} — ImmoCrew`,
    description,
    openGraph: {
      title: annonce.title,
      description,
      type: "article",
      locale: "fr_FR",
      siteName: "ImmoCrew",
    },
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function AnnoncePublicPage({ params }: PageProps) {
  const { token } = await params
  const annonce = await getAnnonceByToken(token)

  if (!annonce) notFound()

  const formattedDate = new Date(annonce.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <main className="min-h-screen bg-[#F8F6F2]">
      {/* Header branded */}
      <header className="bg-[#1B2A4A] text-white">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <p className="text-[#F27A1A] font-semibold text-sm uppercase tracking-wider mb-3">
            Annonce immobilière
          </p>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {annonce.title}
          </h1>
          <p className="text-neutral-400 text-sm mt-3">
            Publiée le {formattedDate}
          </p>
        </div>
      </header>

      {/* Contenu de l'annonce */}
      <article className="max-w-3xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 md:p-10">
          <AnnonceContent content={annonce.content} />
        </div>
      </article>

      {/* Footer CTA */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <p className="text-neutral-500 text-sm mb-2">
            Annonce générée par
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#1B2A4A] font-bold text-lg hover:text-[#F27A1A] transition-colors"
          >
            <span className="text-[#F27A1A]">Immo</span>Crew
          </Link>
          <p className="text-neutral-400 text-xs mt-3">
            Ton équipe marketing immobilier, clé en main.
          </p>
        </div>
      </footer>
    </main>
  )
}

/**
 * Rendu du contenu markdown de l'annonce.
 * Réutilise la logique de markdownToHtml inline (server component, pas d'import client).
 */
function AnnonceContent({ content }: { content: string }) {
  const html = serverMarkdownToHtml(content)
  return (
    <div
      className="prose prose-lg max-w-none text-neutral-800
        prose-headings:text-[#1B2A4A] prose-headings:font-bold
        prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3
        prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-2
        prose-p:leading-relaxed prose-p:mb-4
        prose-strong:text-[#1B2A4A]
        prose-li:leading-relaxed
        prose-a:text-[#F27A1A] prose-a:no-underline hover:prose-a:underline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/**
 * Conversion markdown vers HTML côté serveur.
 * Volontairement inline pour éviter d'importer le module client.
 */
function serverMarkdownToHtml(md: string): string {
  const lines = md.split("\n")
  const html: string[] = []
  let inList = false
  let listType: "ul" | "ol" = "ul"

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed) {
      if (inList) {
        html.push(listType === "ul" ? "</ul>" : "</ol>")
        inList = false
      }
      continue
    }

    if (trimmed === "---") {
      html.push('<hr class="my-6 border-neutral-200" />')
      continue
    }

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
      if (!inList) {
        html.push('<ul class="list-disc list-inside space-y-1 my-3">')
        inList = true
        listType = "ul"
      }
      html.push(`<li>${formatInline(trimmed.slice(2))}</li>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        html.push('<ol class="list-decimal list-inside space-y-1 my-3">')
        inList = true
        listType = "ol"
      }
      html.push(`<li>${formatInline(trimmed.replace(/^\d+\.\s/, ""))}</li>`)
      continue
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      if (inList) { html.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false }
      html.push(`<blockquote class="border-l-4 border-[#F27A1A]/30 pl-4 my-4 text-neutral-600 italic"><p>${formatInline(trimmed.slice(2))}</p></blockquote>`)
      continue
    }

    // Paragraph
    if (inList) { html.push(listType === "ul" ? "</ul>" : "</ol>"); inList = false }
    html.push(`<p>${formatInline(trimmed)}</p>`)
  }

  if (inList) html.push(listType === "ul" ? "</ul>" : "</ol>")
  return sanitize(html.join("\n"))
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
}

function sanitize(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<script\b[^>]*\/?>/gi, "")
    .replace(/<(iframe|object|embed|form|input|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(iframe|object|embed|form|input|style)\b[^>]*\/?>/gi, "")
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, '$1=""')
}

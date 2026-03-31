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
  client_first_name: string | null
  client_last_name: string | null
  client_phone: string | null
}

interface PageProps {
  params: Promise<{ token: string }>
}

async function getAnnonceByToken(token: string): Promise<AnnonceRow | null> {
  const { rows } = await query<AnnonceRow>(
    `SELECT d.id, d.title, d.content, d.metadata, d.created_at,
            c.email AS client_email, c.first_name AS client_first_name,
            c.last_name AS client_last_name,
            (c.client_context->>'telephone')::text AS client_phone
     FROM deliverables d
     JOIN clients c ON d.client_id = c.id
     WHERE d.share_token = $1 AND d.type = 'annonce' AND d.status = 'delivered'
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

  const agentName = [annonce.client_first_name, annonce.client_last_name].filter(Boolean).join(" ")

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
          <div className="flex items-center gap-4 mt-3 text-sm text-neutral-400">
            <span>Publiée le {formattedDate}</span>
            {agentName && (
              <>
                <span aria-hidden="true">·</span>
                <span>Par {agentName}</span>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bouton contact mandataire */}
      {(annonce.client_phone || annonce.client_email) && (
        <div className="max-w-3xl mx-auto px-6 -mb-4 pt-6">
          <div className="flex items-center gap-3 flex-wrap">
            {annonce.client_phone && (
              <a
                href={`tel:${annonce.client_phone}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-bold text-sm hover:bg-secondary-600 transition-all shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Appeler {agentName || "le mandataire"}
              </a>
            )}
            <a
              href={`mailto:${annonce.client_email}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              Envoyer un email
            </a>
          </div>
        </div>
      )}

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
            Annonce{agentName ? ` de ${agentName},` : ""} générée par
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

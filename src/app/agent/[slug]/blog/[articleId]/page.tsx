/**
 * Page article publique sur le blog du mandataire — /agent/[slug]/blog/[articleId]
 * Accessible sans authentification. SEO indexable si la page mandataire l'est.
 */
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { markdownToHtml } from "@/lib/markdownRenderer"
import { JsonLd } from "@/components/JsonLd"

interface PageProps {
  params: Promise<{ slug: string; articleId: string }>
}

interface ArticleRow {
  id: string
  title: string
  content: string
  metadata: Record<string, unknown>
  created_at: string
  agent_prenom: string
  agent_nom: string
  agent_reseau: string | null
  agent_ville: string | null
  agent_slug: string
  agent_indexation: boolean
}

async function getArticle(slug: string, articleId: string): Promise<ArticleRow | null> {
  const { rows } = await query<ArticleRow>(
    `SELECT d.id, d.title, d.content, d.metadata, d.created_at,
            COALESCE(c.client_context->>'prenom', c.first_name, '') AS agent_prenom,
            COALESCE(c.client_context->>'nom', c.last_name, '') AS agent_nom,
            c.client_context->>'reseau' AS agent_reseau,
            c.client_context->>'ville' AS agent_ville,
            ap.slug AS agent_slug,
            ap.indexation AS agent_indexation
     FROM deliverables d
     JOIN clients c ON d.client_id = c.id
     JOIN agent_pages ap ON ap.client_id = c.id
     WHERE d.id = $1 AND ap.slug = $2 AND d.type = 'article_seo' AND d.status = 'delivered'
       AND ap.status IN ('active', 'frozen')
     LIMIT 1`,
    [articleId, slug]
  )
  return rows[0] || null
}

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://immocrew.fr"

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, articleId } = await params
  const article = await getArticle(slug, articleId)

  if (!article) return { title: "Article non trouvé" }

  const fullName = `${article.agent_prenom} ${article.agent_nom}`.trim()
  const description = typeof article.metadata?.meta_description === "string"
    ? article.metadata.meta_description
    : article.content.slice(0, 155).replace(/[#*\n]/g, " ").trim()

  const canonicalUrl = `${BASE_URL}/agent/${slug}/blog/${articleId}`

  const robots = article.agent_indexation
    ? { index: true, follow: true }
    : { index: false, follow: false }

  return {
    title: `${article.title} — ${fullName}`,
    description,
    robots,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      locale: "fr_FR",
      url: canonicalUrl,
      siteName: "ImmoCrew",
    },
  }
}

export default async function AgentBlogArticlePage({ params }: PageProps) {
  const { slug, articleId } = await params
  const article = await getArticle(slug, articleId)
  if (!article) notFound()

  const html = markdownToHtml(article.content)
  const formattedDate = new Date(article.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const fullName = `${article.agent_prenom} ${article.agent_nom}`.trim()

  const articleDescription = typeof article.metadata?.meta_description === "string"
    ? article.metadata.meta_description
    : article.content.slice(0, 155).replace(/[#*\n]/g, " ").trim()

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: articleDescription,
    datePublished: article.created_at,
    dateModified: article.created_at,
    url: `${BASE_URL}/agent/${slug}/blog/${articleId}`,
    author: {
      "@type": "Person",
      name: fullName,
      url: `${BASE_URL}/agent/${slug}`,
      ...(article.agent_reseau
        ? { jobTitle: `Mandataire immobilier ${article.agent_reseau}` }
        : { jobTitle: "Mandataire immobilier indépendant" }),
      ...(article.agent_ville
        ? {
            address: {
              "@type": "PostalAddress",
              addressLocality: article.agent_ville,
              addressCountry: "FR",
            },
          }
        : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "ImmoCrew",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/icon.svg`,
      },
    },
    inLanguage: "fr-FR",
    ...(article.agent_ville
      ? { about: { "@type": "Place", name: article.agent_ville } }
      : {}),
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <Header />
      <main className="min-h-screen bg-background">
        {/* Header article */}
        <section className="bg-primary text-white section-padding">
          <div className="container-immocrew max-w-3xl">
            <div className="flex items-center gap-2 text-caption text-neutral-300 mb-3">
              <a href={`/agent/${slug}`} className="hover:text-secondary transition-colors">
                {fullName}
              </a>
              <span aria-hidden="true">·</span>
              <time dateTime={String(article.created_at)}>{formattedDate}</time>
            </div>
            <h1 className="text-display-lg tablet:text-display-xl text-white">
              {article.title}
            </h1>
            {article.agent_reseau && (
              <p className="text-body-sm text-neutral-300 mt-3">
                Par {fullName}, mandataire {article.agent_reseau}
                {article.agent_ville ? ` à ${article.agent_ville}` : ""}
              </p>
            )}
          </div>
        </section>

        {/* Contenu article */}
        <section className="section-padding">
          <div className="container-immocrew max-w-3xl">
            <article
              className="prose prose-lg max-w-none text-foreground
                prose-headings:text-primary prose-headings:font-display prose-headings:font-bold
                prose-h2:text-h2 prose-h2:mt-8 prose-h2:mb-3
                prose-h3:text-h3 prose-h3:mt-6 prose-h3:mb-2
                prose-p:leading-relaxed prose-p:mb-4
                prose-strong:text-primary
                prose-a:text-secondary prose-a:no-underline hover:prose-a:underline
                prose-li:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </section>

        {/* CTA contact mandataire */}
        <section className="section-padding bg-card border-t border-border">
          <div className="container-immocrew max-w-3xl text-center">
            <p className="font-display text-h3 text-primary mb-2">
              Un projet immobilier {article.agent_ville ? `à ${article.agent_ville}` : ""} ?
            </p>
            <p className="text-body text-neutral-500 mb-6">
              {fullName} est disponible pour répondre à tes questions.
            </p>
            <a
              href={`/agent/${slug}#contact`}
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-white font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md transition-all"
            >
              Contacter {article.agent_prenom}
            </a>
          </div>
        </section>

        {/* Retour page mandataire */}
        <div className="container-immocrew max-w-3xl py-6">
          <a
            href={`/agent/${slug}`}
            className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-secondary-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Retour au profil de {article.agent_prenom}
          </a>
        </div>
      </main>
      <Footer />
    </>
  )
}

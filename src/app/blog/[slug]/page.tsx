import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { JsonLd } from "@/components/JsonLd"
import { CTAButton } from "@/components/landing/CTAButton"
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/blog"
import { CategoryIcon, getCategoryStyle } from "@/components/blog/ArticleCover"
import { ArticleHeroImage } from "@/components/blog/ArticleHeroImage"
import { PACK_MENSUEL, formatPrice } from "@/lib/pricing"

interface BlogArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return { title: "Article introuvable" }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://immocrew.fr"

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `${baseUrl}/blog/${article.slug}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.date,
      authors: ["ImmoCrew"],
      url: `${baseUrl}/blog/${article.slug}`,
      images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  }
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    return notFound()
  }

  const relatedArticles = getRelatedArticles(slug, 3)
  const baseUrl = "https://immocrew.fr"
  const articleUrl = `${baseUrl}/blog/${article.slug}`

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: `${baseUrl}/og-image.jpg`,
    datePublished: article.date,
    dateModified: article.date,
    author: {
      "@type": "Organization",
      name: "ImmoCrew",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "ImmoCrew",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${baseUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: articleUrl,
      },
    ],
  }

  // Social share URLs
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`
  const shareTwitter = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(article.title)}`

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <Header />
      <main className="bg-background min-h-screen">
        <article className="section-padding">
          <div className="container-immocrew max-w-3xl">
            {/* Breadcrumb */}
            <nav
              aria-label="Fil d'Ariane"
              className="mb-8 flex items-center gap-2 text-caption text-neutral-500"
            >
              <Link
                href="/"
                className="hover:text-secondary transition-colors duration-normal"
              >
                Accueil
              </Link>
              <span aria-hidden="true">&gt;</span>
              <Link
                href="/blog"
                className="hover:text-secondary transition-colors duration-normal"
              >
                Blog
              </Link>
              <span aria-hidden="true">&gt;</span>
              <span className="text-foreground truncate max-w-[200px] tablet:max-w-none">
                {article.title}
              </span>
            </nav>

            {/* Article header — contenu d'abord, image après */}
            <header className="mb-8">
              <div className="flex items-center gap-3 text-caption text-neutral-500 mb-4">
                <span className="bg-primary-50 text-primary px-3 py-1 rounded-full font-medium text-caption">
                  {article.category}
                </span>
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span aria-hidden="true">&middot;</span>
                <span>{article.readingTime} de lecture</span>
              </div>

              <h1 className="font-display text-display-lg font-bold text-foreground leading-tight">
                {article.title}
              </h1>

              <p className="mt-4 text-body-lg text-neutral-500">
                {article.description}
              </p>
            </header>

            {/* Hero image — uniquement pour les articles géolocalisés, compact sur mobile */}
            <ArticleHeroImage
              title={article.title}
              slug={article.slug}
              category={article.category}
            />

            {/* Article content */}
            <div
              className="prose-immocrew"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Social share */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-body font-semibold text-foreground mb-4">
                Partager cet article
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={shareLinkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 min-w-[44px] px-4 rounded-lg border border-border text-body-sm font-medium text-foreground hover:bg-primary-50 hover:border-primary-200 transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                >
                  LinkedIn
                </a>
                <a
                  href={shareFacebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 min-w-[44px] px-4 rounded-lg border border-border text-body-sm font-medium text-foreground hover:bg-primary-50 hover:border-primary-200 transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                >
                  Facebook
                </a>
                <a
                  href={shareTwitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center h-11 min-w-[44px] px-4 rounded-lg border border-border text-body-sm font-medium text-foreground hover:bg-primary-50 hover:border-primary-200 transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                >
                  Twitter
                </a>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 p-8 bg-primary-50 rounded-xl text-center">
              <p className="font-display text-h3 font-bold text-foreground mb-2">
                Tu veux que ton marketing soit fait pour toi ?
              </p>
              <p className="text-body text-neutral-500 mb-6">
                Posts, articles SEO, annonces storytelling — 100% personnalisés
                pour ta zone. À partir de {formatPrice(PACK_MENSUEL)}.
              </p>
              <CTAButton
                href="/#pricing"
                label="Découvre ImmoCrew →"
                location="blog_article_cta"
                variant="primary"
                className="w-full tablet:w-auto"
              />
            </div>
          </div>
        </article>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <section className="section-padding border-t border-border">
            <div className="container-immocrew max-w-3xl">
              <h2 className="font-display text-h2 font-bold text-foreground mb-8">
                Articles similaires
              </h2>
              <div className="grid grid-cols-1 tablet:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className={`group flex gap-3 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-normal p-4 border-l-4 ${getCategoryStyle(related.category).border}`}
                  >
                    <CategoryIcon category={related.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-caption text-neutral-500 mb-1">
                        {related.readingTime} de lecture
                      </p>
                      <h3 className="font-display text-body font-semibold text-foreground group-hover:text-secondary transition-colors duration-normal line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

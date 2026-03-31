import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { getAllArticles } from "@/lib/blog"
import { BlogGrid } from "@/components/blog/BlogGrid"

export const metadata: Metadata = {
  title: "Blog ImmoCrew — Marketing et SEO pour mandataires immobiliers",
  description:
    "Conseils concrets de marketing digital pour mandataires immobiliers indépendants : réseaux sociaux, SEO local, annonces, personal branding. Gratuit.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog ImmoCrew — Marketing et SEO pour mandataires immobiliers",
    description:
      "Guides pratiques pour ta présence digitale : posts, annonces, SEO local, Google Business Profile.",
    url: "/blog",
    type: "website",
  },
}

export default function BlogPage() {
  const articles = getAllArticles()

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        {/* Hero section */}
        <section className="section-padding border-b border-border">
          <div className="container-immocrew">
            <div className="max-w-2xl">
              <h1 className="font-display text-h1 desktop:text-display-lg font-bold text-primary">
                Le marketing immobilier, sans les prises de tête
              </h1>
              <p className="mt-3 text-body-lg text-neutral-500">
                Guides pratiques pour ta présence digitale : posts, annonces, SEO local, personal branding.
              </p>
              <p className="mt-2 text-body-sm text-neutral-400">
                {articles.length} guides gratuits · Mis à jour chaque mois
              </p>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="section-padding">
          <div className="container-immocrew">
            <BlogGrid
              articles={articles.map((a) => ({
                slug: a.slug,
                title: a.title,
                description: a.description,
                date: a.date,
                readingTime: a.readingTime,
                category: a.category,
              }))}
            />
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding border-t border-border">
          <div className="container-immocrew text-center">
            <p className="font-display text-h2 font-bold text-primary mb-3">
              Tu veux que quelqu&apos;un le fasse à ta place ?
            </p>
            <p className="text-body-lg text-neutral-500 mb-6 max-w-lg mx-auto">
              Posts, articles SEO, annonces storytelling — 100% personnalisés pour ta zone. À partir de 150&nbsp;€/mois.
            </p>
            <Link
              href="/#pricing"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-white font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
            >
              Découvrir les offres
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

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
          <div className="container-immocrew max-w-4xl">
            <div className="max-w-2xl">
              <h1 className="font-display text-h1 desktop:text-display-lg font-bold text-primary">
                Le marketing immobilier, sans les prises de tête
              </h1>
              <p className="mt-3 text-body-lg text-neutral-500">
                Des conseils concrets écrits pour les mandataires — pas pour les agences de com&apos;.
              </p>
              <p className="mt-2 text-body-sm text-neutral-400">
                Nouveaux guides chaque mois · 100% gratuit
              </p>
            </div>
          </div>
        </section>

        {/* Articles */}
        <section className="section-padding">
          <div className="container-immocrew max-w-4xl">
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

        {/* CTA — contextualisé pour les visiteurs blog (pas direct pricing) */}
        <section className="section-padding border-t border-border">
          <div className="container-immocrew text-center max-w-xl mx-auto">
            <p className="font-display text-h2 font-bold text-primary mb-3">
              Tu veux que quelqu&apos;un le fasse à ta place ?
            </p>
            <p className="text-body-lg text-neutral-500 mb-3">
              Ces articles, ces posts, ces annonces — on les produit chaque semaine pour des mandataires comme toi. 100% personnalisés pour ta zone.
            </p>
            <p className="text-body-sm text-neutral-400 mb-6">
              3 posts/semaine, 1 article SEO, 1 script vidéo, 1 newsletter — prêts à publier. Tu copies, tu colles, tu retournes faire ton métier.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-white font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
            >
              Découvrir ImmoCrew
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

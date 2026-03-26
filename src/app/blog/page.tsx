import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { getAllArticles } from "@/lib/blog"

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
      "Guides pratiques pour votre présence digitale : posts, annonces, SEO local, Google Business Profile.",
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
          <div className="container-immocrew text-center">
            <h1 className="font-display text-display-lg font-bold text-foreground">
              Blog
            </h1>
            <p className="mt-3 text-body-lg text-neutral-500 max-w-2xl mx-auto">
              Conseils marketing pour mandataires immobiliers
            </p>
          </div>
        </section>

        {/* Articles grid */}
        <section className="section-padding">
          <div className="container-immocrew">
            <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-6 desktop:gap-8">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group flex flex-col bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow duration-normal overflow-hidden"
                >
                  {/* Image placeholder */}
                  <div className="aspect-[16/9] bg-primary-50 flex items-center justify-center">
                    <span className="text-primary-200 text-caption font-medium uppercase tracking-widest">
                      {article.category}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-5 desktop:p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-caption text-neutral-500 mb-3">
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

                    {/* Title */}
                    <h2 className="font-display text-h4 font-semibold text-foreground group-hover:text-secondary transition-colors duration-normal mb-2">
                      {article.title}
                    </h2>

                    {/* Description */}
                    <p className="text-body-sm text-neutral-500 line-clamp-3 flex-1">
                      {article.description}
                    </p>

                    {/* Read more */}
                    <span className="mt-4 text-body-sm font-semibold text-secondary group-hover:underline">
                      Lire l&apos;article &rarr;
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

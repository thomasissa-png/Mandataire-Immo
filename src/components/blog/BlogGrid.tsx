"use client"

import { useState, useMemo, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { CategoryIcon, getCategoryStyle } from "./ArticleCover"
import { CategoryFilter } from "./CategoryFilter"
import { getArticleThumbnail } from "@/lib/city-image"

interface BlogArticle {
  slug: string
  title: string
  description: string
  date: string
  readingTime: string
  category: string
}

interface BlogGridProps {
  articles: BlogArticle[]
}

export function BlogGrid({ articles }: BlogGridProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const cats = new Set(articles.map((a) => a.category))
    return Array.from(cats).sort()
  }, [articles])

  const handleFilter = useCallback((cat: string | null) => {
    setActiveCategory(cat)
  }, [])

  const filtered = activeCategory
    ? articles.filter((a) => a.category === activeCategory)
    : articles

  const isNew = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    return diff < 14 * 24 * 60 * 60 * 1000
  }

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  return (
    <>
      {/* Category filter pills */}
      <div className="mb-6">
        <CategoryFilter categories={categories} onFilter={handleFilter} />
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-8">
          <p className="text-body text-neutral-500">
            Aucun article dans cette catégorie pour l&apos;instant — d&apos;autres arrivent prochainement.
          </p>
        </div>
      )}

      {/* Grid uniforme — 2 colonnes, cards identiques avec thumbnail */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {filtered.map((article) => {
            const catStyle = getCategoryStyle(article.category)
            const thumb = getArticleThumbnail(article.title, article.slug, article.category)
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`group flex bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-normal overflow-hidden border-l-4 ${catStyle.border}`}
              >
                {/* Thumbnail — photo de ville ou icône catégorie */}
                {thumb.type === "city" ? (
                  <div className="relative w-[100px] min-h-[100px] flex-shrink-0">
                    <Image
                      src={thumb.url}
                      alt={thumb.alt}
                      fill
                      className="object-cover"
                      sizes="100px"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-[80px] min-h-[100px] flex-shrink-0 bg-neutral-50">
                    <CategoryIcon category={article.category} size="sm" />
                  </div>
                )}

                <div className="flex flex-col flex-1 min-w-0 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-caption text-neutral-500 mb-1">
                    {isNew(article.date) && (
                      <span className="px-2 py-0.5 rounded bg-success-50 text-success-800 text-caption font-semibold">
                        Nouveau
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 text-caption font-medium">
                      {article.category}
                    </span>
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                    <span aria-hidden="true">&middot;</span>
                    <span>{article.readingTime}</span>
                  </div>

                  <h2 className="font-display text-body font-semibold text-foreground group-hover:text-secondary transition-colors duration-normal mb-1 line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-body-sm text-neutral-500 line-clamp-2 flex-1">
                    {article.description}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

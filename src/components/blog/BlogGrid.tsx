"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { CategoryIcon, getCategoryStyle } from "./ArticleCover"
import { CategoryFilter } from "./CategoryFilter"

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

  const [featured, ...rest] = filtered

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
      {!featured && (
        <div className="text-center py-12">
          <p className="text-body text-neutral-500">
            Aucun article dans cette catégorie pour l&apos;instant — d&apos;autres arrivent prochainement.
          </p>
        </div>
      )}

      {/* Featured article — compact horizontal card with left accent */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className={`group flex bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-normal overflow-hidden mb-6 border-l-4 ${getCategoryStyle(featured.category).border}`}
        >
          <div className="flex flex-col justify-center p-5 tablet:p-6 flex-1">
            <div className="flex items-center gap-3 text-caption text-neutral-500 mb-2">
              {isNew(featured.date) && (
                <span className="px-2 py-0.5 rounded bg-success-50 text-success-800 text-caption font-semibold">
                  Nouveau
                </span>
              )}
              <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 text-caption font-medium">
                {featured.category}
              </span>
              <time dateTime={featured.date}>{formatDate(featured.date)}</time>
              <span aria-hidden="true">&middot;</span>
              <span>{featured.readingTime} de lecture</span>
            </div>
            <h2 className="font-display text-h3 font-semibold text-foreground group-hover:text-secondary transition-colors duration-normal mb-2">
              {featured.title}
            </h2>
            <p className="text-body-sm text-neutral-500 line-clamp-2 mb-3">
              {featured.description}
            </p>
            <span className="text-body-sm font-semibold text-secondary group-hover:underline">
              Lire l&apos;article &rarr;
            </span>
          </div>
          <div className="hidden tablet:flex items-center pr-6">
            <CategoryIcon category={featured.category} size="md" />
          </div>
        </Link>
      )}

      {/* Grid — 2 columns, compact cards without large covers */}
      {rest.length > 0 && (
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
          {rest.map((article) => {
            const catStyle = getCategoryStyle(article.category)
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`group flex gap-4 bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-normal p-4 border-l-4 ${catStyle.border}`}
              >
                <CategoryIcon category={article.category} size="sm" />

                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-caption text-neutral-500 mb-1">
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

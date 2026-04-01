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
            Aucun article dans cette catégorie pour l&apos;instant.
          </p>
          {activeCategory && (
            <button
              type="button"
              onClick={() => handleFilter(null)}
              className="mt-3 text-body-sm text-secondary-700 font-semibold hover:underline"
            >
              Voir tous les articles
            </button>
          )}
        </div>
      )}

      {/* Grid — cards verticales (thumbnail en haut, texte en bas) */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {filtered.map((article) => {
            const catStyle = getCategoryStyle(article.category)
            const thumb = getArticleThumbnail(article.title, article.slug, article.category)
            return (
              <Link
                key={article.slug}
                href={`/blog/${article.slug}`}
                className={`group flex flex-col h-full bg-white rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow duration-normal overflow-hidden border-l-4 ${catStyle.border}`}
              >
                {/* Thumbnail — pleine largeur en haut */}
                {thumb.type === "city" ? (
                  <div className="relative w-full aspect-[16/9]">
                    <Image
                      src={thumb.url}
                      alt={thumb.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />
                    {thumb.cityName && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/50 rounded-md px-2 py-0.5">
                        <svg className="w-3 h-3 text-white/90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-white/90 text-caption font-medium">{thumb.cityName}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-full h-[100px] bg-neutral-50">
                    <CategoryIcon category={article.category} size="md" />
                  </div>
                )}

                {/* Texte */}
                <div className="flex flex-col flex-1 p-4">
                  <div className="flex flex-wrap items-center gap-2 text-caption text-neutral-500 mb-2">
                    {isNew(article.date) && (
                      <span className="px-2 py-0.5 rounded bg-success-100 text-success-900 text-caption font-semibold">
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

                  <h2 className="font-display text-body font-semibold text-foreground group-hover:text-secondary transition-colors duration-normal mb-2 line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-body-sm text-neutral-500 line-clamp-2 flex-1">
                    {article.description}
                  </p>

                  <span className="text-body-sm font-semibold text-secondary mt-3 group-hover:underline">
                    Lire l&apos;article →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}

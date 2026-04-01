"use client"

import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import type { Deliverable } from "@/types/deliverable"

interface ArticlesFilteredProps {
  articles: Deliverable[]
}

export function ArticlesFiltered({ articles }: ArticlesFilteredProps) {
  return (
    <FilteredPageWrapper deliverables={articles} showArchiveToggle>
      {(filtered) =>
        filtered.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-8 text-center">
            <p className="text-body text-neutral-500">
              Aucun article pour cette période — change de mois ou vérifie tes filtres.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => {
              const isArchived = d.status === "archived"
              return (
                <article
                  key={d.id}
                  className={`rounded-lg bg-card border border-border border-l-4 border-l-info p-4 ${isArchived ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-base" aria-hidden="true">📝</span>
                        <span className="px-2 py-0.5 rounded-full text-caption font-semibold bg-info-50 text-info-700">
                          Article SEO
                        </span>
                        {d.status === "draft" && (
                          <span className="px-2 py-0.5 rounded-full text-caption font-semibold bg-warning-50 text-warning-800">
                            En préparation
                          </span>
                        )}
                        {isArchived && (
                          <span className="px-2 py-0.5 rounded-full text-caption font-semibold bg-neutral-200 text-neutral-600">
                            Archivé
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-h4 text-primary leading-snug">
                        {d.title}
                      </h3>
                    </div>

                    {/* CTA : lire l'article dans le dashboard */}
                    {d.status === "delivered" && (
                      <a
                        href={`/dashboard/articles/${d.id}`}
                        className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-lg bg-secondary-50 text-secondary-700 text-body-sm font-semibold hover:bg-secondary-100 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Lire l{"'"}article
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )
      }
    </FilteredPageWrapper>
  )
}

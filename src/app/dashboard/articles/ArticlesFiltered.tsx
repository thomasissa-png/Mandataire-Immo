"use client"

import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
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
            {/* Conseil publication */}
            <div className="rounded-lg bg-info-50 border border-info-200 p-3 mb-1">
              <p className="text-caption text-info-700">
                <span className="font-semibold">📝 Tes articles</span> sont publiés automatiquement sur ta page mandataire. Partage le lien sur LinkedIn pour plus de visibilité.
              </p>
            </div>

            {filtered.map((d) => (
              <div key={d.id}>
                <DeliverableCard
                  id={d.id}
                  type={d.type}
                  typeLabel="Article SEO"
                  typeColor="bg-info-50 text-info-700"
                  title={d.title}
                  status={d.status}
                  createdAt={d.created_at}
                />
                {/* Lien vers l'article complet */}
                {d.status === "delivered" && (
                  <div className="mt-1 ml-1">
                    <a
                      href={`/dashboard/articles/${d.id}`}
                      className="text-caption font-semibold text-secondary-700 hover:underline inline-flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Lire l{"'"}article en pleine page
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )
      }
    </FilteredPageWrapper>
  )
}

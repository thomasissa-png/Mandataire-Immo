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
            {filtered.map((d) => (
              <DeliverableCard
                key={d.id}
                id={d.id}
                type={d.type}
                typeLabel="Article local"
                typeColor="bg-blue-50 text-blue-700"
                title={d.title}
                status={d.status}
                createdAt={d.created_at}
              />
            ))}
          </div>
        )
      }
    </FilteredPageWrapper>
  )
}

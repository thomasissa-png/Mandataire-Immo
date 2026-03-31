"use client"

import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import type { Deliverable } from "@/types/deliverable"

interface ScriptsFilteredProps {
  scripts: Deliverable[]
}

export function ScriptsFiltered({ scripts }: ScriptsFilteredProps) {
  return (
    <FilteredPageWrapper deliverables={scripts} showArchiveToggle>
      {(filtered) =>
        filtered.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-8 text-center">
            <p className="text-body text-neutral-500">
              Aucun script pour le moment — tes premiers contenus arrivent bientôt.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => (
              <DeliverableCard
                key={d.id}
                id={d.id}
                type={d.type}
                typeLabel="Script vidéo"
                typeColor="bg-warning-50 text-warning-800"
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

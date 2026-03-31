"use client"

import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import { AnnonceList } from "@/components/dashboard/AnnonceList"
import type { Deliverable } from "@/types/deliverable"

interface AnnoncesFilteredProps {
  annonces: Deliverable[]
}

export function AnnoncesFiltered({ annonces }: AnnoncesFilteredProps) {
  return (
    <FilteredPageWrapper deliverables={annonces} showArchiveToggle>
      {(filtered, _showArchived, onArchiveToggle) =>
        filtered.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-8 text-center">
            <p className="text-body text-neutral-500">
              Aucune annonce pour le moment — tes premières annonces arrivent bientôt.
            </p>
          </div>
        ) : (
          <AnnonceList
            annonces={filtered.map((d) => ({
              id: d.id,
              title: d.title,
              status: d.status,
              createdAt: d.created_at,
            }))}
            onArchiveToggle={onArchiveToggle}
          />
        )
      }
    </FilteredPageWrapper>
  )
}

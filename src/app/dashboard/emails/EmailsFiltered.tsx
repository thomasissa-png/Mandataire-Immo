"use client"

import { FilteredPageWrapper } from "@/components/dashboard/FilteredPageWrapper"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import type { Deliverable } from "@/types/deliverable"

const TYPE_LABELS: Record<string, string> = {
  newsletter: "Newsletter",
  email_prospection: "Email prospection",
}

const TYPE_COLORS: Record<string, string> = {
  newsletter: "bg-primary-50 text-primary-700",
  email_prospection: "bg-error-50 text-error-700",
}

interface EmailsFilteredProps {
  emails: Deliverable[]
}

export function EmailsFiltered({ emails }: EmailsFilteredProps) {
  return (
    <FilteredPageWrapper deliverables={emails} showArchiveToggle>
      {(filtered) =>
        filtered.length === 0 ? (
          <div className="rounded-lg bg-card border border-border p-8 text-center">
            <p className="text-body text-neutral-500">
              Aucun email pour le moment — tes premiers contenus arrivent bientôt.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((d) => (
              <DeliverableCard
                key={d.id}
                id={d.id}
                type={d.type}
                typeLabel={TYPE_LABELS[d.type] || d.type}
                typeColor={TYPE_COLORS[d.type] || "bg-neutral-100 text-neutral-600"}
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

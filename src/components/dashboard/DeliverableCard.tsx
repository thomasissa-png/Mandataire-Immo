"use client"

import { track } from "@/lib/tracking"

interface DeliverableCardProps {
  id: string
  type: string
  typeLabel: string
  typeColor: string
  title: string
  content: string
  status?: "draft" | "delivered"
}

export function DeliverableCard({
  id,
  type,
  typeLabel,
  typeColor,
  title,
  content,
  status = "delivered",
}: DeliverableCardProps) {
  return (
    <div
      className="rounded-lg bg-card border border-border p-6 hover:shadow-md transition-shadow duration-normal cursor-pointer"
      onClick={() => {
        track("deliverable_view", {
          deliverable_id: id,
          type,
        })
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-caption font-semibold ${typeColor}`}
            >
              {typeLabel}
            </span>
            {status === "draft" && (
              <span className="inline-block px-2 py-0.5 rounded-full text-caption font-semibold bg-warning-50 text-warning-800">
                En preparation
              </span>
            )}
          </div>
          <h3 className="font-display text-h4 text-primary mb-2">{title}</h3>
          <p className="text-body-sm text-neutral-600 line-clamp-3">
            {content}
          </p>
          <button
            className="mt-3 text-body-sm text-secondary font-semibold hover:text-secondary-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(content)
              track("deliverable_download", {
                deliverable_id: id,
                type,
                method: "copy",
              })
            }}
          >
            Copier le texte
          </button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { track } from "@/lib/tracking"

interface DeliverableCardProps {
  id: string
  type: string
  typeLabel: string
  typeColor: string
  title: string
  content: string
}

export function DeliverableCard({
  id,
  type,
  typeLabel,
  typeColor,
  title,
  content,
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
          </div>
          <h3 className="font-display text-h4 text-primary mb-2">{title}</h3>
          <p className="text-body-sm text-neutral-600 line-clamp-3">
            {content}
          </p>
        </div>
      </div>
    </div>
  )
}

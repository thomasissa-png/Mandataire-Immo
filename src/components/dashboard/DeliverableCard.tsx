"use client"

import { useState } from "react"
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
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      track("deliverable_download", {
        deliverable_id: id,
        type,
        method: "copy",
      })
    })
  }

  return (
    <div
      role="article"
      className="w-full text-left rounded-xl bg-card border border-border p-6 hover:shadow-md hover:border-secondary/30 transition-all duration-normal cursor-pointer"
      onClick={() => {
        track("deliverable_view", {
          deliverable_id: id,
          type,
        })
        setExpanded(!expanded)
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
                En pr&eacute;paration &middot; livraison sous 24-48h
              </span>
            )}
          </div>
          <h3 className="font-display text-h4 text-primary mb-2">{title}</h3>
          <p className={`text-body-sm text-neutral-600 ${expanded ? "" : "line-clamp-3"}`}>
            {content}
          </p>
          <div className="flex items-center gap-4 mt-3">
            {status === "delivered" ? (
              <button
                type="button"
                aria-label={`Copier le texte : ${title}`}
                className="text-body-sm text-secondary font-semibold hover:text-secondary-600 transition-colors"
                onClick={handleCopy}
              >
                {copied ? "✓ Copié !" : "Copier le texte"}
              </button>
            ) : (
              <span className="text-body-sm text-neutral-400">
                Bientôt disponible
              </span>
            )}
            <button
              type="button"
              className="text-caption text-neutral-400 hover:text-secondary transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded(!expanded)
              }}
            >
              {expanded ? "Réduire" : "Lire en entier"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

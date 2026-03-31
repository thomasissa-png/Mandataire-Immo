"use client"

import { useEffect, useRef } from "react"
import type { Deliverable } from "@/types/deliverable"

const TYPE_LABELS: Record<string, string> = {
  post: "Post",
  article_seo: "Article SEO",
  annonce: "Annonce",
  script_video: "Script vidéo",
  newsletter: "Newsletter",
  email_prospection: "Email",
}

const TYPE_ICONS: Record<string, string> = {
  post: "📱",
  article_seo: "📝",
  annonce: "🏠",
  script_video: "🎬",
  newsletter: "📧",
  email_prospection: "📧",
}

const TYPE_BADGE_COLORS: Record<string, string> = {
  post: "bg-secondary-50 text-secondary-700",
  article_seo: "bg-primary-50 text-primary-700",
  annonce: "bg-warning-50 text-warning-700",
  script_video: "bg-success-50 text-success-700",
  newsletter: "bg-info-50 text-info-700",
  email_prospection: "bg-error-50 text-error-700",
}

interface CalendarDayPopoverProps {
  day: number
  month: number
  year: number
  deliverables: Deliverable[]
  onClose: () => void
  anchorRect: DOMRect | null
}

export function CalendarDayPopover({
  day,
  month,
  year,
  deliverables,
  onClose,
  anchorRect,
}: CalendarDayPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  const dateLabel = new Date(year, month, day).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  // Fermer au clic extérieur ou Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  // Focus trap basique
  useEffect(() => {
    popoverRef.current?.focus()
  }, [])

  // Position : mobile = bottom sheet style, desktop = positioned near anchor
  const positionStyle: React.CSSProperties = {}
  if (anchorRect) {
    const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1280
    if (viewportWidth >= 768) {
      // Desktop : positionner sous la cellule, centré
      positionStyle.position = "fixed"
      positionStyle.top = anchorRect.bottom + 8
      positionStyle.left = Math.max(16, Math.min(anchorRect.left, viewportWidth - 340))
      positionStyle.zIndex = 50
    }
  }

  return (
    <>
      {/* Overlay mobile */}
      <div
        className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40 tablet:bg-transparent tablet:backdrop-blur-none"
        aria-hidden="true"
        onClick={onClose}
      />

      <div
        ref={popoverRef}
        role="dialog"
        aria-label={`Contenus du ${dateLabel}`}
        tabIndex={-1}
        className="fixed bottom-0 left-0 right-0 tablet:bottom-auto tablet:left-auto tablet:right-auto tablet:w-[320px] bg-card rounded-t-xl tablet:rounded-xl border border-border shadow-lg z-50 max-h-[70vh] tablet:max-h-[400px] overflow-y-auto focus-visible:outline-none"
        style={positionStyle}
      >
        {/* Handle mobile */}
        <div className="flex justify-center pt-3 pb-1 tablet:hidden">
          <div className="w-10 h-1 rounded-full bg-neutral-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="font-display text-h5 text-primary capitalize">
            {dateLabel}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="p-1.5 rounded-lg text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Deliverables list */}
        <div className="p-4 space-y-3">
          {deliverables.length === 0 ? (
            <p className="text-body-sm text-neutral-400 text-center py-4">
              Rien de prévu ce jour-là
            </p>
          ) : (
            deliverables.map((d) => (
              <a
                key={d.id}
                href={`/dashboard/${getRouteForType(d.type)}`}
                className="block rounded-lg bg-background p-3 hover:bg-neutral-100 transition-colors group"
              >
                <div className="flex items-start gap-2.5">
                  <span className="text-base flex-shrink-0 mt-0.5" aria-hidden="true">
                    {TYPE_ICONS[d.type] || "📄"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-caption font-semibold mb-1 ${TYPE_BADGE_COLORS[d.type] || "bg-neutral-100 text-neutral-600"}`}
                    >
                      {TYPE_LABELS[d.type] || d.type}
                    </span>
                    <p className="text-body-sm text-primary font-medium truncate group-hover:text-secondary-700 transition-colors">
                      {d.title}
                    </p>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </>
  )
}

function getRouteForType(type: string): string {
  switch (type) {
    case "post": return "posts"
    case "article_seo": return "articles"
    case "annonce": return "annonces"
    case "script_video": return "scripts"
    case "newsletter": return "emails"
    case "email_prospection": return "emails"
    default: return "calendrier"
  }
}

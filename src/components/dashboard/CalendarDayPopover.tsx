"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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

        {/* Deliverables list with inline content expand */}
        <DeliverablesList deliverables={deliverables} />
      </div>
    </>
  )
}

function DeliverablesList({ deliverables }: { deliverables: Deliverable[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const loadContent = useCallback(async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    setContent(null)
    setLoading(true)
    try {
      const res = await fetch(`/api/deliverables/${id}`)
      if (res.ok) {
        const data = await res.json()
        setContent(data.content || "")
      }
    } catch {
      setContent("Impossible de charger le contenu.")
    } finally {
      setLoading(false)
    }
  }, [expandedId])

  const handleCopy = useCallback(async () => {
    if (!content) return
    // Strip markdown basique pour le copier-coller
    const plain = content
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/^#{1,3}\s+/gm, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    try {
      await navigator.clipboard.writeText(plain)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard API unavailable
    }
  }, [content])

  if (deliverables.length === 0) {
    return (
      <div className="p-4">
        <p className="text-body-sm text-neutral-400 text-center py-4">
          Rien de prévu ce jour-là
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-3">
      {deliverables.map((d) => (
        <div key={d.id} className="rounded-lg bg-background overflow-hidden">
          <button
            type="button"
            onClick={() => loadContent(d.id)}
            className="w-full text-left p-3 hover:bg-neutral-100 transition-colors group"
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
              <svg
                className={`w-4 h-4 text-neutral-400 flex-shrink-0 mt-1 transition-transform ${expandedId === d.id ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Expanded content */}
          {expandedId === d.id && (
            <div className="px-3 pb-3 border-t border-border">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
                </div>
              ) : content ? (
                <>
                  <div className="mt-3 text-body-sm text-neutral-700 whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                    {content}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-display font-bold text-body-sm transition-all ${
                      copied
                        ? "bg-success-50 text-success-700"
                        : "bg-secondary text-white hover:bg-secondary-600"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Copié !
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
                        Copier le texte
                      </>
                    )}
                  </button>
                </>
              ) : null}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

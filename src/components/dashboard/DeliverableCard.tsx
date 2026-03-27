"use client"

import { useState, useCallback } from "react"
import { track } from "@/lib/tracking"

interface DeliverableCardProps {
  id: string
  type: string
  typeLabel: string
  typeColor: string
  title: string
  content?: string
  status?: "draft" | "delivered"
}

export function DeliverableCard({
  id,
  type,
  typeLabel,
  typeColor,
  title,
  content: initialContent,
  status = "delivered",
}: DeliverableCardProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState<string | null>(initialContent ?? null)
  const [loadingContent, setLoadingContent] = useState(false)

  /** Charge le contenu complet depuis l'API si non disponible */
  const loadContent = useCallback(async () => {
    if (content !== null || loadingContent) return
    setLoadingContent(true)
    try {
      const res = await fetch(`/api/deliverables/${id}`)
      if (res.ok) {
        const data = await res.json()
        setContent(data.content ?? "")
      }
    } catch {
      // Silencieux : le contenu reste null, l'utilisateur peut réessayer
    } finally {
      setLoadingContent(false)
    }
  }, [id, content, loadingContent])

  const handleExpand = async () => {
    if (!expanded) {
      await loadContent()
      track("deliverable_view", {
        deliverable_id: id,
        type,
      })
    }
    setExpanded(!expanded)
  }

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation()
    await loadContent()
    if (content === null) return
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
      onClick={handleExpand}
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
                En pr&eacute;paration
              </span>
            )}
          </div>
          <h3 className="font-display text-h4 text-primary mb-2">{title}</h3>
          {loadingContent && (
            <p className="text-body-sm text-neutral-400">Chargement du contenu...</p>
          )}
          {content !== null && (
            <p className={`text-body-sm text-neutral-600 ${expanded ? "" : "line-clamp-3"}`}>
              {content}
            </p>
          )}
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
                handleExpand()
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

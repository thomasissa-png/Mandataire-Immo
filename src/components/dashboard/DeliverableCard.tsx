"use client"

import { useState, useCallback } from "react"
import { track } from "@/lib/tracking"
import { markdownToHtml, stripMarkdown } from "@/lib/markdownRenderer"

type DeliverableType =
  | "post"
  | "article_seo"
  | "annonce"
  | "script_video"
  | "newsletter"
  | "email_prospection"
  | "bio"
  | "brief_graphique"
  | "calendrier"
  | "positionnement"
  | "landing_page"

const TYPE_ACCENT_COLORS: Record<DeliverableType, string> = {
  post: "border-l-secondary",
  article_seo: "border-l-info",
  annonce: "border-l-success",
  script_video: "border-l-warning",
  newsletter: "border-l-primary-400",
  email_prospection: "border-l-error",
  bio: "border-l-secondary-300",
  brief_graphique: "border-l-neutral-400",
  calendrier: "border-l-warning-600",
  positionnement: "border-l-primary-300",
  landing_page: "border-l-success-400",
}

const TYPE_ICONS: Record<DeliverableType, string> = {
  post: "📱",
  article_seo: "📝",
  annonce: "🏠",
  script_video: "🎬",
  newsletter: "📧",
  email_prospection: "📧",
  bio: "📋",
  brief_graphique: "🎨",
  calendrier: "📅",
  positionnement: "🎯",
  landing_page: "🌐",
}

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
  const [loadError, setLoadError] = useState(false)

  const deliverableType = type as DeliverableType
  const accentColor = TYPE_ACCENT_COLORS[deliverableType] || "border-l-neutral-300"
  const icon = TYPE_ICONS[deliverableType] || "📄"

  const loadContent = useCallback(async () => {
    if (content !== null || loadingContent) return
    setLoadError(false)
    setLoadingContent(true)
    try {
      const res = await fetch(`/api/deliverables/${id}`)
      if (res.ok) {
        const data = await res.json()
        setContent(data.content ?? "")
      } else {
        setLoadError(true)
      }
    } catch {
      setLoadError(true)
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
    // content peut être null si le fetch a échoué — l'état d'erreur est déjà affiché
    if (content === null) return
    const plainText = stripMarkdown(content)
    try {
      await navigator.clipboard.writeText(plainText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      track("deliverable_download", {
        deliverable_id: id,
        type,
        method: "copy",
      })
    } catch {
      // Clipboard API non autorisée (contexte non-sécurisé ou refus utilisateur)
      setLoadError(true)
    }
  }

  /** Preview: first 2 non-empty, non-heading lines */
  const previewText = content
    ? content
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith("#") && !l.startsWith(">") && !l.startsWith("---"))
        .slice(0, 2)
        .join(" ")
        .replace(/\*\*(.+?)\*\*/g, "$1")
        .replace(/\*(.+?)\*/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    : null

  return (
    <article
      tabIndex={0}
      aria-label={`Livrable : ${title}`}
      className={`rounded-lg bg-card border border-border border-l-4 ${accentColor} overflow-hidden shadow-xs hover:shadow-md hover:border-secondary/30 transition-all duration-normal cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary`}
      onClick={handleExpand}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); void handleExpand() } }}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-base" aria-hidden="true">
                {icon}
              </span>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-caption font-semibold ${typeColor}`}
              >
                {typeLabel}
              </span>
              {status === "draft" && (
                <span className="inline-block px-2 py-0.5 rounded-full text-caption font-semibold bg-warning-50 text-warning-800">
                  En préparation
                </span>
              )}
            </div>
            <h3 className="font-display text-h4 text-primary leading-snug">
              {title}
            </h3>
          </div>

          {/* Copy button — top right, always visible on delivered */}
          {status === "delivered" && (
            <button
              type="button"
              aria-label={`Copier le texte : ${title}`}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm font-semibold transition-all duration-normal ${
                copied
                  ? "bg-success-50 text-success-700"
                  : "bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
              }`}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copié
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copier
                </>
              )}
            </button>
          )}
        </div>

        {/* Preview (collapsed) */}
        {!expanded && !loadingContent && previewText && (
          <p className="text-body-sm text-neutral-500 mt-2 line-clamp-2">
            {previewText}
          </p>
        )}

        {/* Loading state */}
        {loadingContent && (
          <div className="flex items-center gap-2 mt-3" aria-live="polite" aria-label="Chargement en cours">
            <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" aria-hidden="true" />
            <p className="text-body-sm text-neutral-500">
              Chargement du contenu...
            </p>
          </div>
        )}

        {/* Error state */}
        {loadError && !loadingContent && (
          <div className="flex items-center gap-2 mt-3" role="alert">
            <p className="text-body-sm text-error-700">
              Impossible de charger le contenu.{" "}
              <button
                type="button"
                className="underline font-semibold hover:text-error-900 transition-colors"
                onClick={(e) => { e.stopPropagation(); setLoadError(false); void loadContent() }}
              >
                Réessayer
              </button>
            </p>
          </div>
        )}

        {/* Expanded content with markdown rendering */}
        {expanded && content !== null && (
          <div
            id={`deliverable-content-${id}`}
            className="mt-4 pt-4 border-t border-border prose-deliverable"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
          />
        )}

        {/* Footer action */}
        <div className="flex items-center mt-3">
          {status === "delivered" ? (
            <button
              type="button"
              aria-expanded={expanded}
              aria-controls={`deliverable-content-${id}`}
              className="text-caption text-neutral-500 hover:text-secondary-700 transition-colors duration-normal flex items-center gap-1 min-h-[44px] py-2"
              onClick={(e) => { e.stopPropagation(); void handleExpand() }}
            >
              {expanded ? (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Réduire
                </>
              ) : (
                <>
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Voir le contenu
                </>
              )}
            </button>
          ) : (
            <span className="text-body-sm text-neutral-400">
              En cours de rédaction — disponible sous 24h
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

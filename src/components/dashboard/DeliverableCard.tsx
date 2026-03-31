"use client"

import { useState, useCallback } from "react"
import { track } from "@/lib/tracking"
import { markdownToHtml, stripMarkdown } from "@/lib/markdownRenderer"
import type { DeliverableType } from "@/types/deliverable"

type Feedback = "like" | "dislike" | null

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
  createdAt?: string
}

export function DeliverableCard({
  id,
  type,
  typeLabel,
  typeColor,
  title,
  content: initialContent,
  status = "delivered",
  createdAt,
}: DeliverableCardProps) {
  const [copied, setCopied] = useState(false)
  const [loadingCopy, setLoadingCopy] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState<string | null>(initialContent ?? null)
  const [loadingContent, setLoadingContent] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [rewriteCount, setRewriteCount] = useState(0)
  const [rewriting, setRewriting] = useState(false)
  const MAX_REWRITES = 3

  const deliverableType = type as DeliverableType
  const accentColor = TYPE_ACCENT_COLORS[deliverableType] || "border-l-neutral-300"
  const icon = TYPE_ICONS[deliverableType] || "📄"

  // Badge "Nouveau" si créé il y a moins de 48h
  const isNew = createdAt
    ? Date.now() - new Date(createdAt).getTime() < 48 * 60 * 60 * 1000
    : false

  /**
   * Charge le contenu si pas encore disponible.
   * Retourne le contenu (chaîne) si chargé avec succès, null sinon.
   * Si le contenu est déjà en mémoire, retourne directement sans fetch.
   */
  const loadContent = useCallback(async (): Promise<string | null> => {
    if (content !== null) return content
    if (loadingContent) return null
    setLoadError(false)
    setLoadingContent(true)
    try {
      const res = await fetch(`/api/deliverables/${id}`)
      if (res.ok) {
        const data = await res.json()
        const loaded = data.content ?? ""
        setContent(loaded)
        return loaded
      } else {
        setLoadError(true)
        return null
      }
    } catch {
      setLoadError(true)
      return null
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
    setLoadingCopy(true)
    // Utiliser le contenu retourné directement pour éviter le problème de closure sur le state
    const resolvedContent = await loadContent()
    setLoadingCopy(false)
    // resolvedContent est null si le fetch a échoué — l'état d'erreur est déjà affiché
    if (resolvedContent === null) return
    const plainText = stripMarkdown(resolvedContent)
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

  const handleFeedback = async (value: Feedback) => {
    setFeedback(value)
    track("deliverable_feedback", { deliverable_id: id, type, feedback: value })
    try {
      await fetch(`/api/deliverables/${id}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ feedback: value }),
      })
    } catch {
      // silently fail — feedback is tracked client-side
    }
  }

  const handleRewrite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (rewriteCount >= MAX_REWRITES || rewriting) return
    setRewriting(true)
    track("deliverable_rewrite", { deliverable_id: id, type, attempt: rewriteCount + 1 })
    try {
      const res = await fetch(`/api/deliverables/${id}/rewrite`, { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        if (data.content) {
          setContent(data.content)
          setRewriteCount((c) => c + 1)
          setFeedback(null)
        }
      }
    } catch {
      // silently fail
    } finally {
      setRewriting(false)
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
      aria-label={`Contenu : ${title}`}
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
              {isNew && status === "delivered" && (
                <span className="inline-block px-2 py-0.5 rounded-full text-caption font-semibold bg-success-50 text-success-700">
                  Nouveau
                </span>
              )}
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
              aria-label={copied ? "Contenu copié" : loadingCopy ? "Chargement en cours" : `Copier le texte : ${title}`}
              aria-busy={loadingCopy}
              disabled={loadingCopy}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-lg text-body-sm font-semibold transition-all duration-normal ${
                copied
                  ? "bg-success-50 text-success-700"
                  : loadingCopy
                  ? "bg-neutral-50 text-neutral-400 cursor-wait"
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
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copié — colle-le !
                </>
              ) : loadingCopy ? (
                <>
                  <div className="w-4 h-4 border-2 border-neutral-300 border-t-neutral-500 rounded-full animate-spin" aria-hidden="true" />
                  Chargement...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
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
              On charge ton contenu...
            </p>
          </div>
        )}

        {/* Error state */}
        {loadError && !loadingContent && (
          <div className="flex items-center gap-2 mt-3" role="alert">
            <p className="text-body-sm text-error-700">
              Oups, il y a eu un souci.{" "}
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

        {/* Feedback — like/dislike + rewrite */}
        {expanded && status === "delivered" && (
          <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
            <span className="text-caption text-neutral-400">Ce contenu te plaît ?</span>
            <button
              type="button"
              aria-label="J'aime ce contenu"
              aria-pressed={feedback === "like"}
              onClick={(e) => { e.stopPropagation(); void handleFeedback(feedback === "like" ? null : "like") }}
              className={`p-1.5 rounded-lg transition-colors ${feedback === "like" ? "bg-success-50 text-success-700" : "text-neutral-400 hover:text-success-600 hover:bg-success-50"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Je n'aime pas ce contenu"
              aria-pressed={feedback === "dislike"}
              onClick={(e) => { e.stopPropagation(); void handleFeedback(feedback === "dislike" ? null : "dislike") }}
              className={`p-1.5 rounded-lg transition-colors ${feedback === "dislike" ? "bg-error-50 text-error-700" : "text-neutral-400 hover:text-error-600 hover:bg-error-50"}`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
              </svg>
            </button>
            {feedback === "dislike" && rewriteCount < MAX_REWRITES && (
              <button
                type="button"
                disabled={rewriting}
                onClick={handleRewrite}
                className="ml-auto text-body-sm font-semibold text-secondary hover:text-secondary-700 transition-colors disabled:text-neutral-400 disabled:cursor-wait flex items-center gap-1.5"
              >
                {rewriting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" aria-hidden="true" />
                    Réécriture...
                  </>
                ) : (
                  <>Réécrire ({MAX_REWRITES - rewriteCount} restante{MAX_REWRITES - rewriteCount > 1 ? "s" : ""})</>
                )}
              </button>
            )}
            {rewriteCount >= MAX_REWRITES && feedback === "dislike" && (
              <a
                href={`mailto:support@immocrew.fr?subject=Contenu%20%C3%A0%20revoir&body=ID%20:%20${id}`}
                className="ml-auto text-body-sm font-semibold text-secondary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                Contacter le support
              </a>
            )}
          </div>
        )}

        {/* Aide contextuelle — visible quand expanded */}
        {expanded && status === "delivered" && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <p className="text-caption text-neutral-400">
              Après avoir copié → ouvre ton appli et colle le texte
            </p>
            <a
              href={`mailto:support@immocrew.fr?subject=Contenu%20%C3%A0%20revoir&body=ID%20du%20contenu%20:%20${id}%0AProbl%C3%A8me%20:%20`}
              className="text-caption text-neutral-400 hover:text-error-600 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Signaler un souci
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

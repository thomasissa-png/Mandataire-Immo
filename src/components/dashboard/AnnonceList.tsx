"use client"

import { useState, useCallback } from "react"
import { track } from "@/lib/tracking"
import { markdownToHtml, stripMarkdown } from "@/lib/markdownRenderer"

interface Annonce {
  id: string
  title: string
  status: "draft" | "delivered"
  createdAt?: string
}

interface AnnonceListProps {
  annonces: Annonce[]
}

const PORTAILS = [
  { name: "LeBonCoin", icon: "🟠", maxChars: 4000 },
  { name: "Bien'ici", icon: "🔵", maxChars: null },
  { name: "SeLoger", icon: "🟢", maxChars: 1500 },
] as const

export function AnnonceList({ annonces }: AnnonceListProps) {
  return (
    <div className="space-y-3">
      {annonces.map((a) => (
        <AnnonceRow key={a.id} annonce={a} />
      ))}
    </div>
  )
}

function AnnonceRow({ annonce }: { annonce: Annonce }) {
  const [expanded, setExpanded] = useState(false)
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  const isNew = annonce.createdAt
    ? Date.now() - new Date(annonce.createdAt).getTime() < 48 * 60 * 60 * 1000
    : false

  const loadContent = useCallback(async (): Promise<string | null> => {
    if (content !== null) return content
    setLoading(true)
    try {
      const res = await fetch(`/api/deliverables/${annonce.id}`)
      if (res.ok) {
        const data = await res.json()
        const loaded = data.content ?? ""
        setContent(loaded)
        return loaded
      }
      return null
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }, [annonce.id, content])

  const handleToggle = async () => {
    if (!expanded) {
      await loadContent()
      track("deliverable_view", { deliverable_id: annonce.id, type: "annonce" })
    }
    setExpanded(!expanded)
  }

  const handleCopy = async (portailName: string, maxChars: number | null) => {
    const resolved = await loadContent()
    if (!resolved) return

    let text = stripMarkdown(resolved)
    if (maxChars && text.length > maxChars) {
      text = text.slice(0, maxChars - 3) + "..."
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopied(portailName)
      setTimeout(() => setCopied(null), 2000)
      track("deliverable_download", {
        deliverable_id: annonce.id,
        type: "annonce",
        method: "copy",
        portail: portailName,
      })
    } catch {
      // Clipboard API unavailable
    }
  }

  const handleCopyAll = async () => {
    const resolved = await loadContent()
    if (!resolved) return
    const text = stripMarkdown(resolved)
    try {
      await navigator.clipboard.writeText(text)
      setCopied("all")
      setTimeout(() => setCopied(null), 2000)
      track("deliverable_download", {
        deliverable_id: annonce.id,
        type: "annonce",
        method: "copy",
      })
    } catch {
      // Clipboard API unavailable
    }
  }

  return (
    <article className="rounded-lg bg-card border border-border border-l-4 border-l-success overflow-hidden shadow-xs hover:shadow-sm transition-shadow">
      {/* Header — compact row */}
      <div className="p-4 flex items-center gap-3">
        <span className="text-lg flex-shrink-0" aria-hidden="true">🏠</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            {isNew && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-success-50 text-success-700 uppercase">
                Nouveau
              </span>
            )}
            {annonce.status === "draft" && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-warning-50 text-warning-700 uppercase">
                En préparation
              </span>
            )}
          </div>
          <h3
            className="font-display text-body font-semibold text-primary truncate cursor-pointer hover:text-secondary transition-colors"
            onClick={handleToggle}
          >
            {annonce.title}
          </h3>
        </div>

        {/* Actions rapides — toujours visibles */}
        {annonce.status === "delivered" && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Copier tout */}
            <button
              type="button"
              onClick={handleCopyAll}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-caption font-semibold transition-all ${
                copied === "all"
                  ? "bg-success-50 text-success-700"
                  : "bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
              }`}
              aria-label={copied === "all" ? "Copié" : "Copier le texte complet"}
            >
              {copied === "all" ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Copié
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copier
                </>
              )}
            </button>

            {/* Voir/masquer */}
            <button
              type="button"
              onClick={handleToggle}
              className="p-2 rounded-lg text-neutral-400 hover:text-primary hover:bg-neutral-50 transition-colors"
              aria-expanded={expanded}
              aria-label={expanded ? "Masquer l'annonce" : "Voir l'annonce"}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={expanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="px-4 pb-4 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          <p className="text-caption text-neutral-500">Chargement...</p>
        </div>
      )}

      {/* Expanded content */}
      {expanded && content !== null && (
        <div className="border-t border-border">
          {/* Export buttons */}
          <div className="px-4 pt-3 pb-2 flex flex-wrap gap-2">
            <span className="text-caption text-neutral-400 py-1">Exporter pour :</span>
            {PORTAILS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => handleCopy(p.name, p.maxChars)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium transition-all ${
                  copied === p.name
                    ? "bg-success-50 text-success-700 ring-1 ring-success-200"
                    : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100 ring-1 ring-neutral-200"
                }`}
              >
                <span aria-hidden="true">{p.icon}</span>
                {copied === p.name ? "Copié !" : p.name}
                {p.maxChars && <span className="text-neutral-400">({p.maxChars} car.)</span>}
              </button>
            ))}
          </div>

          {/* Content */}
          <div
            className="px-4 pb-4 prose-deliverable text-body-sm"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
          />
        </div>
      )}
    </article>
  )
}

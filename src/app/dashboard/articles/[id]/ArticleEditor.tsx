"use client"

import { useState, useCallback } from "react"
import { markdownToHtml } from "@/lib/markdownRenderer"

interface ArticleEditorProps {
  id: string
  initialContent: string
  title: string
}

export function ArticleEditor({ id, initialContent, title }: ArticleEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/deliverables/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        setSaved(true)
        setEditing(false)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      // Erreur silencieuse
    } finally {
      setSaving(false)
    }
  }, [id, content])

  const handleCopy = useCallback(async () => {
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
      // Clipboard unavailable
    }
  }, [content])

  const html = markdownToHtml(content)

  return (
    <>
      {/* Navigation + Actions */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <a
          href="/dashboard/articles"
          className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-secondary-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour aux articles
        </a>
        <div className="flex items-center gap-2">
          {!editing ? (
            <>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-lg border border-border text-body-sm font-semibold text-neutral-600 hover:border-secondary hover:text-secondary transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Modifier
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-lg text-body-sm font-semibold transition-colors ${
                  copied ? "bg-success-50 text-success-700" : "bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
                }`}
              >
                {copied ? "Copié !" : "Copier"}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-lg bg-secondary text-white font-bold text-body-sm hover:bg-secondary-600 transition-colors disabled:opacity-50"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                type="button"
                onClick={() => { setContent(initialContent); setEditing(false) }}
                className="px-4 py-2 min-h-[44px] text-body-sm text-neutral-500 hover:text-primary transition-colors"
              >
                Annuler
              </button>
            </>
          )}
        </div>
      </div>

      {saved && (
        <div className="rounded-lg bg-success-50 border border-success-200 p-3 mb-4 text-body-sm text-success-700 font-medium">
          Modifications enregistrées.
        </div>
      )}

      {/* Contenu — lecture ou édition */}
      <div className="rounded-lg bg-card border border-border p-6 tablet:p-8">
        {editing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[400px] px-4 py-3 rounded-lg border border-border bg-background text-body text-foreground font-mono text-body-sm resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
            placeholder="Modifie ton article ici (format Markdown)..."
          />
        ) : (
          <div
            className="prose-deliverable max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </>
  )
}

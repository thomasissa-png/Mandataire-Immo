"use client"

import { useState, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────

interface AnnonceData {
  annonce_longue: string
  annonce_courte: string
  titre_annonce: string
  accroche_courte: string
  page_url: string
}

interface AnnonceBlockProps {
  propertyId: string
  existingAnnonce?: AnnonceData | null
  hasPhotos: boolean
}

type TabId = "longue" | "courte"

// ─── Composant ────────────────────────────────────────────────────

export function AnnonceBlock({
  propertyId,
  existingAnnonce,
  hasPhotos,
}: AnnonceBlockProps) {
  const [annonce, setAnnonce] = useState<AnnonceData | null>(
    existingAnnonce || null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>("longue")
  const [copiedTab, setCopiedTab] = useState<TabId | null>(null)
  const [showConfirmRegenerate, setShowConfirmRegenerate] = useState(false)

  // ─── Génération ──────────────────────────────────────────────

  const generate = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/biens/${propertyId}/generate-annonce`, {
        method: "POST",
        signal: AbortSignal.timeout(35000), // 35s timeout
      })

      if (!res.ok) {
        const data = await res
          .json()
          .catch(() => ({ error: "Erreur inconnue" }))
        throw new Error(data.error || `Erreur ${res.status}`)
      }

      const result: AnnonceData = await res.json()
      setAnnonce(result)
      setActiveTab("longue")
    } catch (err) {
      if (err instanceof DOMException && err.name === "TimeoutError") {
        setError(
          "La génération a pris trop longtemps — réessaie dans quelques instants."
        )
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Impossible de générer l'annonce. Réessaie."
        )
      }
    } finally {
      setLoading(false)
      setShowConfirmRegenerate(false)
    }
  }, [propertyId])

  // ─── Copier ──────────────────────────────────────────────────

  const handleCopy = useCallback(
    async (tab: TabId) => {
      if (!annonce) return

      const text =
        tab === "longue" ? annonce.annonce_longue : annonce.annonce_courte

      try {
        await navigator.clipboard.writeText(text)
        setCopiedTab(tab)
        setTimeout(() => setCopiedTab(null), 2500)
      } catch {
        // Fallback : créer un textarea temporaire
        const textarea = document.createElement("textarea")
        textarea.value = text
        textarea.style.position = "fixed"
        textarea.style.opacity = "0"
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        setCopiedTab(tab)
        setTimeout(() => setCopiedTab(null), 2500)
      }
    },
    [annonce]
  )

  // ─── État : Pas de photos ────────────────────────────────────

  if (!hasPhotos && !annonce) {
    return (
      <div className="rounded-lg bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <span aria-hidden="true">✍️</span>
          </div>
          <h3 className="font-display text-h4 text-primary">Annonce</h3>
        </div>
        <div className="text-center py-6">
          <p className="text-body-sm text-neutral-500 mb-2">
            Ajoute au moins une photo pour générer ton annonce
          </p>
          <div
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-neutral-100 text-neutral-400 text-body-sm font-semibold cursor-not-allowed"
            title="Ajoute au moins une photo"
            aria-disabled="true"
          >
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Générer mon annonce
          </div>
        </div>
      </div>
    )
  }

  // ─── État : Loading ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="rounded-lg bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <span aria-hidden="true">✍️</span>
          </div>
          <h3 className="font-display text-h4 text-primary">Annonce</h3>
        </div>
        <div className="space-y-4" aria-live="polite" aria-label="Rédaction en cours">
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin"
              aria-hidden="true"
            />
            <p className="text-body-sm text-neutral-600 font-medium">
              Rédaction en cours... (30 secondes)
            </p>
          </div>
          {/* Skeleton texte */}
          <div className="space-y-2">
            <div className="h-4 bg-neutral-100 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-neutral-100 rounded animate-pulse w-full" />
            <div className="h-4 bg-neutral-100 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-neutral-100 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-neutral-100 rounded animate-pulse w-full" />
            <div className="h-4 bg-neutral-100 rounded animate-pulse w-4/5" />
          </div>
        </div>
      </div>
    )
  }

  // ─── État : Erreur ───────────────────────────────────────────

  if (error && !annonce) {
    return (
      <div className="rounded-lg bg-card border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
            <span aria-hidden="true">✍️</span>
          </div>
          <h3 className="font-display text-h4 text-primary">Annonce</h3>
        </div>
        <div className="rounded-lg bg-error-50 border border-error-200 p-4" role="alert">
          <p className="text-body-sm text-error-700 mb-3">{error}</p>
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-full bg-error-100 text-error-700 font-semibold text-body-sm hover:bg-error-200 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  // ─── État : Succès (annonce générée) ─────────────────────────

  if (annonce) {
    const currentText =
      activeTab === "longue" ? annonce.annonce_longue : annonce.annonce_courte

    return (
      <div className="rounded-lg bg-card border border-border p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success-50 flex items-center justify-center flex-shrink-0">
              <span aria-hidden="true">✅</span>
            </div>
            <div>
              <h3 className="font-display text-h4 text-primary">
                {annonce.titre_annonce}
              </h3>
              {annonce.accroche_courte && (
                <p className="text-caption text-neutral-500 mt-0.5">
                  {annonce.accroche_courte}
                </p>
              )}
            </div>
          </div>

          {/* Bouton régénérer */}
          <button
            type="button"
            onClick={() => setShowConfirmRegenerate(true)}
            className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center gap-1.5 px-3 py-2 rounded-lg text-caption text-neutral-500 hover:text-secondary-700 hover:bg-neutral-50 transition-colors"
            aria-label="Régénérer l'annonce"
          >
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
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
              />
            </svg>
            <span className="hidden tablet:inline">Régénérer</span>
          </button>
        </div>

        {/* Erreur après régénération ratée */}
        {error && (
          <div
            className="rounded-lg bg-error-50 border border-error-200 p-3 mb-4"
            role="alert"
          >
            <p className="text-caption text-error-700">{error}</p>
          </div>
        )}

        {/* Modal confirmation régénération */}
        {showConfirmRegenerate && (
          <div className="rounded-lg bg-warning-50 border border-warning-200 p-4 mb-4">
            <p className="text-body-sm text-warning-800 font-medium mb-3">
              Écraser l'annonce existante ? Cette action est irréversible.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={generate}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-warning-600 text-white text-body-sm font-semibold hover:bg-warning-700 transition-colors"
              >
                Oui, régénérer
              </button>
              <button
                type="button"
                onClick={() => setShowConfirmRegenerate(false)}
                className="min-h-[44px] px-4 py-2 rounded-lg bg-white border border-border text-body-sm text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="flex border-b border-border mb-4" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "longue"}
            onClick={() => setActiveTab("longue")}
            className={`min-h-[44px] px-4 py-2.5 text-body-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "longue"
                ? "border-secondary text-secondary-700"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Annonce longue
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "courte"}
            onClick={() => setActiveTab("courte")}
            className={`min-h-[44px] px-4 py-2.5 text-body-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === "courte"
                ? "border-secondary text-secondary-700"
                : "border-transparent text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Annonce courte (portails)
          </button>
        </div>

        {/* Contenu annonce */}
        <div
          role="tabpanel"
          className="rounded-lg bg-neutral-50 border border-border p-4 mb-4 max-h-[400px] overflow-y-auto overscroll-contain"
        >
          <p className="text-body-sm text-foreground whitespace-pre-wrap leading-relaxed">
            {currentText}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Bouton copier */}
          <button
            type="button"
            onClick={() => handleCopy(activeTab)}
            className={`inline-flex items-center gap-2 min-h-[44px] px-5 py-2.5 rounded-full text-body-sm font-semibold transition-all duration-150 ${
              copiedTab === activeTab
                ? "bg-success-50 text-success-700"
                : "bg-secondary text-primary hover:bg-secondary-600 hover:text-white shadow-sm"
            }`}
          >
            {copiedTab === activeTab ? (
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
                Copier l'annonce
              </>
            )}
          </button>

          {/* Lien page publique */}
          {annonce.page_url && (
            <a
              href={annonce.page_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-full border border-border text-body-sm font-medium text-neutral-600 hover:text-secondary-700 hover:border-secondary/30 transition-colors"
            >
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
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              Voir ma page publique
            </a>
          )}
        </div>
      </div>
    )
  }

  // ─── État : Défaut (pas encore d'annonce, photos présentes) ──

  return (
    <div className="rounded-lg bg-card border border-border p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
          <span aria-hidden="true">✍️</span>
        </div>
        <h3 className="font-display text-h4 text-primary">Annonce</h3>
      </div>
      <p className="text-body-sm text-neutral-500 mb-4">
        Tes photos sont prêtes. Génère ton annonce en un clic — on s'occupe du
        texte.
      </p>
      <button
        type="button"
        onClick={generate}
        className="inline-flex items-center gap-2 min-h-[44px] px-6 py-2.5 rounded-full bg-secondary text-white font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 hover:text-white hover:shadow-md transition-all duration-150"
      >
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
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
        Générer mon annonce
      </button>
    </div>
  )
}

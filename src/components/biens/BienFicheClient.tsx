"use client"

import { useState, useCallback } from "react"
import { PhotoUploader } from "@/components/biens/PhotoUploader"
import { AnnonceBlock } from "@/components/biens/AnnonceBlock"
import type { PropertyPhoto } from "@/types/property"

// ─── Types ────────────────────────────────────────────────────────

interface AnnonceData {
  annonce_longue: string
  annonce_courte: string
  titre_annonce: string
  accroche_courte: string
  page_url: string
}

interface BienFicheClientProps {
  propertyId: string
  initialPhotos: PropertyPhoto[]
  existingAnnonce: AnnonceData | null
  slug: string | null
}

// ─── Composant ────────────────────────────────────────────────────

export function BienFicheClient({
  propertyId,
  initialPhotos,
  existingAnnonce,
  slug,
}: BienFicheClientProps) {
  const [photoCount, setPhotoCount] = useState(initialPhotos.length)
  const [linkCopied, setLinkCopied] = useState(false)

  const handlePhotosChange = useCallback((photos: PropertyPhoto[]) => {
    setPhotoCount(photos.length)
  }, [])

  const handleCopyLink = useCallback(async () => {
    if (!slug) return
    const url = `${window.location.origin}/bien/${slug}`
    try {
      await navigator.clipboard.writeText(url)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2500)
    } catch {
      // Fallback silencieux
    }
  }, [slug])

  return (
    <div className="space-y-6">
      {/* Section Photos */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg" aria-hidden="true">📸</span>
          <h2 className="font-display text-h3 text-primary">Photos</h2>
          <span className="text-caption text-neutral-400">
            ({photoCount})
          </span>
        </div>
        <PhotoUploader
          propertyId={propertyId}
          initialPhotos={initialPhotos}
          onPhotosChange={handlePhotosChange}
        />
      </section>

      {/* Section Annonce */}
      <section>
        <AnnonceBlock
          propertyId={propertyId}
          existingAnnonce={existingAnnonce}
          hasPhotos={photoCount > 0}
        />
      </section>

      {/* Section Page publique */}
      <section className="rounded-lg bg-card border border-border p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg" aria-hidden="true">🌐</span>
          <h2 className="font-display text-h3 text-primary">
            Page publique
          </h2>
        </div>
        {!slug ? (
          <p className="text-body-sm text-neutral-500">
            La page publique sera disponible après la génération de ton annonce.
          </p>
        ) : (
          <>
          <p className="text-body-sm text-neutral-500 mb-4">
            Partage ce lien avec tes acheteurs potentiels par SMS, email ou
            dans tes annonces.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/bien/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg border border-border text-body-sm text-neutral-600 hover:text-secondary-700 hover:border-secondary/30 transition-colors"
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
              Voir la page
            </a>
            <button
              type="button"
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2.5 rounded-lg text-body-sm font-semibold transition-all duration-150 ${
                linkCopied
                  ? "bg-success-50 text-success-700"
                  : "bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
              }`}
            >
              {linkCopied ? (
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
                  Lien copié !
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
                  Copier le lien
                </>
              )}
            </button>
          </div>
          </>
        )}
      </section>
    </div>
  )
}

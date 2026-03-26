"use client"

import { useState } from "react"
import type { PropertyPhoto, StagingPhoto } from "@/types/property"

interface PropertyGalleryProps {
  originales: PropertyPhoto[]
  staging: StagingPhoto[]
}

/**
 * Galerie avant/apres pour les visuels home staging.
 * Si des photos staging existent, affiche un comparateur avant/apres.
 * Sinon, affiche les photos originales en grille.
 */
export function PropertyGallery({ originales, staging }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showOriginal, setShowOriginal] = useState(false)

  const hasStaging = staging.length > 0

  // Construire les paires avant/apres
  const pairs = hasStaging
    ? staging.map((s) => ({
        staging: s,
        original: originales.find((o) => o.key === s.photo_originale_key) || null,
      }))
    : originales.map((o) => ({ staging: null, original: o }))

  if (pairs.length === 0) return null

  const currentPair = pairs[selectedIndex]

  return (
    <div>
      {/* Image principale */}
      <div className="relative rounded-lg overflow-hidden bg-neutral-100 aspect-square max-w-2xl mx-auto mb-4">
        {hasStaging && currentPair.staging ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={showOriginal && currentPair.original ? currentPair.original.url : currentPair.staging.url}
              alt={`${currentPair.staging.piece} — ${showOriginal ? "Photo originale" : `Home staging ${currentPair.staging.style}`}`}
              className="w-full h-full object-cover"
            />
            {/* Toggle avant/apres */}
            {currentPair.original && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex bg-primary/90 rounded-full overflow-hidden">
                <button
                  onClick={() => setShowOriginal(false)}
                  className={`px-4 py-2 text-small font-medium transition-colors ${
                    !showOriginal ? "bg-secondary text-white" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  Apres
                </button>
                <button
                  onClick={() => setShowOriginal(true)}
                  className={`px-4 py-2 text-small font-medium transition-colors ${
                    showOriginal ? "bg-secondary text-white" : "text-neutral-300 hover:text-white"
                  }`}
                >
                  Avant
                </button>
              </div>
            )}
            {/* Badge home staging */}
            <div className="absolute top-4 right-4 bg-primary/80 text-white text-caption px-3 py-1 rounded-full">
              {showOriginal ? "Photo originale" : `Staging ${currentPair.staging.style}`}
            </div>
          </>
        ) : currentPair.original ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={currentPair.original.url}
            alt={currentPair.original.piece}
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* Mention legale */}
      {hasStaging && !showOriginal && (
        <p className="text-caption text-neutral-400 text-center mb-4">
          Home staging virtuel — photo non contractuelle
        </p>
      )}

      {/* Thumbnails */}
      {pairs.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
          {pairs.map((pair, index) => {
            const thumbSrc = pair.staging?.url || pair.original?.url
            const thumbAlt = pair.staging?.piece || pair.original?.piece || `Photo ${index + 1}`
            return (
              <button
                key={index}
                onClick={() => {
                  setSelectedIndex(index)
                  setShowOriginal(false)
                }}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                  selectedIndex === index ? "border-secondary" : "border-transparent"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumbSrc}
                  alt={thumbAlt}
                  className="w-full h-full object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

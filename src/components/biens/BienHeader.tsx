"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { BienEditForm } from "./BienEditForm"

interface BienHeaderProps {
  propertyId: string
  titre: string
  type_bien: string
  adresse: string
  prix: number
  surface: number
  pieces: number
  points_forts: string | null
}

export function BienHeader({
  propertyId,
  titre,
  type_bien,
  adresse,
  prix,
  surface,
  pieces,
  points_forts,
}: BienHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const formatPrix = (p: number): string => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(p)
  }

  const handleSaved = useCallback(() => {
    setIsEditing(false)
    router.refresh()
  }, [router])

  if (isEditing) {
    return (
      <div className="rounded-lg bg-card border border-border p-5 mb-6">
        <h2 className="font-display text-h3 text-primary font-bold mb-4">
          Modifier les infos du bien
        </h2>
        <BienEditForm
          propertyId={propertyId}
          initialData={{ titre, type_bien, adresse, prix, surface, pieces, points_forts }}
          onSaved={handleSaved}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-card border border-border p-5 mb-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="font-display text-h2 text-primary font-bold mb-1 break-words">
            {titre || `${type_bien} — ${adresse}`}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded bg-primary-50 text-caption font-medium text-primary-700">
              {type_bien}
            </span>
            <span className="text-body-sm text-neutral-500">
              {adresse}
            </span>
          </div>
        </div>
        <p className="text-h3 font-display font-bold text-secondary-700 flex-shrink-0 break-words">
          {formatPrix(prix)}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 mt-3">
        {surface > 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">
            {surface} m²
          </span>
        )}
        {pieces > 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">
            {pieces} pièce{pieces > 1 ? "s" : ""}
          </span>
        )}
        {points_forts && (
          <span className="px-2.5 py-1 rounded-lg bg-secondary-50 text-caption font-medium text-secondary-700">
            {points_forts}
          </span>
        )}

        {/* Bouton Modifier */}
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-body-sm font-medium text-primary-600 hover:bg-primary-50 border border-primary-200 transition-colors duration-fast"
          aria-label="Modifier les informations du bien"
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
          Modifier les infos
        </button>
      </div>
    </div>
  )
}

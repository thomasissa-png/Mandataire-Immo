"use client"

import { useState, useEffect } from "react"
import { BienCard } from "@/components/biens/BienCard"
import type { PropertyPage } from "@/types/property"

// ─── Types ────────────────────────────────────────────────────────

interface AnnonceDeliverable {
  id: string
  type: string
  title: string
  status: "draft" | "delivered" | "archived"
}

interface MesBiensSectionProps {
  annonces?: AnnonceDeliverable[]
}

// ─── Composant ────────────────────────────────────────────────────

export function MesBiensSection({ annonces = [] }: MesBiensSectionProps) {
  const [biens, setBiens] = useState<PropertyPage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBiens() {
      try {
        const res = await fetch("/api/biens")
        if (!res.ok) {
          throw new Error("Impossible de charger tes biens")
        }
        const data = await res.json()
        setBiens(data.biens || [])
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erreur lors du chargement"
        )
      } finally {
        setLoading(false)
      }
    }

    fetchBiens()
  }, [])

  // ─── Loading ─────────────────────────────────────────────────

  if (loading) {
    return (
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg" aria-hidden="true">🏠</span>
            <h2 className="font-display text-h3 text-primary">Mes biens</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-lg bg-card border border-border overflow-hidden animate-pulse"
            >
              <div className="aspect-[16/9] bg-neutral-100" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                <div className="h-3 bg-neutral-100 rounded w-1/2" />
                <div className="h-5 bg-neutral-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // ─── Erreur ──────────────────────────────────────────────────

  if (error) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg" aria-hidden="true">🏠</span>
          <h2 className="font-display text-h3 text-primary">Mes biens</h2>
        </div>
        <div className="rounded-lg bg-error-50 border border-error-200 p-4" role="alert">
          <p className="text-body-sm text-error-700">{error}</p>
        </div>
      </section>
    )
  }

  // ─── État vide ───────────────────────────────────────────────

  if (biens.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg" aria-hidden="true">🏠</span>
          <h2 className="font-display text-h3 text-primary">Mes biens</h2>
        </div>
        <div className="rounded-lg bg-neutral-50 border border-border p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-primary-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </div>
          <p className="text-body-sm text-neutral-600 mb-2">
            Ajoute tes biens ici pour créer des annonces personnalisées avec tes photos.
          </p>
          {annonces.length > 0 ? (
            <p className="text-body-sm text-secondary-700 font-medium mb-4">
              Tu as déjà {annonces.length} annonce{annonces.length > 1 ? "s" : ""} générée{annonces.length > 1 ? "s" : ""} par ton équipe. Ajoute tes biens pour recevoir des annonces avec TES photos.
            </p>
          ) : null}
          <a
            href="/dashboard/biens/nouveau"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Ajouter mon premier bien
          </a>
        </div>

      </section>
    )
  }

  // ─── Liste des biens ─────────────────────────────────────────

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden="true">🏠</span>
          <h2 className="font-display text-h3 text-primary">Mes biens</h2>
          <span className="text-caption text-neutral-400">
            ({biens.length})
          </span>
        </div>
        <a
          href="/dashboard/biens/nouveau"
          className="inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2 rounded-full bg-secondary text-white font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 hover:text-white hover:shadow-md transition-all duration-150"
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
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Ajouter un bien
        </a>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
        {biens.map((bien) => (
          <BienCard key={bien.id} bien={bien} />
        ))}
      </div>
    </section>
  )
}

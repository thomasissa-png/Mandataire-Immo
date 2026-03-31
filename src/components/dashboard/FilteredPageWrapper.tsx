"use client"

import { useState, useMemo, useEffect } from "react"
import { MonthFilter } from "@/components/dashboard/MonthFilter"
import type { Deliverable } from "@/types/deliverable"

interface FilteredPageWrapperProps {
  /** Tous les livrables (non filtrés) */
  deliverables: Deliverable[]
  /** Inclure le toggle d'archives (défaut : true) */
  showArchiveToggle?: boolean
  /** Fonction de rendu qui reçoit les livrables filtrés et le state d'archive */
  children: (filtered: Deliverable[], showArchived: boolean, onArchiveToggle: (id: string) => void) => React.ReactNode
}

/**
 * Wrapper client qui ajoute le filtre par mois et le toggle d'archives
 * à n'importe quelle page dashboard.
 *
 * Les pages serveur passent tous les livrables, ce composant gère
 * le filtrage côté client.
 */
export function FilteredPageWrapper({
  deliverables,
  showArchiveToggle = true,
  children,
}: FilteredPageWrapperProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [items, setItems] = useState(deliverables)

  // Synchroniser quand les props changent (navigation, revalidation SSR)
  useEffect(() => {
    setItems(deliverables)
  }, [deliverables])

  // Extraire les mois disponibles à partir des données
  const availableMonths = useMemo(() => {
    const monthSet = new Set<string>()
    items.forEach((d) => {
      if (d.month) monthSet.add(d.month)
    })
    // Trier en ordre décroissant (plus récent d'abord)
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a))
  }, [items])

  // Filtrer par mois et statut d'archive
  const filtered = useMemo(() => {
    let result = items

    // Filtre mois
    if (selectedMonth) {
      result = result.filter((d) => d.month === selectedMonth)
    }

    // Filtre archives
    if (!showArchived) {
      result = result.filter((d) => d.status !== "archived")
    }

    return result
  }, [items, selectedMonth, showArchived])

  const archivedCount = useMemo(
    () => items.filter((d) => d.status === "archived").length,
    [items]
  )

  /** Bascule le statut d'un livrable localement après appel API */
  const handleArchiveToggle = async (id: string) => {
    try {
      const res = await fetch(`/api/deliverables/${id}/archive`, { method: "PATCH" })
      if (res.ok) {
        const data = await res.json()
        setItems((prev) =>
          prev.map((d) =>
            d.id === id ? { ...d, status: data.status } : d
          )
        )
      }
    } catch {
      // Erreur réseau — pas de changement
    }
  }

  return (
    <div className="space-y-4">
      {/* Barre de filtres */}
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        {availableMonths.length > 1 && (
          <MonthFilter
            selectedMonth={selectedMonth}
            onChange={setSelectedMonth}
            availableMonths={availableMonths}
          />
        )}

        {showArchiveToggle && archivedCount > 0 && (
          <button
            type="button"
            onClick={() => setShowArchived(!showArchived)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-semibold transition-all whitespace-nowrap ${
              showArchived
                ? "bg-neutral-700 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            }`}
            aria-pressed={showArchived}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            {showArchived ? "Masquer les archives" : `Archives (${archivedCount})`}
          </button>
        )}
      </div>

      {/* Contenu filtré */}
      {children(filtered, showArchived, handleArchiveToggle)}
    </div>
  )
}

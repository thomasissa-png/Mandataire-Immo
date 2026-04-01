"use client"

import { useState, useCallback, useRef } from "react"

export interface CitySuggestion {
  city: string        // "Angers"
  postcode: string    // "49000"
  departement: string // "49 - Maine-et-Loire" (extrait de context)
  context: string     // "49, Maine-et-Loire, Pays de la Loire"
  label: string       // "Angers (49000)"
}

/**
 * Hook d'autocomplete pour les communes françaises via l'API Adresse.
 * Utilise type=municipality pour ne retourner que des villes (pas des rues).
 * Retourne aussi le département extrait du context.
 */
export function useCityAutocomplete() {
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((q: string) => {
    if (q.length < 2) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5&type=municipality`
        )
        if (!res.ok) return
        const data = await res.json()
        const results: CitySuggestion[] = (data.features || []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (f: any) => {
            const ctx: string = f.properties.context || ""
            // context = "49, Maine-et-Loire, Pays de la Loire"
            // Extraire le département : "49 - Maine-et-Loire"
            const parts = ctx.split(", ")
            const deptNum = parts[0] || ""
            const deptName = parts[1] || ""
            const departement = deptNum && deptName ? `${deptNum} - ${deptName}` : ctx

            return {
              city: f.properties.city || f.properties.name || "",
              postcode: f.properties.postcode || "",
              departement,
              context: ctx,
              label: `${f.properties.city || f.properties.name} (${f.properties.postcode || ""})`,
            }
          }
        )
        setSuggestions(results)
        setIsOpen(results.length > 0)
      } catch {
        // Silently fail — user can still type manually
      }
    }, 250)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return { search, suggestions, isOpen, close }
}

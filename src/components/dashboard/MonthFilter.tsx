"use client"

const FRENCH_MONTHS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
] as const

const SHORT_MONTHS = [
  "Janv", "Fév", "Mars", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sept", "Oct", "Nov", "Déc",
] as const

/**
 * Génère les 6 derniers mois au format "YYYY-MM" à partir de la date courante.
 */
function getLastSixMonths(): string[] {
  const months: string[] = []
  const now = new Date()
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    months.push(`${yyyy}-${mm}`)
  }
  return months
}

/**
 * Formate "2026-03" en "Mars 2026" (format court : "Mars 26").
 */
function formatMonth(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split("-")
  const monthIndex = parseInt(monthStr, 10) - 1
  return `${SHORT_MONTHS[monthIndex]} ${yearStr}`
}

/**
 * Formate "2026-03" en label accessible "Mars 2026".
 */
function formatMonthFull(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split("-")
  const monthIndex = parseInt(monthStr, 10) - 1
  return `${FRENCH_MONTHS[monthIndex]} ${yearStr}`
}

interface MonthFilterProps {
  /** Mois sélectionné au format "YYYY-MM", ou null pour "Tous" */
  selectedMonth: string | null
  /** Callback quand l'utilisateur change le mois */
  onChange: (month: string | null) => void
  /** Mois disponibles (si fourni, n'affiche que ceux-ci). Format "YYYY-MM". */
  availableMonths?: string[]
}

export function MonthFilter({ selectedMonth, onChange, availableMonths }: MonthFilterProps) {
  const months = availableMonths ?? getLastSixMonths()

  return (
    <nav aria-label="Filtrer par mois" className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {/* Bouton "Tous" */}
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-caption font-semibold transition-all whitespace-nowrap ${
          selectedMonth === null
            ? "bg-primary text-white shadow-sm"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        }`}
        aria-pressed={selectedMonth === null}
        aria-label="Afficher tous les mois"
      >
        Tous
      </button>

      {months.map((m) => (
        <button
          key={m}
          type="button"
          onClick={() => onChange(m)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-caption font-semibold transition-all whitespace-nowrap ${
            selectedMonth === m
              ? "bg-primary text-white shadow-sm"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
          aria-pressed={selectedMonth === m}
          aria-label={`Filtrer : ${formatMonthFull(m)}`}
        >
          {formatMonth(m)}
        </button>
      ))}
    </nav>
  )
}

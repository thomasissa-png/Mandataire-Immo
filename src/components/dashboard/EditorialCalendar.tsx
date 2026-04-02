"use client"

/**
 * Calendrier éditorial visuel — vue mensuelle.
 * Client Component : navigation entre mois, popover au clic sur un jour.
 * Rendu : SSR initial avec le mois courant, navigation côté client.
 */

import { useState, useCallback, useMemo } from "react"
import type { Deliverable } from "@/types/deliverable"
import { distributeDeliverables } from "@/lib/calendar-distribution"
import { CalendarDayPopover } from "./CalendarDayPopover"

/* ─── Constantes de type ─── */

const TYPE_DOT_COLORS: Record<string, string> = {
  post: "bg-secondary",
  article_seo: "bg-primary",
  script_video: "bg-success",
  newsletter: "bg-info",
  email_prospection: "bg-error",
}

/** Lettre affichée dans le point coloré sur mobile */
const TYPE_DOT_LETTERS: Record<string, string> = {
  post: "P",
  article_seo: "A",
  script_video: "V",
  newsletter: "N",
  email_prospection: "E",
}

const TYPE_LABELS: Record<string, string> = {
  post: "Post",
  article_seo: "Article SEO",
  script_video: "Script vidéo",
  newsletter: "Newsletter",
  email_prospection: "Email prospection",
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"] as const

/* ─── Helpers ─── */

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  // 0=dimanche dans JS, on veut 0=lundi
  const day = new Date(year, month, 1).getDay()
  return day === 0 ? 6 : day - 1
}

function isSameDay(date: Date, year: number, month: number, day: number): boolean {
  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day
}

function getDeliverableYearMonth(d: Deliverable): string {
  // Préférer le champ month (YYYY-MM), fallback sur created_at
  if (d.month && /^\d{4}-\d{2}$/.test(d.month)) return d.month
  if (d.created_at) {
    const date = new Date(d.created_at)
    if (!isNaN(date.getTime())) {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    }
  }
  return ""
}

/* ─── Composant ─── */

interface EditorialCalendarProps {
  deliverables: Deliverable[]
  initialYear: number
  initialMonth: number // 0-indexed
}

export function EditorialCalendar({
  deliverables,
  initialYear,
  initialMonth,
}: EditorialCalendarProps) {
  const [year, setYear] = useState(initialYear)
  const [month, setMonth] = useState(initialMonth)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [popoverAnchor, setPopoverAnchor] = useState<DOMRect | null>(null)

  const today = useMemo(() => new Date(), [])
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month

  const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`
  const monthLabel = new Date(year, month).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  })

  // Distribuer les deliverables par mois : le template hebdomadaire place ~5-6
  // contenus/semaine (~22/mois). Si un mois a plus de contenus que de slots,
  // l'excédent déborde sur le mois suivant.
  const monthDeliverables = useMemo(() => {
    // Regrouper tous les deliverables par mois d'origine
    const byMonth: Record<string, Deliverable[]> = {}
    for (const d of deliverables) {
      const m = getDeliverableYearMonth(d)
      if (!byMonth[m]) byMonth[m] = []
      byMonth[m].push(d)
    }

    // Trier les mois chronologiquement
    const sortedMonths = Object.keys(byMonth).sort()
    if (sortedMonths.length === 0) return []

    // Calculer la capacité de chaque mois (jours ouvrés avec le template = ~5/semaine)
    // et distribuer les excédents sur les mois suivants
    const distributed: Record<string, Deliverable[]> = {}
    let overflow: Deliverable[] = []

    for (const m of sortedMonths) {
      const items = [...overflow, ...(byMonth[m] || [])]
      overflow = []

      // Parser le mois
      const [y, mo] = m.split("-").map(Number)
      const daysInMonth = getDaysInMonth(y, mo - 1)

      // Compter les slots disponibles (jours du template qui ont un contenu assigné)
      // Template : lun=article, mar/jeu/sam=post, mer=cond, ven=vidéo = 5-6/semaine
      let slots = 0
      for (let d = 1; d <= daysInMonth; d++) {
        const wd = new Date(y, mo - 1, d).getDay()
        if (wd >= 1 && wd <= 6) slots++ // Lundi à samedi
      }

      if (items.length > slots) {
        distributed[m] = items.slice(0, slots)
        overflow = items.slice(slots)
      } else {
        distributed[m] = items
      }
    }

    // Si overflow reste, l'ajouter au mois suivant
    if (overflow.length > 0) {
      const lastMonth = sortedMonths[sortedMonths.length - 1]
      const [y, mo] = lastMonth.split("-").map(Number)
      const nextMonth = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, "0")}`
      distributed[nextMonth] = [...(distributed[nextMonth] || []), ...overflow]
    }

    return distributed[monthKey] || []
  }, [deliverables, monthKey])

  // Détecter le jour de début pour la distribution.
  // Pour le premier mois (même mois que la création), on commence au jour de création.
  // Pour les mois suivants (contenus débordés), on commence au 1er.
  const startDay = useMemo(() => {
    if (monthDeliverables.length === 0) return 1
    // Vérifier si c'est le premier mois (date de création est dans ce mois)
    let earliest = 0
    for (const d of monthDeliverables) {
      const date = new Date(d.created_at)
      if (!isNaN(date.getTime()) && date.getFullYear() === year && date.getMonth() === month) {
        earliest = earliest === 0 ? date.getDate() : Math.min(earliest, date.getDate())
      }
    }
    // Si aucun deliverable n'a été créé dans ce mois (contenus débordés), commencer au 1er
    return earliest === 0 ? 1 : earliest
  }, [monthDeliverables, year, month])

  // Distribuer les livrables : 1 contenu/jour, types alternés, pas de dimanche
  const deliverablesByDay = useMemo(
    () => distributeDeliverables(monthDeliverables, getDaysInMonth(year, month), year, month, startDay),
    [monthDeliverables, year, month, startDay],
  )

  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOffset = getFirstDayOfWeek(year, month)

  const goToPrev = useCallback(() => {
    if (month === 0) {
      setMonth(11)
      setYear((y) => y - 1)
    } else {
      setMonth((m) => m - 1)
    }
    setSelectedDay(null)
  }, [month])

  const goToNext = useCallback(() => {
    if (month === 11) {
      setMonth(0)
      setYear((y) => y + 1)
    } else {
      setMonth((m) => m + 1)
    }
    setSelectedDay(null)
  }, [month])

  const goToToday = useCallback(() => {
    setYear(today.getFullYear())
    setMonth(today.getMonth())
    setSelectedDay(null)
  }, [today])

  const handleDayClick = useCallback(
    (day: number, e: React.MouseEvent<HTMLButtonElement>) => {
      const dayDeliverables = deliverablesByDay.get(day)
      if (dayDeliverables && dayDeliverables.length > 0) {
        setSelectedDay(day)
        setPopoverAnchor(e.currentTarget.getBoundingClientRect())
      }
    },
    [deliverablesByDay],
  )

  // Compter les types uniques présents ce mois pour la légende
  const typesInMonth = useMemo(() => {
    const types = new Set<string>()
    for (const d of monthDeliverables) {
      types.add(d.type)
    }
    return Array.from(types)
  }, [monthDeliverables])

  // Grille : cellules vides avant le 1er jour + jours du mois
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="space-y-4">
      {/* Conteneur du calendrier */}
      <div className="rounded-xl bg-card border border-border shadow-xs overflow-hidden">
        {/* Header : navigation */}
        <div className="flex items-center justify-between px-4 py-3 tablet:px-6 tablet:py-4 border-b border-border bg-background/50">
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Mois précédent"
            className="p-2 rounded-lg text-neutral-500 hover:text-primary hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-3">
            <h2 className="font-display text-h3 tablet:text-h2 text-primary capitalize">
              {monthLabel}
            </h2>
            {!isCurrentMonth && (
              <button
                type="button"
                onClick={goToToday}
                className="text-caption font-semibold text-secondary hover:text-secondary-700 transition-colors px-2 py-1 rounded-md hover:bg-secondary-50"
              >
                Aujourd'hui
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={goToNext}
            aria-label="Mois suivant"
            className="p-2 rounded-lg text-neutral-500 hover:text-primary hover:bg-neutral-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Jours de la semaine */}
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-2 text-center text-caption text-neutral-400 font-semibold uppercase tracking-wider"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grille des jours */}
        <div className="grid grid-cols-7">
          {cells.map((day, i) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${i}`}
                  className="min-h-[60px] tablet:min-h-[80px] border-b border-r border-border/50 bg-neutral-50/50"
                />
              )
            }

            const dayItems = deliverablesByDay.get(day) || []
            const hasContent = dayItems.length > 0
            const isToday = isCurrentMonth && isSameDay(today, year, month, day)
            const isWeekend = (i % 7) >= 5
            const isSelected = selectedDay === day

            return (
              <button
                key={day}
                type="button"
                onClick={(e) => handleDayClick(day, e)}
                disabled={!hasContent}
                aria-label={`${day} ${monthLabel}${hasContent ? `, ${dayItems.length} contenu${dayItems.length > 1 ? "s" : ""}` : ""}`}
                className={[
                  "relative min-h-[60px] tablet:min-h-[80px] p-1.5 tablet:p-2 border-b border-r border-border/50 text-left transition-all duration-fast",
                  "focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-secondary",
                  hasContent
                    ? "cursor-pointer hover:bg-secondary-50/50"
                    : "cursor-default",
                  isToday ? "bg-secondary-50/30" : "",
                  isWeekend && !isToday ? "bg-neutral-50/30" : "",
                  isSelected ? "bg-secondary-50" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Numéro du jour */}
                <span
                  className={[
                    "inline-flex items-center justify-center w-7 h-7 rounded-full text-body-sm font-semibold",
                    isToday
                      ? "bg-secondary text-white ring-2 ring-secondary/30"
                      : hasContent
                      ? "text-primary"
                      : "text-neutral-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {day}
                </span>

                {/* Points colorés (mobile : dots uniquement) */}
                {hasContent && (
                  <div className="mt-1 flex flex-wrap gap-0.5 tablet:hidden">
                    {dayItems.slice(0, 4).map((d, idx) => (
                      <span
                        key={idx}
                        className={`w-4 h-4 rounded-full ${TYPE_DOT_COLORS[d.type] || "bg-neutral-400"} text-white text-[8px] font-bold flex items-center justify-center leading-none`}
                        title={TYPE_LABELS[d.type] || d.type}
                      >
                        {TYPE_DOT_LETTERS[d.type] || ""}
                      </span>
                    ))}
                    {dayItems.length > 4 && (
                      <span className="text-caption text-neutral-400 leading-none">
                        +{dayItems.length - 4}
                      </span>
                    )}
                  </div>
                )}

                {/* Pills avec label (desktop) */}
                {hasContent && (
                  <div className="mt-1 hidden tablet:flex flex-col gap-0.5">
                    {dayItems.slice(0, 3).map((d, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] leading-tight font-medium truncate ${TYPE_DOT_COLORS[d.type] || "bg-neutral-400"} text-white`}
                      >
                        <span className="truncate">{TYPE_LABELS[d.type] || d.type}</span>
                      </div>
                    ))}
                    {dayItems.length > 3 && (
                      <span className="text-[10px] text-neutral-400 pl-1">
                        +{dayItems.length - 3} autre{dayItems.length - 3 > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* Légende */}
        {typesInMonth.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 px-4 py-3 tablet:px-6 border-t border-border bg-background/50">
            <span className="text-caption text-neutral-400">Légende :</span>
            {typesInMonth.map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${TYPE_DOT_COLORS[type] || "bg-neutral-400"}`} />
                <span className="text-caption text-neutral-600">
                  {TYPE_LABELS[type] || type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Résumé du mois */}
      {monthDeliverables.length > 0 && (
        <div className="rounded-xl bg-card border border-border p-4 tablet:p-5">
          <h3 className="font-display text-h5 text-primary mb-2">
            Résumé du mois
          </h3>
          <p className="text-body-sm text-neutral-500">
            {monthDeliverables.length} contenu{monthDeliverables.length > 1 ? "s" : ""} prévu{monthDeliverables.length > 1 ? "s" : ""} en {new Date(year, month).toLocaleDateString("fr-FR", { month: "long" })}
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {typesInMonth.map((type) => {
              const count = monthDeliverables.filter((d) => d.type === type).length
              return (
                <span
                  key={type}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background text-body-sm text-primary font-medium"
                >
                  <span className={`w-2 h-2 rounded-full ${TYPE_DOT_COLORS[type] || "bg-neutral-400"}`} />
                  {count} {TYPE_LABELS[type] || type}{count > 1 ? "s" : ""}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* État vide — avec bouton pour revenir au dernier mois avec du contenu */}
      {monthDeliverables.length === 0 && (() => {
        // Trouver le dernier mois qui a du contenu
        const lastMonthWithContent = deliverables.length > 0
          ? Array.from(new Set(deliverables.map((d) => getDeliverableYearMonth(d)))).sort().pop()
          : null
        const canGoBack = lastMonthWithContent && lastMonthWithContent !== monthKey

        return (
          <div className="rounded-xl bg-card border border-border p-6 tablet:p-8 text-center">
            <span className="text-3xl mb-3 block" aria-hidden="true">📭</span>
            <h3 className="font-display text-h4 text-primary mb-2">
              Pas encore de contenus en {new Date(year, month).toLocaleDateString("fr-FR", { month: "long" })}
            </h3>
            <p className="text-body-sm text-neutral-500 max-w-md mx-auto mb-4">
              Tes nouveaux contenus sont générés automatiquement chaque lundi. Ils apparaîtront ici dès qu{"'"}ils seront prêts.
            </p>
            {canGoBack && (() => {
              const [prevY, prevM] = lastMonthWithContent.split("-").map(Number)
              const prevLabel = new Date(prevY, prevM - 1).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
              return (
                <button
                  type="button"
                  onClick={() => { setYear(prevY); setMonth(prevM - 1) }}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary text-white font-display font-bold text-body-sm hover:bg-secondary-600 transition-all shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
                  Voir {prevLabel}
                </button>
              )
            })()}
          </div>
        )
      })()}

      {/* Popover */}
      {selectedDay !== null && (
        <CalendarDayPopover
          day={selectedDay}
          month={month}
          year={year}
          deliverables={deliverablesByDay.get(selectedDay) || []}
          onClose={() => setSelectedDay(null)}
          anchorRect={popoverAnchor}
        />
      )}
    </div>
  )
}

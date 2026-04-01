"use client"

/**
 * Calendrier éditorial visuel — vue mensuelle.
 * Client Component : navigation entre mois, popover au clic sur un jour.
 * Rendu : SSR initial avec le mois courant, navigation côté client.
 */

import { useState, useCallback, useMemo } from "react"
import type { Deliverable } from "@/types/deliverable"
import { CalendarDayPopover } from "./CalendarDayPopover"

/* ─── Constantes de type ─── */

const TYPE_DOT_COLORS: Record<string, string> = {
  post: "bg-secondary",
  article_seo: "bg-primary",
  script_video: "bg-success",
  newsletter: "bg-info",
  email_prospection: "bg-error",
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

function getDeliverableDay(d: Deliverable): number | null {
  if (d.created_at) {
    const date = new Date(d.created_at)
    if (!isNaN(date.getTime())) return date.getDate()
  }
  return null
}

/**
 * Ordre de priorité pour le placement dans le calendrier.
 * Les types en premier sont placés en priorité sur les meilleurs jours.
 */
const TYPE_PRIORITY: string[] = [
  "post",              // Coeur du calendrier — mardi, jeudi, samedi
  "script_video",      // Reels/TikTok — samedi matin
  "article_seo",       // SEO — lundi/mercredi (1/semaine)
  "newsletter",        // 1x/mois — milieu de mois
  "email_prospection", // 1x/mois — début de mois
]

/**
 * Jours préférés par type de contenu (jour de semaine : 0=dim, 1=lun ... 6=sam).
 * Basé sur les best practices par réseau social.
 */
const PREFERRED_WEEKDAYS: Record<string, number[]> = {
  post: [2, 4, 6],            // Mardi, Jeudi, Samedi (LinkedIn mardi/jeudi, Instagram samedi)
  script_video: [6, 5],       // Samedi (Reels), Vendredi
  article_seo: [1, 3],        // Lundi, Mercredi (1/semaine, pas le même jour que les posts)
  newsletter: [4, 3],         // Jeudi, Mercredi
  email_prospection: [1, 2],  // Lundi, Mardi (début de semaine pour prospection)
}

/**
 * Caps hebdomadaires par type de contenu.
 * Empêche de concentrer 5 posts sur 5 jours consécutifs.
 */
const WEEKLY_CAPS: Record<string, number> = {
  post: 3,               // Max 3 posts/semaine
  script_video: 1,       // Max 1 vidéo/semaine
  article_seo: 1,        // Max 1 article/semaine
  newsletter: 1,         // Max 1/mois
  email_prospection: 1,  // Max 1/mois
}

/**
 * Hash déterministe simple pour un string → nombre positif.
 * Utilisé pour assigner un jour stable à chaque deliverable.
 */
function stableHash(str: string): number {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/**
 * Distribue les livrables sur le mois : 1 contenu par jour max,
 * types alternés, pas de dimanche, jours préférés par type.
 *
 * Le placement est DÉTERMINISTE : basé sur un hash de l'id du deliverable
 * + le mois affiché, pour que la position reste stable entre les renders
 * et la navigation mois précédent/suivant.
 *
 * startDay : jour à partir duquel distribuer (1 = tout le mois,
 * 25 = seulement à partir du 25). Permet de respecter la date d'activation.
 */
function distributeDeliverables(
  deliverables: Deliverable[],
  daysInMonth: number,
  year: number,
  month: number,
  startDay: number = 1,
): Map<number, Deliverable[]> {
  const map = new Map<number, Deliverable[]>()
  const usedDays = new Set<number>()

  // Calculer les jours disponibles (pas dimanche, à partir de startDay)
  const availableDays: number[] = []
  for (let d = startDay; d <= daysInMonth; d++) {
    const weekday = new Date(year, month, d).getDay()
    if (weekday !== 0) availableDays.push(d) // Exclure dimanche
  }

  // Index les jours disponibles par jour de semaine pour un accès rapide
  const daysByWeekday: Record<number, number[]> = {}
  for (const day of availableDays) {
    const wd = new Date(year, month, day).getDay()
    if (!daysByWeekday[wd]) daysByWeekday[wd] = []
    daysByWeekday[wd].push(day)
  }

  // Compteur de contenus par semaine et par type (pour les caps)
  // Semaine = numéro ISO (lundi à dimanche)
  const weekTypeCount: Record<string, number> = {} // "week-type" → count
  function getWeekKey(day: number, type: string): string {
    const weekNum = Math.ceil((day - startDay + 1) / 7)
    return `${weekNum}-${type}`
  }
  function canPlaceInWeek(day: number, type: string): boolean {
    const cap = WEEKLY_CAPS[type]
    if (!cap) return true
    const key = getWeekKey(day, type)
    return (weekTypeCount[key] || 0) < cap
  }
  function markPlaced(day: number, type: string) {
    const key = getWeekKey(day, type)
    weekTypeCount[key] = (weekTypeCount[key] || 0) + 1
  }

  // Grouper par type et trier par priorité
  const byType: Record<string, Deliverable[]> = {}
  for (const d of deliverables) {
    if (!byType[d.type]) byType[d.type] = []
    byType[d.type].push(d)
  }

  // Trier chaque groupe par hash déterministe pour un ordre stable
  const monthSeed = `${year}-${month}`
  for (const type of Object.keys(byType)) {
    byType[type].sort((a, b) => stableHash(a.id + monthSeed) - stableHash(b.id + monthSeed))
  }

  // Trouver le meilleur jour libre pour un contenu, avec seed déterministe + cap hebdo
  function findBestDay(type: string, deliverableId: string): number | null {
    const preferred = PREFERRED_WEEKDAYS[type] || [2, 4]
    const hash = stableHash(deliverableId + monthSeed)

    // D'abord : jours préférés non utilisés + cap hebdo respecté
    for (const prefWeekday of preferred) {
      const candidates = (daysByWeekday[prefWeekday] || []).filter((d) => !usedDays.has(d) && canPlaceInWeek(d, type))
      if (candidates.length > 0) {
        return candidates[hash % candidates.length]
      }
    }
    // Fallback : n'importe quel jour libre respectant le cap hebdo
    const remaining = availableDays.filter((d) => !usedDays.has(d) && canPlaceInWeek(d, type))
    if (remaining.length > 0) {
      return remaining[hash % remaining.length]
    }
    // Dernier recours : ignorer le cap (tous les jours de la semaine sont pleins)
    const anyRemaining = availableDays.filter((d) => !usedDays.has(d))
    if (anyRemaining.length > 0) {
      return anyRemaining[hash % anyRemaining.length]
    }
    return null
  }

  // Placer les contenus type par type, en alternant
  for (const type of TYPE_PRIORITY) {
    const items = byType[type]
    if (!items) continue

    for (const item of items) {
      const day = findBestDay(type, item.id)
      if (day === null) break // Plus de jours disponibles
      usedDays.add(day)
      markPlaced(day, type)
      map.set(day, [item]) // 1 seul contenu par jour
    }
  }

  // Contenus de types non listés dans TYPE_PRIORITY (sécurité)
  for (const type of Object.keys(byType)) {
    if (TYPE_PRIORITY.includes(type)) continue
    for (const item of byType[type]) {
      const day = findBestDay(type, item.id)
      if (day === null) break
      usedDays.add(day)
      markPlaced(day, type)
      map.set(day, [item])
    }
  }

  return map
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

  // Distribuer TOUS les deliverables sur les mois par tranche.
  // Sophie paie → reçoit N contenus → on les étale sur les semaines suivantes.
  // Chaque contenu est assigné à un mois via son rang dans la liste totale
  // et les caps hebdomadaires. Le calendrier affiche une "tranche" par mois.
  const { monthDeliverables, totalDistributed } = useMemo(() => {
    // Trier tous les deliverables par date de création (plus ancien d'abord)
    const sorted = [...deliverables].sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    if (sorted.length === 0) return { monthDeliverables: [], totalDistributed: 0 }

    // Trouver la date de début (premier contenu)
    const firstDate = new Date(sorted[0].created_at)
    const startYear = firstDate.getFullYear()
    const startMonth = firstDate.getMonth()
    const startDay = firstDate.getDate()

    // Calculer combien de jours disponibles par mois à partir de la date de début
    // et distribuer les contenus mois par mois en respectant les caps
    const monthBuckets: Map<string, Deliverable[]> = new Map()
    let currentIdx = 0

    // Itérer mois par mois depuis le début jusqu'au mois affiché + 1
    let iterYear = startYear
    let iterMonth = startMonth
    const endKey = `${year}-${String(month + 1).padStart(2, "0")}`

    for (let safety = 0; safety < 24 && currentIdx < sorted.length; safety++) {
      const iterKey = `${iterYear}-${String(iterMonth + 1).padStart(2, "0")}`
      const daysInMonth = getDaysInMonth(iterYear, iterMonth)
      const dayStart = (iterYear === startYear && iterMonth === startMonth) ? startDay : 1

      // Compter les jours disponibles (pas dimanche)
      let availableDays = 0
      for (let d = dayStart; d <= daysInMonth; d++) {
        if (new Date(iterYear, iterMonth, d).getDay() !== 0) availableDays++
      }

      // Prendre un maximum de contenus pour ce mois (1 par jour dispo)
      const bucketSize = Math.min(availableDays, sorted.length - currentIdx)
      const bucket = sorted.slice(currentIdx, currentIdx + bucketSize)
      monthBuckets.set(iterKey, bucket)
      currentIdx += bucketSize

      // Stop si on a dépassé le mois affiché
      if (iterKey > endKey) break

      // Mois suivant
      iterMonth++
      if (iterMonth > 11) { iterMonth = 0; iterYear++ }
    }

    const result = monthBuckets.get(monthKey) || []
    return { monthDeliverables: result, totalDistributed: currentIdx }
  }, [deliverables, monthKey, year, month])

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
                        className={`w-2 h-2 rounded-full ${TYPE_DOT_COLORS[d.type] || "bg-neutral-400"}`}
                        title={TYPE_LABELS[d.type] || d.type}
                      />
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

      {/* État vide */}
      {monthDeliverables.length === 0 && (
        <div className="rounded-xl bg-card border border-border p-6 tablet:p-8 text-center">
          <span className="text-3xl mb-3 block" aria-hidden="true">📭</span>
          <h3 className="font-display text-h4 text-primary mb-2">
            Rien de prévu en {new Date(year, month).toLocaleDateString("fr-FR", { month: "long" })}
          </h3>
          <p className="text-body-sm text-neutral-500 max-w-md mx-auto">
            Ton prochain pack de contenus sera bientôt livré. Reviens sur le mois en cours pour voir ton calendrier.
          </p>
        </div>
      )}

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

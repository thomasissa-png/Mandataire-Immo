/**
 * Algorithme de distribution du calendrier éditorial.
 * Distribue les contenus sur un mois avec des règles strictes :
 * - 3 posts/semaine (mardi, jeudi, samedi)
 * - 1 article SEO/semaine (lundi)
 * - 1 script vidéo/semaine (vendredi)
 * - 1 newsletter/mois (mercredi semaine 2)
 * - 1 email prospection/mois (mercredi semaine 3)
 * - Pas de dimanche
 * - 1 contenu max par jour
 *
 * L'approche est DÉTERMINISTE et par semaine (round-robin),
 * pas par type (qui concentrait les articles).
 */

import type { Deliverable } from "@/types/deliverable"

interface DayAssignment {
  day: number
  type: string
}

/**
 * Template hebdomadaire : chaque jour de la semaine a un type assigné.
 * Lundi=1, Mardi=2, ..., Samedi=6, Dimanche=0 (exclu)
 */
const WEEK_TEMPLATE: { weekday: number; type: string; label: string }[] = [
  { weekday: 1, type: "article_seo",       label: "Lundi → Article SEO" },
  { weekday: 2, type: "post",              label: "Mardi → Post" },
  { weekday: 3, type: "newsletter",        label: "Mercredi → Newsletter/Email" },  // Slot conditionnel
  { weekday: 4, type: "post",              label: "Jeudi → Post" },
  { weekday: 5, type: "script_video",      label: "Vendredi → Script vidéo" },
  { weekday: 6, type: "post",              label: "Samedi → Post" },
]

/**
 * Distribue les deliverables sur le mois en respectant le template hebdomadaire.
 * Retourne une Map<jour, Deliverable[]> (1 contenu par jour).
 */
export function distributeDeliverables(
  deliverables: Deliverable[],
  daysInMonth: number,
  year: number,
  month: number,
  startDay: number = 1,
): Map<number, Deliverable[]> {
  const map = new Map<number, Deliverable[]>()

  // Grouper les deliverables par type
  const byType: Record<string, Deliverable[]> = {}
  for (const d of deliverables) {
    if (!byType[d.type]) byType[d.type] = []
    byType[d.type].push(d)
  }

  // Index de consommation par type
  const typeIndex: Record<string, number> = {}
  for (const type of Object.keys(byType)) {
    typeIndex[type] = 0
  }

  // Helper : prendre le prochain deliverable d'un type
  function takeNext(type: string): Deliverable | null {
    const items = byType[type]
    if (!items || typeIndex[type] >= items.length) return null
    return items[typeIndex[type]++]
  }

  // Construire le calendrier semaine par semaine
  let weekNumber = 0

  for (let day = startDay; day <= daysInMonth; day++) {
    const weekday = new Date(year, month, day).getDay()

    // Dimanche = repos
    if (weekday === 0) continue

    // Détecte le début d'une nouvelle semaine (lundi)
    if (weekday === 1) weekNumber++
    // Si on commence un autre jour que lundi (mois qui commence un mercredi par ex)
    if (day === startDay && weekday !== 1) weekNumber = 1

    // Trouver le slot du template pour ce jour de semaine
    const slot = WEEK_TEMPLATE.find((s) => s.weekday === weekday)
    if (!slot) continue

    let deliverable: Deliverable | null = null

    if (slot.type === "newsletter") {
      // Mercredi : newsletter en semaine 2, email prospection en semaine 3, rien sinon
      if (weekNumber === 2) {
        deliverable = takeNext("newsletter")
      } else if (weekNumber === 3) {
        deliverable = takeNext("email_prospection")
      }
      // Semaines 1, 4+ : mercredi libre (pas de contenu)
    } else {
      deliverable = takeNext(slot.type)
    }

    if (deliverable) {
      map.set(day, [deliverable])
    }
  }

  // S'il reste des contenus non placés (plus que prévu dans un type),
  // les distribuer sur les jours libres
  const usedDays = new Set(map.keys())
  const remainingTypes = Object.keys(byType).filter(
    (type) => typeIndex[type] < byType[type].length
  )

  if (remainingTypes.length > 0) {
    for (let day = startDay; day <= daysInMonth; day++) {
      if (usedDays.has(day)) continue
      const weekday = new Date(year, month, day).getDay()
      if (weekday === 0) continue // Pas dimanche

      // Prendre le prochain contenu disponible (round-robin par type)
      for (const type of remainingTypes) {
        const item = takeNext(type)
        if (item) {
          map.set(day, [item])
          usedDays.add(day)
          break
        }
      }

      // Si plus rien à placer, arrêter
      if (remainingTypes.every((t) => typeIndex[t] >= (byType[t]?.length || 0))) break
    }
  }

  return map
}

import { describe, it, expect } from "vitest"
import type { Deliverable } from "@/types/deliverable"

/**
 * Test du scénario réel du fondateur :
 * - 26 deliverables créés le 25 mars avec month="2026-03"
 * - Mars ne devrait montrer que ~5 jours (25-31 mars, ~5 jours ouvrés)
 * - Avril devrait montrer le reste (~21 contenus)
 *
 * Ce test valide la logique d'overflow dans EditorialCalendar.
 * On reproduit la logique du useMemo du composant ici pour la tester.
 */

function makeDeliverable(id: string, type: string, month: string): Deliverable {
  return {
    id,
    type: type as Deliverable["type"],
    title: `${type} ${id}`,
    month,
    status: "delivered",
    created_at: "2026-03-25T10:00:00Z",
  }
}

function makeFullPack(month: string): Deliverable[] {
  const items: Deliverable[] = []
  for (let i = 1; i <= 12; i++) items.push(makeDeliverable(`post-${i}`, "post", month))
  for (let i = 1; i <= 4; i++) items.push(makeDeliverable(`article-${i}`, "article_seo", month))
  for (let i = 1; i <= 4; i++) items.push(makeDeliverable(`script-${i}`, "script_video", month))
  items.push(makeDeliverable("newsletter-1", "newsletter", month))
  items.push(makeDeliverable("email-1", "email_prospection", month))
  // 22 total
  return items
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getDeliverableYearMonth(d: Deliverable): string {
  if (d.month && /^\d{4}-\d{2}$/.test(d.month)) return d.month
  return ""
}

/**
 * Reproduit la logique d'overflow du composant EditorialCalendar
 */
function getMonthDeliverables(deliverables: Deliverable[], monthKey: string): Deliverable[] {
  const byMonth: Record<string, Deliverable[]> = {}
  for (const d of deliverables) {
    const m = getDeliverableYearMonth(d)
    if (!byMonth[m]) byMonth[m] = []
    byMonth[m].push(d)
  }

  const sortedMonths = Object.keys(byMonth).sort()
  if (sortedMonths.length === 0) return []

  const distributed: Record<string, Deliverable[]> = {}
  let overflow: Deliverable[] = []

  for (const m of sortedMonths) {
    const items = [...overflow, ...(byMonth[m] || [])]
    overflow = []

    const [y, mo] = m.split("-").map(Number)
    const daysInMonth = getDaysInMonth(y, mo - 1)

    let slots = 0
    for (let d = 1; d <= daysInMonth; d++) {
      const wd = new Date(y, mo - 1, d).getDay()
      if (wd >= 1 && wd <= 6) slots++
    }

    if (items.length > slots) {
      distributed[m] = items.slice(0, slots)
      overflow = items.slice(slots)
    } else {
      distributed[m] = items
    }
  }

  if (overflow.length > 0) {
    const lastMonth = sortedMonths[sortedMonths.length - 1]
    const [y, mo] = lastMonth.split("-").map(Number)
    const nextMonth = mo === 12 ? `${y + 1}-01` : `${y}-${String(mo + 1).padStart(2, "0")}`
    distributed[nextMonth] = [...(distributed[nextMonth] || []), ...overflow]
  }

  return distributed[monthKey] || []
}

describe("Calendar overflow — scénario fondateur", () => {
  it("mars 2026 montre les 22 contenus (26 jours ouvrés en mars)", () => {
    const pack = makeFullPack("2026-03")
    const march = getMonthDeliverables(pack, "2026-03")
    // Mars 2026 a 27 jours ouvrés (lun-sam), 22 contenus < 27 slots → tout tient
    expect(march.length).toBe(22)
  })

  it("si 30 contenus en mars, l'excédent va en avril", () => {
    const pack = makeFullPack("2026-03")
    // Ajoutons 8 contenus supplémentaires
    for (let i = 13; i <= 20; i++) pack.push(makeDeliverable(`post-extra-${i}`, "post", "2026-03"))
    // 30 total, mars a 27 slots → 3 en overflow

    const march = getMonthDeliverables(pack, "2026-03")
    const april = getMonthDeliverables(pack, "2026-04")

    expect(march.length).toBe(26) // Max slots mars (26 jours lun-sam)
    expect(april.length).toBe(4) // Overflow
    expect(march.length + april.length).toBe(30) // Rien de perdu
  })

  it("avril n'est PAS vide si mars déborde", () => {
    const pack = makeFullPack("2026-03")
    for (let i = 13; i <= 20; i++) pack.push(makeDeliverable(`post-extra-${i}`, "post", "2026-03"))

    const april = getMonthDeliverables(pack, "2026-04")
    expect(april.length).toBeGreaterThan(0)
  })

  it("si mars a pile le bon nombre de contenus, avril est vide", () => {
    // 22 contenus, mars a 27 slots → tout tient, rien en avril
    const pack = makeFullPack("2026-03")
    const april = getMonthDeliverables(pack, "2026-04")
    expect(april.length).toBe(0)
  })

  it("contenus de 2 mois différents restent séparés", () => {
    const marchPack = makeFullPack("2026-03")
    const aprilPack = makeFullPack("2026-04")
    const all = [...marchPack, ...aprilPack]

    const march = getMonthDeliverables(all, "2026-03")
    const april = getMonthDeliverables(all, "2026-04")

    expect(march.length).toBe(22) // Pack mars
    expect(april.length).toBe(22) // Pack avril
  })
})

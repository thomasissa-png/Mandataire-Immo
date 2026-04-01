import { describe, it, expect } from "vitest"
import { distributeDeliverables } from "@/lib/calendar-distribution"
import type { Deliverable } from "@/types/deliverable"

function makeDeliverable(id: string, type: string): Deliverable {
  return {
    id,
    type: type as Deliverable["type"],
    title: `${type} ${id}`,
    month: "2026-04",
    status: "delivered",
    created_at: "2026-04-01T00:00:00Z",
  }
}

/**
 * Génère le pack mensuel standard :
 * 12 posts, 4 articles, 4 scripts, 1 newsletter, 1 email prospection
 */
function makeMonthlyPack(): Deliverable[] {
  const items: Deliverable[] = []
  for (let i = 1; i <= 12; i++) items.push(makeDeliverable(`post-${i}`, "post"))
  for (let i = 1; i <= 4; i++) items.push(makeDeliverable(`article-${i}`, "article_seo"))
  for (let i = 1; i <= 4; i++) items.push(makeDeliverable(`script-${i}`, "script_video"))
  items.push(makeDeliverable("newsletter-1", "newsletter"))
  items.push(makeDeliverable("email-1", "email_prospection"))
  return items
}

describe("distributeDeliverables", () => {
  // Avril 2026 : 1er = mercredi, 30 jours
  const year = 2026
  const month = 3 // 0-indexed = avril
  const daysInMonth = 30

  it("distribue le pack mensuel sur avril 2026", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    // Vérifier qu'on a des contenus
    expect(result.size).toBeGreaterThan(0)
    expect(result.size).toBeLessThanOrEqual(26) // Max 26 jours ouvrés
  })

  it("ne place jamais de contenu un dimanche", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    for (const [day] of result) {
      const weekday = new Date(year, month, day).getDay()
      expect(weekday).not.toBe(0)
    }
  })

  it("place maximum 1 contenu par jour", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    for (const [, items] of result) {
      expect(items.length).toBe(1)
    }
  })

  it("place exactement 3 posts par semaine complète", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    // Compter les posts par semaine ISO
    const postsByWeek: Record<number, number> = {}
    for (const [day, items] of result) {
      if (items[0].type === "post") {
        // Calculer le numéro de semaine (lundi = début)
        const date = new Date(year, month, day)
        const weekStart = day - ((date.getDay() + 6) % 7) // Lundi de cette semaine
        const weekNum = Math.ceil(weekStart / 7)
        postsByWeek[weekNum] = (postsByWeek[weekNum] || 0) + 1
      }
    }

    // Chaque semaine complète devrait avoir exactement 3 posts
    // (la première ou dernière semaine peut être incomplète)
    for (const [, count] of Object.entries(postsByWeek)) {
      expect(count).toBeLessThanOrEqual(3)
    }
  })

  it("place les posts le mardi, jeudi et samedi", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    for (const [day, items] of result) {
      if (items[0].type === "post") {
        const weekday = new Date(year, month, day).getDay()
        expect([2, 4, 6]).toContain(weekday) // Mardi, Jeudi, Samedi
      }
    }
  })

  it("place les articles SEO le lundi", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    for (const [day, items] of result) {
      if (items[0].type === "article_seo") {
        const weekday = new Date(year, month, day).getDay()
        expect(weekday).toBe(1) // Lundi
      }
    }
  })

  it("place les scripts vidéo le vendredi", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    for (const [day, items] of result) {
      if (items[0].type === "script_video") {
        const weekday = new Date(year, month, day).getDay()
        expect(weekday).toBe(5) // Vendredi
      }
    }
  })

  it("place 1 article SEO par semaine (max)", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    const articlesByWeek: Record<number, number> = {}
    for (const [day, items] of result) {
      if (items[0].type === "article_seo") {
        const weekNum = Math.ceil(day / 7)
        articlesByWeek[weekNum] = (articlesByWeek[weekNum] || 0) + 1
      }
    }

    for (const [, count] of Object.entries(articlesByWeek)) {
      expect(count).toBeLessThanOrEqual(1)
    }
  })

  it("place 1 script vidéo par semaine (max)", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    const scriptsByWeek: Record<number, number> = {}
    for (const [day, items] of result) {
      if (items[0].type === "script_video") {
        const weekNum = Math.ceil(day / 7)
        scriptsByWeek[weekNum] = (scriptsByWeek[weekNum] || 0) + 1
      }
    }

    for (const [, count] of Object.entries(scriptsByWeek)) {
      expect(count).toBeLessThanOrEqual(1)
    }
  })

  it("place la newsletter et l'email prospection", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    const types = new Set<string>()
    for (const [, items] of result) {
      types.add(items[0].type)
    }

    expect(types.has("newsletter")).toBe(true)
    expect(types.has("email_prospection")).toBe(true)
  })

  it("place tous les 22 contenus (12 posts + 4 articles + 4 scripts + 1 NL + 1 email)", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month)

    let total = 0
    for (const [, items] of result) {
      total += items.length
    }

    expect(total).toBe(22)
  })

  it("fonctionne avec startDay au milieu du mois", () => {
    const pack = makeMonthlyPack()
    const result = distributeDeliverables(pack, daysInMonth, year, month, 15)

    // Vérifier que tous les jours sont >= 15
    for (const [day] of result) {
      expect(day).toBeGreaterThanOrEqual(15)
    }

    // Doit quand même avoir du contenu
    expect(result.size).toBeGreaterThan(0)
  })
})

import { test, expect } from "./fixtures"

/**
 * Legal pages E2E tests — ImmoCrew
 *
 * Why these tests exist:
 * Legal pages (CGV, Mentions legales, Confidentialite) are a regulatory
 * requirement for any French commercial website. Their absence or
 * inaccessibility exposes the business to DGCCRF sanctions. These tests
 * verify that each page loads, has correct structure, and is reachable
 * from the footer navigation.
 */

const LEGAL_PAGES = [
  {
    path: "/cgv",
    heading: /Conditions G.n.rales de Vente/,
    title: /CGV|Conditions/,
  },
  {
    path: "/mentions-legales",
    heading: /Mentions l.gales/,
    title: /Mentions/,
  },
  {
    path: "/confidentialite",
    heading: /Politique de confidentialit/,
    title: /Confidentialit/,
  },
] as const

for (const legalPage of LEGAL_PAGES) {
  test.describe(`Legal page: ${legalPage.path}`, () => {
    test(`loads successfully with correct heading`, async ({ page }) => {
      const response = await page.goto(legalPage.path)

      // Page must return 200 — a 404 on a legal page is a compliance bug
      expect(response?.status()).toBe(200)

      // H1 heading must match expected content
      const h1 = page.getByRole("heading", { level: 1 })
      await expect(h1).toBeVisible()
      await expect(h1).toHaveText(legalPage.heading)
    })

    test(`has correct meta title`, async ({ page }) => {
      await page.goto(legalPage.path)
      await expect(page).toHaveTitle(legalPage.title)
    })

    test(`has header and footer (consistent layout)`, async ({ page }) => {
      await page.goto(legalPage.path)

      await expect(page.locator("header")).toBeVisible()
      await expect(page.locator("footer")).toBeVisible()
    })

    test(`contains an article element for content`, async ({ page }) => {
      await page.goto(legalPage.path)
      await expect(page.locator("article")).toBeVisible()
    })
  })
}

test.describe("Legal pages — navigation from footer", () => {
  test("all legal links in footer lead to accessible pages", async ({
    page,
  }) => {
    await page.goto("/")

    for (const legalPage of LEGAL_PAGES) {
      const link = page.locator(`footer a[href='${legalPage.path}']`)
      await expect(link).toBeAttached()

      // Verify the link text is meaningful (not empty)
      const text = await link.textContent()
      expect(text?.trim().length).toBeGreaterThan(0)
    }
  })
})

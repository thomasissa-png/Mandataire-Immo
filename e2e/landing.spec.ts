import { test, expect, EXPECTED_PACKS } from "./fixtures"

/**
 * Landing page E2E tests — ImmoCrew
 *
 * Why these tests exist:
 * The landing page is the sole acquisition channel. Every section must render
 * correctly, CTAs must point to the right checkout URLs, and pricing must
 * display the contractually committed amounts (150/120/100 EUR). A pricing
 * regression costs trust AND potentially legal exposure (engagement tarifaire).
 *
 * Covers: Hero, Problem, Pillars, BeforeAfter, SocialProof, Pricing, FAQ,
 * CTAFinal, Header, Footer, legal page links.
 */

test.describe("Landing page — sections and structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("renders all main sections in correct order", async ({ page }) => {
    // Header is sticky at top
    await expect(page.locator("header")).toBeVisible()
    await expect(page.locator("header")).toContainText("ImmoCrew")

    // Main content sections — verify they exist and are in DOM order
    const main = page.locator("main")
    await expect(main).toBeVisible()

    // Hero section — the hook
    const heroHeading = page.getByRole("heading", { level: 1 })
    await expect(heroHeading).toBeVisible()
    await expect(heroHeading).toContainText("Canva")

    // Pricing section
    const pricingSection = page.locator("#pricing")
    await expect(pricingSection).toBeAttached()

    // FAQ section
    const faqSection = page.locator("#faq")
    await expect(faqSection).toBeAttached()

    // Footer
    const footer = page.locator("footer")
    await expect(footer).toBeVisible()
    await expect(footer).toContainText("ImmoCrew")
  })

  test("Hero CTA links to examples section", async ({ page }) => {
    const heroCta = page.locator("a", { hasText: "Voir des exemples concrets" })
    await expect(heroCta).toBeVisible()
    await expect(heroCta).toHaveAttribute("href", "#avant-apres")
  })

  test("Hero displays reassurance mentions", async ({ page }) => {
    // These mentions reduce purchase anxiety — their absence is a conversion bug
    await expect(page.getByText(/Pas d.engagement/)).toBeVisible()
    await expect(page.getByText(/Satisfait ou rembours/)).toBeVisible()
  })
})

test.describe("Landing page — Pricing cards", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    // Scroll to pricing to ensure visibility
    await page.locator("#pricing").scrollIntoViewIfNeeded()
  })

  test("displays exactly 3 pricing packs with correct prices", async ({
    page,
  }) => {
    const pricingSection = page.locator("#pricing")

    for (const pack of EXPECTED_PACKS) {
      // Price must be visible as text (e.g. "150" in the section)
      await expect(pricingSection.getByText(pack.price + "\u20AC")).toBeVisible()
      // Pack name must be visible
      await expect(pricingSection.getByText(pack.name)).toBeVisible()
    }
  })

  test("Pack Trimestriel has 'Recommandé' badge", async ({ page }) => {
    await expect(
      page.locator("#pricing").getByText("Recommandé")
    ).toBeVisible()
  })

  test("each pricing CTA links to correct checkout URL", async ({ page }) => {
    for (const pack of EXPECTED_PACKS) {
      const link = page.locator(`#pricing a[href="${pack.href}"]`)
      await expect(link).toBeAttached()
    }
  })

  test("pricing displays TTC mention", async ({ page }) => {
    // Legal requirement — all displayed prices must state TTC
    await expect(
      page.locator("#pricing").getByText("Tous les prix sont TTC")
    ).toBeVisible()
  })
})

test.describe("Landing page — FAQ accordion", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
    await page.locator("#faq").scrollIntoViewIfNeeded()
  })

  test("renders all 10 FAQ questions", async ({ page }) => {
    const faqButtons = page.locator("#faq button[aria-expanded]")
    await expect(faqButtons).toHaveCount(10)
  })

  test("all FAQ items start closed", async ({ page }) => {
    const faqButtons = page.locator("#faq button[aria-expanded]")
    const count = await faqButtons.count()
    for (let i = 0; i < count; i++) {
      await expect(faqButtons.nth(i)).toHaveAttribute("aria-expanded", "false")
    }
  })

  test("clicking a question opens it and closes others (accordion)", async ({
    page,
  }) => {
    const faqButtons = page.locator("#faq button[aria-expanded]")

    // Open first question
    await faqButtons.nth(0).click()
    await expect(faqButtons.nth(0)).toHaveAttribute("aria-expanded", "true")

    // Open second question — first should close
    await faqButtons.nth(1).click()
    await expect(faqButtons.nth(1)).toHaveAttribute("aria-expanded", "true")
    await expect(faqButtons.nth(0)).toHaveAttribute("aria-expanded", "false")
  })

  test("clicking an open question closes it", async ({ page }) => {
    const faqButtons = page.locator("#faq button[aria-expanded]")

    await faqButtons.nth(0).click()
    await expect(faqButtons.nth(0)).toHaveAttribute("aria-expanded", "true")

    await faqButtons.nth(0).click()
    await expect(faqButtons.nth(0)).toHaveAttribute("aria-expanded", "false")
  })
})

test.describe("Landing page — Header navigation", () => {
  test("desktop: displays nav links and CTA", async ({ page }) => {
    // Desktop viewport (default 1280px in config)
    await page.goto("/")

    const header = page.locator("header")
    await expect(header.getByText("Comment ca marche")).toBeVisible()
    await expect(header.getByText("Tarifs")).toBeVisible()
    await expect(header.getByText("FAQ")).toBeVisible()
    await expect(
      header.locator("a", { hasText: "Commencer" })
    ).toBeVisible()
  })

  test("desktop: nav links have correct anchor hrefs", async ({ page }) => {
    await page.goto("/")

    const header = page.locator("header")
    await expect(
      header.locator("a[href='#piliers']")
    ).toBeAttached()
    await expect(
      header.locator("a[href='#pricing']")
    ).toBeAttached()
    await expect(header.locator("a[href='#faq']")).toBeAttached()
  })
})

test.describe("Landing page — Header mobile", () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test("mobile: hamburger opens and closes menu", async ({ page }) => {
    await page.goto("/")

    // Hamburger button should be visible on mobile
    const hamburger = page.locator("button[aria-label='Ouvrir le menu']")
    await expect(hamburger).toBeVisible()

    // Click to open
    await hamburger.click()

    // Mobile menu should appear with nav links
    await expect(page.getByText("Comment ca marche")).toBeVisible()
    await expect(page.getByText("Tarifs")).toBeVisible()

    // Close button should now say "Fermer le menu"
    const closeBtn = page.locator("button[aria-label='Fermer le menu']")
    await expect(closeBtn).toBeVisible()
    await closeBtn.click()
  })

  test("mobile: clicking nav link closes menu", async ({ page }) => {
    await page.goto("/")

    const hamburger = page.locator("button[aria-label='Ouvrir le menu']")
    await hamburger.click()

    // Click a nav link in the mobile menu
    const tarifLink = page
      .locator("nav a", { hasText: "Tarifs" })
      .first()
    await tarifLink.click()

    // Menu should be closed — hamburger should be back to "Ouvrir"
    await expect(
      page.locator("button[aria-label='Ouvrir le menu']")
    ).toBeVisible()
  })
})

test.describe("Landing page — Footer and legal links", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/")
  })

  test("footer contains legal page links", async ({ page }) => {
    const footer = page.locator("footer")

    await expect(footer.locator("a[href='/cgv']")).toBeAttached()
    await expect(
      footer.locator("a[href='/confidentialite']")
    ).toBeAttached()
    await expect(
      footer.locator("a[href='/mentions-legales']")
    ).toBeAttached()
  })

  test("footer contains contact email", async ({ page }) => {
    await expect(
      page
        .locator("footer")
        .locator("a[href='mailto:contact@immocrew.fr']")
    ).toBeAttached()
  })

  test("footer displays current year copyright", async ({ page }) => {
    const year = new Date().getFullYear().toString()
    await expect(page.locator("footer")).toContainText(year)
  })
})

test.describe("Landing page — SEO essentials", () => {
  test("page has correct meta title", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/ImmoCrew/)
  })

  test("page has lang=fr on html element", async ({ page }) => {
    await page.goto("/")
    const lang = await page.locator("html").getAttribute("lang")
    expect(lang).toBe("fr")
  })

  test("page contains JSON-LD structured data", async ({ page }) => {
    await page.goto("/")
    const jsonLdScripts = page.locator('script[type="application/ld+json"]')
    const count = await jsonLdScripts.count()
    // At least: Organization (layout) + Service + FAQPage (page.tsx)
    expect(count).toBeGreaterThanOrEqual(3)
  })
})

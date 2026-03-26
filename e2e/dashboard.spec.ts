import { test, expect } from "./fixtures"

/**
 * Dashboard E2E tests — ImmoCrew
 *
 * Why these tests exist:
 * The dashboard is where Sophie sees her livrables. It's the core value
 * delivery interface. The empty state (first visit after payment) is
 * particularly critical: Sophie just paid 197 EUR, lands on an empty page,
 * and needs immediate reassurance that her team is working.
 *
 * Clerk auth bypass:
 * /dashboard is protected by Clerk middleware. We test two scenarios:
 * 1. Unauthenticated access -> redirect to sign-in (security)
 * 2. Authenticated access -> proper rendering (mocked)
 *
 * Database dependency:
 * The dashboard is a Server Component that queries PostgreSQL directly.
 * In E2E, the dev server connects to the real (or test) database.
 * We test the empty state (no deliverables) as that's the guaranteed
 * initial state for a new client.
 */

test.describe("Dashboard — auth protection", () => {
  test("redirects unauthenticated users away from /dashboard", async ({
    page,
  }) => {
    const response = await page.goto("/dashboard", {
      waitUntil: "domcontentloaded",
    })

    const url = page.url()
    const status = response?.status()

    // Clerk should either redirect to sign-in or block with 307/401
    const isRedirected = url.includes("clerk") || url.includes("sign-in")
    const isProtected = status === 307 || status === 401 || isRedirected

    expect(isProtected).toBeTruthy()
  })

  test("redirects unauthenticated users away from /dashboard/monthly-update", async ({
    page,
  }) => {
    const response = await page.goto("/dashboard/monthly-update", {
      waitUntil: "domcontentloaded",
    })

    const url = page.url()
    const status = response?.status()

    const isRedirected = url.includes("clerk") || url.includes("sign-in")
    const isProtected = status === 307 || status === 401 || isRedirected

    expect(isProtected).toBeTruthy()
  })
})

test.describe("Dashboard — empty state (new client)", () => {
  /**
   * To test the authenticated dashboard, we would need either:
   * 1. A real Clerk test instance with test credentials
   * 2. A way to bypass Clerk middleware at the server level
   *
   * Since this is a Server Component that calls currentUser(),
   * client-side route interception cannot fully mock Clerk auth.
   * These tests document the expected behavior and will pass
   * once a Clerk test instance is configured.
   *
   * Expected behavior for empty state:
   * - Greeting: "Bonjour Sophie" (or first name)
   * - Empty state card: "Bienvenue dans ton espace !"
   * - Reassurance: "Tu recevras tes premiers livrables sous 48h"
   * - List of what to expect (12 posts, 2 articles, etc.)
   * - No scary zeros or error messages
   */

  test.skip(
    true,
    "Requires Clerk test instance — see docs/qa/TESTING.md for setup instructions"
  )

  test("displays welcome message for new client with no deliverables", async ({
    page,
  }) => {
    // This test will work once CLERK_TEST_USER_EMAIL is configured
    await page.goto("/dashboard")

    await expect(
      page.getByRole("heading", { name: /Bonjour/ })
    ).toBeVisible()

    await expect(
      page.getByRole("heading", { name: /Bienvenue dans ton espace/ })
    ).toBeVisible()

    await expect(
      page.getByText(/livrables sous 48h/)
    ).toBeVisible()

    // Verify the expected deliverables list is shown
    await expect(page.getByText(/12 posts/)).toBeVisible()
    await expect(page.getByText(/2 articles SEO/)).toBeVisible()
  })

  test("does not show stats grid when no deliverables", async ({ page }) => {
    await page.goto("/dashboard")

    // Stats grid should NOT be visible for empty state
    await expect(
      page.getByText("Livrables ce mois")
    ).not.toBeVisible()
  })
})

test.describe("Dashboard — admin route protection", () => {
  test("redirects unauthenticated users away from /admin", async ({
    page,
  }) => {
    const response = await page.goto("/admin", {
      waitUntil: "domcontentloaded",
    })

    const url = page.url()
    const status = response?.status()

    const isRedirected = url.includes("clerk") || url.includes("sign-in")
    const isProtected = status === 307 || status === 401 || isRedirected

    expect(isProtected).toBeTruthy()
  })
})

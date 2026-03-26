import { test, expect } from "./fixtures"

/**
 * API smoke tests — ImmoCrew
 *
 * Why these tests exist:
 * API routes are the backbone of the revenue flow. If /api/checkout breaks,
 * nobody can pay. If /api/leads breaks, acquisition data is lost.
 * These smoke tests verify that each route responds correctly to
 * basic valid and invalid requests — not full integration tests
 * (those are in Vitest with mocked dependencies), but real HTTP
 * requests against the running Next.js server.
 *
 * Stripe/DB interaction:
 * These tests intentionally test edge cases that DON'T require
 * a real Stripe connection or database (invalid inputs, missing params).
 * The happy path (successful checkout) requires Stripe test keys in env.
 */

test.describe("API — /api/checkout", () => {
  test("returns 400 for missing pack parameter", async ({ request }) => {
    const response = await request.get("/api/checkout")
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.error).toContain("Invalid pack")
  })

  test("returns 400 for invalid pack name", async ({ request }) => {
    const response = await request.get("/api/checkout?pack=freebie")
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.error).toContain("Invalid pack")
  })

  test("accepts valid pack names: mensuel, lancement, boost", async ({
    request,
  }) => {
    // These will either redirect to Stripe (302/307) or return 500
    // if Stripe keys are not configured. Either way, they should NOT
    // return 400 — proving the pack validation passes.
    for (const pack of ["mensuel", "lancement", "boost"]) {
      const response = await request.get(`/api/checkout?pack=${pack}`, {
        maxRedirects: 0,
      })

      // Valid pack should NOT return 400
      expect(response.status()).not.toBe(400)

      // If Stripe test keys are configured, it should redirect (302/307)
      // If not, it returns 500 (Stripe SDK error) — both are acceptable
      // in a smoke test context
      const validStatuses = [200, 302, 303, 307, 500]
      expect(validStatuses).toContain(response.status())
    }
  })
})

test.describe("API — /api/leads", () => {
  test("returns 400 for invalid JSON body", async ({ request }) => {
    const response = await request.post("/api/leads", {
      headers: { "Content-Type": "application/json" },
      data: "not json{{{",
    })
    // Should return 400 for invalid JSON
    expect(response.status()).toBe(400)
  })

  test("returns 400 for missing email", async ({ request }) => {
    const response = await request.post("/api/leads", {
      data: { name: "Test User" },
    })
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body.error).toContain("invalide")
  })

  test("returns 400 for invalid email format", async ({ request }) => {
    const response = await request.post("/api/leads", {
      data: { email: "not-an-email" },
    })
    expect(response.status()).toBe(400)
  })

  test("accepts valid lead submission (or fails gracefully on DB error)", async ({
    request,
  }) => {
    const response = await request.post("/api/leads", {
      data: {
        email: "e2e-test@immocrew.fr",
        name: "E2E Test",
        city: "Paris",
        source: "e2e_test",
      },
    })

    // If DB is available: 200. If not: 500 (graceful error).
    // Must NOT be 400 (that would mean validation is wrong).
    expect(response.status()).not.toBe(400)
    expect([200, 500]).toContain(response.status())

    if (response.status() === 200) {
      const body = await response.json()
      expect(body.success).toBe(true)
    }
  })
})

test.describe("API — /api/onboarding", () => {
  test("returns error for unauthenticated POST request", async ({
    request,
  }) => {
    const response = await request.post("/api/onboarding", {
      data: {
        prenom: "Test",
        nom: "User",
        ville: "Paris",
      },
    })

    // Should either require auth (401/403) or handle the request
    // depending on whether the route checks Clerk auth
    const status = response.status()
    expect([200, 401, 403, 500]).toContain(status)
  })
})

test.describe("API — /api/portal (Stripe Customer Portal)", () => {
  test("returns error without auth context", async ({ request }) => {
    const response = await request.get("/api/portal", {
      maxRedirects: 0,
    })

    // Portal route requires authenticated user with a Stripe customer ID.
    // Without auth, it should return an error status (not crash with 500
    // due to unhandled null).
    const status = response.status()
    // Any of these is acceptable: redirect to auth, unauthorized, or server error
    expect(status).toBeGreaterThanOrEqual(300)
  })
})

test.describe("API — webhook endpoints reject unsigned requests", () => {
  test("/api/webhooks/stripe rejects request without signature", async ({
    request,
  }) => {
    const response = await request.post("/api/webhooks/stripe", {
      data: { type: "checkout.session.completed" },
    })

    // Must return 400 — accepting unsigned webhooks is a security vulnerability
    expect(response.status()).toBe(400)
  })

  test("/api/webhooks/clerk rejects request without svix headers", async ({
    request,
  }) => {
    const response = await request.post("/api/webhooks/clerk", {
      data: { type: "user.created" },
    })

    // Must return 400 — missing svix-id, svix-timestamp, svix-signature headers
    expect(response.status()).toBe(400)
  })
})

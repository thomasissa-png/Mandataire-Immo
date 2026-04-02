/**
 * Tests pour la route GET /api/checkout
 *
 * Pourquoi ces tests existent :
 * - Cette route est le chemin critique de monetisation (CTA pricing -> Stripe Checkout)
 * - Un bug ici = 0 revenu. Chaque cas d'erreur doit etre couvert.
 *
 * Ce qui est mocke :
 * - stripe.checkout.sessions.create : simule la creation de session Stripe
 * - Les env vars STRIPE_* sont definies dans vitest.config.ts
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockSessionCreate } = vi.hoisted(() => ({
  mockSessionCreate: vi.fn(),
}))

vi.mock("@/lib/tracking", () => ({
  trackServer: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: mockSessionCreate,
      },
    },
  },
  STRIPE_PRICES: {
    mensuel: "price_test_mensuel",
    trimestriel: "price_test_trimestriel",
    annuel: "price_test_annuel",
    boost: "price_test_boost",
  },
}))

import { GET } from "@/app/api/checkout/route"
import { NextRequest } from "next/server"

function makeRequest(pack?: string): NextRequest {
  const url = pack
    ? `https://immocrew.fr/api/checkout?pack=${pack}`
    : "https://immocrew.fr/api/checkout"
  return new NextRequest(url)
}

describe("GET /api/checkout", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("returns 400 if pack parameter is missing", async () => {
    const response = await GET(makeRequest())
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain("Invalid pack")
  })

  it("returns 400 if pack is not a valid option", async () => {
    const response = await GET(makeRequest("invalid"))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toContain("Invalid pack")
  })

  it("redirects to Stripe Checkout URL for a valid pack (mensuel)", async () => {
    mockSessionCreate.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/session/test_123",
    })

    const response = await GET(makeRequest("mensuel"))
    // NextResponse.redirect returns a 307 status
    expect(response.status).toBe(307)
    expect(response.headers.get("location")).toBe(
      "https://checkout.stripe.com/session/test_123"
    )
  })

  it("creates a subscription session for pack mensuel", async () => {
    mockSessionCreate.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/session/test_sub",
    })

    await GET(makeRequest("mensuel"))

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_test_mensuel", quantity: 1 }],
        metadata: { pack: "mensuel" },
      })
    )
  })

  it("creates a subscription session for pack trimestriel", async () => {
    mockSessionCreate.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/session/test_tri",
    })

    await GET(makeRequest("trimestriel"))

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_test_trimestriel", quantity: 1 }],
        metadata: { pack: "trimestriel" },
      })
    )
  })

  it("creates a subscription session for pack annuel", async () => {
    mockSessionCreate.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/session/test_ann",
    })

    await GET(makeRequest("annuel"))

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "subscription",
        line_items: [{ price: "price_test_annuel", quantity: 1 }],
        metadata: { pack: "annuel" },
      })
    )
  })

  it("creates a payment session for pack boost (one-shot)", async () => {
    mockSessionCreate.mockResolvedValueOnce({
      url: "https://checkout.stripe.com/session/test_boost",
    })

    await GET(makeRequest("boost"))

    expect(mockSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        line_items: [{ price: "price_test_boost", quantity: 1 }],
        metadata: { pack: "boost" },
      })
    )
  })

  it("returns 500 if Stripe session has no URL", async () => {
    mockSessionCreate.mockResolvedValueOnce({ url: null })

    const response = await GET(makeRequest("mensuel"))
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe("Failed to create checkout session")
  })

  it("returns 500 if Stripe throws an error", async () => {
    mockSessionCreate.mockRejectedValueOnce(new Error("Stripe API error"))

    const response = await GET(makeRequest("mensuel"))
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe("Failed to create checkout session")
  })
})

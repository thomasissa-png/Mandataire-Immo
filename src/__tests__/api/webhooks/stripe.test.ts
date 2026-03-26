/**
 * Tests pour la route POST /api/webhooks/stripe
 *
 * Pourquoi ces tests existent :
 * - Les webhooks Stripe sont le nerf de la guerre : creation de comptes, enregistrement
 *   des paiements, gestion des abonnements et du churn. Un bug ici = comptes non crees,
 *   paiements non enregistres, clients marques comme actifs alors qu'ils ont resilie.
 * - La verification de signature est critique : sans elle, n'importe qui peut
 *   simuler des webhooks et creer de faux comptes.
 *
 * Ce qui est mocke :
 * - stripe.webhooks.constructEvent : simule la verification de signature
 * - query : la fonction d'acces DB via pg pool
 * - next/headers : simule les headers HTTP
 */

import { describe, it, expect, vi, beforeEach } from "vitest"
import type Stripe from "stripe"

// --- Mocks ---

const {
  mockConstructEvent,
  mockQuery,
  mockHeaderStore,
} = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockQuery: vi.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
  mockHeaderStore: { headers: {} as Record<string, string | null> },
}))

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: (...args: unknown[]) => mockConstructEvent(...args),
    },
    customers: {
      retrieve: vi.fn().mockResolvedValue({ deleted: false, email: "test@example.com" }),
    },
  },
}))

vi.mock("@/lib/db", () => ({
  query: (...args: unknown[]) => mockQuery(...args),
}))

vi.mock("@/lib/tracking", () => ({
  trackServer: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("next/headers", () => ({
  headers: () => Promise.resolve({
    get: (key: string) => mockHeaderStore.headers[key] ?? null,
  }),
}))

import { POST } from "@/app/api/webhooks/stripe/route"

function makeRequest(body = "raw-body"): Request {
  return new Request("https://immocrew.fr/api/webhooks/stripe", {
    method: "POST",
    body,
  })
}

function makeStripeEvent(type: string, data: Record<string, unknown>): Stripe.Event {
  return {
    id: "evt_test_123",
    type,
    data: { object: data },
    object: "event",
    api_version: "2024-04-10",
    created: Date.now(),
    livemode: false,
    pending_webhooks: 0,
    request: null,
  } as unknown as Stripe.Event
}

describe("POST /api/webhooks/stripe", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHeaderStore.headers = { "stripe-signature": "sig_test_123" }
    mockQuery.mockResolvedValue({ rows: [], rowCount: 1 })
  })

  // --- Signature verification ---

  it("returns 400 if stripe-signature header is missing", async () => {
    mockHeaderStore.headers = {}
    const response = await POST(makeRequest())
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe("Missing stripe-signature header")
  })

  it("returns 400 if signature verification fails", async () => {
    mockConstructEvent.mockImplementationOnce(() => {
      throw new Error("Invalid signature")
    })

    const response = await POST(makeRequest())
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe("Invalid signature")
  })

  // --- checkout.session.completed ---

  it("creates client and records payment on checkout.session.completed", async () => {
    const event = makeStripeEvent("checkout.session.completed", {
      customer_email: "sophie@example.com",
      customer: "cus_test_123",
      metadata: { pack: "lancement" },
      subscription: null,
      amount_total: 49700,
      currency: "eur",
      id: "cs_test_123",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)

    // First call: INSERT INTO clients (upsert)
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO clients"),
      expect.arrayContaining([
        "sophie@example.com",
        "cus_test_123",
        "lancement",
        "active",
      ])
    )

    // Second call: INSERT INTO payments
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO payments"),
      expect.arrayContaining([
        "sophie@example.com",
        "cs_test_123",
        "cus_test_123",
        497,
        "eur",
        "lancement",
        "completed",
      ])
    )
  })

  it("defaults to pack 'mensuel' if metadata.pack is missing", async () => {
    const event = makeStripeEvent("checkout.session.completed", {
      customer_email: "sophie@example.com",
      customer: "cus_test_123",
      metadata: {},
      subscription: "sub_test_123",
      amount_total: 19700,
      currency: "eur",
      id: "cs_test_456",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    await POST(makeRequest())

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO clients"),
      expect.arrayContaining(["mensuel"])
    )
  })

  it("skips client creation if customer_email is null", async () => {
    const event = makeStripeEvent("checkout.session.completed", {
      customer_email: null,
      customer: "cus_test_123",
      metadata: { pack: "mensuel" },
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  // --- invoice.paid ---

  it("records payment on invoice.paid", async () => {
    const event = makeStripeEvent("invoice.paid", {
      customer_email: "sophie@example.com",
      customer: "cus_test_123",
      amount_paid: 19700,
      currency: "eur",
      id: "in_test_123",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO payments"),
      expect.arrayContaining([
        "sophie@example.com",
        197,
        "mensuel",
        "completed",
      ])
    )
  })

  it("skips payment recording on invoice.paid if no customer_email", async () => {
    const event = makeStripeEvent("invoice.paid", {
      customer_email: null,
      customer: "cus_test_123",
      amount_paid: 19700,
      currency: "eur",
      id: "in_test_456",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)
    expect(mockQuery).not.toHaveBeenCalled()
  })

  // --- customer.subscription.updated ---

  it("updates client status to active when subscription is active", async () => {
    const event = makeStripeEvent("customer.subscription.updated", {
      customer: "cus_test_123",
      status: "active",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE clients SET status"),
      ["active", "cus_test_123"]
    )
  })

  it("updates client status to inactive when subscription is past_due", async () => {
    const event = makeStripeEvent("customer.subscription.updated", {
      customer: "cus_test_123",
      status: "past_due",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    await POST(makeRequest())

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE clients SET status"),
      ["inactive", "cus_test_123"]
    )
  })

  // --- customer.subscription.deleted ---

  it("marks client as churned on subscription.deleted", async () => {
    const event = makeStripeEvent("customer.subscription.deleted", {
      customer: "cus_test_123",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("UPDATE clients SET status"),
      ["churned", "cus_test_123"]
    )
  })

  // --- Unknown event ---

  it("returns 200 for unhandled event types (graceful handling)", async () => {
    const event = makeStripeEvent("charge.refunded", {})
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.received).toBe(true)
  })

  // --- Error handling ---

  it("returns 500 if webhook handler throws an unexpected error", async () => {
    const event = makeStripeEvent("checkout.session.completed", {
      customer_email: "sophie@example.com",
      customer: "cus_test_123",
      metadata: { pack: "mensuel" },
      subscription: null,
      amount_total: 19700,
      currency: "eur",
      id: "cs_test_err",
    })
    mockConstructEvent.mockReturnValueOnce(event)
    mockQuery.mockRejectedValueOnce(new Error("DB crashed"))

    const response = await POST(makeRequest())
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe("Webhook handler failed")
  })
})

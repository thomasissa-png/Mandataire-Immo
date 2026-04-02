/**
 * Tests pour la route POST /api/webhooks/stripe
 *
 * Pourquoi ces tests existent :
 * - Les webhooks Stripe sont le nerf de la guerre : creation de comptes, enregistrement
 *   des paiements, gestion des abonnements et du churn. Un bug ici = comptes non crees,
 *   paiements non enregistres, clients marques comme actifs alors qu'ils ont resilie.
 * - La verification de signature est critique : sans elle, n'importe qui peut
 *   simuler des webhooks et creer de faux comptes.
 * - Le traitement des codes parrainage est critique pour l'acquisition : un filleul
 *   non creditee = un parrain frustre = bouche-a-oreille casse.
 *
 * Ce qui est mocke :
 * - stripe.webhooks.constructEvent : simule la verification de signature
 * - stripe.subscriptions.retrieve : simule la recuperation de metadata pack
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
  mockSubscriptionRetrieve,
} = vi.hoisted(() => ({
  mockConstructEvent: vi.fn(),
  mockQuery: vi.fn().mockResolvedValue({ rows: [], rowCount: 1 }),
  mockHeaderStore: { headers: {} as Record<string, string | null> },
  mockSubscriptionRetrieve: vi.fn(),
}))

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: (...args: unknown[]) => mockConstructEvent(...args),
    },
    customers: {
      retrieve: vi.fn().mockResolvedValue({ deleted: false, email: "test@example.com" }),
    },
    subscriptions: {
      retrieve: (...args: unknown[]) => mockSubscriptionRetrieve(...args),
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
    mockSubscriptionRetrieve.mockResolvedValue({ metadata: { pack: "mensuel" } })
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
      metadata: { pack: "mensuel" },
      subscription: null,
      amount_total: 15000,
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
        "mensuel",
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
        150,
        "eur",
        "mensuel",
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
      amount_total: 15000,
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

  // --- checkout.session.completed — referral processing ---

  it("processes referral code on checkout with valid referral", async () => {
    // Mock referral code lookup
    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT clients
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT payments
      .mockResolvedValueOnce({ rows: [{ id: "rc_1", user_id: "user_parrain" }], rowCount: 1 }) // SELECT referral_codes
      .mockResolvedValueOnce({ rows: [{ id: "user_filleul" }], rowCount: 1 }) // SELECT clients (referee)
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT referrals
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // UPDATE clients (credit)

    const event = makeStripeEvent("checkout.session.completed", {
      customer_email: "filleul@example.com",
      customer: "cus_filleul",
      metadata: { pack: "mensuel", referral_code: "IMMOCREW-SOPH7K2M" },
      subscription: "sub_test_ref",
      amount_total: 15000,
      currency: "eur",
      id: "cs_test_ref",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)

    // Should have inserted into referrals
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO referrals"),
      expect.arrayContaining(["rc_1", "user_parrain", "user_filleul", "filleul@example.com"])
    )

    // Should have credited the referrer
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("referral_credit_months_remaining + 1"),
      ["user_parrain"]
    )
  })

  it("does not process referral if no referral_code in metadata", async () => {
    const event = makeStripeEvent("checkout.session.completed", {
      customer_email: "solo@example.com",
      customer: "cus_solo",
      metadata: { pack: "mensuel" },
      subscription: null,
      amount_total: 15000,
      currency: "eur",
      id: "cs_test_solo",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    await POST(makeRequest())

    // Should NOT query referral_codes
    expect(mockQuery).not.toHaveBeenCalledWith(
      expect.stringContaining("referral_codes"),
      expect.anything()
    )
  })

  it("handles invalid referral code gracefully", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT clients
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT payments
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // SELECT referral_codes — not found

    const event = makeStripeEvent("checkout.session.completed", {
      customer_email: "filleul@example.com",
      customer: "cus_filleul",
      metadata: { pack: "mensuel", referral_code: "IMMOCREW-INVALID" },
      subscription: "sub_test_bad",
      amount_total: 15000,
      currency: "eur",
      id: "cs_test_bad_ref",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200) // Should not crash
  })

  // --- invoice.paid ---

  it("records payment on invoice.paid with correct pack from subscription", async () => {
    mockSubscriptionRetrieve.mockResolvedValueOnce({
      metadata: { pack: "trimestriel" },
    })

    // Mock query responses: INSERT payments, then SELECT credit
    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT payments
      .mockResolvedValueOnce({ rows: [{ referral_credit_months_remaining: 0 }], rowCount: 1 }) // SELECT credit

    const event = makeStripeEvent("invoice.paid", {
      customer_email: "sophie@example.com",
      customer: "cus_test_123",
      subscription: "sub_test_tri",
      amount_paid: 36000,
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
        360,
        "trimestriel",
        "completed",
      ])
    )
  })

  it("applies referral credit on invoice.paid when credit months remaining > 0", async () => {
    mockSubscriptionRetrieve.mockResolvedValueOnce({
      metadata: { pack: "mensuel" },
    })

    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // INSERT payments
      .mockResolvedValueOnce({ rows: [{ referral_credit_months_remaining: 2 }], rowCount: 1 }) // SELECT credit
      .mockResolvedValueOnce({ rows: [], rowCount: 1 }) // UPDATE credit

    const event = makeStripeEvent("invoice.paid", {
      customer_email: "parrain@example.com",
      customer: "cus_parrain",
      subscription: "sub_parrain",
      amount_paid: 15000,
      currency: "eur",
      id: "in_credit",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    const response = await POST(makeRequest())
    expect(response.status).toBe(200)

    // Should decrement credit
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("referral_credit_months_remaining - 1"),
      ["cus_parrain"]
    )
  })

  it("skips payment recording on invoice.paid if no customer_email", async () => {
    const event = makeStripeEvent("invoice.paid", {
      customer_email: null,
      customer: "cus_test_123",
      amount_paid: 15000,
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

  // --- invoice.payment_failed ---

  it("records failed payment with correct pack", async () => {
    mockSubscriptionRetrieve.mockResolvedValueOnce({
      metadata: { pack: "annuel" },
    })

    const event = makeStripeEvent("invoice.payment_failed", {
      customer_email: "sophie@example.com",
      customer: "cus_test_fail",
      subscription: "sub_annuel",
      amount_due: 120000,
      currency: "eur",
      id: "in_fail_123",
    })
    mockConstructEvent.mockReturnValueOnce(event)

    await POST(makeRequest())

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO payments"),
      expect.arrayContaining([
        "sophie@example.com",
        1200,
        "annuel",
        "failed",
      ])
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
      amount_total: 15000,
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

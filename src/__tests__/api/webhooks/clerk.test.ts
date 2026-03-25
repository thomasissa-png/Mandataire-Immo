/**
 * Tests pour la route POST /api/webhooks/clerk
 *
 * Pourquoi ces tests existent :
 * - Le webhook Clerk synchronise les utilisateurs avec Supabase.
 * - Si la verification de signature svix echoue silencieusement, n'importe qui
 *   peut injecter de faux utilisateurs en base.
 * - Si le sync Supabase echoue, les clients payes n'ont pas de clerk_user_id
 *   et ne peuvent pas acceder a leur dashboard.
 *
 * Ce qui est mocke :
 * - svix Webhook.verify : simule la verification de signature
 * - createAdminSupabaseClient : retourne un client Supabase mock
 * - next/headers : simule les headers HTTP
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

// --- Mocks ---

const { mockVerify, mockUpsert, mockHeaderStore } = vi.hoisted(() => ({
  mockVerify: vi.fn(),
  mockUpsert: vi.fn().mockResolvedValue({ error: null }),
  mockHeaderStore: { headers: {} as Record<string, string | null> },
}))

vi.mock("svix", () => {
  class MockWebhook {
    verify(...args: unknown[]) {
      return mockVerify(...args)
    }
  }
  return { Webhook: MockWebhook }
})

vi.mock("@/lib/supabase", () => ({
  createAdminSupabaseClient: () => ({
    from: () => ({
      upsert: mockUpsert,
    }),
  }),
}))

vi.mock("next/headers", () => ({
  headers: () => Promise.resolve({
    get: (key: string) => mockHeaderStore.headers[key] ?? null,
  }),
}))

import { POST } from "@/app/api/webhooks/clerk/route"

function makeRequest(body = "{}"): Request {
  return new Request("https://immocrew.fr/api/webhooks/clerk", {
    method: "POST",
    body,
  })
}

const VALID_CLERK_EVENT = {
  type: "user.created",
  data: {
    id: "user_test_123",
    email_addresses: [
      { email_address: "sophie@example.com", id: "email_test_1" },
    ],
    first_name: "Sophie",
    last_name: "Martin",
    created_at: Date.now(),
  },
}

describe("POST /api/webhooks/clerk", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockHeaderStore.headers = {
      "svix-id": "msg_test_123",
      "svix-timestamp": "1234567890",
      "svix-signature": "v1,test_signature",
    }
    mockUpsert.mockResolvedValue({ error: null })
  })

  // --- Header validation ---

  it("returns 400 if svix-id header is missing", async () => {
    mockHeaderStore.headers = {
      "svix-timestamp": "1234567890",
      "svix-signature": "v1,test_signature",
    }

    const response = await POST(makeRequest())
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe("Missing svix headers")
  })

  it("returns 400 if svix-timestamp header is missing", async () => {
    mockHeaderStore.headers = {
      "svix-id": "msg_test_123",
      "svix-signature": "v1,test_signature",
    }

    const response = await POST(makeRequest())
    expect(response.status).toBe(400)
  })

  it("returns 400 if svix-signature header is missing", async () => {
    mockHeaderStore.headers = {
      "svix-id": "msg_test_123",
      "svix-timestamp": "1234567890",
    }

    const response = await POST(makeRequest())
    expect(response.status).toBe(400)
  })

  // --- Signature verification ---

  it("returns 400 if svix signature verification fails", async () => {
    mockVerify.mockImplementationOnce(() => {
      throw new Error("Invalid signature")
    })

    const response = await POST(makeRequest())
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe("Invalid signature")
  })

  // --- user.created event ---

  it("upserts client in Supabase on user.created event", async () => {
    mockVerify.mockReturnValueOnce(VALID_CLERK_EVENT)

    const response = await POST(makeRequest(JSON.stringify(VALID_CLERK_EVENT)))
    expect(response.status).toBe(200)

    expect(mockUpsert).toHaveBeenCalledWith(
      {
        email: "sophie@example.com",
        clerk_user_id: "user_test_123",
        first_name: "Sophie",
        last_name: "Martin",
      },
      { onConflict: "email" }
    )
  })

  it("returns 200 without upsert if user has no email", async () => {
    const eventNoEmail = {
      ...VALID_CLERK_EVENT,
      data: {
        ...VALID_CLERK_EVENT.data,
        email_addresses: [],
      },
    }
    mockVerify.mockReturnValueOnce(eventNoEmail)

    const response = await POST(makeRequest(JSON.stringify(eventNoEmail)))
    expect(response.status).toBe(200)
    expect(mockUpsert).not.toHaveBeenCalled()
  })

  it("handles null first_name and last_name", async () => {
    const eventNullNames = {
      ...VALID_CLERK_EVENT,
      data: {
        ...VALID_CLERK_EVENT.data,
        first_name: null,
        last_name: null,
      },
    }
    mockVerify.mockReturnValueOnce(eventNullNames)

    await POST(makeRequest(JSON.stringify(eventNullNames)))

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        first_name: null,
        last_name: null,
      }),
      expect.any(Object)
    )
  })

  // --- Ignored event types ---

  it("returns 200 and does not upsert for non-user.created events", async () => {
    const otherEvent = { type: "user.updated", data: {} }
    mockVerify.mockReturnValueOnce(otherEvent)

    const response = await POST(makeRequest(JSON.stringify(otherEvent)))
    expect(response.status).toBe(200)
    expect(mockUpsert).not.toHaveBeenCalled()
  })
})

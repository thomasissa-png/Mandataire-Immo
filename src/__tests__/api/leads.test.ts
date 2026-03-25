/**
 * Tests pour la route POST /api/leads
 *
 * Pourquoi ces tests existent :
 * - La capture de leads est le deuxieme chemin de conversion (lead magnet "Voir un exemple pour ma zone").
 * - Un email invalide qui passe = donnees pourries en base.
 * - Une erreur Supabase silencieuse = leads perdus sans alerte.
 *
 * Ce qui est mocke :
 * - createAdminSupabaseClient : retourne un client Supabase mock avec .from().upsert()
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockUpsert } = vi.hoisted(() => ({
  mockUpsert: vi.fn(),
}))

vi.mock("@/lib/supabase", () => ({
  createAdminSupabaseClient: () => ({
    from: () => ({
      upsert: mockUpsert,
    }),
  }),
}))

import { POST } from "@/app/api/leads/route"
import { NextRequest } from "next/server"

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("https://immocrew.fr/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function makeRawRequest(body: string): NextRequest {
  return new NextRequest("https://immocrew.fr/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  })
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUpsert.mockResolvedValue({ error: null })
  })

  it("returns 400 if body is not valid JSON", async () => {
    const response = await POST(makeRawRequest("not-json"))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe("Invalid JSON body")
  })

  it("returns 400 if email is missing", async () => {
    const response = await POST(makeRequest({ name: "Sophie" }))
    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBe("Email invalide")
  })

  it("returns 400 if email has no @", async () => {
    const response = await POST(makeRequest({ email: "sophie.martin" }))
    expect(response.status).toBe(400)
  })

  it("returns 400 if email has no dot", async () => {
    const response = await POST(makeRequest({ email: "sophie@martin" }))
    expect(response.status).toBe(400)
  })

  it("returns 200 with success on valid email", async () => {
    const response = await POST(
      makeRequest({ email: "sophie@example.com", city: "Angers" })
    )
    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it("upserts lead with lowercased and trimmed email", async () => {
    await POST(
      makeRequest({
        email: "  Sophie@Example.COM  ",
        name: "Sophie Martin",
        city: "Angers",
        source: "footer_cta",
      })
    )

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "sophie@example.com",
        name: "Sophie Martin",
        city: "Angers",
        source: "footer_cta",
      }),
      { onConflict: "email" }
    )
  })

  it("uses default source 'landing_hero' if not provided", async () => {
    await POST(makeRequest({ email: "sophie@example.com" }))

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "landing_hero",
      }),
      expect.any(Object)
    )
  })

  it("stores null for optional fields when not provided", async () => {
    await POST(makeRequest({ email: "sophie@example.com" }))

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: null,
        city: null,
      }),
      expect.any(Object)
    )
  })

  it("returns 500 if Supabase upsert fails", async () => {
    mockUpsert.mockResolvedValueOnce({
      error: { message: "DB connection failed" },
    })

    const response = await POST(
      makeRequest({ email: "sophie@example.com" })
    )
    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe("Erreur lors de l'enregistrement")
  })
})

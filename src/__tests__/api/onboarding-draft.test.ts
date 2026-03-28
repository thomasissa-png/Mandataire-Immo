/**
 * Tests pour les routes GET et PATCH /api/onboarding/draft
 *
 * Pourquoi ces tests existent :
 * - Le brouillon d'onboarding est la seule protection contre la perte de données
 *   si Sophie ferme son navigateur en plein wizard (10 étapes).
 * - Un PATCH qui écrase au lieu de merger = retour à l'étape 1.
 * - Un GET qui plante = wizard bloqué, Sophie ne peut pas s'inscrire.
 *
 * Ce qui est mocké :
 * - getSessionUser : simule l'authentification NextAuth
 * - query : la fonction d'accès DB via pg pool
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockQuery, mockGetSessionUser } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockGetSessionUser: vi.fn(),
}))

vi.mock("@/lib/db", () => ({
  query: (...args: unknown[]) => mockQuery(...args),
}))

vi.mock("@/lib/getSessionUser", () => ({
  getSessionUser: () => mockGetSessionUser(),
}))

import { GET, PATCH } from "@/app/api/onboarding/draft/route"
import { NextRequest } from "next/server"

const MOCK_USER = {
  id: "usr_test_123",
  email: "sophie@example.com",
  name: "Sophie Martin",
  firstName: "Sophie",
}

function makePatchRequest(body: unknown): NextRequest {
  return new NextRequest("https://immocrew.fr/api/onboarding/draft", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("GET /api/onboarding/draft", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await GET()
    expect(response.status).toBe(401)
  })

  it("retourne un brouillon vide si pas de client", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.step).toBe(0)
    expect(data.data).toEqual({})
  })

  it("retourne un brouillon vide si onboarding_draft est null", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          onboarding_draft: null,
          onboarding_draft_step: null,
          onboarding_draft_updated_at: null,
        },
      ],
    })

    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.step).toBe(0)
    expect(data.data).toEqual({})
  })

  it("retourne le brouillon existant avec step et data", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          onboarding_draft: { prenom: "Sophie", ville: "Angers" },
          onboarding_draft_step: 3,
          onboarding_draft_updated_at: "2026-03-28T10:00:00Z",
        },
      ],
    })

    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.step).toBe(3)
    expect(data.data.prenom).toBe("Sophie")
    expect(data.data.ville).toBe("Angers")
    expect(data.updated_at).toBe("2026-03-28T10:00:00Z")
  })
})

describe("PATCH /api/onboarding/draft", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await PATCH(
      makePatchRequest({ step: 1, data: { prenom: "Sophie" } })
    )
    expect(response.status).toBe(401)
  })

  it("merge les données dans le brouillon existant", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })

    const response = await PATCH(
      makePatchRequest({ step: 2, data: { ville: "Angers", departement: "49" } })
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.step).toBe(2)
    expect(data.data.ville).toBe("Angers")

    // Vérifier que la requête SQL utilise le COALESCE || pour merger
    const sqlCall = mockQuery.mock.calls[0]
    expect(sqlCall[0]).toContain("COALESCE")
    expect(sqlCall[0]).toContain("||")
  })

  it("met à jour le step", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })

    const response = await PATCH(
      makePatchRequest({ step: 5, data: { ton_communication: "Direct" } })
    )
    expect(response.status).toBe(200)

    const sqlCall = mockQuery.mock.calls[0]
    expect(sqlCall[1][1]).toBe(5)
  })

  it("rejette si step n'est pas un number", async () => {
    const response = await PATCH(
      makePatchRequest({ step: "trois", data: { prenom: "Sophie" } })
    )
    expect(response.status).toBe(400)
  })

  it("rejette si data n'est pas un objet", async () => {
    const response = await PATCH(
      makePatchRequest({ step: 1, data: "invalid" })
    )
    expect(response.status).toBe(400)
  })

  it("rejette un body JSON invalide", async () => {
    const request = new NextRequest("https://immocrew.fr/api/onboarding/draft", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    })

    const response = await PATCH(request)
    expect(response.status).toBe(400)
  })

  it("retourne 500 si la base de données échoue", async () => {
    mockQuery.mockRejectedValueOnce(new Error("DB connection failed"))

    const response = await PATCH(
      makePatchRequest({ step: 1, data: { prenom: "Sophie" } })
    )
    expect(response.status).toBe(500)
  })
})

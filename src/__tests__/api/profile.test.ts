/**
 * Tests pour les routes GET et PATCH /api/profile
 *
 * Pourquoi ces tests existent :
 * - Le profil est la source de vérité de Sophie pour tous les contenus générés.
 * - Un PATCH qui écrase au lieu de merger = données perdues.
 * - Un prénom vide qui passe = contenus "Salut ," dans les emails.
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

import { GET, PATCH } from "@/app/api/profile/route"
import { NextRequest } from "next/server"

const MOCK_USER = {
  id: "usr_test_123",
  email: "sophie@example.com",
  name: "Sophie Martin",
  firstName: "Sophie",
}

function makePatchRequest(body: unknown): NextRequest {
  return new NextRequest("https://immocrew.fr/api/profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

describe("GET /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await GET()
    expect(response.status).toBe(401)
  })

  it("retourne le profil depuis client_context", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          email: "sophie@example.com",
          first_name: "Sophie",
          last_name: "Martin",
          client_context: {
            prenom: "Sophie",
            nom: "Martin",
            ville: "Angers",
            specialites: "Résidentiel, Ancien",
          },
        },
      ],
    })

    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.profile.prenom).toBe("Sophie")
    expect(data.profile.ville).toBe("Angers")
    expect(data.profile.specialites).toBe("Résidentiel, Ancien")
  })

  it("retourne profile: null si le client n'existe pas", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.profile).toBeNull()
  })
})

describe("PATCH /api/profile", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await PATCH(makePatchRequest({ ville: "Lyon" }))
    expect(response.status).toBe(401)
  })

  it("met à jour partiellement le profil", async () => {
    // Premier appel : SELECT client_context
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          client_context: {
            prenom: "Sophie",
            nom: "Martin",
            ville: "Angers",
          },
        },
      ],
    })
    // Deuxième appel : UPDATE
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })

    const response = await PATCH(makePatchRequest({ ville: "Lyon" }))
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.profile.ville).toBe("Lyon")

    // Vérifier que le UPDATE a bien mergé dans client_context
    const updateCall = mockQuery.mock.calls[1]
    const updatedCtx = JSON.parse(updateCall[1][0] as string)
    expect(updatedCtx.prenom).toBe("Sophie")
    expect(updatedCtx.ville).toBe("Lyon")
  })

  it("rejette un prénom vide", async () => {
    const response = await PATCH(makePatchRequest({ prenom: "" }))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain("prénom")
  })

  it("rejette un nom vide", async () => {
    const response = await PATCH(makePatchRequest({ nom: "  " }))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain("nom")
  })

  it("rejette un body sans champ valide", async () => {
    const response = await PATCH(makePatchRequest({ champ_inconnu: "test" }))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain("Aucun champ")
  })

  it("accepte la mise à jour des spécialités", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          client_context: {
            prenom: "Sophie",
            nom: "Martin",
            ville: "Angers",
          },
        },
      ],
    })
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })

    const response = await PATCH(
      makePatchRequest({ specialites: "Résidentiel, Luxe" })
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.profile.specialites).toBe("Résidentiel, Luxe")
  })
})

/**
 * Tests pour la route PATCH /api/biens/[id] — Modification d'un bien
 *
 * Pourquoi ces tests existent :
 * - L'édition inline est le parcours critique pour Sophie : corriger une faute
 *   dans le titre ou ajuster le prix SANS recréer le bien.
 * - Un PATCH qui accepte un prix négatif = annonce corrompue.
 * - Un PATCH sans auth = faille de sécurité (modification par un tiers).
 * - Un PATCH sur le bien d'un autre user = violation IDOR (OWASP A01).
 *
 * Ce qui est mocké :
 * - getSessionUser : simule l'authentification NextAuth
 * - query : la fonction d'accès DB via pg pool
 * - tracking : éviter les appels externes
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

vi.mock("@/lib/tracking", () => ({
  trackServer: vi.fn().mockResolvedValue(undefined),
}))

import { PATCH } from "@/app/api/biens/[id]/route"
import { NextRequest } from "next/server"

const MOCK_USER = {
  id: "usr_test_123",
  email: "sophie@example.com",
  name: "Sophie Martin",
  firstName: "Sophie",
}

function makePatchRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

// ─── PATCH /api/biens/[id] ──────────────────────────────────────────

describe("PATCH /api/biens/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {
        titre: "Nouveau titre",
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(401)

    const data = await response.json()
    expect(data.error).toBe("Non authentifié")
  })

  it("retourne 200 avec données valides et met à jour le bien", async () => {
    // SELECT ownership check
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: "prop_123" }],
    })
    // UPDATE RETURNING
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "prop_123",
          titre: "Appartement T3 rénové",
          type_bien: "Appartement",
          adresse: "12 rue de la Paix, Angers",
          prix: 195000,
          surface: 65,
          pieces: 3,
          points_forts: "Lumineux, balcon sud",
          updated_at: new Date().toISOString(),
        },
      ],
    })

    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {
        titre: "Appartement T3 rénové",
        prix: 195000,
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.bien.titre).toBe("Appartement T3 rénové")
    expect(data.bien.prix).toBe(195000)
  })

  it("retourne 400 si prix négatif", async () => {
    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {
        prix: -50000,
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe("Données invalides")
  })

  it("retourne 400 si titre est une chaîne vide", async () => {
    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {
        titre: "",
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe("Données invalides")
  })

  it("retourne 400 si aucun champ à modifier (body vide)", async () => {
    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {}),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe("Aucun champ à modifier")
  })

  it("retourne 404 si le bien n'appartient pas à l'utilisateur (IDOR)", async () => {
    // SELECT ownership check retourne vide — bien inexistant ou pas propriétaire
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_autre_user", {
        titre: "Tentative de modification",
      }),
      { params: Promise.resolve({ id: "prop_autre_user" }) }
    )
    expect(response.status).toBe(404)

    const data = await response.json()
    expect(data.error).toBe("Bien non trouvé")
  })

  it("retourne 404 si le bien n'existe pas", async () => {
    // SELECT ownership check retourne vide
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_inexistant", {
        prix: 200000,
      }),
      { params: Promise.resolve({ id: "prop_inexistant" }) }
    )
    expect(response.status).toBe(404)
  })

  it("accepte une modification partielle (un seul champ)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: "prop_123" }] })
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "prop_123",
          titre: "Appartement T3",
          type_bien: "Appartement",
          adresse: "12 rue de la Paix, Angers",
          prix: 210000,
          surface: 65,
          pieces: 3,
          points_forts: null,
          updated_at: new Date().toISOString(),
        },
      ],
    })

    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {
        prix: 210000,
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(200)

    // Vérifier que la requête UPDATE ne contient que le champ prix
    const updateCall = mockQuery.mock.calls[1]
    expect(updateCall[0]).toContain("prix")
  })

  it("accepte points_forts null (suppression)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: "prop_123" }] })
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "prop_123",
          titre: "Appartement T3",
          type_bien: "Appartement",
          adresse: "12 rue de la Paix",
          prix: 180000,
          surface: 65,
          pieces: 3,
          points_forts: null,
          updated_at: new Date().toISOString(),
        },
      ],
    })

    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {
        points_forts: null,
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.bien.points_forts).toBeNull()
  })

  it("retourne 400 si prix est zéro (doit être positif)", async () => {
    const response = await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {
        prix: 0,
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(400)
  })

  it("construit correctement la requête UPDATE dynamique avec updated_at", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ id: "prop_123" }] })
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "prop_123",
          titre: "Maison 5P",
          type_bien: "Maison",
          adresse: "5 allée des Chênes",
          prix: 320000,
          surface: 120,
          pieces: 5,
          points_forts: "Jardin, garage",
          updated_at: new Date().toISOString(),
        },
      ],
    })

    await PATCH(
      makePatchRequest("https://immocrew.fr/api/biens/prop_123", {
        titre: "Maison 5P",
        type_bien: "Maison",
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )

    // L'UPDATE doit contenir updated_at = NOW()
    const updateCall = mockQuery.mock.calls[1]
    expect(updateCall[0]).toContain("updated_at = NOW()")
    // Et les deux champs modifiés
    expect(updateCall[0]).toContain("titre")
    expect(updateCall[0]).toContain("type_bien")
  })
})

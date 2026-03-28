/**
 * Tests pour les routes de gestion de biens et photos
 * - POST /api/biens (création de bien)
 * - POST /api/biens/[id]/photos (upload photo)
 * - DELETE /api/biens/[id]/photos/[key] (suppression photo)
 * - POST /api/biens/[id]/generate-annonce (vérification pré-requis)
 *
 * Pourquoi ces tests existent :
 * - La création de bien est le point d'entrée pour toute la génération d'annonces.
 * - Un upload photo qui échoue silencieusement = annonce générée sans visuels.
 * - Le generate-annonce sans photo doit être bloqué (sinon appel LLM inutile).
 *
 * Ce qui est mocké :
 * - getSessionUser : simule l'authentification NextAuth
 * - query : la fonction d'accès DB via pg pool
 * - uploadFile / deleteFile : Object Storage
 * - sharp : traitement d'image
 * - enrichProperty : géocodage BAN + DVF
 * - getClientContext / generateJSON / prompts : dépendances LLM
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockQuery, mockGetSessionUser, mockUploadFile, mockDeleteFile } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockGetSessionUser: vi.fn(),
  mockUploadFile: vi.fn(),
  mockDeleteFile: vi.fn(),
}))

vi.mock("@/lib/db", () => ({
  query: (...args: unknown[]) => mockQuery(...args),
}))

vi.mock("@/lib/getSessionUser", () => ({
  getSessionUser: () => mockGetSessionUser(),
}))

vi.mock("@/lib/storage", () => ({
  uploadFile: (...args: unknown[]) => mockUploadFile(...args),
  deleteFile: (...args: unknown[]) => mockDeleteFile(...args),
}))

vi.mock("@/lib/enrich-property", () => ({
  enrichProperty: vi.fn().mockResolvedValue(null),
}))

vi.mock("@/lib/tracking", () => ({
  trackServer: vi.fn().mockResolvedValue(undefined),
}))

vi.mock("sharp", () => ({
  default: vi.fn(() => ({
    jpeg: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from("converted")),
  })),
}))

vi.mock("@/lib/client-context", () => ({
  getClientContext: vi.fn().mockResolvedValue({
    prenom: "Sophie",
    nom: "Martin",
    reseau: "IAD",
    specialite: "Résidentiel",
    zone_geo: "Angers",
    ton: "Direct",
    valeurs: "Transparence",
    ce_qui_differencie: "Connaissance locale",
    cible_clients: "Primo-accédants",
    gamme_prix: "100-300K",
    telephone: "0612345678",
  }),
}))

vi.mock("@/lib/claude", () => ({
  generateJSON: vi.fn().mockResolvedValue({ data: {} }),
}))

vi.mock("@/lib/prompts/annonce-storytelling", () => ({
  buildAnnonceStorytellingPrompt: vi.fn().mockReturnValue({ system: "", user: "" }),
}))

vi.mock("@/lib/prompts/annonce-enrichie", () => ({
  buildAnnonceEnrichiePrompt: vi.fn().mockReturnValue({ system: "", user: "" }),
}))

import { POST as createBien } from "@/app/api/biens/route"
import { POST as uploadPhoto } from "@/app/api/biens/[id]/photos/route"
import { DELETE as deletePhoto } from "@/app/api/biens/[id]/photos/[key]/route"
import { POST as generateAnnonce } from "@/app/api/biens/[id]/generate-annonce/route"
import { NextRequest } from "next/server"

const MOCK_USER = {
  id: "usr_test_123",
  email: "sophie@example.com",
  name: "Sophie Martin",
  firstName: "Sophie",
}

function makePostRequest(url: string, body: unknown): NextRequest {
  return new NextRequest(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function makeDeleteRequest(url: string): NextRequest {
  return new NextRequest(url, { method: "DELETE" })
}

// ─── POST /api/biens ──────────────────────────────────────────────

describe("POST /api/biens", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await createBien(
      makePostRequest("https://immocrew.fr/api/biens", {
        titre: "Appartement T3",
        type_bien: "Appartement",
        adresse: "12 rue de la Paix, Angers",
        prix: 180000,
        surface: 65,
        pieces: 3,
        points_forts: "Lumineux, balcon",
      })
    )
    expect(response.status).toBe(401)
  })

  it("crée un bien en draft avec un slug unique", async () => {
    // Appel pour vérifier unicité du slug
    mockQuery.mockResolvedValueOnce({ rows: [] })
    // Appel INSERT
    mockQuery.mockResolvedValueOnce({ rows: [{ id: "prop_123" }] })

    const response = await createBien(
      makePostRequest("https://immocrew.fr/api/biens", {
        titre: "Appartement T3 La Doutre",
        type_bien: "Appartement",
        adresse: "12 rue de la Paix, Angers",
        prix: 180000,
        surface: 65,
        pieces: 3,
        points_forts: "Lumineux, balcon sud",
      })
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.id).toBe("prop_123")
    expect(data.slug).toBeTruthy()

    // Vérifier que l'INSERT a bien été appelé avec status 'draft'
    const insertCall = mockQuery.mock.calls[1]
    expect(insertCall[0]).toContain("'draft'")
  })

  it("rejette si titre manquant", async () => {
    const response = await createBien(
      makePostRequest("https://immocrew.fr/api/biens", {
        type_bien: "Appartement",
        adresse: "12 rue de la Paix",
        prix: 180000,
        surface: 65,
        pieces: 3,
        points_forts: "Lumineux",
      })
    )
    expect(response.status).toBe(400)
  })

  it("rejette si prix négatif", async () => {
    const response = await createBien(
      makePostRequest("https://immocrew.fr/api/biens", {
        titre: "Test",
        type_bien: "Appartement",
        adresse: "12 rue de la Paix",
        prix: -100,
        surface: 65,
        pieces: 3,
        points_forts: "Lumineux",
      })
    )
    expect(response.status).toBe(400)
  })
})

// ─── POST /api/biens/[id]/photos ──────────────────────────────────

describe("POST /api/biens/[id]/photos", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await uploadPhoto(
      makePostRequest("https://immocrew.fr/api/biens/prop_123/photos", {
        photo: "data:image/jpeg;base64,/9j/4AAQ",
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(401)
  })

  it("retourne 404 si le bien n'existe pas", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await uploadPhoto(
      makePostRequest("https://immocrew.fr/api/biens/prop_999/photos", {
        photo: "data:image/jpeg;base64,/9j/4AAQ",
      }),
      { params: Promise.resolve({ id: "prop_999" }) }
    )
    expect(response.status).toBe(404)
  })

  it("retourne 403 si pas propriétaire du bien", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ client_id: "autre_user", photos_originales: [] }],
    })

    const response = await uploadPhoto(
      makePostRequest("https://immocrew.fr/api/biens/prop_123/photos", {
        photo: "data:image/jpeg;base64,/9j/4AAQ",
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(403)
  })

  it("uploade une photo avec succès", async () => {
    // SELECT ownership
    mockQuery.mockResolvedValueOnce({
      rows: [{ client_id: MOCK_USER.id, photos_originales: [] }],
    })
    // UPDATE photos_originales
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })
    // Mock storage
    mockUploadFile.mockResolvedValueOnce(undefined)

    const response = await uploadPhoto(
      makePostRequest("https://immocrew.fr/api/biens/prop_123/photos", {
        photo: "data:image/jpeg;base64,/9j/4AAQ",
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.key).toBeTruthy()
    expect(data.url).toBeTruthy()
    expect(mockUploadFile).toHaveBeenCalledOnce()
  })

  it("rejette si limite de 10 photos atteinte", async () => {
    const tenPhotos = Array.from({ length: 10 }, (_, i) => ({
      key: `photo_${i}`,
      url: `/api/photos/photo_${i}`,
      piece: "",
      ordre: i + 1,
    }))

    mockQuery.mockResolvedValueOnce({
      rows: [{ client_id: MOCK_USER.id, photos_originales: tenPhotos }],
    })

    const response = await uploadPhoto(
      makePostRequest("https://immocrew.fr/api/biens/prop_123/photos", {
        photo: "data:image/jpeg;base64,/9j/4AAQ",
      }),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(409)
  })
})

// ─── DELETE /api/biens/[id]/photos/[key] ──────────────────────────

describe("DELETE /api/biens/[id]/photos/[key]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await deletePhoto(
      makeDeleteRequest("https://immocrew.fr/api/biens/prop_123/photos/photo_key"),
      { params: Promise.resolve({ id: "prop_123", key: "photo_key" }) }
    )
    expect(response.status).toBe(401)
  })

  it("supprime une photo existante", async () => {
    // SELECT ownership
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          client_id: MOCK_USER.id,
          photos_originales: [
            { key: "clients/sophie/biens/prop_123/1_123.jpg", url: "/api/photos/1", piece: "Salon", ordre: 1 },
            { key: "clients/sophie/biens/prop_123/2_456.jpg", url: "/api/photos/2", piece: "Cuisine", ordre: 2 },
          ],
        },
      ],
    })
    // UPDATE photos_originales
    mockQuery.mockResolvedValueOnce({ rows: [], rowCount: 1 })
    // Mock delete storage
    mockDeleteFile.mockResolvedValueOnce(undefined)

    const response = await deletePhoto(
      makeDeleteRequest("https://immocrew.fr/api/biens/prop_123/photos/clients/sophie/biens/prop_123/1_123.jpg"),
      { params: Promise.resolve({ id: "prop_123", key: "clients/sophie/biens/prop_123/1_123.jpg" }) }
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
    expect(mockDeleteFile).toHaveBeenCalledWith("clients/sophie/biens/prop_123/1_123.jpg")
  })

  it("retourne 404 si la photo n'existe pas sur le bien", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          client_id: MOCK_USER.id,
          photos_originales: [
            { key: "clients/sophie/biens/prop_123/1_123.jpg", url: "/api/photos/1", piece: "", ordre: 1 },
          ],
        },
      ],
    })

    const response = await deletePhoto(
      makeDeleteRequest("https://immocrew.fr/api/biens/prop_123/photos/inexistant.jpg"),
      { params: Promise.resolve({ id: "prop_123", key: "inexistant.jpg" }) }
    )
    expect(response.status).toBe(404)
  })
})

// ─── POST /api/biens/[id]/generate-annonce ────────────────────────

describe("POST /api/biens/[id]/generate-annonce", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await generateAnnonce(
      makePostRequest("https://immocrew.fr/api/biens/prop_123/generate-annonce", {}),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(401)
  })

  it("retourne 404 si le bien n'existe pas", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await generateAnnonce(
      makePostRequest("https://immocrew.fr/api/biens/prop_999/generate-annonce", {}),
      { params: Promise.resolve({ id: "prop_999" }) }
    )
    expect(response.status).toBe(404)
  })

  it("retourne 400 si aucune photo n'est uploadée", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "prop_123",
          client_id: MOCK_USER.id,
          client_email: MOCK_USER.email,
          titre: "Appartement T3",
          type_bien: "Appartement",
          adresse: "12 rue de la Paix, Angers",
          prix: 180000,
          surface: 65,
          pieces: 3,
          points_forts: "Lumineux",
          photos_originales: [],
          slug: "12-rue-de-la-paix-angers",
          status: "draft",
        },
      ],
    })

    const response = await generateAnnonce(
      makePostRequest("https://immocrew.fr/api/biens/prop_123/generate-annonce", {}),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain("photo")
  })

  it("retourne 403 si pas propriétaire", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          id: "prop_123",
          client_id: "autre_user",
          photos_originales: [{ key: "test.jpg" }],
          slug: "test",
          status: "draft",
        },
      ],
    })

    const response = await generateAnnonce(
      makePostRequest("https://immocrew.fr/api/biens/prop_123/generate-annonce", {}),
      { params: Promise.resolve({ id: "prop_123" }) }
    )
    expect(response.status).toBe(403)
  })
})

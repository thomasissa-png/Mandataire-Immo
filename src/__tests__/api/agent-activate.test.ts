/**
 * Tests pour la route POST /api/agent/activate — Activation landing page mandataire
 *
 * Pourquoi ces tests existent :
 * - L'activation de la page mandataire est un parcours critique pour Sophie.
 *   Un slug malformé = page inaccessible. Un doublon de slug = conflit utilisateur.
 * - Un POST sans auth = activation par un tiers (faille de sécurité).
 * - Un POST avec profil incomplet (pas de prénom/nom) = slug vide/invalide.
 * - Le slug doit être unique : collision gérée par suffixe incrémental (-2, -3...).
 * - bio_generee doit rester null (pas de copie de bio_personnelle).
 * - Si une page existe déjà pour ce client, retour 200 idempotent (pas 409).
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

import { POST } from "@/app/api/agent/activate/route"
import { NextRequest } from "next/server"

const MOCK_USER = {
  id: "usr_test_123",
  email: "sophie@example.com",
  name: "Sophie Martin",
  firstName: "Sophie",
}

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest("https://immocrew.fr/api/agent/activate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

// ─── POST /api/agent/activate ──────────────────────────────────────

describe("POST /api/agent/activate", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(401)

    const data = await response.json()
    expect(data.error).toBe("Non authentifié")
  })

  it("retourne 400 si pack invalide", async () => {
    const response = await POST(makePostRequest({ pack: "inexistant" }))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain("Pack invalide")
  })

  it("retourne 400 si pack absent du body", async () => {
    const response = await POST(makePostRequest({}))
    expect(response.status).toBe(400)
  })

  it("retourne 400 si JSON invalide", async () => {
    const req = new NextRequest("https://immocrew.fr/api/agent/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "not-json{",
    })

    const response = await POST(req)
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe("JSON invalide")
  })

  it("retourne 404 si client introuvable en base", async () => {
    // SELECT clients retourne vide
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(404)

    const data = await response.json()
    expect(data.error).toBe("Client introuvable")
  })

  it("retourne 400 si prénom et nom vides dans client_context et colonnes", async () => {
    // SELECT clients : pas de prenom/nom dans context ni colonnes
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: "cli_1", client_context: {}, first_name: null, last_name: null }],
    })
    // SELECT agent_pages existantes
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toContain("Prénom et nom requis")
  })

  it("retourne 201 avec slug correct si activation réussie", async () => {
    // SELECT clients
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: "cli_1",
        client_context: { prenom: "Sophie", nom: "Martin" },
        first_name: null,
        last_name: null,
      }],
    })
    // SELECT agent_pages existantes (aucune)
    mockQuery.mockResolvedValueOnce({ rows: [] })
    // SELECT slug conflicts (aucun)
    mockQuery.mockResolvedValueOnce({ rows: [] })
    // INSERT RETURNING slug
    mockQuery.mockResolvedValueOnce({ rows: [{ slug: "sophie-martin" }] })

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.slug).toBe("sophie-martin")
    expect(data.status).toBe("active")
  })

  it("génère un slug sans accents (éàç → eac)", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: "cli_2",
        client_context: { prenom: "Hélène", nom: "Müller" },
        first_name: null,
        last_name: null,
      }],
    })
    mockQuery.mockResolvedValueOnce({ rows: [] })
    mockQuery.mockResolvedValueOnce({ rows: [] })
    mockQuery.mockResolvedValueOnce({ rows: [{ slug: "helene-muller" }] })

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.slug).toBe("helene-muller")
  })

  it("ajoute un suffixe -2 si le slug existe déjà", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: "cli_3",
        client_context: { prenom: "Sophie", nom: "Martin" },
        first_name: null,
        last_name: null,
      }],
    })
    mockQuery.mockResolvedValueOnce({ rows: [] })
    // slug conflicts : sophie-martin existe déjà
    mockQuery.mockResolvedValueOnce({ rows: [{ slug: "sophie-martin" }] })
    mockQuery.mockResolvedValueOnce({ rows: [{ slug: "sophie-martin-2" }] })

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.slug).toBe("sophie-martin-2")
  })

  it("ajoute un suffixe -3 si -2 existe aussi", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: "cli_4",
        client_context: { prenom: "Sophie", nom: "Martin" },
        first_name: null,
        last_name: null,
      }],
    })
    mockQuery.mockResolvedValueOnce({ rows: [] })
    // slug conflicts : sophie-martin et sophie-martin-2 existent
    mockQuery.mockResolvedValueOnce({
      rows: [{ slug: "sophie-martin" }, { slug: "sophie-martin-2" }],
    })
    mockQuery.mockResolvedValueOnce({ rows: [{ slug: "sophie-martin-3" }] })

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.slug).toBe("sophie-martin-3")
  })

  it("retourne 200 si page déjà existante pour ce client (idempotent)", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: "cli_1",
        client_context: { prenom: "Sophie", nom: "Martin" },
        first_name: null,
        last_name: null,
      }],
    })
    // agent_pages existe déjà
    mockQuery.mockResolvedValueOnce({
      rows: [{ slug: "sophie-martin", status: "active" }],
    })

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.slug).toBe("sophie-martin")
    expect(data.message).toBe("Page déjà existante")
  })

  it("INSERT envoie bio_generee = null (pas de copie de bio_personnelle)", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: "cli_5",
        client_context: { prenom: "Marc", nom: "Dupont" },
        first_name: null,
        last_name: null,
      }],
    })
    mockQuery.mockResolvedValueOnce({ rows: [] })
    mockQuery.mockResolvedValueOnce({ rows: [] })
    mockQuery.mockResolvedValueOnce({ rows: [{ slug: "marc-dupont" }] })

    await POST(makePostRequest({ pack: "mensuel" }))

    // L'INSERT est le 4e appel à mockQuery
    const insertCall = mockQuery.mock.calls[3]
    expect(insertCall[0]).toContain("INSERT INTO agent_pages")
    // Le 3e paramètre ($3 = bio_generee) doit être null
    expect(insertCall[1][2]).toBeNull()
  })

  it("utilise first_name/last_name si client_context ne contient pas prenom/nom", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{
        id: "cli_6",
        client_context: {},
        first_name: "Jean",
        last_name: "Valjean",
      }],
    })
    mockQuery.mockResolvedValueOnce({ rows: [] })
    mockQuery.mockResolvedValueOnce({ rows: [] })
    mockQuery.mockResolvedValueOnce({ rows: [{ slug: "jean-valjean" }] })

    const response = await POST(makePostRequest({ pack: "mensuel" }))
    expect(response.status).toBe(201)

    const data = await response.json()
    expect(data.slug).toBe("jean-valjean")
  })
})

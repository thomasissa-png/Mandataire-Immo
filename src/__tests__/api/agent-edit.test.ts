/**
 * Tests pour la route PATCH /api/agent/[slug] — Modification de la page mandataire
 *
 * Pourquoi ces tests existent :
 * - L'édition de la page mandataire doit être strictement contrôlée :
 *   seuls bio_generee, bio_personnelle et indexation sont modifiables.
 * - edition_locked = true bloque toute modification (pack expiré).
 * - Un PATCH sans auth = modification par un tiers (faille de sécurité).
 * - Un PATCH sur le slug d'un autre user = violation IDOR (OWASP A01).
 * - indexation est un booléen strict, pas une string.
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

import { PATCH } from "@/app/api/agent/[slug]/route"
import { NextRequest } from "next/server"

const MOCK_USER = {
  id: "usr_test_123",
  email: "sophie@example.com",
  name: "Sophie Martin",
  firstName: "Sophie",
}

function makePatchRequest(slug: string, body: unknown): NextRequest {
  return new NextRequest(`https://immocrew.fr/api/agent/${slug}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

function makeContext(slug: string) {
  return { params: Promise.resolve({ slug }) }
}

const MOCK_AGENT_PAGE = {
  id: "ap_1",
  edition_locked: false,
  client_id: "cli_1",
}

// ─── PATCH /api/agent/[slug] ──────────────────────────────────────

describe("PATCH /api/agent/[slug]", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetSessionUser.mockResolvedValue(MOCK_USER)
  })

  it("retourne 401 si pas authentifié", async () => {
    mockGetSessionUser.mockResolvedValueOnce(null)

    const response = await PATCH(
      makePatchRequest("sophie-martin", { bio_generee: "Nouvelle bio" }),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(401)

    const data = await response.json()
    expect(data.error).toBe("Non authentifié")
  })

  it("retourne 404 si slug n'appartient pas au user", async () => {
    // JOIN retourne vide (pas propriétaire ou slug inexistant)
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await PATCH(
      makePatchRequest("autre-agent", { bio_generee: "Test" }),
      makeContext("autre-agent")
    )
    expect(response.status).toBe(404)

    const data = await response.json()
    expect(data.error).toContain("Page introuvable")
  })

  it("retourne 403 si edition_locked = true", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ ...MOCK_AGENT_PAGE, edition_locked: true }],
    })

    const response = await PATCH(
      makePatchRequest("sophie-martin", { bio_generee: "Test" }),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(403)

    const data = await response.json()
    expect(data.error).toContain("édition a expiré")
  })

  it("retourne 200 si mise à jour de bio_generee réussie", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })
    // UPDATE agent_pages
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await PATCH(
      makePatchRequest("sophie-martin", { bio_generee: "Ma nouvelle bio générée" }),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it("retourne 200 si mise à jour de bio_personnelle réussie (via client_context)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })
    // UPDATE clients (JSONB merge)
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await PATCH(
      makePatchRequest("sophie-martin", { bio_personnelle: "Ma bio personnelle" }),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it("retourne 200 si mise à jour d'indexation (booléen true)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })
    // UPDATE agent_pages
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await PATCH(
      makePatchRequest("sophie-martin", { indexation: true }),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it("retourne 200 si mise à jour d'indexation (booléen false)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })
    // UPDATE agent_pages
    mockQuery.mockResolvedValueOnce({ rows: [] })

    const response = await PATCH(
      makePatchRequest("sophie-martin", { indexation: false }),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.success).toBe(true)
  })

  it("ignore indexation si ce n'est pas un booléen (string)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })

    const response = await PATCH(
      makePatchRequest("sophie-martin", { indexation: "true" }),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    // Aucune modification envoyée car "true" (string) est ignoré
    expect(data.message).toContain("Aucune modification")
  })

  it("retourne 200 message si aucune modification envoyée (body vide)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })

    const response = await PATCH(
      makePatchRequest("sophie-martin", {}),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.message).toContain("Aucune modification")
  })

  it("ignore les champs non éditables (slug, status, client_id)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })

    const response = await PATCH(
      makePatchRequest("sophie-martin", { slug: "hack-slug", status: "frozen", client_id: "other" }),
      makeContext("sophie-martin")
    )
    expect(response.status).toBe(200)

    const data = await response.json()
    // Aucune modification effective car aucun champ n'est dans la whitelist
    expect(data.message).toContain("Aucune modification")
  })

  it("retourne 400 si JSON invalide", async () => {
    const req = new NextRequest("https://immocrew.fr/api/agent/sophie-martin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: "not-json{",
    })

    const response = await PATCH(req, makeContext("sophie-martin"))
    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBe("JSON invalide")
  })

  it("met à jour agent_pages avec updated_at = NOW() quand champ agent modifié", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })
    mockQuery.mockResolvedValueOnce({ rows: [] })

    await PATCH(
      makePatchRequest("sophie-martin", { bio_generee: "Nouvelle bio" }),
      makeContext("sophie-martin")
    )

    // Le 2e appel est l'UPDATE de agent_pages
    const updateCall = mockQuery.mock.calls[1]
    expect(updateCall[0]).toContain("updated_at = NOW()")
    expect(updateCall[0]).toContain("bio_generee")
  })

  it("utilise JSONB merge pour bio_personnelle (client_context)", async () => {
    mockQuery.mockResolvedValueOnce({ rows: [MOCK_AGENT_PAGE] })
    mockQuery.mockResolvedValueOnce({ rows: [] })

    await PATCH(
      makePatchRequest("sophie-martin", { bio_personnelle: "Ma bio perso" }),
      makeContext("sophie-martin")
    )

    // Le 2e appel est l'UPDATE de clients (JSONB merge)
    const updateCall = mockQuery.mock.calls[1]
    expect(updateCall[0]).toContain("COALESCE(client_context")
    expect(updateCall[0]).toContain("::jsonb")
  })
})

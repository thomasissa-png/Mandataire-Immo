/**
 * Tests pour les utilitaires email — isEmailSent + templates
 *
 * Pourquoi ces tests existent :
 * - L'idempotence email protège contre les doubles envois (nurturing J+2
 *   envoyé 2 fois = impression de spam, désabonnement).
 * - Les templates sont les premiers emails que Sophie reçoit. Un placeholder
 *   non remplacé = perte de crédibilité immédiate.
 *
 * Ce qui est mocké :
 * - query : la fonction d'accès DB via pg pool
 */

import { describe, it, expect, vi, beforeEach } from "vitest"

const { mockQuery } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
}))

vi.mock("@/lib/db", () => ({
  query: (...args: unknown[]) => mockQuery(...args),
}))

import { isEmailSent } from "@/lib/email"
import { nurturingJ2, nurturingJ7, nurturingJ14 } from "@/lib/email-templates"
import type { EmailTemplateParams } from "@/lib/email-templates"

const TEMPLATE_PARAMS: EmailTemplateParams = {
  prenom: "Sophie",
  email: "sophie@example.com",
  dashboardUrl: "https://immocrew.fr/dashboard",
  pricingUrl: "https://immocrew.fr/pricing",
  unsubscribeUrl: "https://immocrew.fr/unsubscribe?token=test_123",
}

describe("isEmailSent", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("retourne false quand aucun email n'a été envoyé", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ count: "0" }],
    })

    const result = await isEmailSent("client_123", "nurturing_j2")
    expect(result).toBe(false)
  })

  it("retourne true quand un email a déjà été envoyé", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ count: "1" }],
    })

    const result = await isEmailSent("client_123", "nurturing_j2")
    expect(result).toBe(true)
  })

  it("interroge la bonne table avec les bons paramètres", async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ count: "0" }],
    })

    await isEmailSent("client_456", "nurturing_j7")

    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("email_logs"),
      ["client_456", "nurturing_j7"]
    )
  })
})

describe("Templates email", () => {
  describe("nurturingJ2", () => {
    it("génère un HTML valide avec le prénom", () => {
      const result = nurturingJ2(TEMPLATE_PARAMS)

      expect(result.subject).toContain("Sophie")
      expect(result.html).toContain("Sophie")
      expect(result.html).toContain("<!DOCTYPE html>")
      expect(result.html).toContain("</html>")
      expect(result.text).toContain("Sophie")
    })

    it("contient le lien vers le dashboard", () => {
      const result = nurturingJ2(TEMPLATE_PARAMS)

      expect(result.html).toContain(TEMPLATE_PARAMS.dashboardUrl)
      expect(result.text).toContain(TEMPLATE_PARAMS.dashboardUrl)
    })

    it("mentionne le prix du pack mensuel", () => {
      const result = nurturingJ2(TEMPLATE_PARAMS)

      // Le template utilise PACK_MENSUEL.price — on vérifie qu'il y a un nombre suivi de €
      expect(result.html).toMatch(/\d+€/)
      expect(result.text).toMatch(/\d+€/)
    })

    it("ne contient pas de placeholder non remplacé", () => {
      const result = nurturingJ2(TEMPLATE_PARAMS)

      expect(result.html).not.toMatch(/\$\{[^}]+\}/)
      expect(result.html).not.toContain("[PLACEHOLDER")
      expect(result.html).not.toContain("undefined")
      expect(result.text).not.toMatch(/\$\{[^}]+\}/)
    })
  })

  describe("nurturingJ7", () => {
    it("génère un HTML valide avec le prénom", () => {
      const result = nurturingJ7(TEMPLATE_PARAMS)

      expect(result.subject).toContain("Sophie")
      expect(result.html).toContain("Sophie")
      expect(result.html).toContain("<!DOCTYPE html>")
      expect(result.html).toContain("</html>")
    })

    it("contient des conseils concrets", () => {
      const result = nurturingJ7(TEMPLATE_PARAMS)

      expect(result.html).toContain("régularité")
      expect(result.text).toContain("régularité")
    })

    it("ne contient pas de placeholder non remplacé", () => {
      const result = nurturingJ7(TEMPLATE_PARAMS)

      expect(result.html).not.toMatch(/\$\{[^}]+\}/)
      expect(result.html).not.toContain("undefined")
    })
  })

  describe("nurturingJ14", () => {
    it("génère un HTML valide avec le prénom", () => {
      const result = nurturingJ14(TEMPLATE_PARAMS)

      expect(result.subject).toContain("Sophie")
      expect(result.html).toContain("Sophie")
      expect(result.html).toContain("<!DOCTYPE html>")
      expect(result.html).toContain("</html>")
    })

    it("contient le lien vers la page pricing", () => {
      const result = nurturingJ14(TEMPLATE_PARAMS)

      expect(result.html).toContain(TEMPLATE_PARAMS.pricingUrl)
      expect(result.text).toContain(TEMPLATE_PARAMS.pricingUrl)
    })

    it("mentionne le prix du pack mensuel", () => {
      const result = nurturingJ14(TEMPLATE_PARAMS)

      expect(result.html).toMatch(/\d+€/)
      expect(result.text).toMatch(/\d+€/)
    })

    it("ne contient pas de placeholder non remplacé", () => {
      const result = nurturingJ14(TEMPLATE_PARAMS)

      expect(result.html).not.toMatch(/\$\{[^}]+\}/)
      expect(result.html).not.toContain("undefined")
    })
  })
})

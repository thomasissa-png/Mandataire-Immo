/**
 * Tests pour le composant Pricing
 *
 * Pourquoi ces tests existent :
 * - Les prix affiches sont un engagement contractuel (cf. legal-audit.md).
 *   Un prix incorrect = litige juridique potentiel.
 * - Le badge "Le plus populaire" sur le Pack Mensuel est une decision UX
 *   critique pour orienter la conversion (cf. wireframes.md).
 * - Les liens CTA pointent vers /api/checkout?pack=X. Un lien casse = 0 paiement.
 * - Les mentions (garantie 14j, sans engagement) sont des obligations legales.
 */

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Pricing } from "@/components/landing/Pricing"

describe("Pricing", () => {
  it("renders the section heading", () => {
    render(<Pricing />)
    expect(screen.getByText("Choisis ton pack.")).toBeInTheDocument()
  })

  it("renders all 3 pack names", () => {
    render(<Pricing />)
    expect(screen.getByText("Pack Lancement")).toBeInTheDocument()
    expect(screen.getByText("Pack Mensuel")).toBeInTheDocument()
    expect(screen.getByText("Boost Mandat")).toBeInTheDocument()
  })

  it("displays correct prices for each pack", () => {
    render(<Pricing />)
    // Prices are rendered with &euro; entity, resulting in the euro sign
    const priceElements = screen.getAllByText(/\d+\u20AC/)
    const priceTexts = priceElements.map((el) => el.textContent)
    expect(priceTexts).toContain("497\u20AC")
    expect(priceTexts).toContain("197\u20AC")
    expect(priceTexts).toContain("97\u20AC")
  })

  it("shows the 'Le plus populaire' badge on Pack Mensuel only", () => {
    render(<Pricing />)
    const badge = screen.getByText("Le plus populaire")
    expect(badge).toBeInTheDocument()
    // Should appear only once
    expect(screen.getAllByText("Le plus populaire")).toHaveLength(1)
  })

  it("displays TTC mention for all packs", () => {
    render(<Pricing />)
    const ttcMentions = screen.getAllByText("TTC")
    expect(ttcMentions.length).toBe(3)
  })

  it("shows the guarantee mention for Pack Lancement", () => {
    render(<Pricing />)
    expect(
      screen.getByText("Satisfait ou rembourse 14 jours.")
    ).toBeInTheDocument()
  })

  it("shows the no-commitment mention for Pack Mensuel", () => {
    render(<Pricing />)
    expect(
      screen.getByText("Sans engagement. Resiliation libre.")
    ).toBeInTheDocument()
  })

  it("renders correct CTA links pointing to /api/checkout with proper pack", () => {
    render(<Pricing />)

    const lancementLink = screen.getByText(/Demarrer mon lancement/i)
      .closest("a")
    expect(lancementLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=lancement"
    )

    const mensuelLink = screen.getByText(/Commencer maintenant/i)
      .closest("a")
    expect(mensuelLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=mensuel"
    )

    const boostLink = screen.getByText(/Booster un mandat/i)
      .closest("a")
    expect(boostLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=boost"
    )
  })

  it("renders the anchor price comparison text", () => {
    render(<Pricing />)
    expect(
      screen.getByText(/Une vente de plus dans l'ann/i)
    ).toBeInTheDocument()
  })

  it("displays 'Tous les prix sont TTC.' global mention", () => {
    render(<Pricing />)
    expect(
      screen.getByText("Tous les prix sont TTC.")
    ).toBeInTheDocument()
  })

  it("lists the correct number of features for Pack Mensuel (6)", () => {
    render(<Pricing />)
    // Pack Mensuel features
    expect(
      screen.getByText("12 posts personnalises pour tes reseaux")
    ).toBeInTheDocument()
    expect(
      screen.getByText("4 scripts video pour tes Reels")
    ).toBeInTheDocument()
    expect(
      screen.getByText("2 articles SEO local")
    ).toBeInTheDocument()
    expect(
      screen.getByText("1 newsletter pour tes contacts")
    ).toBeInTheDocument()
    expect(
      screen.getByText("4 annonces immobilieres storytelling")
    ).toBeInTheDocument()
    expect(
      screen.getByText("1 email de prospection vendeurs")
    ).toBeInTheDocument()
  })
})

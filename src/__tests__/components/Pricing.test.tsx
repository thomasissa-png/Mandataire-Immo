/**
 * Tests pour le composant Pricing (3 formules d'abonnement + Boost Mandat)
 *
 * Les prix affichés sont un engagement contractuel.
 * Les CTA pointent vers /api/checkout — un lien cassé = 0 paiement.
 * Les mentions (engagement, résiliation) sont des obligations légales.
 */

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Pricing } from "@/components/landing/Pricing"
import {
  PACK_MENSUEL,
  PACK_TRIMESTRIEL,
  PACK_ANNUEL,
  PACK_BOOST,
  PRIX_MIN_MENSUEL,
  formatPrice,
} from "@/lib/pricing"

describe("Pricing", () => {
  it("renders the section heading with starting price", () => {
    render(<Pricing />)
    const heading = screen.getByText(/équipe marketing.*à partir de/i)
    expect(heading).toBeInTheDocument()
  })

  it("renders the 3 subscription plan names", () => {
    render(<Pricing />)
    expect(screen.getByText("Mensuel")).toBeInTheDocument()
    expect(screen.getByText("Trimestriel")).toBeInTheDocument()
    expect(screen.getByText("Annuel")).toBeInTheDocument()
  })

  it("renders the Boost Mandat section", () => {
    render(<Pricing />)
    expect(screen.getByText(/Boost Mandat/i)).toBeInTheDocument()
  })

  it("displays correct prices for all plans", () => {
    render(<Pricing />)
    const priceElements = screen.getAllByText(/\d+€/)
    const priceTexts = priceElements.map((el) => el.textContent)
    expect(priceTexts).toContain(`${PACK_MENSUEL.price}€`)
    expect(priceTexts).toContain(`${PACK_TRIMESTRIEL.price}€`)
    expect(priceTexts).toContain(`${PACK_ANNUEL.price}€`)
    expect(
      screen.getByText(new RegExp(`${PACK_BOOST.price}€${PACK_BOOST.unit}`, "i"))
    ).toBeInTheDocument()
  })

  it("shows the 'Recommandé' badge on Trimestriel", () => {
    render(<Pricing />)
    expect(screen.getByText("Recommandé")).toBeInTheDocument()
  })

  it("shows savings badges", () => {
    render(<Pricing />)
    expect(screen.getByText(/Économise 90€/i)).toBeInTheDocument()
    expect(screen.getAllByText(/4 mois offerts/i).length).toBeGreaterThan(0)
  })

  it("shows '4 mois offerts' highlight on Annuel", () => {
    render(<Pricing />)
    expect(screen.getByText("4 mois offerts")).toBeInTheDocument()
  })

  it("displays TTC mentions for each card", () => {
    render(<Pricing />)
    const ttcMentions = screen.getAllByText("TTC")
    expect(ttcMentions.length).toBeGreaterThanOrEqual(3)
  })

  it("shows correct engagement mentions", () => {
    render(<Pricing />)
    // "Sans engagement" appears in multiple places (guidance text + card mention)
    expect(
      screen.getAllByText(/Sans engagement/i).length
    ).toBeGreaterThanOrEqual(1)
    expect(
      screen.getByText(/Engagement 3 mois/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Engagement 12 mois/i)
    ).toBeInTheDocument()
  })

  it("renders CTA links pointing to /api/checkout", () => {
    render(<Pricing />)

    const mensuelLink = screen.getByText(new RegExp(PACK_MENSUEL.cta, "i"))
      .closest("a")
    expect(mensuelLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=mensuel"
    )

    const trimestrielLink = screen.getByText(new RegExp(PACK_TRIMESTRIEL.cta, "i"))
      .closest("a")
    expect(trimestrielLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=trimestriel"
    )

    const annuelLink = screen.getByText(new RegExp(PACK_ANNUEL.cta, "i"))
      .closest("a")
    expect(annuelLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=annuel"
    )

    const boostLink = screen.getByText(/Booster mon prochain bien/i)
      .closest("a")
    expect(boostLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=boost"
    )
  })

  it("renders the ROI argument", () => {
    render(<Pricing />)
    expect(
      screen.getByText(/mandat supplémentaire.*rembourse.*abonnement/i)
    ).toBeInTheDocument()
  })

  it("displays 'Tous les prix sont TTC.'", () => {
    render(<Pricing />)
    expect(
      screen.getByText("Tous les prix sont TTC.")
    ).toBeInTheDocument()
  })

  it("lists correct features (setup + content)", () => {
    render(<Pricing />)
    expect(
      screen.getAllByText("Setup mois 1 inclus : positionnement, bio, charte visuelle").length
    ).toBeGreaterThanOrEqual(1)
    expect(
      screen.getAllByText("12 posts personnalisés pour tes réseaux").length
    ).toBeGreaterThanOrEqual(1)
    expect(
      screen.getAllByText("4 articles SEO local").length
    ).toBeGreaterThanOrEqual(1)
  })

  it("renders the comparison table", () => {
    render(<Pricing />)
    expect(screen.getByText("Freelance marketing")).toBeInTheDocument()
    expect(screen.getByText("Outil avec templates")).toBeInTheDocument()
  })

  it("shows the lowest price in comparison table", () => {
    render(<Pricing />)
    const priceElements = screen.getAllByText(`${PRIX_MIN_MENSUEL}€`)
    // Should appear at least twice: in the Annuel card AND in the comparison table
    expect(priceElements.length).toBeGreaterThanOrEqual(2)
  })
})

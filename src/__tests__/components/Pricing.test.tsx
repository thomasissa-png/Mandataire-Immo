/**
 * Tests pour le composant Pricing
 *
 * Les prix affichés sont un engagement contractuel.
 * Les CTA pointent vers /api/checkout — un lien cassé = 0 paiement.
 * Les mentions (garantie 14j, sans engagement) sont des obligations légales.
 */

import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Pricing } from "@/components/landing/Pricing"
import { PACK_LANCEMENT, PACK_MENSUEL, PACK_BOOST, formatPrice } from "@/lib/pricing"

describe("Pricing", () => {
  it(`renders the section heading with ${formatPrice(PACK_MENSUEL)}`, () => {
    render(<Pricing />)
    const pricePattern = new RegExp(`équipe marketing.*${PACK_MENSUEL.price}€${PACK_MENSUEL.unit.replace("/", "/")}`, "i")
    expect(
      screen.getByText(pricePattern)
    ).toBeInTheDocument()
  })

  it("renders the 2 main pack names", () => {
    render(<Pricing />)
    expect(screen.getByText("Pack Lancement")).toBeInTheDocument()
    expect(screen.getByText("Pack Mensuel")).toBeInTheDocument()
  })

  it("renders the Boost Mandat section", () => {
    render(<Pricing />)
    expect(screen.getByText(/Boost Mandat/i)).toBeInTheDocument()
  })

  it("displays correct prices", () => {
    render(<Pricing />)
    const priceElements = screen.getAllByText(/\d+\u20AC/)
    const priceTexts = priceElements.map((el) => el.textContent)
    expect(priceTexts).toContain("400\u20AC")
    expect(priceTexts).toContain("150\u20AC")
    // Boost price is in inline text "Boost Mandat · 100€/bien", not a separate price element
    expect(screen.getByText(/100\u20AC\/bien/i)).toBeInTheDocument()
  })

  it("shows the badge on Pack Mensuel", () => {
    render(<Pricing />)
    expect(
      screen.getByText(/choix de la plupart des mandataires/i)
    ).toBeInTheDocument()
  })

  it("displays TTC mentions", () => {
    render(<Pricing />)
    const ttcMentions = screen.getAllByText("TTC")
    expect(ttcMentions.length).toBeGreaterThanOrEqual(2)
  })

  it("shows the guarantee mention for Pack Lancement", () => {
    render(<Pricing />)
    expect(
      screen.getByText(/Satisfait ou rembours\u00e9 14 jours/i)
    ).toBeInTheDocument()
  })

  it("shows the no-commitment mention for Pack Mensuel", () => {
    render(<Pricing />)
    expect(
      screen.getByText(/Sans engagement/i)
    ).toBeInTheDocument()
  })

  it("renders CTA links pointing to /api/checkout", () => {
    render(<Pricing />)

    const lancementLink = screen.getByText(/D\u00e9marrer mon lancement/i)
      .closest("a")
    expect(lancementLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=lancement"
    )

    const mensuelLink = screen.getByText(/Commencer ce mois-ci/i)
      .closest("a")
    expect(mensuelLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=mensuel"
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
      screen.getByText(/mandat suppl\u00e9mentaire.*rembourse.*abonnement/i)
    ).toBeInTheDocument()
  })

  it("displays 'Tous les prix sont TTC.'", () => {
    render(<Pricing />)
    expect(
      screen.getByText("Tous les prix sont TTC.")
    ).toBeInTheDocument()
  })

  it("lists correct features for Pack Mensuel", () => {
    render(<Pricing />)
    expect(
      screen.getByText("12 posts personnalis\u00e9s pour tes r\u00e9seaux")
    ).toBeInTheDocument()
    expect(
      screen.getByText("4 scripts vid\u00e9o pour tes Reels")
    ).toBeInTheDocument()
    expect(
      screen.getByText("2 articles SEO local")
    ).toBeInTheDocument()
    expect(
      screen.getByText("4 annonces qui donnent envie de visiter")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Calendrier de publication mensuel")
    ).toBeInTheDocument()
  })

  it("renders the comparison table", () => {
    render(<Pricing />)
    expect(screen.getByText("Freelance marketing")).toBeInTheDocument()
    expect(screen.getByText("Outil avec templates")).toBeInTheDocument()
  })
})

/**
 * Tests pour le composant Pricing
 *
 * Pourquoi ces tests existent :
 * - Les prix affiches sont un engagement contractuel (cf. legal-audit.md).
 *   Un prix incorrect = litige juridique potentiel.
 * - Le badge "Recommandé" sur le Pack Mensuel est une decision UX
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
    expect(
      screen.getByText(/Ton \u00e9quipe marketing.*150\u20ac\/mois/i)
    ).toBeInTheDocument()
  })

  it("renders all 3 pack names", () => {
    render(<Pricing />)
    expect(screen.getByText("Pack Lancement")).toBeInTheDocument()
    expect(screen.getByText("Pack Mensuel")).toBeInTheDocument()
    expect(screen.getByText("Boost Mandat")).toBeInTheDocument()
  })

  it("displays correct prices for each pack", () => {
    render(<Pricing />)
    const priceElements = screen.getAllByText(/\d+\u20AC/)
    const priceTexts = priceElements.map((el) => el.textContent)
    expect(priceTexts).toContain("400\u20AC")
    expect(priceTexts).toContain("150\u20AC")
    expect(priceTexts).toContain("100\u20AC")
  })

  it("shows the 'Recommand\u00e9' badge on Pack Mensuel only", () => {
    render(<Pricing />)
    const badge = screen.getByText("Recommand\u00e9")
    expect(badge).toBeInTheDocument()
    expect(screen.getAllByText("Recommand\u00e9")).toHaveLength(1)
  })

  it("displays TTC mention for all packs", () => {
    render(<Pricing />)
    const ttcMentions = screen.getAllByText("TTC")
    expect(ttcMentions.length).toBe(3)
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
      screen.getByText(/Sans engagement.*R\u00e9siliation libre/i)
    ).toBeInTheDocument()
  })

  it("renders correct CTA links pointing to /api/checkout with proper pack", () => {
    render(<Pricing />)

    const lancementLink = screen.getByText(/Je veux mon kit de d\u00e9marrage/i)
      .closest("a")
    expect(lancementLink).toHaveAttribute(
      "href",
      "/api/checkout?pack=lancement"
    )

    const mensuelLink = screen.getByText(/Recevoir mes premiers posts/i)
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
      screen.getByText(/Une seule vente suppl\u00e9mentaire.*rembourse.*abonnement/i)
    ).toBeInTheDocument()
  })

  it("displays 'Tous les prix sont TTC.' global mention", () => {
    render(<Pricing />)
    expect(
      screen.getByText("Tous les prix sont TTC.")
    ).toBeInTheDocument()
  })

  it("lists the correct features for Pack Mensuel with French accents", () => {
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
      screen.getByText("1 newsletter pour tes contacts")
    ).toBeInTheDocument()
    expect(
      screen.getByText("4 annonces immobili\u00e8res storytelling")
    ).toBeInTheDocument()
    expect(
      screen.getByText("1 email de prospection vendeurs")
    ).toBeInTheDocument()
    expect(
      screen.getByText("Calendrier de publication mensuel")
    ).toBeInTheDocument()
  })
})

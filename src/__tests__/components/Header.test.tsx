/**
 * Tests pour le composant Header (navigation + menu mobile)
 *
 * Pourquoi ces tests existent :
 * - Le header est sticky et present sur toute la landing page. Un header casse
 *   = aucune navigation possible, pas de CTA "Commencer" visible.
 * - Le menu mobile est critique : 60%+ du trafic est mobile (cf. personas.md,
 *   Sophie utilise principalement son iPhone).
 * - L'accessibilite du menu hamburger (aria-label, aria-expanded) est obligatoire.
 */

import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Header } from "@/components/landing/Header"

describe("Header", () => {
  it("renders the ImmoCrew logo", () => {
    render(<Header />)
    expect(screen.getByText("ImmoCrew")).toBeInTheDocument()
  })

  it("renders the logo as a link to home", () => {
    render(<Header />)
    const logoLink = screen.getByText("ImmoCrew").closest("a")
    expect(logoLink).toHaveAttribute("href", "/")
  })

  it("renders navigation links", () => {
    render(<Header />)
    expect(screen.getAllByText("Comment \u00E7a marche").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Avant / Apr\u00E8s").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Tarifs").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("FAQ").length).toBeGreaterThanOrEqual(1)
  })

  it("renders the hamburger button with correct initial aria-label", () => {
    render(<Header />)
    const hamburger = screen.getByLabelText("Ouvrir le menu")
    expect(hamburger).toBeInTheDocument()
    expect(hamburger).toHaveAttribute("aria-expanded", "false")
  })

  it("opens mobile menu on hamburger click", () => {
    render(<Header />)
    const hamburger = screen.getByLabelText("Ouvrir le menu")
    fireEvent.click(hamburger)

    // After opening, the button label should change
    const closeButton = screen.getByLabelText("Fermer le menu")
    expect(closeButton).toBeInTheDocument()
    expect(closeButton).toHaveAttribute("aria-expanded", "true")
  })

  it("closes mobile menu on hamburger click when open", () => {
    render(<Header />)
    const hamburger = screen.getByLabelText("Ouvrir le menu")
    fireEvent.click(hamburger) // open
    fireEvent.click(screen.getByLabelText("Fermer le menu")) // close

    expect(screen.getByLabelText("Ouvrir le menu")).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })

  it("closes mobile menu when a navigation link is clicked", () => {
    render(<Header />)
    const hamburger = screen.getByLabelText("Ouvrir le menu")
    fireEvent.click(hamburger)

    // Click the first nav link in the mobile menu
    // Mobile menu renders links that also exist in desktop nav,
    // so we look for all links with the href
    const faqLinks = screen.getAllByText("FAQ")
    // The mobile version has onClick that closes menu
    const mobileLink = faqLinks.find(
      (el) => el.closest("[class*='fixed']") !== null
    )
    if (mobileLink) {
      fireEvent.click(mobileLink)
    }

    // Menu should be closed now
    expect(screen.getByLabelText("Ouvrir le menu")).toHaveAttribute(
      "aria-expanded",
      "false"
    )
  })

  it("renders CTA buttons linking to #pricing", () => {
    render(<Header />)
    const ctaLinks = screen.getAllByText("Commencer")
    // Desktop CTA + mobile CTA
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1)
    ctaLinks.forEach((link) => {
      const anchor = link.closest("a")
      expect(anchor).toHaveAttribute("href", "#pricing")
    })
  })
})

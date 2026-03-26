/**
 * Tests pour le composant Header (navigation + menu mobile)
 */

import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { Header } from "@/components/landing/Header"

// Mock next-auth/react — Header uses useSession()
vi.mock("next-auth/react", () => ({
  useSession: () => ({ data: null, status: "unauthenticated" }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock next/navigation — AuthModal uses useSearchParams() and useRouter()
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ push: vi.fn() }),
}))

describe("Header", () => {
  it("renders the ImmoCrew logo", () => {
    render(<Header />)
    expect(screen.getAllByText("ImmoCrew").length).toBeGreaterThanOrEqual(1)
  })

  it("renders the logo as a link to home", () => {
    render(<Header />)
    const logos = screen.getAllByText("ImmoCrew")
    const logoLink = logos[0].closest("a")
    expect(logoLink).toHaveAttribute("href", "/")
  })

  it("renders navigation links", () => {
    render(<Header />)
    expect(screen.getAllByText("Comment \u00E7a marche").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Avant / Apr\u00E8s").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("Tarifs").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("FAQ").length).toBeGreaterThanOrEqual(1)
  })

  it("renders CTA buttons linking to #pricing", () => {
    render(<Header />)
    const ctaLinks = screen.getAllByText("Commencer")
    expect(ctaLinks.length).toBeGreaterThanOrEqual(1)
    ctaLinks.forEach((link) => {
      const anchor = link.closest("a")
      expect(anchor).toHaveAttribute("href", "#pricing")
    })
  })

  it("renders Mon espace link", () => {
    render(<Header />)
    const links = screen.getAllByText("Mon espace")
    expect(links.length).toBeGreaterThanOrEqual(1)
  })
})

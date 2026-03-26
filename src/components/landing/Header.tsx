"use client"

import { useState, useEffect } from "react"

const NAV_LINKS = [
  { label: "Comment \u00E7a marche", href: "#piliers" },
  { label: "Avant / Apr\u00E8s", href: "#avant-apres" },
  { label: "Tarifs", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-white border-b border-border transition-shadow duration-normal ${scrolled ? "shadow-md" : "shadow-xs"}`}>
      <div className="container-immocrew flex items-center justify-between h-14 tablet:h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-normal">
          <span className="font-display text-h3 font-bold text-primary">
            ImmoCrew
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden tablet:flex items-center gap-6 desktop:gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-body font-medium text-foreground hover:text-secondary transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded-md px-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#pricing"
          className="hidden tablet:inline-flex items-center justify-center h-12 px-6 rounded-full bg-secondary text-primary font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          Commencer
        </a>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="tablet:hidden flex items-center justify-center w-11 h-11"
          aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isMenuOpen}
        >
          <svg
            className="w-6 h-6 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`tablet:hidden fixed inset-0 top-14 z-40 bg-white transition-all duration-normal ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
      >
        <nav className="flex flex-col px-4 py-6 gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center h-12 px-4 rounded-lg text-h4 font-semibold text-foreground hover:bg-primary-50 transition-colors duration-normal"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 px-4">
            <a
              href="#pricing"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center h-12 w-full rounded-full bg-secondary text-primary font-display font-semibold text-body shadow-sm hover:bg-secondary-600 transition-all duration-normal"
            >
              Commencer
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

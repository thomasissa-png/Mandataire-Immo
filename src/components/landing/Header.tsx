"use client"

import { useState } from "react"

const NAV_LINKS = [
  { label: "Comment ca marche", href: "#piliers" },
  { label: "Avant / Apres", href: "#avant-apres" },
  { label: "Tarifs", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
      <div className="container-immocrew flex items-center justify-between h-14 tablet:h-16">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <span className="font-display text-h3 font-bold text-primary">
            ImmoCrew
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden tablet:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-body font-medium text-foreground hover:text-secondary transition-colors duration-normal"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA */}
        <a
          href="#pricing"
          className="hidden tablet:inline-flex items-center justify-center h-12 px-6 rounded-full bg-secondary text-white font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
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
      {isMenuOpen && (
        <div className="tablet:hidden fixed inset-0 top-14 z-40 bg-white">
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
                className="flex items-center justify-center h-12 w-full rounded-full bg-secondary text-white font-display font-semibold text-body shadow-sm hover:bg-secondary-600 transition-all duration-normal"
              >
                Commencer
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

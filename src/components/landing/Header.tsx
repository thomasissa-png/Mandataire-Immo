"use client"

import { useState, useEffect, Suspense } from "react"
import { useSession } from "next-auth/react"
import { AuthModal } from "@/components/AuthModal"

const NAV_LINKS = [
  { label: "Comment ça marche", href: "#comment-ca-marche" },
  { label: "Avant / Après", href: "#avant-apres" },
  { label: "Tarifs", href: "#pricing" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "#faq" },
] as const

function HeaderInner() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { data: session } = useSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const handleMonEspaceClick = (e: React.MouseEvent) => {
    if (session) return // Let the <a> navigate to /dashboard
    e.preventDefault()
    setIsMenuOpen(false)
    setIsAuthModalOpen(true)
  }

  return (
    <>
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

          {/* Desktop: Mon espace + CTA */}
          <div className="hidden tablet:flex items-center gap-4">
            <a
              href="/dashboard"
              onClick={handleMonEspaceClick}
              className="text-body font-medium text-foreground hover:text-secondary transition-colors duration-normal"
            >
              Mon espace
            </a>
            <a
              href="#pricing"
              className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
            >
              Commencer
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="tablet:hidden flex items-center justify-center w-11 h-11 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
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
            <a
              href="/dashboard"
              onClick={handleMonEspaceClick}
              className="flex items-center h-12 px-4 rounded-lg text-h4 font-semibold text-secondary hover:bg-secondary-50 transition-colors duration-normal"
            >
              Mon espace
            </a>
            <div className="mt-4 px-4">
              <a
                href="#pricing"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center h-12 w-full rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 transition-all duration-normal"
              >
                Commencer
              </a>
            </div>
          </nav>
        </div>
      </header>

      <Suspense fallback={null}>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode="sign-in"
        />
      </Suspense>
    </>
  )
}

export function Header() {
  return (
    <Suspense fallback={
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
        <div className="container-immocrew flex items-center justify-between h-14 tablet:h-16">
          <span className="font-display text-h3 font-bold text-primary">ImmoCrew</span>
        </div>
      </header>
    }>
      <HeaderInner />
    </Suspense>
  )
}

"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

interface SidebarLink {
  href: string
  label: string
  icon: string
}

interface SidebarSection {
  title?: string
  links: SidebarLink[]
}

const NAV_SECTIONS: SidebarSection[] = [
  {
    links: [
      { href: "/dashboard", label: "Tableau de bord", icon: "🏠" },
    ],
  },
  {
    title: "Mon compte",
    links: [
      { href: "/dashboard/profile", label: "Mon profil", icon: "👤" },
      { href: "/dashboard/ma-page", label: "Ma page mandataire", icon: "🌐" },
      { href: "/dashboard/biens", label: "Mes biens", icon: "🏡" },
    ],
  },
  {
    title: "Mes contenus",
    links: [
      { href: "/dashboard/strategie", label: "Mes bios et positionnement", icon: "🎯" },
      { href: "/dashboard/annonces", label: "Mes annonces", icon: "🏡" },
      { href: "/dashboard/calendrier", label: "Calendrier éditorial", icon: "📆" },
      { href: "/dashboard/posts", label: "Mes posts", icon: "📅" },
      { href: "/dashboard/articles", label: "Articles SEO", icon: "📝" },
      { href: "/dashboard/scripts", label: "Scripts vidéo", icon: "🎬" },
      { href: "/dashboard/emails", label: "Emails", icon: "📧" },
    ],
  },
]

// Mobile bottom nav : subset des liens les plus importants
const MOBILE_NAV: SidebarLink[] = [
  { href: "/dashboard", label: "Accueil", icon: "🏠" },
  { href: "/dashboard/posts", label: "Posts", icon: "📱" },
  { href: "/dashboard/annonces", label: "Annonces", icon: "📝" },
  { href: "/dashboard/calendrier", label: "Calendrier", icon: "📆" },
]

const MORE_LINKS: SidebarLink[] = [
  { href: "/dashboard/scripts", label: "Scripts vidéo", icon: "🎬" },
  { href: "/dashboard/articles", label: "Articles SEO", icon: "📝" },
  { href: "/dashboard/emails", label: "Emails", icon: "📧" },
  { href: "/dashboard/strategie", label: "Bios et positionnement", icon: "🎯" },
  { href: "/dashboard/biens", label: "Mes biens", icon: "🏡" },
  { href: "/dashboard/ma-page", label: "Ma page mandataire", icon: "🌐" },
  { href: "/dashboard/profile", label: "Mon profil", icon: "👤" },
  { href: "/dashboard/support", label: "Support", icon: "💬" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [moreOpen, setMoreOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0">
        <div className="sticky top-20 space-y-4">
          {NAV_SECTIONS.map((section, i) => (
            <div key={i}>
              {section.title && (
                <p className="px-3 text-caption font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`w-full text-left px-3 py-2 rounded-lg text-body-sm flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
                      isActive(link.href)
                        ? "bg-primary-50 text-primary font-semibold"
                        : "text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <span className="text-sm" aria-hidden="true">{link.icon}</span>
                    <span className="flex-1">{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <hr className="border-border" />
          <a
            href="/dashboard/support"
            className={`w-full text-left px-3 py-2 rounded-lg text-body-sm flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
              isActive("/dashboard/support")
                ? "bg-primary-50 text-primary font-semibold"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <span className="text-sm" aria-hidden="true">💬</span>
            <span>Support</span>
          </a>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-3 py-2 rounded-lg text-body-sm flex items-center gap-2 text-neutral-600 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <span className="text-sm" aria-hidden="true">🚪</span>
            <span>Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg" aria-label="Navigation">
        <div className="flex justify-around items-center h-14 px-2">
          {MOBILE_NAV.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-center transition-colors ${
                isActive(link.href)
                  ? "text-primary font-semibold"
                  : "text-neutral-500"
              }`}
            >
              <span className="text-lg" aria-hidden="true">{link.icon}</span>
              <span className="text-[10px] leading-tight">{link.label}</span>
            </a>
          ))}
          {/* Bouton "Plus" */}
          <button
            type="button"
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-lg text-center transition-colors ${
              moreOpen ? "text-primary font-semibold" : "text-neutral-500"
            }`}
            aria-expanded={moreOpen}
            aria-label="Plus de pages"
          >
            <span className="text-lg" aria-hidden="true">•••</span>
            <span className="text-[10px] leading-tight">Plus</span>
          </button>
        </div>

        {/* Slide-up menu "Plus" */}
        {moreOpen && (
          <>
            <div
              className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-40"
              onClick={() => setMoreOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute bottom-14 left-0 right-0 bg-card border-t border-border rounded-t-2xl shadow-xl z-50 px-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-2">
                {MORE_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl text-center transition-colors min-h-[72px] ${
                      isActive(link.href)
                        ? "bg-primary-50 text-primary font-semibold"
                        : "bg-neutral-50 text-neutral-600 hover:bg-neutral-100"
                    }`}
                  >
                    <span className="text-xl" aria-hidden="true">{link.icon}</span>
                    <span className="text-[11px] leading-tight">{link.label}</span>
                  </a>
                ))}
                <button
                  type="button"
                  onClick={() => { signOut({ callbackUrl: "/" }); setMoreOpen(false) }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-center bg-neutral-50 text-neutral-600 hover:bg-neutral-100 transition-colors min-h-[72px]"
                >
                  <span className="text-xl" aria-hidden="true">🚪</span>
                  <span className="text-[11px] leading-tight">Déconnexion</span>
                </button>
              </div>
            </div>
          </>
        )}
      </nav>
    </>
  )
}

"use client"

import { usePathname } from "next/navigation"

interface SidebarLink {
  href: string
  label: string
  icon: string
}

const NAV_LINKS: SidebarLink[] = [
  { href: "/dashboard", label: "Mon espace", icon: "🏠" },
  { href: "/dashboard/profile", label: "Mon profil", icon: "👤" },
  { href: "/dashboard/ma-page", label: "Ma page mandataire", icon: "🌐" },
  { href: "/dashboard/biens/nouveau", label: "Ajouter un bien", icon: "➕" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0">
        <div className="sticky top-20 space-y-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-body-sm flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
                isActive(link.href)
                  ? "bg-primary-50 text-primary font-semibold"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <span aria-hidden="true">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
            </a>
          ))}
          <hr className="my-3 border-border" />
          <a
            href="mailto:support@immocrew.fr"
            className="w-full text-left px-3 py-2.5 rounded-lg text-body-sm flex items-center gap-2 text-neutral-600 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">💬</span>
            <span>Support</span>
          </a>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg" aria-label="Navigation">
        <div className="flex justify-around items-center h-14 px-2">
          {NAV_LINKS.map((link) => (
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
              <span className="text-[10px] leading-tight">{link.label.split(" ").slice(0, 2).join(" ")}</span>
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}

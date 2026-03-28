"use client"

const SECTIONS = [
  { id: "identite", label: "Identité", icon: "👤" },
  { id: "zone", label: "Zone", icon: "📍" },
  { id: "metier", label: "Métier", icon: "🏠" },
  { id: "communication", label: "Style", icon: "✍️" },
  { id: "reseaux", label: "Réseaux", icon: "🔗" },
  { id: "bio", label: "Bio", icon: "📝" },
] as const

export function ProfileSectionNav() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(`section-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <nav
      className="md:hidden mb-6 -mx-4 px-4 overflow-x-auto scrollbar-hide"
      aria-label="Navigation rapide des sections"
    >
      <div className="flex gap-2 min-w-max">
        {SECTIONS.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => scrollToSection(section.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-primary-50 text-primary text-body-sm font-medium whitespace-nowrap hover:bg-primary-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 min-h-[44px]"
          >
            <span aria-hidden="true">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>
    </nav>
  )
}

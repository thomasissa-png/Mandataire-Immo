/**
 * Accent visuel par catégorie — bandeau coloré compact + icône inline.
 * Remplace les grosses covers monochromes qui gaspillaient l'espace.
 */

interface CategoryStyle {
  /** Couleur Tailwind pour le bandeau et l'icône */
  border: string
  bg: string
  text: string
  icon: string
  iconViewBox: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Annonces": {
    border: "border-l-primary",
    bg: "bg-primary/10",
    text: "text-primary",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    iconViewBox: "0 0 24 24",
  },
  "Stratégie": {
    border: "border-l-primary-700",
    bg: "bg-primary-700/10",
    text: "text-primary-700",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    iconViewBox: "0 0 24 24",
  },
  "SEO local": {
    border: "border-l-success-600",
    bg: "bg-success-600/10",
    text: "text-success-700",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    iconViewBox: "0 0 24 24",
  },
  "Marketing digital": {
    border: "border-l-secondary",
    bg: "bg-secondary/10",
    text: "text-secondary-700",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    iconViewBox: "0 0 24 24",
  },
  "Réseaux sociaux": {
    border: "border-l-secondary-600",
    bg: "bg-secondary-600/10",
    text: "text-secondary-700",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    iconViewBox: "0 0 24 24",
  },
  "Image pro": {
    border: "border-l-success-500",
    bg: "bg-success-500/10",
    text: "text-success-700",
    icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    iconViewBox: "0 0 24 24",
  },
  "Vidéo": {
    border: "border-l-primary-500",
    bg: "bg-primary-500/10",
    text: "text-primary-600",
    icon: "M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    iconViewBox: "0 0 24 24",
  },
  Blog: {
    border: "border-l-primary",
    bg: "bg-primary/10",
    text: "text-primary",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    iconViewBox: "0 0 24 24",
  },
}

export function getCategoryStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES["Blog"]
}

interface CategoryIconProps {
  category: string
  size?: "sm" | "md"
}

/** Icône catégorie compacte dans un cercle coloré */
export function CategoryIcon({ category, size = "md" }: CategoryIconProps) {
  const style = getCategoryStyle(category)
  const containerSize = size === "sm" ? "w-8 h-8" : "w-10 h-10"
  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5"

  return (
    <div className={`${containerSize} rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
      <svg
        className={`${iconSize} ${style.text}`}
        fill="none"
        viewBox={style.iconViewBox}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={style.icon} />
      </svg>
    </div>
  )
}

// Legacy export for backward compat — not used anymore in blog but may be referenced elsewhere
export function ArticleCover({ category }: { category: string; title?: string; size?: string }) {
  return <CategoryIcon category={category} size="md" />
}

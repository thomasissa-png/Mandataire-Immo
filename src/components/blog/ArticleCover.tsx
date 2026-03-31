/**
 * Covers visuelles par catégorie — monochrome, un seul hue par catégorie.
 * Doux à l'œil, pas de dégradés multicolores agressifs.
 */

interface CategoryStyle {
  /** Dégradé monochrome (même teinte, 2 stops seulement) */
  gradient: string
  icon: string
  iconViewBox: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Annonces": {
    gradient: "from-primary/80 to-primary",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    iconViewBox: "0 0 24 24",
  },
  "Stratégie": {
    gradient: "from-primary-600/90 to-primary-800",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    iconViewBox: "0 0 24 24",
  },
  "SEO local": {
    gradient: "from-success/70 to-success-700",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    iconViewBox: "0 0 24 24",
  },
  "Marketing digital": {
    gradient: "from-secondary/70 to-secondary-700",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    iconViewBox: "0 0 24 24",
  },
  "Réseaux sociaux": {
    gradient: "from-secondary-500/80 to-secondary-800",
    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    iconViewBox: "0 0 24 24",
  },
  "Image pro": {
    gradient: "from-success-500/80 to-success-800",
    icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    iconViewBox: "0 0 24 24",
  },
  "Vidéo": {
    gradient: "from-primary-400/80 to-primary-700",
    icon: "M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
    iconViewBox: "0 0 24 24",
  },
  Blog: {
    gradient: "from-primary/70 to-primary-700",
    icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    iconViewBox: "0 0 24 24",
  },
}

function getStyle(category: string): CategoryStyle {
  return CATEGORY_STYLES[category] || CATEGORY_STYLES["Blog"]
}

interface ArticleCoverProps {
  category: string
  title?: string
  size?: "sm" | "md" | "featured"
}

export function ArticleCover({ category, title, size = "md" }: ArticleCoverProps) {
  const style = getStyle(category)
  const iconSize = size === "sm" ? "w-6 h-6" : size === "featured" ? "w-14 h-14" : "w-10 h-10"
  const textSize = size === "sm" ? "text-caption" : size === "featured" ? "text-body" : "text-body-sm"
  const aspect = size === "featured" ? "aspect-[16/5]" : "aspect-[16/7]"

  return (
    <div
      className={`${aspect} bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Motif décoratif discret */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute -top-8 -right-8 w-32 h-32 border border-white rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-20 h-20 border border-white rounded-full" />
      </div>

      {/* Icône */}
      <svg
        className={`${iconSize} text-white/70 mb-2`}
        fill="none"
        viewBox={style.iconViewBox}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={style.icon} />
      </svg>

      {/* Catégorie — visible uniquement sur le featured (pas de doublon card) */}
      {title && (
        <>
          <span className="text-white/50 text-caption font-medium uppercase tracking-widest mb-1">
            {category}
          </span>
          <p className={`text-white/90 font-display font-semibold ${textSize} text-center line-clamp-2 max-w-[85%] leading-snug`}>
            {title}
          </p>
        </>
      )}
    </div>
  )
}

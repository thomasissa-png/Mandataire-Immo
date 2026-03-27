/**
 * Couleurs et icônes SVG par catégorie d'article de blog.
 * Génère des covers visuelles en CSS pur — pas besoin d'images.
 */

interface CategoryStyle {
  gradient: string
  icon: string // SVG path (d attribute)
  iconViewBox: string
}

const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "Annonces": {
    gradient: "from-secondary via-secondary-400 to-primary",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    iconViewBox: "0 0 24 24",
  },
  "Stratégie": {
    gradient: "from-primary via-primary-600 to-primary-800",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    iconViewBox: "0 0 24 24",
  },
  "SEO local": {
    gradient: "from-success via-success-500 to-primary",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    iconViewBox: "0 0 24 24",
  },
  "Marketing digital": {
    gradient: "from-secondary-400 via-secondary to-secondary-600",
    icon: "M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z",
    iconViewBox: "0 0 24 24",
  },
  Blog: {
    gradient: "from-primary-400 via-primary to-primary-700",
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
  size?: "sm" | "md"
}

export function ArticleCover({ category, title, size = "md" }: ArticleCoverProps) {
  const style = getStyle(category)
  const iconSize = size === "sm" ? "w-8 h-8" : "w-12 h-12"
  const textSize = size === "sm" ? "text-caption" : "text-body-sm"

  return (
    <div
      className={`aspect-[16/9] bg-gradient-to-br ${style.gradient} flex flex-col items-center justify-center p-4 relative overflow-hidden`}
    >
      {/* Pattern décoratif */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-8 -right-8 w-32 h-32 border-2 border-white rounded-full" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 border-2 border-white rounded-full" />
      </div>

      {/* Icône */}
      <svg
        className={`${iconSize} text-white/80 mb-2`}
        fill="none"
        viewBox={style.iconViewBox}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d={style.icon} />
      </svg>

      {/* Catégorie */}
      <span className="text-white/60 text-caption font-medium uppercase tracking-widest mb-1">
        {category}
      </span>

      {/* Titre (tronqué) */}
      {title && (
        <p className={`text-white font-display font-semibold ${textSize} text-center line-clamp-2 max-w-[85%] leading-snug`}>
          {title}
        </p>
      )}
    </div>
  )
}

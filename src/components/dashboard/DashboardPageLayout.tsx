/**
 * Layout partagé pour toutes les sous-pages du dashboard.
 * Garantit la cohérence visuelle : titre, description, structure identique.
 */

interface DashboardPageLayoutProps {
  icon: string
  title: string
  description?: string
  count?: number
  children: React.ReactNode
}

export function DashboardPageLayout({
  icon,
  title,
  description,
  count,
  children,
}: DashboardPageLayoutProps) {
  return (
    <div className="space-y-6">
      {/* En-tête de page — identique partout */}
      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-2xl" aria-hidden="true">{icon}</span>
          <div>
            <h1 className="font-display text-h2 text-primary">
              {title}
              {typeof count === "number" && (
                <span className="text-neutral-400 text-h3 ml-2">({count})</span>
              )}
            </h1>
            {description && (
              <p className="text-body-sm text-neutral-500 mt-1">{description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      {children}
    </div>
  )
}

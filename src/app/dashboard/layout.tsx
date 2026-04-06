import { UserMenu } from "@/components/dashboard/UserMenu"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
        <div className="container-immocrew flex items-center justify-between h-14 tablet:h-16">
          <a href="/" className="font-display text-h3 font-bold text-primary">
            ImmoCrew
          </a>
          <nav className="flex items-center gap-4" aria-label="Navigation principale">
            <a
              href="/dashboard"
              className="text-body-sm font-medium text-foreground hover:text-secondary transition-colors duration-normal py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded"
            >
              Mon espace
            </a>
            <a
              href="mailto:contact@immocrew.fr"
              className="hidden tablet:inline text-body-sm text-neutral-500 hover:text-secondary transition-colors duration-normal py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded"
            >
              Une question ?
            </a>
            <UserMenu />
          </nav>
        </div>
      </header>

      {/* Content with persistent sidebar */}
      <div className="container-immocrew py-8 desktop:py-12">
        <div className="lg:flex lg:gap-6">
          <DashboardSidebar />
          <main className="flex-1 min-w-0 pb-16 lg:pb-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

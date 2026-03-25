import { UserButton } from "@clerk/nextjs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-xs">
        <div className="container-immocrew flex items-center justify-between h-14 tablet:h-16">
          <a href="/" className="font-display text-h3 font-bold text-primary">
            ImmoCrew
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/dashboard"
              className="text-body-sm font-medium text-foreground hover:text-secondary transition-colors duration-normal"
            >
              Mes livrables
            </a>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container-immocrew py-8 desktop:py-12">
        {children}
      </main>
    </div>
  )
}

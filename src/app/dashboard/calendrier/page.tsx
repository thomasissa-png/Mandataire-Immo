/**
 * Page Calendrier éditorial — SSR avec Suspense.
 * Affiche un calendrier visuel mensuel avec les contenus planifiés.
 * Le composant EditorialCalendar gère la navigation entre mois côté client.
 */

import { redirect } from "next/navigation"
import Link from "next/link"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { EditorialCalendar } from "@/components/dashboard/EditorialCalendar"

const QUICK_LINKS = [
  { href: "/dashboard/posts", icon: "📱", label: "Posts" },
  { href: "/dashboard/articles", icon: "📝", label: "Articles SEO" },
  { href: "/dashboard/scripts", icon: "🎬", label: "Scripts vidéo" },
  { href: "/dashboard/emails", icon: "📧", label: "Emails" },
] as const

export default async function CalendrierPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const now = new Date()
  const monthLabel = now.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })

  // Calendrier éditorial = uniquement les contenus publiables
  // Exclure : annonces (contenu immobilier, pas éditorial) et emails de prospection (CRM)
  const allDeliverables = await getDeliverables(user.email, [
    "post",
    "article_seo",
    "script_video",
    "newsletter",
  ])

  return (
    <DashboardPageLayout
      icon="📆"
      title="Calendrier éditorial"
      description={`Ton planning de contenus pour ${monthLabel}.`}
      count={allDeliverables.length}
    >
      {/* Calendrier visuel */}
      <EditorialCalendar
        deliverables={allDeliverables}
        initialYear={now.getFullYear()}
        initialMonth={now.getMonth()}
      />

      {/* Liens rapides vers les sections */}
      <div className="rounded-xl bg-card border border-border p-4 tablet:p-5">
        <h3 className="font-display text-h5 text-primary mb-3">
          Accès rapide
        </h3>
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-2">
          {QUICK_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-background hover:bg-secondary-50 text-body-sm text-primary font-medium transition-colors min-h-[44px] group"
            >
              <span className="text-base" aria-hidden="true">{link.icon}</span>
              <span className="group-hover:text-secondary-700 transition-colors">
                {link.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardPageLayout>
  )
}

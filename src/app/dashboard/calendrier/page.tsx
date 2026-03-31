import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

const TYPE_LABELS: Record<string, string> = {
  post: "Post",
  article_seo: "Article SEO",
  annonce: "Annonce",
  script_video: "Script vidéo",
  newsletter: "Newsletter",
  email_prospection: "Email prospection",
}

const TYPE_COLORS: Record<string, string> = {
  post: "bg-secondary-50 text-secondary-600",
  article_seo: "bg-primary-50 text-primary-700",
  annonce: "bg-warning-50 text-warning-700",
  script_video: "bg-success-50 text-success-700",
  newsletter: "bg-neutral-100 text-neutral-600",
  email_prospection: "bg-neutral-100 text-neutral-600",
}

export default async function CalendrierPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  // Récupérer le calendrier + tous les contenus du mois en cours
  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthLabel = new Date().toLocaleDateString("fr-FR", { month: "long", year: "numeric" })

  const [calendriers, allDeliverables] = await Promise.all([
    getDeliverables(user.email, ["calendrier"]),
    getDeliverables(user.email, [
      "post", "article_seo", "annonce", "script_video", "newsletter", "email_prospection",
    ]),
  ])

  const thisMonthContent = allDeliverables.filter(
    (d) => d.month === currentMonth || d.created_at.startsWith(currentMonth)
  )

  // Compter par type
  const countByType = thisMonthContent.reduce<Record<string, number>>((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + 1
    return acc
  }, {})

  const latestCalendrier = calendriers[0]

  return (
    <DashboardPageLayout
      icon="📆"
      title="Calendrier éditorial"
      description={`Ta vue d'ensemble pour ${monthLabel}.`}
      count={thisMonthContent.length}
    >
      {/* Calendrier deliverable */}
      {latestCalendrier && (
        <div className="mb-6">
          <DeliverableCard
            id={latestCalendrier.id}
            type={latestCalendrier.type}
            typeLabel="Calendrier du mois"
            typeColor="bg-secondary-50 text-secondary-600"
            title={latestCalendrier.title}
            status={latestCalendrier.status}
          />
        </div>
      )}

      {/* Résumé du mois */}
      <div className="rounded-xl bg-card border border-border p-5 mb-6">
        <h3 className="font-display text-h4 font-semibold text-primary mb-4">
          Contenus prévus — {monthLabel}
        </h3>
        {Object.keys(countByType).length === 0 ? (
          <p className="text-body-sm text-neutral-500">
            Aucun contenu prévu ce mois-ci — ton prochain pack sera bientôt livré.
          </p>
        ) : (
          <div className="grid grid-cols-2 tablet:grid-cols-3 gap-3">
            {Object.entries(countByType).map(([type, count]) => (
              <div key={type} className="rounded-lg bg-background p-3 text-center">
                <p className="font-display text-h2 font-bold text-primary">{count}</p>
                <p className="text-caption text-neutral-500">
                  {TYPE_LABELS[type] || type}{count > 1 ? "s" : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Liste des contenus du mois */}
      {thisMonthContent.length > 0 && (
        <>
          <h3 className="font-display text-h4 font-semibold text-primary mb-3">
            Détail des contenus
          </h3>
          <div className="space-y-3">
            {thisMonthContent.map((d) => (
              <DeliverableCard
                key={d.id}
                id={d.id}
                type={d.type}
                typeLabel={TYPE_LABELS[d.type] || d.type}
                typeColor={TYPE_COLORS[d.type] || "bg-neutral-100 text-neutral-600"}
                title={d.title}
                status={d.status}
              />
            ))}
          </div>
        </>
      )}
    </DashboardPageLayout>
  )
}

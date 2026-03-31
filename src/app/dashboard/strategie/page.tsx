import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

const TYPE_LABELS: Record<string, string> = {
  bio: "Bio",
  brief_graphique: "Kit graphique",
  calendrier: "Calendrier",
  positionnement: "Positionnement",
  landing_page: "Landing page",
}

const TYPE_COLORS: Record<string, string> = {
  bio: "bg-secondary-50 text-secondary-600",
  brief_graphique: "bg-neutral-100 text-neutral-600",
  calendrier: "bg-warning-50 text-warning-700",
  positionnement: "bg-primary-50 text-primary-700",
  landing_page: "bg-success-50 text-success-700",
}

const STRATEGY_HINTS: Record<string, string> = {
  bio: "Copie-la sur Instagram, LinkedIn et Facebook",
  positionnement: "Ton argumentaire unique — à utiliser dans tes échanges",
  brief_graphique: "Pour tes visuels Canva ou ton graphiste",
  calendrier: "Ton planning de publication pour le mois",
  landing_page: "Ta page web personnalisée",
}

export default async function StrategiePage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const strategie = await getDeliverables(user.email, [
    "bio", "brief_graphique", "calendrier", "positionnement", "landing_page",
  ])

  // Dédupliquer par type (garde le plus récent)
  const uniqueStrategie = strategie.reduce<typeof strategie>((acc, d) => {
    if (!acc.find(x => x.type === d.type)) acc.push(d)
    return acc
  }, [])

  return (
    <DashboardPageLayout
      icon="👤"
      title="Mes bios et positionnement"
      description="Tes bios, ton positionnement et ton kit graphique. Copie-les sur tes réseaux."
      count={uniqueStrategie.length}
    >
      {uniqueStrategie.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center">
          <p className="text-body text-neutral-500">Aucun contenu stratégique pour le moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
          {uniqueStrategie.map((d) => (
            <div key={d.id}>
              <DeliverableCard id={d.id} type={d.type} typeLabel={TYPE_LABELS[d.type] || d.type} typeColor={TYPE_COLORS[d.type] || "bg-neutral-100 text-neutral-600"} title={d.title} status={d.status} />
              {STRATEGY_HINTS[d.type] ? <p className="text-caption text-neutral-400 mt-1 ml-1">{STRATEGY_HINTS[d.type]}</p> : null}
            </div>
          ))}
        </div>
      )}
    </DashboardPageLayout>
  )
}

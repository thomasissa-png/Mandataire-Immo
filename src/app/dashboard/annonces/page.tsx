import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

export default async function AnnoncesPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const annonces = await getDeliverables(user.email, ["annonce"])

  return (
    <DashboardPageLayout
      icon="🏡"
      title="Mes annonces"
      description="Tes annonces immobilières rédigées pour donner envie de visiter."
      count={annonces.length}
    >
      {annonces.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center">
          <p className="text-body text-neutral-500">Aucune annonce pour le moment — tes premières annonces arrivent bientôt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
          {annonces.map((d) => (
            <DeliverableCard
              key={d.id}
              id={d.id}
              type={d.type}
              typeLabel="Annonce"
              typeColor="bg-secondary-50 text-secondary-600"
              title={d.title}
              status={d.status}
            />
          ))}
        </div>
      )}
    </DashboardPageLayout>
  )
}

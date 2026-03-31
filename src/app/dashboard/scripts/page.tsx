import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

export default async function ScriptsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const scripts = await getDeliverables(user.email, ["script_video"])

  return (
    <DashboardPageLayout
      icon="🎬"
      title="Mes scripts vidéo"
      description="Filme-toi avec ton iPhone, c'est suffisant. Chaque script est prêt à lire face caméra."
      count={scripts.length}
    >
      {scripts.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center">
          <p className="text-body text-neutral-500">Aucun script pour le moment — tes premiers contenus arrivent bientôt.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {scripts.map((d) => (
            <DeliverableCard key={d.id} id={d.id} type={d.type} typeLabel="Script vidéo" typeColor="bg-warning-50 text-warning-800" title={d.title} status={d.status} />
          ))}
        </div>
      )}
    </DashboardPageLayout>
  )
}

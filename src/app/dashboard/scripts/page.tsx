import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { ScriptsFiltered } from "./ScriptsFiltered"

export default async function ScriptsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const scripts = await getDeliverables(user.email, ["script_video"], { includeArchived: true })

  const activeCount = scripts.filter((s) => s.status !== "archived").length

  return (
    <DashboardPageLayout
      icon="🎬"
      title="Mes scripts vidéo"
      description="Filme-toi avec ton iPhone, c'est suffisant. Chaque script est prêt à lire face caméra."
      count={activeCount}
    >
      <ScriptsFiltered scripts={scripts} />
    </DashboardPageLayout>
  )
}

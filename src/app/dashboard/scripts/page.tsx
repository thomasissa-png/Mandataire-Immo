import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { query } from "@/lib/db"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { ScriptsFiltered } from "./ScriptsFiltered"

export default async function ScriptsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const scripts = await getDeliverables(user.email, ["script_video"], { includeArchived: true })
  const activeCount = scripts.filter((s) => s.status !== "archived").length

  // Récupérer le niveau de confort caméra
  const { rows } = await query<{ client_context: Record<string, unknown> | null }>(
    "SELECT client_context FROM clients WHERE email = $1 LIMIT 1",
    [user.email]
  )
  const confortCamera = String(rows[0]?.client_context?.confort_camera || "debutant")

  return (
    <DashboardPageLayout
      icon="🎬"
      title="Mes scripts vidéo"
      description="Chaque script est prêt à tourner. Pas besoin de matériel pro — ton smartphone suffit."
      count={activeCount}
    >
      <ScriptsFiltered scripts={scripts} confortCamera={confortCamera} />
    </DashboardPageLayout>
  )
}

import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { StrategieFiltered } from "./StrategieFiltered"

export default async function StrategiePage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const strategie = await getDeliverables(user.email, [
    "bio", "calendrier", "positionnement", "landing_page",
  ], { includeArchived: true })

  // Dédupliquer par type (garde le plus récent — la query est ORDER BY created_at DESC)
  const uniqueStrategie = strategie.reduce<typeof strategie>((acc, d) => {
    if (!acc.find((x) => x.type === d.type)) acc.push(d)
    return acc
  }, [])

  const activeCount = uniqueStrategie.filter((s) => s.status !== "archived").length

  return (
    <DashboardPageLayout
      icon="👤"
      title="Mes bios et positionnement"
      description="Tes bios, ton positionnement et ton kit graphique. Copie-les sur tes réseaux."
      count={activeCount}
    >
      <StrategieFiltered strategie={uniqueStrategie} />
    </DashboardPageLayout>
  )
}

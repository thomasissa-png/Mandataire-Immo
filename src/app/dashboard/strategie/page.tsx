import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { StrategieContent } from "./StrategieContent"

export default async function StrategiePage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  // Contenus permanents uniquement — pas de calendrier (sa propre page)
  // brief_graphique exclu : outil interne, pas de valeur pour Sophie
  const strategie = await getDeliverables(user.email, [
    "bio", "positionnement", "landing_page",
  ])

  // Dédupliquer par type (garde le plus récent)
  const uniqueStrategie = strategie.reduce<typeof strategie>((acc, d) => {
    if (!acc.find((x) => x.type === d.type)) acc.push(d)
    return acc
  }, [])

  return (
    <DashboardPageLayout
      icon="🎯"
      title="Mes bios et positionnement"
      description="Ta fondation marketing — bio, positionnement, kit graphique. Contenu permanent, pas mensuel."
      count={uniqueStrategie.length}
    >
      <StrategieContent strategie={uniqueStrategie} />
    </DashboardPageLayout>
  )
}

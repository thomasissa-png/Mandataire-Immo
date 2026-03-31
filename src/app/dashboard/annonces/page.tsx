import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { AnnoncesFiltered } from "./AnnoncesFiltered"

export default async function AnnoncesPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  // Récupérer toutes les annonces (y compris archivées) pour le filtrage client
  const annonces = await getDeliverables(user.email, ["annonce"], { includeArchived: true })

  const activeCount = annonces.filter((a) => a.status !== "archived").length

  return (
    <DashboardPageLayout
      icon="🏡"
      title="Mes annonces"
      description="Tes annonces immobilières prêtes à publier. Copie le texte et colle-le sur le portail de ton choix."
      count={activeCount}
    >
      <AnnoncesFiltered annonces={annonces} />
    </DashboardPageLayout>
  )
}

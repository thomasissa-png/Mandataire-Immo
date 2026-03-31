import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { AnnonceList } from "@/components/dashboard/AnnonceList"

export default async function AnnoncesPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const annonces = await getDeliverables(user.email, ["annonce"])

  return (
    <DashboardPageLayout
      icon="🏡"
      title="Mes annonces"
      description="Tes annonces immobilières prêtes à publier. Copie le texte et colle-le sur le portail de ton choix."
      count={annonces.length}
    >
      {annonces.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center">
          <p className="text-body text-neutral-500">Aucune annonce pour le moment — tes premières annonces arrivent bientôt.</p>
        </div>
      ) : (
        <AnnonceList annonces={annonces.map(d => ({ id: d.id, title: d.title, status: d.status, createdAt: d.created_at }))} />
      )}
    </DashboardPageLayout>
  )
}

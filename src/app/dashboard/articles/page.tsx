import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

export default async function ArticlesPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const articles = await getDeliverables(user.email, ["article_seo"])

  return (
    <DashboardPageLayout
      icon="📝"
      title="Mes articles SEO"
      description="Publie-les sur ton blog ou ta page Facebook. Le SEO local met 2-3 mois à porter ses fruits — la régularité est la clé."
      count={articles.length}
    >
      {articles.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center">
          <p className="text-body text-neutral-500">Aucun article pour le moment — tes premiers contenus arrivent bientôt.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((d) => (
            <DeliverableCard key={d.id} id={d.id} type={d.type} typeLabel="Article local" typeColor="bg-blue-50 text-blue-700" title={d.title} status={d.status} />
          ))}
        </div>
      )}
    </DashboardPageLayout>
  )
}

import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { ArticlesFiltered } from "./ArticlesFiltered"

export default async function ArticlesPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const articles = await getDeliverables(user.email, ["article_seo"], { includeArchived: true })
  const active = articles.filter((a) => a.status !== "archived")

  return (
    <DashboardPageLayout
      icon="📝"
      title="Mes articles SEO"
      description="Publie-les sur ton blog ou ta page Facebook. Le SEO local met 2-3 mois à porter ses fruits — la régularité est la clé."
      count={active.length}
    >
      <ArticlesFiltered articles={articles} />
    </DashboardPageLayout>
  )
}

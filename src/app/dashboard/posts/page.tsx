import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { PostsFiltered } from "./PostsFiltered"

export default async function PostsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const posts = await getDeliverables(user.email, ["post"], { includeArchived: true })
  const active = posts.filter((p) => p.status !== "archived")

  return (
    <DashboardPageLayout
      icon="📅"
      title="Mes posts"
      description="Copie, colle, publie. Ton équipe a fait le reste."
      count={active.length}
    >
      <PostsFiltered posts={posts} />
    </DashboardPageLayout>
  )
}

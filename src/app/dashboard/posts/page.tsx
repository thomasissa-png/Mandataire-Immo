import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { query } from "@/lib/db"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { PostsFiltered } from "./PostsFiltered"

export default async function PostsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const posts = await getDeliverables(user.email, ["post"], { includeArchived: true })
  const active = posts.filter((p) => p.status !== "archived")

  // Récupérer les réseaux sociaux actifs de Sophie
  const { rows } = await query<{ client_context: Record<string, unknown> | null }>(
    "SELECT client_context FROM clients WHERE email = $1 LIMIT 1",
    [user.email]
  )
  const ctx = rows[0]?.client_context || {}
  const activePlatforms: string[] = []
  if (ctx.instagram) activePlatforms.push("Instagram")
  if (ctx.linkedin_url) activePlatforms.push("LinkedIn")
  if (ctx.facebook) activePlatforms.push("Facebook")
  // Fallback si rien renseigné
  if (activePlatforms.length === 0) activePlatforms.push("Instagram", "LinkedIn")

  return (
    <DashboardPageLayout
      icon="📅"
      title="Mes posts"
      description="Copie, colle, publie. Ton équipe a fait le reste."
      count={active.length}
    >
      <PostsFiltered posts={posts} activePlatforms={activePlatforms} />
    </DashboardPageLayout>
  )
}

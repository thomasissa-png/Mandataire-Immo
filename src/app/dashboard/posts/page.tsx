import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

function detectPlatform(title: string) {
  const t = title.toLowerCase()
  if (t.includes("instagram") || t.includes("reel") || t.includes("story")) return { icon: "📸", name: "Instagram" }
  if (t.includes("linkedin")) return { icon: "💼", name: "LinkedIn" }
  if (t.includes("facebook")) return { icon: "📘", name: "Facebook" }
  if (t.includes("tiktok")) return { icon: "🎵", name: "TikTok" }
  return { icon: "📱", name: "Post" }
}

export default async function PostsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const posts = await getDeliverables(user.email, ["post"])
  const currentMonth = new Date().toISOString().slice(0, 7)
  const postsThisMonth = posts.filter(p => p.month === currentMonth || p.created_at.startsWith(currentMonth)).length

  return (
    <DashboardPageLayout
      icon="📅"
      title="Mon calendrier"
      description={postsThisMonth > 0 ? `${postsThisMonth} posts ce mois` : `${posts.length} posts au total`}
      count={posts.length}
    >
      {posts.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center">
          <p className="text-body text-neutral-500">Aucun post pour le moment — tes premiers contenus arrivent bientôt.</p>
        </div>
      ) : (
        <>
          <p className="text-caption text-neutral-400">Copie, colle, publie. Ton équipe a fait le reste.</p>
          <div className="relative mt-2">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-secondary/20" aria-hidden="true" />
            <div className="space-y-2">
              {(() => {
                let lastMonth = ""
                return posts.map((post) => {
                  const platform = detectPlatform(post.title)
                  const monthKey = post.month || post.created_at.slice(0, 7)
                  const showMonthHeader = monthKey !== lastMonth
                  if (showMonthHeader) lastMonth = monthKey
                  const monthLabel = monthKey ? new Date(monthKey + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : ""
                  return (
                    <div key={post.id}>
                      {showMonthHeader && monthLabel ? (
                        <div className="flex items-center gap-3 py-3 pl-10">
                          <div className="h-px flex-1 bg-border" />
                          <span className="text-caption font-semibold text-primary capitalize">{monthLabel}</span>
                          <div className="h-px flex-1 bg-border" />
                        </div>
                      ) : null}
                      <div className="relative pl-10">
                        <div className="absolute left-2 top-4 w-5 h-5 rounded-full bg-card border-2 border-secondary/30 flex items-center justify-center text-xs" aria-hidden="true">
                          {platform.icon}
                        </div>
                        <DeliverableCard id={post.id} type={post.type} typeLabel={platform.name} typeColor="bg-secondary-50 text-secondary-700" title={post.title} status={post.status} />
                      </div>
                    </div>
                  )
                })
              })()}
            </div>
          </div>
        </>
      )}
    </DashboardPageLayout>
  )
}

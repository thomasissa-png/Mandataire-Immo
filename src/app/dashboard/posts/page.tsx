import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

function detectPlatform(title: string) {
  const t = title.toLowerCase()
  if (t.includes("instagram") || t.includes("reel") || t.includes("story")) return { icon: "📸", name: "Instagram", hint: "Publie le soir (18h-20h) pour toucher les particuliers" }
  if (t.includes("linkedin")) return { icon: "💼", name: "LinkedIn", hint: "Publie le matin (7h-9h) pour toucher les pros" }
  if (t.includes("facebook")) return { icon: "📘", name: "Facebook", hint: "Publie en fin de journée (17h-19h)" }
  if (t.includes("tiktok")) return { icon: "🎵", name: "TikTok", hint: "Publie entre 19h et 21h pour un max de vues" }
  return { icon: "📱", name: "Post", hint: "" }
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
      title="Mes posts"
      description={postsThisMonth > 0 ? `${postsThisMonth} posts ce mois` : `${posts.length} posts au total`}
      count={posts.length}
    >
      {posts.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center">
          <p className="text-body text-neutral-500">Aucun post pour le moment — tes premiers contenus arrivent bientôt.</p>
        </div>
      ) : (
        <>
          {/* Progression mensuelle */}
          {postsThisMonth > 0 && (
            <div className="rounded-lg bg-card border border-border p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-body-sm font-semibold text-primary">Progression ce mois</p>
                  <p className="text-caption font-semibold text-secondary-700">{postsThisMonth} post{postsThisMonth > 1 ? "s" : ""} prêt{postsThisMonth > 1 ? "s" : ""}</p>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-secondary transition-all"
                    style={{ width: `${Math.min(100, (postsThisMonth / Math.max(postsThisMonth, 12)) * 100)}%` }}
                  />
                </div>
                <p className="text-caption text-neutral-400 mt-1">Copie et publie-les au fil de la semaine pour rester visible.</p>
              </div>
            </div>
          )}

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
                        {platform.hint && <p className="text-caption text-neutral-400 mt-1 ml-1">{platform.hint}</p>}
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

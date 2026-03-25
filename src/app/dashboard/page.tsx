import { currentUser } from "@clerk/nextjs/server"
import { createAdminSupabaseClient } from "@/lib/supabase"

type DeliverableType =
  | "post"
  | "article_seo"
  | "annonce"
  | "script_video"
  | "newsletter"
  | "email_prospection"

interface Deliverable {
  id: string
  type: DeliverableType
  title: string
  content: string
  month: string
  status: "draft" | "delivered"
  created_at: string
}

const TYPE_LABELS: Record<DeliverableType, string> = {
  post: "Post",
  article_seo: "Article SEO",
  annonce: "Annonce",
  script_video: "Script video",
  newsletter: "Newsletter",
  email_prospection: "Email prospection",
}

const TYPE_COLORS: Record<DeliverableType, string> = {
  post: "bg-secondary-50 text-secondary-800",
  article_seo: "bg-info-50 text-info-700",
  annonce: "bg-success-50 text-success-800",
  script_video: "bg-warning-50 text-warning-800",
  newsletter: "bg-primary-50 text-primary",
  email_prospection: "bg-error-50 text-error-700",
}

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    return null
  }

  const supabase = createAdminSupabaseClient()

  // Fetch client info
  const primaryEmail = user.emailAddresses[0]?.emailAddress
  const { data: client } = await supabase
    .from("clients")
    .select("*")
    .eq("email", primaryEmail)
    .single()

  // Fetch deliverables for current month
  const currentMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
  const { data: deliverables } = await supabase
    .from("deliverables")
    .select("*")
    .eq("client_email", primaryEmail)
    .eq("status", "delivered")
    .order("created_at", { ascending: false })

  const monthDeliverables = (deliverables as Deliverable[] | null) || []

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-h1 text-primary mb-2">
          Bonjour {user.firstName || ""}
        </h1>
        <p className="text-body text-neutral-500">
          {client?.pack === "mensuel"
            ? "Voici tes livrables du mois."
            : "Voici tes livrables."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Livrables ce mois",
            value: monthDeliverables.length,
          },
          {
            label: "Posts",
            value: monthDeliverables.filter((d) => d.type === "post").length,
          },
          {
            label: "Articles SEO",
            value: monthDeliverables.filter((d) => d.type === "article_seo")
              .length,
          },
          {
            label: "Annonces",
            value: monthDeliverables.filter((d) => d.type === "annonce")
              .length,
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg bg-card border border-border p-4 text-center"
          >
            <p className="font-display text-display-lg text-primary">
              {stat.value}
            </p>
            <p className="text-caption text-neutral-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Deliverables list */}
      {monthDeliverables.length === 0 ? (
        <div className="rounded-xl bg-card border border-border p-12 text-center">
          <p className="text-body text-neutral-500 mb-2">
            Tes livrables sont en cours de preparation.
          </p>
          <p className="text-body-sm text-neutral-400">
            Tu recevras un email des qu&apos;ils seront prets.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {monthDeliverables.map((deliverable) => (
            <div
              key={deliverable.id}
              className="rounded-lg bg-card border border-border p-6 hover:shadow-md transition-shadow duration-normal"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-caption font-semibold ${
                        TYPE_COLORS[deliverable.type]
                      }`}
                    >
                      {TYPE_LABELS[deliverable.type]}
                    </span>
                  </div>
                  <h3 className="font-display text-h4 text-primary mb-2">
                    {deliverable.title}
                  </h3>
                  <p className="text-body-sm text-neutral-600 line-clamp-3">
                    {deliverable.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manage subscription link */}
      {client?.stripe_customer_id && (
        <div className="mt-10 pt-6 border-t border-border">
          <a
            href="/api/portal"
            className="text-body-sm text-neutral-500 hover:text-secondary underline transition-colors duration-normal"
          >
            Gerer mon abonnement
          </a>
        </div>
      )}
    </div>
  )
}

import { currentUser } from "@clerk/nextjs/server"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import { query } from "@/lib/db"

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

interface ClientRow {
  id: string
  email: string
  pack: string | null
  stripe_customer_id: string | null
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

  const primaryEmail = user.emailAddresses[0]?.emailAddress

  // Fetch client info
  const { rows: clientRows } = await query<ClientRow>(
    "SELECT * FROM clients WHERE email = $1 LIMIT 1",
    [primaryEmail]
  )
  const client = clientRows[0] || null

  // Fetch deliverables (draft + delivered, ordered by most recent)
  const { rows: deliverables } = await query<Deliverable>(
    `SELECT * FROM deliverables
     WHERE client_email = $1 AND status IN ('draft', 'delivered')
     ORDER BY created_at DESC`,
    [primaryEmail]
  )

  const monthDeliverables = deliverables || []

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

      {monthDeliverables.length === 0 ? (
        /* Empty state — warm welcome, no scary zeros */
        <div className="rounded-xl bg-card border border-border p-10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-6">
            <span className="text-secondary text-display-lg" aria-hidden="true">&#9997;</span>
          </div>
          <h2 className="font-display text-h2 text-primary mb-3">
            Bienvenue dans ton espace !
          </h2>
          <p className="text-body text-neutral-600 mb-4">
            Ton &eacute;quipe est au travail. Tu recevras tes premiers livrables sous 48h.
          </p>
          <div className="rounded-lg bg-background p-4 mb-4 text-left">
            <p className="text-body-sm text-neutral-500 font-semibold mb-2">
              Ce que tu vas recevoir :
            </p>
            <ul className="text-body-sm text-neutral-600 space-y-1">
              {client?.pack === "lancement" ? (
                <>
                  <li>&#10003; 20 posts pr&ecirc;ts &agrave; publier</li>
                  <li>&#10003; 5 articles SEO local</li>
                  <li>&#10003; 5 annonces storytelling</li>
                  <li>&#10003; 10 scripts vid&eacute;o</li>
                  <li>&#10003; Kit graphique personnalis&eacute;</li>
                </>
              ) : (
                <>
                  <li>&#10003; 12 posts pr&ecirc;ts &agrave; publier</li>
                  <li>&#10003; 2 articles SEO local</li>
                  <li>&#10003; 4 annonces personnalis&eacute;es</li>
                  <li>&#10003; 4 scripts vid&eacute;o</li>
                  <li>&#10003; 1 newsletter + 1 email prospection</li>
                </>
              )}
            </ul>
          </div>
          <p className="text-caption text-neutral-400">
            On t&apos;envoie un email d&egrave;s que c&apos;est pr&ecirc;t.
          </p>
        </div>
      ) : (
        <>
        {/* Stats — only shown when deliverables exist */}
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
        <div className="space-y-4">
          {monthDeliverables.map((deliverable) => (
            <DeliverableCard
              key={deliverable.id}
              id={deliverable.id}
              type={deliverable.type}
              typeLabel={TYPE_LABELS[deliverable.type]}
              typeColor={TYPE_COLORS[deliverable.type]}
              title={deliverable.title}
              content={deliverable.content}
              status={deliverable.status}
            />
          ))}
        </div>
        </>
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

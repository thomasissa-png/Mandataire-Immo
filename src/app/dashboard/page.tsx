import { getSessionUser } from "@/lib/getSessionUser"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"
import { query } from "@/lib/db"

type DeliverableType =
  | "post"
  | "article_seo"
  | "annonce"
  | "script_video"
  | "newsletter"
  | "email_prospection"
  | "bio"
  | "brief_graphique"
  | "calendrier"
  | "positionnement"
  | "landing_page"

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
  status: string | null
  stripe_customer_id: string | null
  client_context: Record<string, unknown> | null
}

const TYPE_LABELS: Record<DeliverableType, string> = {
  post: "Post",
  article_seo: "Article SEO",
  annonce: "Annonce",
  script_video: "Script video",
  newsletter: "Newsletter",
  email_prospection: "Email prospection",
  bio: "Bio",
  brief_graphique: "Brief graphique",
  calendrier: "Calendrier",
  positionnement: "Positionnement",
  landing_page: "Landing page",
}

const TYPE_COLORS: Record<DeliverableType, string> = {
  post: "bg-secondary-50 text-secondary-800",
  article_seo: "bg-info-50 text-info-700",
  annonce: "bg-success-50 text-success-800",
  script_video: "bg-warning-50 text-warning-800",
  newsletter: "bg-primary-100 text-primary",
  email_prospection: "bg-error-50 text-error-700",
  bio: "bg-secondary-100 text-secondary-700",
  brief_graphique: "bg-neutral-200 text-neutral-800",
  calendrier: "bg-warning-100 text-warning-700",
  positionnement: "bg-primary-50 text-primary-700",
  landing_page: "bg-success-100 text-success-700",
}

export default async function DashboardPage() {
  const user = await getSessionUser()

  if (!user) {
    return null
  }

  const primaryEmail = user.email

  // Fetch client info (include client_context for monthly update check)
  const { rows: clientRows } = await query<ClientRow>(
    "SELECT id, email, pack, status, stripe_customer_id, client_context FROM clients WHERE email = $1 LIMIT 1",
    [primaryEmail]
  )
  const client = clientRows[0] || null

  // If client has churned, show resubscribe message
  if (client?.status === "churned") {
    return (
      <div className="rounded-xl bg-card border border-border p-10 text-center max-w-lg mx-auto mt-12">
        <h2 className="font-display text-h2 text-primary mb-3">
          Ton abonnement est termin&eacute;
        </h2>
        <p className="text-body text-neutral-600 mb-6">
          Tu n&apos;as plus acc&egrave;s &agrave; tes livrables. Pour retrouver ton espace
          et recevoir de nouveaux contenus chaque mois, r&eacute;abonne-toi.
        </p>
        <a
          href="/#pricing"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-primary font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:text-white hover:shadow-md transition-all duration-normal"
        >
          D&eacute;couvrir les packs &rarr;
        </a>
      </div>
    )
  }

  // Check if monthly update is needed (absent or older than 25 days)
  let showMonthlyBanner = true
  if (client?.client_context) {
    const lastUpdate = client.client_context.last_monthly_update
    if (typeof lastUpdate === "string") {
      const updateDate = new Date(lastUpdate)
      const daysSince = (Date.now() - updateDate.getTime()) / (1000 * 60 * 60 * 24)
      showMonthlyBanner = daysSince > 25
    }
  }

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
      {/* Monthly update banner */}
      {showMonthlyBanner && (
        <a
          href="/dashboard/monthly-update"
          className="block mb-6 p-4 rounded-lg border border-secondary/30 bg-secondary-50 hover:bg-secondary-100 transition-colors duration-normal"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-body-sm font-semibold text-primary">
                Tes infos du mois
              </p>
              <p className="text-caption text-neutral-500">
                10 min pour des livrables encore plus personnalises
              </p>
            </div>
            <svg
              className="w-5 h-5 text-neutral-400 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </a>
      )}

      {/* Welcome */}
      <div className="mb-8">
        <h1 className="font-display text-h1 text-primary mb-2">
          Bonjour {user.firstName || user.name || ""}
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
            G&eacute;rer mon abonnement
          </a>
        </div>
      )}
    </div>
  )
}

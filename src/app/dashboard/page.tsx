import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardContent } from "@/components/dashboard/DashboardContent"

interface ClientRow {
  id: string
  email: string
  pack: string | null
  status: string | null
  stripe_customer_id: string | null
  client_context: Record<string, unknown> | null
}

export default async function DashboardPage() {
  const user = await getSessionUser()

  if (!user) {
    return null
  }

  const primaryEmail = user.email

  // Fetch client info (non-bloquant)
  let client: ClientRow | null = null
  try {
    const { rows: clientRows } = await query<ClientRow>(
      "SELECT id, email, pack, status, stripe_customer_id, client_context FROM clients WHERE email = $1 LIMIT 1",
      [primaryEmail]
    )
    client = clientRows[0] || null
  } catch (err) {
    console.error("[dashboard] Error fetching client:", err)
  }

  // If client has churned, show resubscribe message
  if (client?.status === "churned") {
    return (
      <div className="rounded-xl bg-card border border-border p-10 text-center max-w-lg mx-auto mt-12">
        <h2 className="font-display text-h2 text-primary mb-3">
          Ton abonnement est terminé
        </h2>
        <p className="text-body text-neutral-600 mb-6">
          Tu n{"'"}as plus accès à tes contenus. Pour retrouver ton espace
          et recevoir de nouveaux contenus chaque mois, réabonne-toi.
        </p>
        <a
          href="/#pricing"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:text-white hover:shadow-md transition-all duration-normal"
        >
          Découvrir les packs →
        </a>
      </div>
    )
  }

  // Check if monthly update is needed (absent or older than 25 days)
  let showMonthlyBanner = false
  if (client?.client_context) {
    const lastUpdate = client.client_context.last_monthly_update
    const paidAt = client.client_context.paid_at || client.client_context.created_at
    const accountAgeDays = paidAt
      ? (Date.now() - new Date(String(paidAt)).getTime()) / (1000 * 60 * 60 * 24)
      : 0

    if (accountAgeDays > 25) {
      if (typeof lastUpdate === "string") {
        const daysSince = (Date.now() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60 * 24)
        showMonthlyBanner = daysSince > 25
      } else {
        showMonthlyBanner = true
      }
    }
  }

  // Fetch deliverables via shared helper
  const monthDeliverables = await getDeliverables(primaryEmail)

  // Extraire les infos profil depuis le client_context
  const ctx = client?.client_context as Record<string, unknown> | null
  const profile = ctx ? {
    prenom: String(ctx.prenom || ""),
    nom: String(ctx.nom || ""),
    reseau: String(ctx.reseau || ""),
    ville: String(ctx.ville || ""),
    departement: String(ctx.departement || ""),
    telephone: String(ctx.telephone || ""),
    photo_profil_key: String(ctx.photo_profil_key || ""),
    experience_annees: String(ctx.experience_annees || ""),
    nb_transactions_an: String(ctx.nb_transactions_an || ""),
    type_biens: String(ctx.type_biens || ""),
    linkedin_url: String(ctx.linkedin_url || ""),
    quartiers: String(ctx.quartiers || ""),
    gamme_prix: String(ctx.gamme_prix || ""),
    ton_communication: String(ctx.ton_communication || ""),
    cible_clients: String(ctx.cible_clients || ""),
    biens: Array.isArray(ctx.biens)
      ? (ctx.biens as Array<Record<string, string>>).map((b) => ({
          titre: String(b.titre || ""),
          type: String(b.type || ""),
          adresse: String(b.adresse || ""),
          prix: String(b.prix || ""),
          surface: String(b.surface || ""),
          pieces: String(b.pieces || ""),
          points_forts: String(b.points_forts || ""),
          lien_annonce: String(b.lien_annonce || ""),
        }))
      : [],
  } : null

  const profileIncomplete = !ctx || !ctx.ville

  return (
    <DashboardContent
      userName={user.firstName || user.name || ""}
      pack={client?.pack || null}
      stripeCustomerId={client?.stripe_customer_id || null}
      showMonthlyBanner={showMonthlyBanner}
      deliverables={monthDeliverables}
      profile={profile}
      profileIncomplete={profileIncomplete}
    />
  )
}

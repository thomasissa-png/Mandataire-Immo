import { getSessionUser } from "@/lib/getSessionUser"
import { redirect, notFound } from "next/navigation"
import { query } from "@/lib/db"
import { TriggerProductionButton } from "@/components/admin/TriggerProductionButton"

interface ClientDeliverable {
  id: string
  type: string
  title: string
  status: string
  month: string
  created_at: string
}

interface ClientDetail {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  clerk_user_id: string | null
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  pack: string | null
  status: string | null
  client_context: Record<string, unknown> | null
  paid_at: string | null
  created_at: string
}

interface Payment {
  id: string
  amount: number
  currency: string
  pack: string
  status: string
  created_at: string
}

export default async function AdminClientDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const user = await getSessionUser()
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user?.email

  if (!userEmail || userEmail !== adminEmail) {
    redirect("/dashboard")
  }

  const { rows: clientRows } = await query<ClientDetail>(
    "SELECT * FROM clients WHERE id = $1 LIMIT 1",
    [params.id]
  )

  const clientData = clientRows[0]
  if (!clientData) {
    notFound()
  }

  // Fetch payments
  const { rows: paymentList } = await query<Payment>(
    "SELECT * FROM payments WHERE email = $1 ORDER BY created_at DESC",
    [clientData.email]
  )

  // Fetch recent deliverables
  const { rows: deliverableList } = await query<ClientDeliverable>(
    "SELECT id, type, title, status, month, created_at FROM deliverables WHERE client_id = $1 ORDER BY created_at DESC LIMIT 20",
    [params.id]
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-50 bg-primary text-white border-b border-primary-600">
        <div className="container-immocrew flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/admin" className="font-display text-h3 font-bold">
              ImmoCrew
            </a>
            <span className="text-caption bg-secondary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <a
            href="/admin"
            className="text-body-sm text-primary-200 hover:text-white transition-colors duration-normal"
          >
            Retour liste
          </a>
        </div>
      </header>

      <main className="container-immocrew py-8 max-w-3xl">
        {/* Client info */}
        <div className="rounded-xl bg-card border border-border p-6 mb-6">
          <h1 className="font-display text-h1 text-primary mb-4">
            {clientData.first_name || ""} {clientData.last_name || ""}
          </h1>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-caption text-neutral-500">Email</p>
              <p className="text-body-sm text-foreground">
                {clientData.email}
              </p>
            </div>
            <div>
              <p className="text-caption text-neutral-500">Pack</p>
              <p className="text-body-sm text-foreground capitalize">
                {clientData.pack || "—"}
              </p>
            </div>
            <div>
              <p className="text-caption text-neutral-500">Statut</p>
              <p className="text-body-sm text-foreground capitalize">
                {clientData.status || "pending"}
              </p>
            </div>
            <div>
              <p className="text-caption text-neutral-500">Date inscription</p>
              <p className="text-body-sm text-foreground">
                {clientData.paid_at
                  ? new Date(clientData.paid_at).toLocaleDateString("fr-FR")
                  : "—"}
              </p>
            </div>
            <div>
              <p className="text-caption text-neutral-500">Stripe ID</p>
              <p className="text-body-sm text-foreground font-mono">
                {clientData.stripe_customer_id || "—"}
              </p>
            </div>
            <div>
              <p className="text-caption text-neutral-500">ID interne</p>
              <p className="text-body-sm text-foreground font-mono">
                {clientData.id}
              </p>
            </div>
          </div>
        </div>

        {/* Context data */}
        {clientData.client_context && (
          <div className="rounded-xl bg-card border border-border p-6 mb-6">
            <h2 className="font-display text-h2 text-primary mb-4">
              Contexte client
            </h2>
            <pre className="text-body-sm text-neutral-600 bg-neutral-50 rounded-lg p-4 overflow-x-auto">
              {JSON.stringify(clientData.client_context, null, 2)}
            </pre>
          </div>
        )}

        {/* Production trigger */}
        <div className="rounded-xl bg-card border border-border p-6 mb-6">
          <h2 className="font-display text-h2 text-primary mb-4">
            Production IA
          </h2>
          <TriggerProductionButton clientId={params.id} clientPack={clientData.pack} />
        </div>

        {/* Deliverables */}
        <div className="rounded-xl bg-card border border-border p-6 mb-6">
          <h2 className="font-display text-h2 text-primary mb-4">
            Livrables ({deliverableList.length})
          </h2>
          {deliverableList.length === 0 ? (
            <p className="text-body-sm text-neutral-500">
              Aucun livrable genere pour ce client.
            </p>
          ) : (
            <div className="space-y-2">
              {deliverableList.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-body-sm font-medium text-foreground">
                      {d.title}
                    </p>
                    <p className="text-caption text-neutral-500">
                      {d.type} &middot; {d.month} &middot;{" "}
                      {new Date(d.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-caption font-semibold ${
                      d.status === "delivered"
                        ? "bg-success-50 text-success-800"
                        : "bg-warning-50 text-warning-800"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="rounded-xl bg-card border border-border p-6">
          <h2 className="font-display text-h2 text-primary mb-4">
            Paiements
          </h2>

          {paymentList.length === 0 ? (
            <p className="text-body-sm text-neutral-500">
              Aucun paiement enregistre.
            </p>
          ) : (
            <div className="space-y-3">
              {paymentList.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div>
                    <p className="text-body-sm font-medium text-foreground capitalize">
                      {payment.pack}
                    </p>
                    <p className="text-caption text-neutral-500">
                      {new Date(payment.created_at).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-body font-semibold text-primary">
                      {payment.amount}&euro;
                    </p>
                    <p className="text-caption text-success">
                      {payment.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

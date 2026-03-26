import { getSessionUser } from "@/lib/getSessionUser"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import { getNextPlannedTopic } from "@/lib/editorial-calendar"
import GenerateArticleButton from "@/components/admin/GenerateArticleButton"

interface Client {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  pack: string | null
  status: string | null
  paid_at: string | null
  created_at: string
}

const STATUS_BADGES: Record<string, string> = {
  active: "bg-success-50 text-success-800",
  inactive: "bg-warning-50 text-warning-800",
  churned: "bg-error-50 text-error-700",
  pending: "bg-neutral-100 text-neutral-600",
}

export default async function AdminPage() {
  const user = await getSessionUser()

  // Basic admin check — only ADMIN_EMAIL can access
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user?.email

  if (!userEmail || userEmail !== adminEmail) {
    redirect("/dashboard")
  }

  const { rows: clientList } = await query<Client>(
    "SELECT * FROM clients ORDER BY created_at DESC"
  )

  // Stats
  const activeClients = clientList.filter((c) => c.status === "active").length
  const totalClients = clientList.length

  // Prochain article SEO a generer
  const nextTopic = getNextPlannedTopic()

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-50 bg-primary text-white border-b border-primary-600">
        <div className="container-immocrew flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/" className="font-display text-h3 font-bold">
              ImmoCrew
            </a>
            <span className="text-caption bg-secondary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <a
            href="/dashboard"
            className="text-body-sm text-primary-200 hover:text-white transition-colors duration-normal"
          >
            Espace client
          </a>
        </div>
      </header>

      <main className="container-immocrew py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg bg-card border border-border p-4 text-center">
            <p className="font-display text-display-lg text-primary">
              {totalClients}
            </p>
            <p className="text-caption text-neutral-500">Total clients</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-4 text-center">
            <p className="font-display text-display-lg text-success">
              {activeClients}
            </p>
            <p className="text-caption text-neutral-500">Actifs</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-4 text-center">
            <p className="font-display text-display-lg text-secondary">
              {clientList.filter((c) => c.pack === "mensuel").length}
            </p>
            <p className="text-caption text-neutral-500">Mensuels</p>
          </div>
          <div className="rounded-lg bg-card border border-border p-4 text-center">
            <p className="font-display text-display-lg text-primary">
              {clientList.filter((c) => c.pack === "lancement").length}
            </p>
            <p className="text-caption text-neutral-500">Lancements</p>
          </div>
        </div>

        {/* Generate SEO article */}
        <div className="mb-8">
          <GenerateArticleButton
            nextTopicTitle={nextTopic?.titre ?? null}
            nextTopicSlug={nextTopic?.slug ?? null}
            nextTopicCategory={nextTopic?.categorie ?? null}
          />
        </div>

        <h1 className="font-display text-h1 text-primary mb-6">
          Clients
        </h1>

        {/* Client list */}
        {clientList.length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-12 text-center">
            <p className="text-body text-neutral-500">
              Aucun client pour le moment.
            </p>
          </div>
        ) : (
          <div className="rounded-xl bg-card border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-neutral-50">
                    <th className="text-left text-caption font-semibold text-neutral-600 px-4 py-3">
                      Client
                    </th>
                    <th className="text-left text-caption font-semibold text-neutral-600 px-4 py-3">
                      Pack
                    </th>
                    <th className="text-left text-caption font-semibold text-neutral-600 px-4 py-3">
                      Statut
                    </th>
                    <th className="text-left text-caption font-semibold text-neutral-600 px-4 py-3">
                      Date
                    </th>
                    <th className="text-left text-caption font-semibold text-neutral-600 px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientList.map((client) => (
                    <tr
                      key={client.id}
                      className="border-b border-border last:border-0 hover:bg-neutral-50 transition-colors duration-fast"
                    >
                      <td className="px-4 py-3">
                        <p className="font-display text-body-sm font-semibold text-primary">
                          {client.first_name || ""}{" "}
                          {client.last_name || ""}
                        </p>
                        <p className="text-caption text-neutral-500">
                          {client.email}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-body-sm text-foreground capitalize">
                          {client.pack || "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-caption font-semibold ${
                            STATUS_BADGES[client.status || "pending"] ||
                            STATUS_BADGES.pending
                          }`}
                        >
                          {client.status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-body-sm text-neutral-500">
                        {client.paid_at
                          ? new Date(client.paid_at).toLocaleDateString(
                              "fr-FR"
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <a
                          href={`/admin/clients/${client.id}`}
                          className="text-body-sm text-secondary hover:underline"
                        >
                          Voir
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

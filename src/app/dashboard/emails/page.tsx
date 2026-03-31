import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { DeliverableCard } from "@/components/dashboard/DeliverableCard"

const TYPE_LABELS: Record<string, string> = {
  newsletter: "Newsletter",
  email_prospection: "Email prospection",
}

const TYPE_COLORS: Record<string, string> = {
  newsletter: "bg-primary-50 text-primary-700",
  email_prospection: "bg-error-50 text-error-700",
}

export default async function EmailsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const emails = await getDeliverables(user.email, ["newsletter", "email_prospection"])

  return (
    <DashboardPageLayout
      icon="📧"
      title="Mes emails"
      description="Newsletters et emails de prospection prêts à envoyer."
      count={emails.length}
    >
      {emails.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center">
          <p className="text-body text-neutral-500">Aucun email pour le moment — tes premiers contenus arrivent bientôt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
          {emails.map((d) => (
            <DeliverableCard key={d.id} id={d.id} type={d.type} typeLabel={TYPE_LABELS[d.type] || d.type} typeColor={TYPE_COLORS[d.type] || "bg-neutral-100 text-neutral-600"} title={d.title} status={d.status} />
          ))}
        </div>
      )}
    </DashboardPageLayout>
  )
}

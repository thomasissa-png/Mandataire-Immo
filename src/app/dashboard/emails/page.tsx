import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { getDeliverables } from "@/lib/getDeliverables"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { EmailsFiltered } from "./EmailsFiltered"

export default async function EmailsPage() {
  const user = await getSessionUser()
  if (!user) redirect("/login")

  const emails = await getDeliverables(user.email, ["newsletter", "email_prospection"], { includeArchived: true })

  const activeCount = emails.filter((e) => e.status !== "archived").length

  return (
    <DashboardPageLayout
      icon="📧"
      title="Mes emails"
      description="Newsletters et emails de prospection prêts à envoyer."
      count={activeCount}
    >
      <EmailsFiltered emails={emails} />
    </DashboardPageLayout>
  )
}

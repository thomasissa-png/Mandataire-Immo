import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { SupportSection } from "@/components/dashboard/SupportSection"

export default async function SupportPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  return (
    <DashboardPageLayout
      icon="💬"
      title="Support"
      description="Un retour, une question, un bug ? On est là."
    >
      <SupportSection />

      {/* Contact direct */}
      <div className="rounded-lg bg-card border border-border p-5 mt-4">
        <h3 className="font-display text-h4 text-primary mb-2">Besoin d{"'"}une réponse rapide ?</h3>
        <p className="text-body-sm text-neutral-500 mb-3">
          Tu peux aussi nous écrire directement par email. On répond sous 24h.
        </p>
        <a
          href="mailto:contact@immocrew.fr"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-primary text-primary font-display font-bold text-body-sm hover:bg-primary hover:text-white transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          contact@immocrew.fr
        </a>
      </div>
    </DashboardPageLayout>
  )
}

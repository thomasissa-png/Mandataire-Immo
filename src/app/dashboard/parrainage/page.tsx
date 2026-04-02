import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { ReferralSection } from "@/components/dashboard/ReferralSection"

export const metadata = {
  title: "Parrainage — ImmoCrew",
}

export default function ParrainagePage() {
  return (
    <DashboardPageLayout
      icon="🤝"
      title="Parrainage"
      description="Parraine tes collègues mandataires et gagne 1 mois gratuit par filleul abonné."
    >
      <ReferralSection />
    </DashboardPageLayout>
  )
}

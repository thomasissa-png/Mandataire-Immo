/**
 * /dashboard/biens/nouveau — Page de création d'un bien
 *
 * Rendu : SSR (layout dashboard, auth vérifiée par le layout parent)
 * Le formulaire BienForm est un Client Component.
 */

import { BienForm } from "@/components/biens/BienForm"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"

export default function NouveauBienPage() {
  return (
    <DashboardPageLayout
      icon="➕"
      title="Ajouter un bien"
      description="Renseigne les infos de ton bien. Tu pourras ajouter les photos et générer l'annonce juste après."
    >
      <div className="max-w-2xl">
        <div className="rounded-lg bg-card border border-border p-6 tablet:p-8">
          <BienForm />
        </div>
      </div>
    </DashboardPageLayout>
  )
}

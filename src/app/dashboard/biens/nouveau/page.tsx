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
        {/* Retour visible sur mobile (la sidebar est masquée) */}
        <a
          href="/dashboard"
          className="lg:hidden inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-secondary-700 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour au tableau de bord
        </a>
        <div className="rounded-lg bg-card border border-border p-6 tablet:p-8">
          <BienForm />
        </div>
      </div>
    </DashboardPageLayout>
  )
}

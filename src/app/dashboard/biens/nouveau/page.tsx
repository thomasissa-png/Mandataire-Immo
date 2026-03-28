/**
 * /dashboard/biens/nouveau — Page de création d'un bien
 *
 * Rendu : SSR (layout dashboard, auth vérifiée par le layout parent)
 * Le formulaire BienForm est un Client Component.
 */

import { BienForm } from "@/components/biens/BienForm"

export default function NouveauBienPage() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Retour */}
      <a
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-secondary-700 transition-colors mb-6"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
        Retour au dashboard
      </a>

      {/* Titre */}
      <div className="mb-8">
        <h1 className="font-display text-h2 text-primary font-bold mb-2">
          Ajouter un bien
        </h1>
        <p className="text-body-sm text-neutral-500">
          Renseigne les infos de ton bien. Tu pourras ajouter les photos et
          générer l'annonce juste après.
        </p>
      </div>

      {/* Formulaire */}
      <div className="rounded-lg bg-card border border-border p-6 tablet:p-8">
        <BienForm />
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { track } from "@/lib/tracking"

const STEPS = [
  {
    title: "Ton identite",
    fields: ["prenom", "nom", "telephone"],
  },
  {
    title: "Ton reseau",
    fields: ["reseau", "experience_annees", "nb_transactions_an"],
  },
  {
    title: "Ta zone",
    fields: ["ville", "quartiers", "departement"],
  },
  {
    title: "Ta specialite",
    fields: ["type_biens", "gamme_prix", "cible_clients"],
  },
  {
    title: "Ton style",
    fields: ["ton_communication", "valeurs", "ce_qui_te_differencie"],
  },
  {
    title: "Tes biens en cours",
    fields: ["biens_actuels"],
  },
  {
    title: "Tes comptes",
    fields: ["instagram", "facebook", "linkedin", "site_web"],
  },
] as const

interface OnboardingData {
  [key: string]: string
}

const FIELD_LABELS: Record<string, { label: string; placeholder: string; type: "text" | "textarea" | "select" }> = {
  prenom: { label: "Prenom", placeholder: "Sophie", type: "text" },
  nom: { label: "Nom", placeholder: "Martin", type: "text" },
  telephone: { label: "Telephone", placeholder: "06 12 34 56 78", type: "text" },
  reseau: { label: "Ton reseau", placeholder: "IAD, SAFTI, Capifrance, independant...", type: "text" },
  experience_annees: { label: "Annees d'experience", placeholder: "2", type: "text" },
  nb_transactions_an: { label: "Nombre de transactions/an", placeholder: "5", type: "text" },
  ville: { label: "Ville principale", placeholder: "Angers", type: "text" },
  quartiers: { label: "Quartiers ou tu travailles", placeholder: "La Doutre, Centre-ville, Doutre...", type: "textarea" },
  departement: { label: "Departement", placeholder: "49 - Maine-et-Loire", type: "text" },
  type_biens: { label: "Types de biens", placeholder: "Appartements, maisons, neuf, ancien...", type: "text" },
  gamme_prix: { label: "Gamme de prix", placeholder: "100K - 300K EUR", type: "text" },
  cible_clients: { label: "Tes clients types", placeholder: "Primo-accedants, familles, investisseurs...", type: "text" },
  ton_communication: { label: "Comment tu parles a tes clients", placeholder: "Pro mais accessible, chaleureux, direct...", type: "textarea" },
  valeurs: { label: "Ce qui compte pour toi", placeholder: "Transparence, proximite, reactivite...", type: "text" },
  ce_qui_te_differencie: { label: "Ce qui te differencie", placeholder: "Connaissance du quartier, disponibilite...", type: "textarea" },
  biens_actuels: { label: "Tes biens en vente actuellement (optionnel)", placeholder: "T3 68m2 La Doutre Angers 145K EUR...", type: "textarea" },
  instagram: { label: "Instagram", placeholder: "@sophie.immo", type: "text" },
  facebook: { label: "Page Facebook", placeholder: "facebook.com/sophie.immo", type: "text" },
  linkedin: { label: "LinkedIn", placeholder: "linkedin.com/in/sophie-martin", type: "text" },
  site_web: { label: "Site web (si existant)", placeholder: "www.sophie-immo.fr", type: "text" },
}

export default function OnboardingPage() {
  const { user } = useUser()
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<OnboardingData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  useEffect(() => {
    track("onboarding_start")
  }, [])

  const updateField = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      track("onboarding_step_complete", {
        step: currentStep + 1,
        step_name: step.title,
      })
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user?.emailAddresses[0]?.emailAddress,
          name: `${data.prenom || ""} ${data.nom || ""}`.trim(),
          city: data.ville,
          source: "onboarding",
        }),
      })

      if (response.ok) {
        track("onboarding_complete", {
          total_steps: STEPS.length,
        })
        setIsComplete(true)
      }
    } catch (err) {
      console.error("Onboarding submit error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-success-50 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="font-display text-h1 text-primary mb-4">
            C&apos;est tout bon !
          </h1>
          <p className="text-body text-neutral-600 mb-8">
            On a tout ce qu&apos;il nous faut. Ton equipe se met au travail.
            Tu recevras tes premiers livrables sous 48h.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-white font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
          >
            Voir mon espace client
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container-immocrew max-w-xl py-8 desktop:py-16">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-display text-h3 text-primary">
              {step.title}
            </span>
            <span className="text-caption text-neutral-500">
              Etape {currentStep + 1} sur {STEPS.length}
            </span>
          </div>
          <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary rounded-full transition-all duration-slow"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {step.fields.map((field) => {
            const config = FIELD_LABELS[field]
            if (!config) return null

            return (
              <div key={field}>
                <label
                  htmlFor={field}
                  className="block text-caption font-medium text-neutral-600 mb-1"
                >
                  {config.label}
                </label>
                {config.type === "textarea" ? (
                  <textarea
                    id={field}
                    value={data[field] || ""}
                    onChange={(e) => updateField(field, e.target.value)}
                    placeholder={config.placeholder}
                    rows={3}
                    className="w-full px-4 py-3 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast resize-y"
                  />
                ) : (
                  <input
                    id={field}
                    type="text"
                    value={data[field] || ""}
                    onChange={(e) => updateField(field, e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                  />
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="h-12 px-6 rounded-full border-2 border-primary text-primary font-display font-semibold text-body hover:bg-primary-50 active:scale-[0.97] transition-all duration-normal disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Precedent
          </button>

          {currentStep < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="h-12 px-8 rounded-full bg-secondary text-white font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
            >
              Suivant
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 px-8 rounded-full bg-success text-white font-display font-semibold text-body shadow-sm hover:bg-success-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60"
            >
              {isSubmitting ? "Envoi..." : "Terminer"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

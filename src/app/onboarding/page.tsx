"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
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
    title: "Ton quartier en detail",
    fields: [
      "prix_m2_moyen",
      "commerces_reference",
      "ecoles_reference",
      "transports",
      "ambiance_quartier",
    ],
  },
  {
    title: "Ton histoire",
    subtitle:
      "Facultatif — mais ca rend tes livrables beaucoup plus personnels",
    fields: [
      "parcours_avant_immo",
      "pourquoi_immobilier",
      "anecdote_memorable",
    ],
    optional: true,
  },
  {
    title: "Tes biens en cours",
    subtitle: "Facultatif — tu pourras les ajouter plus tard",
    fields: ["__biens__"],
    optional: true,
  },
  {
    title: "La video",
    subtitle: "Facultatif — permet d'adapter les scripts video a ton niveau",
    fields: ["confort_camera"],
    optional: true,
  },
  {
    title: "Tes comptes",
    subtitle: "Optionnel — on peut travailler sans",
    fields: ["instagram", "facebook", "linkedin", "site_web"],
    optional: true,
  },
] as const

interface OnboardingData {
  [key: string]: string
}

interface BienData {
  titre: string
  type: string
  adresse: string
  prix: string
  surface: string
  pieces: string
  points_forts: string
}

const EMPTY_BIEN: BienData = {
  titre: "",
  type: "",
  adresse: "",
  prix: "",
  surface: "",
  pieces: "",
  points_forts: "",
}

interface FieldConfig {
  label: string
  placeholder: string
  type: "text" | "textarea" | "select"
  options?: { value: string; label: string }[]
}

const FIELD_LABELS: Record<string, FieldConfig> = {
  prenom: { label: "Prenom", placeholder: "Sophie", type: "text" },
  nom: { label: "Nom", placeholder: "Martin", type: "text" },
  telephone: {
    label: "Telephone",
    placeholder: "06 12 34 56 78",
    type: "text",
  },
  reseau: {
    label: "Ton reseau",
    placeholder: "IAD, SAFTI, Capifrance, independant...",
    type: "text",
  },
  experience_annees: {
    label: "Annees d'experience",
    placeholder: "2",
    type: "text",
  },
  nb_transactions_an: {
    label: "Nombre de transactions/an",
    placeholder: "5",
    type: "text",
  },
  ville: { label: "Ville principale", placeholder: "Angers", type: "text" },
  quartiers: {
    label: "Quartiers ou tu travailles",
    placeholder: "La Doutre, Centre-ville, Doutre...",
    type: "textarea",
  },
  departement: {
    label: "Departement",
    placeholder: "49 - Maine-et-Loire",
    type: "text",
  },
  type_biens: {
    label: "Types de biens",
    placeholder: "Appartements, maisons, neuf, ancien...",
    type: "text",
  },
  gamme_prix: {
    label: "Gamme de prix",
    placeholder: "100K - 300K EUR",
    type: "text",
  },
  cible_clients: {
    label: "Tes clients types",
    placeholder: "Primo-accedants, familles, investisseurs...",
    type: "text",
  },
  ton_communication: {
    label:
      "Comment tu parles a tes clients — donne un exemple de phrase que tu utilises souvent",
    placeholder:
      "Ex: Je suis directe mais bienveillante. Quand un bien ne correspond pas, je le dis. Je tutoie mes clients.",
    type: "textarea",
  },
  valeurs: {
    label: "Tes 3 valeurs les plus importantes dans ton metier",
    placeholder:
      "Ex: Transparence sur les prix, disponibilite 7j/7, honnetete meme quand ca ne plait pas",
    type: "text",
  },
  ce_qui_te_differencie: {
    label:
      "Ce que tes clients disent de toi que les autres mandataires n'ont pas",
    placeholder:
      "Ex: Je connais chaque rue de La Doutre, j'y vis depuis 10 ans. Mes clients disent que je reponds en moins d'1h.",
    type: "textarea",
  },
  prix_m2_moyen: {
    label: "Prix moyen au m2 dans ta zone (estimation)",
    placeholder: "Ex: 2800",
    type: "text",
  },
  commerces_reference: {
    label: "Les commerces et lieux que tes clients connaissent",
    placeholder:
      "Ex: Marche de La Doutre le samedi, boulangerie Lepine, parc Balzac, mediatheque Toussaint",
    type: "textarea",
  },
  ecoles_reference: {
    label: "Les ecoles et colleges du coin",
    placeholder: "Ex: Ecole Dacier, college Chevreul, lycee Bergson",
    type: "textarea",
  },
  transports: {
    label: "Transports et acces",
    placeholder:
      "Ex: Tramway ligne A arret La Doutre, gare Saint-Laud a 10 min, rocade sud a 5 min",
    type: "textarea",
  },
  ambiance_quartier: {
    label: "Decris l'ambiance de ton quartier en 2-3 phrases",
    placeholder:
      "Ex: La Doutre c'est le quartier boheme d'Angers. Rues pavees, maisons a colombages, bistrots. Les gens qui s'y installent ne repartent plus.",
    type: "textarea",
  },
  parcours_avant_immo: {
    label: "Que faisais-tu avant l'immobilier ?",
    placeholder:
      "Ex: Assistante de direction pendant 8 ans dans une PME",
    type: "text",
  },
  pourquoi_immobilier: {
    label: "Pourquoi tu as choisi ce metier ?",
    placeholder:
      "Ex: J'ai eu un coup de foudre pour l'immobilier quand j'ai achete mon premier appart. J'ai adore le processus.",
    type: "textarea",
  },
  anecdote_memorable: {
    label: "Une anecdote qui te definit comme mandataire",
    placeholder:
      "Ex: Un couple qui cherchait depuis 1 an m'a remerciee en pleurant le jour de la signature. C'est la que j'ai su.",
    type: "textarea",
  },
  confort_camera: {
    label: "Ton rapport a la video",
    placeholder: "",
    type: "select",
    options: [
      { value: "", label: "Choisis ton niveau..." },
      {
        value: "debutant",
        label: "Je n'ai jamais fait de video — ca me stresse",
      },
      { value: "a_laise", label: "J'ai deja fait quelques videos, ca va" },
      { value: "expert", label: "Je suis a l'aise devant la camera" },
    ],
  },
  instagram: {
    label: "Instagram",
    placeholder: "@sophie.immo",
    type: "text",
  },
  facebook: {
    label: "Page Facebook",
    placeholder: "facebook.com/sophie.immo",
    type: "text",
  },
  linkedin: {
    label: "LinkedIn",
    placeholder: "linkedin.com/in/sophie-martin",
    type: "text",
  },
  site_web: {
    label: "Site web (si existant)",
    placeholder: "www.sophie-immo.fr",
    type: "text",
  },
}

const MAX_BIENS = 5

export default function OnboardingPage() {
  const { data: session } = useSession()
  const user = session?.user
  // Restore state from sessionStorage on mount
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("immocrew_onboarding_step")
      return saved ? parseInt(saved, 10) : 0
    }
    return 0
  })
  const [data, setData] = useState<OnboardingData>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("immocrew_onboarding_data")
      return saved ? JSON.parse(saved) : {}
    }
    return {}
  })
  const [biens, setBiens] = useState<BienData[]>(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("immocrew_onboarding_biens")
      return saved ? JSON.parse(saved) : [{ ...EMPTY_BIEN }]
    }
    return [{ ...EMPTY_BIEN }]
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  // Persist state to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem("immocrew_onboarding_step", String(currentStep))
    sessionStorage.setItem("immocrew_onboarding_data", JSON.stringify(data))
    sessionStorage.setItem("immocrew_onboarding_biens", JSON.stringify(biens))
  }, [currentStep, data, biens])

  useEffect(() => {
    track("onboarding_start")

    const handleBeforeUnload = () => {
      if (!isComplete) {
        track("onboarding_step_abandon", {
          step: currentStep + 1,
          step_name: STEPS[currentStep].title,
        })
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [currentStep, isComplete])

  const updateField = (field: string, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const updateBien = (index: number, field: keyof BienData, value: string) => {
    setBiens((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const addBien = () => {
    if (biens.length < MAX_BIENS) {
      setBiens((prev) => [...prev, { ...EMPTY_BIEN }])
    }
  }

  const removeBien = (index: number) => {
    setBiens((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== index)
    })
  }

  const [validationError, setValidationError] = useState("")

  const handleNext = () => {
    // Validate required fields on non-optional steps
    if (!step.optional) {
      const emptyRequired = step.fields.filter(
        (f: string) => f !== "__biens__" && !(data[f] || "").trim()
      )
      if (emptyRequired.length > 0) {
        setValidationError("Merci de remplir tous les champs avant de continuer.")
        return
      }
    }
    setValidationError("")
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
      // Serialize biens into data before sending
      const submitData = {
        ...data,
        biens: JSON.stringify(
          biens.filter((b) => b.titre.trim() !== "")
        ),
      }

      // Envoyer toutes les donnees du wizard vers /api/onboarding (persistance client_context)
      // ET garder /api/leads en parallele pour ne pas casser le funnel
      const [onboardingResponse] = await Promise.all([
        fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        }),
        fetch("/api/leads", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: user?.email,
            name: `${data.prenom || ""} ${data.nom || ""}`.trim(),
            city: data.ville,
            source: "onboarding",
          }),
        }),
      ])

      if (onboardingResponse.ok) {
        track("onboarding_complete", {
          total_steps: STEPS.length,
        })
        sessionStorage.removeItem("immocrew_onboarding_step")
        sessionStorage.removeItem("immocrew_onboarding_data")
        sessionStorage.removeItem("immocrew_onboarding_biens")
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
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-primary font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
          >
            Voir mon espace client
          </a>
        </div>
      </div>
    )
  }

  // Check if current step is the biens step (step index 7)
  const isBiensStep = currentStep === 7

  return (
    <div className="min-h-screen bg-background">
      <div className="container-immocrew max-w-xl py-8 desktop:py-16">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="font-display text-h3 text-primary">
                {step.title}
              </span>
              {"subtitle" in step && step.subtitle && (
                <p className="text-caption text-neutral-400 mt-1">
                  {step.subtitle}
                </p>
              )}
            </div>
            <span className="text-caption text-neutral-500">
              \u00C9tape {currentStep + 1} sur {STEPS.length} &middot; ~8 min
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
          {isBiensStep ? (
            /* Biens step — repeatable mini-form */
            <>
              {biens.map((bien, index) => (
                <div
                  key={index}
                  className="p-4 rounded-md border border-neutral-200 bg-white space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-body-sm font-semibold text-primary">
                      Bien {index + 1}
                    </span>
                    {biens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBien(index)}
                        className="text-body-sm text-neutral-400 hover:text-red-500 transition-colors"
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`bien-${index}-titre`} className="block text-caption font-medium text-neutral-600 mb-1">
                      Titre du bien
                    </label>
                    <input
                      id={`bien-${index}-titre`}
                      type="text"
                      value={bien.titre}
                      onChange={(e) =>
                        updateBien(index, "titre", e.target.value)
                      }
                      placeholder="T3 vue Loire La Doutre"
                      className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`bien-${index}-type`} className="block text-caption font-medium text-neutral-600 mb-1">
                        Type
                      </label>
                      <input
                        id={`bien-${index}-type`}
                        type="text"
                        value={bien.type}
                        onChange={(e) =>
                          updateBien(index, "type", e.target.value)
                        }
                        placeholder="Appartement, Maison..."
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                      />
                    </div>
                    <div>
                      <label htmlFor={`bien-${index}-adresse`} className="block text-caption font-medium text-neutral-600 mb-1">
                        Adresse ou quartier
                      </label>
                      <input
                        id={`bien-${index}-adresse`}
                        type="text"
                        value={bien.adresse}
                        onChange={(e) =>
                          updateBien(index, "adresse", e.target.value)
                        }
                        placeholder="12 rue Beaurepaire, La Doutre"
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 tablet:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor={`bien-${index}-prix`} className="block text-caption font-medium text-neutral-600 mb-1">
                        Prix
                      </label>
                      <input
                        id={`bien-${index}-prix`}
                        type="text"
                        value={bien.prix}
                        onChange={(e) =>
                          updateBien(index, "prix", e.target.value)
                        }
                        placeholder="185000"
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                      />
                    </div>
                    <div>
                      <label htmlFor={`bien-${index}-surface`} className="block text-caption font-medium text-neutral-600 mb-1">
                        Surface (m\u00B2)
                      </label>
                      <input
                        id={`bien-${index}-surface`}
                        type="text"
                        value={bien.surface}
                        onChange={(e) =>
                          updateBien(index, "surface", e.target.value)
                        }
                        placeholder="68"
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                      />
                    </div>
                    <div>
                      <label htmlFor={`bien-${index}-pieces`} className="block text-caption font-medium text-neutral-600 mb-1">
                        Nombre de pi\u00E8ces
                      </label>
                      <input
                        id={`bien-${index}-pieces`}
                        type="text"
                        value={bien.pieces}
                        onChange={(e) =>
                          updateBien(index, "pieces", e.target.value)
                        }
                        placeholder="3"
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`bien-${index}-points_forts`} className="block text-caption font-medium text-neutral-600 mb-1">
                      Points forts (2-3 phrases)
                    </label>
                    <textarea
                      id={`bien-${index}-points_forts`}
                      value={bien.points_forts}
                      onChange={(e) =>
                        updateBien(index, "points_forts", e.target.value)
                      }
                      placeholder="Vue Loire, parquet chene, cave voutee, 5 min tramway"
                      rows={2}
                      className="w-full px-4 py-3 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast resize-y"
                    />
                  </div>
                </div>
              ))}
              {biens.length < MAX_BIENS && (
                <button
                  type="button"
                  onClick={addBien}
                  className="w-full h-12 rounded-md border-2 border-dashed border-neutral-300 text-body-sm text-neutral-500 hover:border-secondary hover:text-secondary transition-colors"
                >
                  + Ajouter un autre bien
                </button>
              )}
            </>
          ) : (
            /* Standard fields */
            step.fields.map((field) => {
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
                  ) : config.type === "select" && config.options ? (
                    <select
                      id={field}
                      value={data[field] || ""}
                      onChange={(e) => updateField(field, e.target.value)}
                      className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                    >
                      {config.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
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
            })
          )}
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
            <div className="flex items-center gap-3">
              {"optional" in step && step.optional && (
                <button
                  type="button"
                  onClick={handleNext}
                  className="text-body-sm text-neutral-400 hover:text-neutral-600 underline transition-colors"
                >
                  Passer
                </button>
              )}
              <button
                type="button"
                onClick={handleNext}
                className="h-12 px-8 rounded-full bg-secondary text-primary font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                Suivant
              </button>
              {validationError && (
                <p className="text-body-sm text-error mt-2" role="alert">
                  {validationError}
                </p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-12 px-8 rounded-full bg-success-600 text-white font-display font-semibold text-body shadow-sm hover:bg-success-700 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60"
            >
              {isSubmitting ? "Envoi..." : "Terminer"}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

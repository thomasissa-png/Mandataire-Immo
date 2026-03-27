"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSession } from "next-auth/react"
import { track } from "@/lib/tracking"

const STEPS = [
  {
    title: "Ton identité",
    fields: ["prenom", "nom", "telephone", "photo_profil"],
  },
  {
    title: "Ton réseau",
    fields: ["reseau", "experience_annees", "nb_transactions_an"],
  },
  {
    title: "Ta zone",
    fields: ["ville", "quartiers", "departement"],
  },
  {
    title: "Ta spécialité",
    fields: ["type_biens", "gamme_prix", "cible_clients"],
  },
  {
    title: "Ton style",
    fields: ["ton_communication", "valeurs", "ce_qui_te_differencie"],
  },
  {
    title: "Ton profil",
    subtitle:
      "Facultatif — mais ça rend tes livrables beaucoup plus personnels",
    fields: [
      "linkedin_url",
      "bio_personnelle",
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
    title: "La vidéo",
    subtitle: "Facultatif — permet d'adapter les scripts vidéo à ton niveau",
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
  lien_annonce: string
}

const EMPTY_BIEN: BienData = {
  titre: "",
  type: "",
  adresse: "",
  prix: "",
  surface: "",
  pieces: "",
  points_forts: "",
  lien_annonce: "",
}

interface FieldConfig {
  label: string
  placeholder: string
  type: "text" | "textarea" | "select" | "url" | "photo"
  options?: { value: string; label: string }[]
  helper?: string
}

const FIELD_LABELS: Record<string, FieldConfig> = {
  prenom: { label: "Prénom", placeholder: "Sophie", type: "text" },
  nom: { label: "Nom", placeholder: "Martin", type: "text" },
  telephone: {
    label: "Téléphone",
    placeholder: "06 12 34 56 78",
    type: "text",
  },
  reseau: {
    label: "Ton reseau",
    placeholder: "IAD, SAFTI, Capifrance, indépendant...",
    type: "text",
  },
  experience_annees: {
    label: "Années d'expérience",
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
    label: "Quartiers où tu travailles",
    placeholder: "La Doutre, Centre-ville, Doutre...",
    type: "textarea",
  },
  departement: {
    label: "Département",
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
      "Comment tu parles à tes clients — donne un exemple de phrase que tu utilises souvent",
    placeholder:
      "Ex: Je suis directe mais bienveillante. Quand un bien ne correspond pas, je le dis. Je tutoie mes clients.",
    type: "textarea",
  },
  valeurs: {
    label: "Tes 3 valeurs les plus importantes dans ton métier",
    placeholder:
      "Ex: Transparence sur les prix, disponibilité 7j/7, honnêteté même quand ca ne plait pas",
    type: "text",
  },
  ce_qui_te_differencie: {
    label:
      "Ce que tes clients disent de toi que les autres mandataires n'ont pas",
    placeholder:
      "Ex: Je connais chaque rue de La Doutre, j'y vis depuis 10 ans. Mes clients disent que je réponds en moins d'1h.",
    type: "textarea",
  },
  linkedin_url: {
    label: "Ton profil LinkedIn (optionnel)",
    placeholder: "https://linkedin.com/in/sophie-martin",
    type: "url",
    helper: "On utilise ton profil pour mieux comprendre ton parcours et personnaliser tes textes.",
  },
  bio_personnelle: {
    label: "Ton parcours en quelques lignes",
    placeholder: "Ex: Avant l'immobilier, j'étais dans la restauration. J'ai choisi ce métier parce que j'aime les gens et les belles maisons. Mon meilleur souvenir : une famille qui a trouvé son bonheur en 3 visites.",
    type: "textarea",
    helper: "Si tu as renseigné ton LinkedIn, tu peux laisser ce champ vide — on s'en inspire.",
  },
  photo_profil: {
    label: "Ta photo de profil",
    placeholder: "",
    type: "photo",
    helper: "Ta photo apparaîtra dans tes livrables et ton profil.",
  },
  confort_camera: {
    label: "Ton rapport à la vidéo",
    placeholder: "",
    type: "select",
    options: [
      { value: "", label: "Choisis ton niveau..." },
      {
        value: "debutant",
        label: "Je n'ai jamais fait de video — ca me stresse",
      },
      { value: "a_laise", label: "J'ai deja fait quelques videos, ca va" },
      { value: "expert", label: "Je suis à l'aise devant la caméra" },
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
  const [submitError, setSubmitError] = useState("")

  // Photo upload state
  const [photoPreview, setPhotoPreview] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("immocrew_onboarding_photo") || null
    }
    return null
  })
  const [photoUploading, setPhotoUploading] = useState(false)
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Address autocomplete state
  const [addressSuggestions, setAddressSuggestions] = useState<
    Record<number, Array<{ label: string; context: string }>>
  >({})
  const [activeAddressIndex, setActiveAddressIndex] = useState<number | null>(null)
  const debounceTimerRef = useRef<Record<number, NodeJS.Timeout>>({})
  const addressDropdownRef = useRef<HTMLDivElement>(null)

  const step = STEPS[currentStep]
  const progress = ((currentStep + 1) / STEPS.length) * 100

  // Pre-fill prenom/nom from session (sign-up already collected these)
  useEffect(() => {
    if (!user) return
    setData((prev) => {
      const updates: OnboardingData = {}
      if (!prev.prenom && user.firstName) updates.prenom = user.firstName
      if (!prev.nom && user.name) {
        const parts = user.name.split(" ")
        if (parts.length > 1 && !prev.nom) updates.nom = parts.slice(1).join(" ")
      }
      if (Object.keys(updates).length === 0) return prev
      return { ...prev, ...updates }
    })
  }, [user])

  // Persist state to sessionStorage on every change
  useEffect(() => {
    sessionStorage.setItem("immocrew_onboarding_step", String(currentStep))
    sessionStorage.setItem("immocrew_onboarding_data", JSON.stringify(data))
    sessionStorage.setItem("immocrew_onboarding_biens", JSON.stringify(biens))
  }, [currentStep, data, biens])

  // Persist photo to sessionStorage
  useEffect(() => {
    if (photoPreview) {
      sessionStorage.setItem("immocrew_onboarding_photo", photoPreview)
    } else {
      sessionStorage.removeItem("immocrew_onboarding_photo")
    }
  }, [photoPreview])

  // Close address dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        addressDropdownRef.current &&
        !addressDropdownRef.current.contains(e.target as Node)
      ) {
        setActiveAddressIndex(null)
        setAddressSuggestions({})
      }
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveAddressIndex(null)
        setAddressSuggestions({})
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

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

  // Photo upload handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("La photo dépasse 5 Mo. Choisis une image plus légère.")
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      alert("Format non supporté. Utilise JPG, PNG ou WebP.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setPhotoPreview(base64)
      setData((prev) => ({ ...prev, photo_profil: base64 }))
    }
    reader.readAsDataURL(file)
  }

  // Address autocomplete with debounce
  const searchAddress = useCallback(
    (query: string, bienIndex: number) => {
      // Clear previous timer for this index
      if (debounceTimerRef.current[bienIndex]) {
        clearTimeout(debounceTimerRef.current[bienIndex])
      }

      if (query.trim().length < 3) {
        setAddressSuggestions((prev) => {
          const next = { ...prev }
          delete next[bienIndex]
          return next
        })
        setActiveAddressIndex(null)
        return
      }

      debounceTimerRef.current[bienIndex] = setTimeout(async () => {
        try {
          const res = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`,
            { signal: AbortSignal.timeout(5000) }
          )
          if (!res.ok) return
          const json = await res.json()
          const suggestions = (
            json.features as Array<{
              properties: { label: string; context: string }
            }>
          ).map((f) => ({
            label: f.properties.label,
            context: f.properties.context,
          }))
          setAddressSuggestions((prev) => ({ ...prev, [bienIndex]: suggestions }))
          setActiveAddressIndex(bienIndex)
        } catch {
          // Silently fail — l'utilisateur peut taper manuellement
        }
      }, 300)
    },
    []
  )

  const selectAddress = (bienIndex: number, label: string) => {
    updateBien(bienIndex, "adresse", label)
    setAddressSuggestions((prev) => {
      const next = { ...prev }
      delete next[bienIndex]
      return next
    })
    setActiveAddressIndex(null)
  }

  const [validationError, setValidationError] = useState("")

  const handleNext = () => {
    // Validate required fields on non-optional steps
    if (!("optional" in step && step.optional)) {
      const emptyRequired = step.fields.filter(
        (f: string) =>
          f !== "__biens__" &&
          f !== "photo_profil" &&
          !(data[f] || "").trim()
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
    setSubmitError("")
    try {
      // Upload photo if present
      let photoKey = ""
      if (photoPreview && user?.email) {
        setPhotoUploading(true)
        try {
          const photoRes = await fetch("/api/upload-photo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              photo: photoPreview,
              email: user.email,
            }),
          })
          if (photoRes.ok) {
            const photoData = await photoRes.json()
            photoKey = photoData.key || ""
          }
        } catch {
          // Photo upload non bloquant — on continue
        } finally {
          setPhotoUploading(false)
        }
      }

      // Serialize biens into data before sending
      // Exclude base64 photo from submit (too large for JSON payload)
      const { photo_profil: _photo, ...dataWithoutPhoto } = data
      const submitData: Record<string, string> = {
        ...dataWithoutPhoto,
        photo_profil_key: photoKey,
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
        sessionStorage.removeItem("immocrew_onboarding_photo")
        setIsComplete(true)
        // Production déclenchée manuellement par l'admin depuis /admin
        // Route /api/auto-produce disponible pour automatiser plus tard
      } else {
        const errorData = await onboardingResponse.json().catch(() => ({}))
        setSubmitError(errorData.error || "Erreur lors de la sauvegarde. Réessaie dans quelques instants.")
      }
    } catch (err) {
      console.error("Onboarding submit error:", err)
      setSubmitError("Impossible de contacter le serveur. Vérifie ta connexion et réessaie.")
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
            On a tout ce qu&apos;il nous faut. Ton &eacute;quipe se met au travail.
            Tu recevras tes premiers livrables sous 24h.
          </p>
          <a
            href="/dashboard"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
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
              Étape {currentStep + 1} sur {STEPS.length} &middot; ~8 min
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
                  className="p-4 rounded-xl border border-neutral-200 bg-white space-y-3"
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
                    <div className="relative" ref={activeAddressIndex === index ? addressDropdownRef : undefined}>
                      <label htmlFor={`bien-${index}-adresse`} className="block text-caption font-medium text-neutral-600 mb-1">
                        Adresse ou quartier
                      </label>
                      <input
                        id={`bien-${index}-adresse`}
                        type="text"
                        value={bien.adresse}
                        onChange={(e) => {
                          updateBien(index, "adresse", e.target.value)
                          searchAddress(e.target.value, index)
                        }}
                        placeholder="12 rue Beaurepaire, La Doutre"
                        autoComplete="off"
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                      />
                      {activeAddressIndex === index &&
                        addressSuggestions[index] &&
                        addressSuggestions[index].length > 0 && (
                          <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-neutral-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                            {addressSuggestions[index].map((suggestion, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => selectAddress(index, suggestion.label)}
                                className="w-full text-left px-4 py-2.5 text-body-sm text-foreground hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0"
                              >
                                <span className="block font-medium">{suggestion.label}</span>
                                <span className="block text-caption text-neutral-400">{suggestion.context}</span>
                              </button>
                            ))}
                          </div>
                        )}
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
                        Surface (m²)
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
                        Nombre de pièces
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
                  <div>
                    <label htmlFor={`bien-${index}-lien_annonce`} className="block text-caption font-medium text-neutral-600 mb-1">
                      Lien vers ton annonce (optionnel)
                    </label>
                    <input
                      id={`bien-${index}-lien_annonce`}
                      type="url"
                      value={bien.lien_annonce}
                      onChange={(e) =>
                        updateBien(index, "lien_annonce", e.target.value)
                      }
                      placeholder="https://www.seloger.com/annonces/..."
                      className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                    />
                    <p className="text-caption text-neutral-400 mt-1">
                      Optionnel — on récupère les infos de l&apos;annonce pour mieux rédiger la tienne.
                    </p>
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

              // Photo upload field
              if (config.type === "photo") {
                const initials =
                  (data.prenom?.[0] || "").toUpperCase() +
                  (data.nom?.[0] || "").toUpperCase()
                return (
                  <div key={field}>
                    <label className="block text-caption font-medium text-neutral-600 mb-2">
                      {config.label}
                    </label>
                    <div className="flex items-center gap-4">
                      {photoPreview ? (
                        <img
                          src={photoPreview}
                          alt="Aperçu photo de profil"
                          className="w-20 h-20 rounded-full object-cover border-2 border-neutral-200"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-neutral-100 border-2 border-dashed border-neutral-300 flex items-center justify-center">
                          {initials ? (
                            <span className="font-display text-h3 text-neutral-400">
                              {initials}
                            </span>
                          ) : (
                            <svg className="w-8 h-8 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                      )}
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => photoInputRef.current?.click()}
                          className="h-10 px-4 rounded-md border border-neutral-300 text-body-sm text-neutral-600 hover:border-secondary hover:text-secondary transition-colors"
                        >
                          {photoPreview ? "Changer la photo" : "Ajouter ta photo"}
                        </button>
                        {photoPreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoPreview(null)
                              setData((prev) => {
                                const { photo_profil: _, ...rest } = prev
                                return rest
                              })
                            }}
                            className="text-body-sm text-neutral-400 hover:text-red-500 transition-colors text-left"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                      <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handlePhotoChange}
                        className="hidden"
                      />
                    </div>
                    {config.helper && (
                      <p className="text-caption text-neutral-400 mt-2">
                        {config.helper}
                      </p>
                    )}
                  </div>
                )
              }

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
                      type={config.type === "url" ? "url" : "text"}
                      value={data[field] || ""}
                      onChange={(e) => updateField(field, e.target.value)}
                      placeholder={config.placeholder}
                      className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                    />
                  )}
                  {config.helper && (
                    <p className="text-caption text-neutral-400 mt-1">
                      {config.helper}
                    </p>
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
            Précédent
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
                className="h-12 px-8 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
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
          {submitError && (
            <p className="text-body-sm text-error mt-3 text-center" role="alert">
              {submitError}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

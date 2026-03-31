"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { track } from "@/lib/tracking"

// --- Types ---

interface BienData {
  titre: string
  type: string
  adresse: string
  prix: string
  surface: string
  points_forts: string
  dpe: string
}

const EMPTY_BIEN: BienData = {
  titre: "",
  type: "",
  adresse: "",
  prix: "",
  surface: "",
  points_forts: "",
  dpe: "",
}

const BIEN_TYPES = [
  { value: "", label: "Type de bien..." },
  { value: "Appartement", label: "Appartement" },
  { value: "Maison", label: "Maison" },
  { value: "Terrain", label: "Terrain" },
  { value: "Commerce", label: "Commerce" },
  { value: "Autre", label: "Autre" },
]

const TENDANCE_OPTIONS = [
  { value: "", label: "Choisis une tendance..." },
  { value: "hausse", label: "Les prix montent" },
  { value: "stable", label: "C'est stable" },
  { value: "baisse", label: "Les prix baissent" },
]

const SUJETS_OPTIONS = [
  "Primo-accédants",
  "Investissement locatif",
  "Vente de maisons",
  "Estimation / prospection vendeurs",
  "Marché local / prix",
  "Conseils acheteurs",
  "Vie de quartier",
]

const MAX_BIENS = 10
const TOTAL_STEPS = 3

// --- Component ---

export default function MonthlyUpdatePage() {
  const { data: session } = useSession()
  const user = session?.user

  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  // Step 1 — Biens
  const [existingBiens, setExistingBiens] = useState<BienData[]>([])
  const [newBiens, setNewBiens] = useState<BienData[]>([])
  const [loadingBiens, setLoadingBiens] = useState(true)

  // Step 2 — Sections 2-5
  const [anecdoteMois, setAnecdoteMois] = useState("")
  const [evenementsLocaux, setEvenementsLocaux] = useState("")
  const [tendanceMarche, setTendanceMarche] = useState("")
  const [tendanceDetail, setTendanceDetail] = useState("")
  const [sujetsPrioritaires, setSujetsPrioritaires] = useState<string[]>([])
  const [sujetAutre, setSujetAutre] = useState("")

  // Track start on mount
  useEffect(() => {
    track("monthly_update_started")
  }, [])

  // Load existing biens from client_context
  useEffect(() => {
    async function loadBiens() {
      try {
        const res = await fetch("/api/monthly-update?action=get-biens")
        if (res.ok) {
          const data = await res.json()
          setExistingBiens(data.biens || [])
        }
      } catch {
        // Silently fail — user can still add biens manually
      } finally {
        setLoadingBiens(false)
      }
    }
    loadBiens()
  }, [])

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100

  // --- Biens handlers ---

  const removeBien = useCallback((index: number) => {
    setExistingBiens((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const addNewBien = useCallback(() => {
    setNewBiens((prev) => {
      const totalBiens = existingBiens.length + prev.length
      if (totalBiens >= MAX_BIENS) return prev
      return [...prev, { ...EMPTY_BIEN }]
    })
  }, [existingBiens.length])

  const updateNewBien = useCallback(
    (index: number, field: keyof BienData, value: string) => {
      setNewBiens((prev) => {
        const next = [...prev]
        next[index] = { ...next[index], [field]: value }
        return next
      })
    },
    []
  )

  const removeNewBien = useCallback((index: number) => {
    setNewBiens((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // --- Sujets handler ---

  const toggleSujet = useCallback((sujet: string) => {
    setSujetsPrioritaires((prev) =>
      prev.includes(sujet)
        ? prev.filter((s) => s !== sujet)
        : [...prev, sujet]
    )
  }, [])

  // --- Navigation ---

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((s) => s + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // --- Submit ---

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const allBiens = [
        ...existingBiens,
        ...newBiens.filter((b) => b.titre.trim() !== ""),
      ]

      const finalSujets = [...sujetsPrioritaires]
      if (sujetAutre.trim()) {
        finalSujets.push(sujetAutre.trim())
      }

      const body = {
        biens: allBiens,
        anecdote_mois: anecdoteMois,
        evenements_locaux: evenementsLocaux,
        tendance_marche: tendanceMarche,
        tendance_detail: tendanceDetail,
        sujets_prioritaires: finalSujets,
      }

      const res = await fetch("/api/monthly-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (res.ok) {
        track("monthly_update_completed")
        setIsComplete(true)
      }
    } catch (err) {
      console.error("Monthly update submit error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Completion screen ---

  if (isComplete) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4">
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
          C&apos;est enregistré !
        </h1>
        <p className="text-body text-neutral-600 mb-2">
          On s&apos;occupe du reste. Tes contenus arrivent sous 48h.
        </p>
        <p className="text-body-sm text-neutral-400 mb-8">
          Tes infos du mois vont rendre ta newsletter, tes posts et tes annonces
          encore plus personnalisés.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-white font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
        >
          Retour au dashboard
        </a>
      </div>
    )
  }

  // --- Step titles ---

  const stepTitles = [
    "Tes biens ce mois-ci",
    "Ton mois en bref",
    "Recap et validation",
  ]

  return (
    <div className="max-w-xl mx-auto px-4 py-4 desktop:py-8">
      {/* Introduction — contexte et bénéfice */}
      <div className="rounded-lg bg-primary-50 border border-primary-100 p-5 mb-8">
        <h1 className="font-display text-h2 text-primary font-bold mb-2">
          Dis-nous ce qui a changé ce mois-ci
        </h1>
        <p className="text-body text-neutral-600 leading-relaxed">
          Ces infos nous permettent de personnaliser tes contenus du mois prochain.
          Plus tu nous en dis, plus tes posts et articles collent à ta réalité terrain.
          Ça prend 5 minutes.
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="font-display text-h3 text-primary">
            {stepTitles[currentStep]}
          </span>
          <span className="text-caption text-neutral-500">
            Étape {currentStep + 1} sur {TOTAL_STEPS}
          </span>
        </div>
        <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full transition-all duration-slow"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step 1 — Biens */}
      {currentStep === 0 && (
        <div className="space-y-4">
          <p className="text-body-sm text-neutral-500 mb-2">
            Ajoute ou retire des biens. Max {MAX_BIENS} biens.
          </p>

          {loadingBiens ? (
            <div className="text-center py-8 text-neutral-400 text-body-sm">
              Chargement de tes biens...
            </div>
          ) : (
            <>
              {/* Existing biens */}
              {existingBiens.map((bien, index) => (
                <div
                  key={`existing-${index}`}
                  className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-body-sm font-semibold text-primary truncate">
                        {bien.titre || "Bien sans titre"}
                      </p>
                      <p className="text-caption text-neutral-500">
                        {[bien.type, bien.adresse, bien.prix ? `${bien.prix} EUR` : ""]
                          .filter(Boolean)
                          .join(" — ")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeBien(index)}
                      className="ml-3 w-8 h-8 flex items-center justify-center rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      aria-label={`Retirer ${bien.titre}`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              {/* New biens (mini-forms) */}
              {newBiens.map((bien, index) => (
                <div
                  key={`new-${index}`}
                  className="p-4 rounded-md border border-secondary/30 bg-white shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-body-sm font-semibold text-primary">
                      Nouveau bien
                    </span>
                    <button
                      type="button"
                      onClick={() => removeNewBien(index)}
                      className="text-body-sm text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      Annuler
                    </button>
                  </div>

                  {/* Titre */}
                  <div>
                    <label className="block text-caption font-medium text-neutral-600 mb-1">
                      Titre du bien
                    </label>
                    <input
                      type="text"
                      value={bien.titre}
                      onChange={(e) =>
                        updateNewBien(index, "titre", e.target.value)
                      }
                      placeholder="T3 vue Loire La Doutre"
                      className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
                    />
                  </div>

                  {/* Type + Adresse */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-caption font-medium text-neutral-600 mb-1">
                        Type
                      </label>
                      <select
                        value={bien.type}
                        onChange={(e) =>
                          updateNewBien(index, "type", e.target.value)
                        }
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
                      >
                        {BIEN_TYPES.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-caption font-medium text-neutral-600 mb-1">
                        Adresse ou quartier
                      </label>
                      <input
                        type="text"
                        value={bien.adresse}
                        onChange={(e) =>
                          updateNewBien(index, "adresse", e.target.value)
                        }
                        placeholder="12 rue Beaurepaire"
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
                      />
                    </div>
                  </div>

                  {/* Prix + Surface + DPE */}
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-caption font-medium text-neutral-600 mb-1">
                        Prix
                      </label>
                      <input
                        type="text"
                        value={bien.prix}
                        onChange={(e) =>
                          updateNewBien(index, "prix", e.target.value)
                        }
                        placeholder="185000"
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
                      />
                    </div>
                    <div>
                      <label className="block text-caption font-medium text-neutral-600 mb-1">
                        Surface (m2)
                      </label>
                      <input
                        type="text"
                        value={bien.surface}
                        onChange={(e) =>
                          updateNewBien(index, "surface", e.target.value)
                        }
                        placeholder="68"
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
                      />
                    </div>
                    <div>
                      <label className="block text-caption font-medium text-neutral-600 mb-1">
                        DPE
                      </label>
                      <select
                        value={bien.dpe}
                        onChange={(e) =>
                          updateNewBien(index, "dpe", e.target.value)
                        }
                        className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
                      >
                        <option value="">DPE...</option>
                        {["A", "B", "C", "D", "E", "F", "G"].map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Points forts */}
                  <div>
                    <label className="block text-caption font-medium text-neutral-600 mb-1">
                      Points forts
                    </label>
                    <textarea
                      value={bien.points_forts}
                      onChange={(e) =>
                        updateNewBien(index, "points_forts", e.target.value)
                      }
                      placeholder="Vue Loire, parquet chene, cave voutee, 5 min tramway"
                      rows={2}
                      className="w-full px-4 py-3 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast resize-y"
                    />
                  </div>
                </div>
              ))}

              {/* Add bien button */}
              {existingBiens.length + newBiens.length < MAX_BIENS && (
                <button
                  type="button"
                  onClick={addNewBien}
                  className="w-full h-12 rounded-md border-2 border-dashed border-neutral-300 text-body-sm text-neutral-500 hover:border-secondary hover:text-secondary transition-colors"
                >
                  + Ajouter un bien
                </button>
              )}

              {existingBiens.length === 0 && newBiens.length === 0 && (
                <p className="text-center text-body-sm text-neutral-400 py-4">
                  Aucun bien pour l&apos;instant. Ajoute ton premier bien ci-dessus.
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* Step 2 — Sections 2-5 on one page */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Section 2 — Anecdote du mois */}
          <div>
            <label
              htmlFor="anecdote_mois"
              className="block text-caption font-medium text-neutral-600 mb-1"
            >
              Un truc marquant ce mois-ci ?
            </label>
            <textarea
              id="anecdote_mois"
              value={anecdoteMois}
              onChange={(e) => setAnecdoteMois(e.target.value)}
              placeholder="Ex: J'ai vendu le T3 Beaurepaire en 48h. Le couple m'a remerciée en pleurant le jour de la signature."
              rows={3}
              className="w-full px-4 py-3 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast resize-y"
            />
            <p className="text-caption text-neutral-400 mt-1">
              Facultatif — ça rend ta newsletter unique. 2 phrases suffisent.
            </p>
          </div>

          {/* Section 3 — Evenements locaux */}
          <div>
            <label
              htmlFor="evenements_locaux"
              className="block text-caption font-medium text-neutral-600 mb-1"
            >
              Un événement dans ta zone ce mois-ci ?
            </label>
            <textarea
              id="evenements_locaux"
              value={evenementsLocaux}
              onChange={(e) => setEvenementsLocaux(e.target.value)}
              placeholder="Ex: Foire d'Angers du 12 au 15, marché de Noël place du Ralliement, ouverture du nouveau tram"
              rows={2}
              className="w-full px-4 py-3 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast resize-y"
            />
            <p className="text-caption text-neutral-400 mt-1">
              Facultatif
            </p>
          </div>

          {/* Section 4 — Tendance marche */}
          <div>
            <label
              htmlFor="tendance_marche"
              className="block text-caption font-medium text-neutral-600 mb-1"
            >
              Les prix dans ton secteur ce mois-ci ?
            </label>
            <select
              id="tendance_marche"
              value={tendanceMarche}
              onChange={(e) => setTendanceMarche(e.target.value)}
              className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
            >
              {TENDANCE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="tendance_detail"
              className="block text-caption font-medium text-neutral-600 mb-1"
            >
              Un mot de plus ?
            </label>
            <textarea
              id="tendance_detail"
              value={tendanceDetail}
              onChange={(e) => setTendanceDetail(e.target.value)}
              placeholder="Ex: Beaucoup de biens en vente dans le centre, les acheteurs négocient plus qu'avant"
              rows={2}
              className="w-full px-4 py-3 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast resize-y"
            />
            <p className="text-caption text-neutral-400 mt-1">
              Facultatif
            </p>
          </div>

          {/* Section 5 — Sujets prioritaires */}
          <div>
            <p className="text-caption font-medium text-neutral-600 mb-2">
              Ton focus du mois — sur quoi tu veux communiquer ?
            </p>
            <div className="space-y-2">
              {SUJETS_OPTIONS.map((sujet) => (
                <label
                  key={sujet}
                  className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-white cursor-pointer hover:border-secondary/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={sujetsPrioritaires.includes(sujet)}
                    onChange={() => toggleSujet(sujet)}
                    className="w-5 h-5 rounded border-neutral-300 text-secondary focus-visible:ring-secondary accent-secondary"
                  />
                  <span className="text-body-sm text-foreground">{sujet}</span>
                </label>
              ))}
              {/* Autre */}
              <div className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 bg-white">
                <span className="text-body-sm text-neutral-500">Autre :</span>
                <input
                  type="text"
                  value={sujetAutre}
                  onChange={(e) => setSujetAutre(e.target.value)}
                  placeholder="Un sujet spécifique..."
                  className="flex-1 h-12 px-4 rounded-md border border-neutral-300 bg-white text-body-sm text-foreground placeholder:text-neutral-400 focus-visible:border-secondary focus-visible:outline-none transition-all duration-fast"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 — Recap */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <p className="text-body text-neutral-600 mb-4">
            Voici le résumé de tes infos du mois. Vérifie et valide.
          </p>

          {/* Biens recap */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
            <p className="text-caption font-medium text-neutral-500 mb-1">
              Biens en portefeuille
            </p>
            <p className="font-display text-body font-semibold text-primary">
              {existingBiens.length + newBiens.filter((b) => b.titre.trim()).length} bien(s)
            </p>
            {(() => {
              const allRecapBiens = [
                ...existingBiens,
                ...newBiens.filter((b) => b.titre.trim()),
              ]
              if (allRecapBiens.length > 0) {
                return (
                  <ul className="mt-2 space-y-1">
                    {allRecapBiens.map((b, i) => (
                      <li key={i} className="text-body-sm text-neutral-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary flex-shrink-0" />
                        {b.titre || "Bien sans titre"}
                        {b.type ? <span className="text-caption text-neutral-400">({b.type})</span> : null}
                      </li>
                    ))}
                  </ul>
                )
              }
              return null
            })()}
          </div>

          {/* Anecdote recap */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
            <p className="text-caption font-medium text-neutral-500 mb-1">
              Anecdote du mois
            </p>
            <p className="text-body-sm text-foreground">
              {anecdoteMois.trim()
                ? anecdoteMois.length > 100
                  ? anecdoteMois.slice(0, 100) + "..."
                  : anecdoteMois
                : "Non renseigné"}
            </p>
          </div>

          {/* Evenements recap */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
            <p className="text-caption font-medium text-neutral-500 mb-1">
              Événements locaux
            </p>
            <p className="text-body-sm text-foreground">
              {evenementsLocaux.trim() || "Non renseigné"}
            </p>
          </div>

          {/* Tendance recap */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
            <p className="text-caption font-medium text-neutral-500 mb-1">
              Tendance marche
            </p>
            <p className="text-body-sm text-foreground">
              {tendanceMarche
                ? TENDANCE_OPTIONS.find((o) => o.value === tendanceMarche)?.label || tendanceMarche
                : "Non renseigné"}
              {tendanceDetail.trim() ? ` — ${tendanceDetail}` : ""}
            </p>
          </div>

          {/* Sujets recap */}
          <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
            <p className="text-caption font-medium text-neutral-500 mb-1">
              Focus du mois
            </p>
            <p className="text-body-sm text-foreground">
              {sujetsPrioritaires.length > 0 || sujetAutre.trim()
                ? [...sujetsPrioritaires, ...(sujetAutre.trim() ? [sujetAutre.trim()] : [])].join(", ")
                : "Non renseigné"}
            </p>
          </div>

          <p className="text-body-sm text-neutral-400 text-center mt-6">
            On s&apos;occupe du reste. Tes contenus arrivent sous 48h.
          </p>
        </div>
      )}

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

        {currentStep < TOTAL_STEPS - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="h-12 px-8 rounded-full bg-secondary text-white font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
          >
            Suivant
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-12 px-8 rounded-full bg-success-600 text-white font-display font-semibold text-body shadow-sm hover:bg-success-700 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60"
          >
            {isSubmitting ? "Envoi..." : "Valider mes infos du mois"}
          </button>
        )}
      </div>
    </div>
  )
}

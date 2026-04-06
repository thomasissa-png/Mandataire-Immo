"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PhotoUploader } from "./PhotoUploader"

// ─── Types ────────────────────────────────────────────────────────

interface BienFormData {
  transaction_type: "vente" | "location"
  type_bien: string
  adresse: string
  prix: string
  surface: string
  pieces: string
  points_forts: string
  description_detaillee: string
}

interface FormErrors {
  type_bien?: string
  adresse?: string
  prix?: string
  surface?: string
  pieces?: string
}

interface AddressSuggestion {
  label: string
  postcode: string
  city: string
  context: string
}

const TYPES_BIEN = [
  "Appartement",
  "Maison",
  "Studio",
  "Terrain",
  "Local commercial",
  "Autre",
] as const

// ─── Validation ───────────────────────────────────────────────────

function validate(data: BienFormData): FormErrors {
  const errors: FormErrors = {}

  if (!data.type_bien) {
    errors.type_bien = "Choisis un type de bien"
  }
  if (!data.adresse.trim()) {
    errors.adresse = "L'adresse est obligatoire"
  }
  const prix = Number(data.prix)
  if (!data.prix || isNaN(prix) || prix <= 0) {
    errors.prix = "Le prix doit être supérieur à 0 €"
  }
  const surface = Number(data.surface)
  if (!data.surface || isNaN(surface) || surface <= 0) {
    errors.surface = "La surface doit être supérieure à 0 m²"
  }

  return errors
}

// ─── Hook autocomplétion adresse (API Adresse gouv) ──────────────

function useAddressAutocomplete() {
  const [query, setQuery] = useState("")
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback((q: string) => {
    setQuery(q)
    if (q.length < 4) {
      setSuggestions([])
      setIsOpen(false)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(q)}&limit=5&type=housenumber`
        )
        if (!res.ok) return
        const data = await res.json()
        const results: AddressSuggestion[] = (data.features || []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (f: any) => ({
            label: f.properties.label,
            postcode: f.properties.postcode,
            city: f.properties.city,
            context: f.properties.context,
          })
        )
        setSuggestions(results)
        setIsOpen(results.length > 0)
      } catch {
        // Silently fail — user can still type manually
      }
    }, 300)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return { query, search, suggestions, isOpen, close }
}

// ─── Composant ────────────────────────────────────────────────────

export function BienForm() {
  const router = useRouter()

  const [formData, setFormData] = useState<BienFormData>({
    transaction_type: "vente",
    type_bien: "",
    adresse: "",
    prix: "",
    surface: "",
    pieces: "",
    points_forts: "",
    description_detaillee: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitProgress, setSubmitProgress] = useState<string | null>(null)

  // Photos sélectionnées (avant création du bien)
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
  const photoInputRef = useRef<HTMLInputElement>(null)

  // Étape 2 : upload photos après création (fallback si besoin)
  const [step, setStep] = useState<"form" | "photos">("form")
  const [createdId, setCreatedId] = useState<string | null>(null)

  // Autocomplétion adresse
  const address = useAddressAutocomplete()
  const addressContainerRef = useRef<HTMLDivElement>(null)

  // Fermer les suggestions au clic extérieur
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (addressContainerRef.current && !addressContainerRef.current.contains(e.target as Node)) {
        address.close()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [address])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleAddressInput = (value: string) => {
    setFormData((prev) => ({ ...prev, adresse: value }))
    address.search(value)
    if (errors.adresse) {
      setErrors((prev) => ({ ...prev, adresse: undefined }))
    }
  }

  const selectAddress = (suggestion: AddressSuggestion) => {
    setFormData((prev) => ({ ...prev, adresse: suggestion.label }))
    address.close()
  }

  // ─── Photos ─────────────────────────────────────────────────────

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const newFiles = Array.from(e.target.files).filter(
      (f) => f.size <= 5 * 1024 * 1024 && ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    )
    const total = [...selectedPhotos, ...newFiles].slice(0, 10)
    setSelectedPhotos(total)
    // Générer les previews
    const previews = total.map((f) => URL.createObjectURL(f))
    setPhotoPreviews((prev) => {
      prev.forEach(URL.revokeObjectURL)
      return previews
    })
    e.target.value = ""
  }

  const removePhoto = (index: number) => {
    setSelectedPhotos((prev) => prev.filter((_, i) => i !== index))
    setPhotoPreviews((prev) => {
      URL.revokeObjectURL(prev[index])
      return prev.filter((_, i) => i !== index)
    })
  }

  // ─── Submit ─────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const validationErrors = validate(formData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSubmitting(true)

    try {
      const prix = Number(formData.prix)
      const surface = Number(formData.surface)
      const pieces = formData.pieces ? Number(formData.pieces) : 1

      const res = await fetch("/api/biens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: `${formData.type_bien} — ${formData.adresse}`,
          type_bien: formData.type_bien,
          transaction_type: formData.transaction_type,
          adresse: formData.adresse,
          prix,
          surface,
          pieces,
          points_forts: formData.points_forts || "À compléter",
          description_detaillee: formData.description_detaillee || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erreur inconnue" }))
        throw new Error(data.error || `Erreur ${res.status}`)
      }

      const { id } = await res.json()

      // Upload les photos sélectionnées
      if (selectedPhotos.length > 0) {
        setSubmitProgress(`Upload des photos (0/${selectedPhotos.length})...`)
        for (let i = 0; i < selectedPhotos.length; i++) {
          setSubmitProgress(`Upload des photos (${i + 1}/${selectedPhotos.length})...`)
          try {
            const reader = new FileReader()
            const base64 = await new Promise<string>((resolve, reject) => {
              reader.onload = () => resolve(reader.result as string)
              reader.onerror = () => reject(new Error("Erreur lecture"))
              reader.readAsDataURL(selectedPhotos[i])
            })
            await fetch(`/api/biens/${id}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                photo: base64,
                filename: selectedPhotos[i].name,
                ordre: i,
              }),
            })
          } catch {
            // Continuer même si une photo échoue
          }
        }
      }

      // Redirection directe vers la fiche bien
      router.push(`/dashboard/biens/${id}`)
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Impossible de créer le bien. Réessaie dans quelques secondes."
      )
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrix = (value: string): string => {
    const num = Number(value)
    if (!value || isNaN(num)) return ""
    return new Intl.NumberFormat("fr-FR").format(num)
  }

  // ─── Étape 2 : Upload photos ───────────────────────────────────

  if (step === "photos" && createdId) {
    return (
      <div className="space-y-6">
        {/* Succès création */}
        <div className="rounded-lg bg-success-50 border border-success-200 p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-success-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-body-sm text-success-800 font-semibold">
            Bien créé ! Ajoute maintenant tes photos.
          </p>
        </div>

        {/* Zone upload */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-display text-h4 font-semibold text-primary mb-1">
            Photos du bien
          </h3>
          <p className="text-body-sm text-neutral-500 mb-2">
            Tes photos seront utilisées pour ta landing page, tes annonces, tes emails et tes posts réseaux sociaux.
          </p>
          <p className="text-caption text-neutral-400 mb-4">
            Formats acceptés : JPG, PNG, WebP. Jusqu'à 10 photos. 5 Mo max par photo.
          </p>
          <PhotoUploader propertyId={createdId} initialPhotos={[]} />
        </div>

        {/* Actions */}
        <div className="flex flex-col tablet:flex-row gap-3">
          <button
            type="button"
            onClick={() => router.push(`/dashboard/biens/${createdId}`)}
            className="flex-1 flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-secondary text-white font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 hover:shadow-md transition-all duration-normal"
          >
            Voir la fiche du bien
          </button>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/biens/${createdId}`)}
            className="flex items-center justify-center h-12 px-6 rounded-full text-body-sm text-neutral-500 hover:text-primary transition-colors"
          >
            Continuer sans photos
          </button>
        </div>
      </div>
    )
  }

  // ─── Étape 1 : Formulaire ──────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Type de transaction — Toggle vente/location */}
      <div>
        <label className="block text-body-sm font-semibold text-primary mb-2">
          Type de transaction
        </label>
        <div className="inline-flex rounded-lg border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, transaction_type: "vente" }))}
            className={`px-5 py-2 text-body-sm font-medium transition-colors ${
              formData.transaction_type === "vente"
                ? "bg-primary text-white"
                : "bg-card text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Vente
          </button>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, transaction_type: "location" }))}
            className={`px-5 py-2 text-body-sm font-medium transition-colors ${
              formData.transaction_type === "location"
                ? "bg-primary text-white"
                : "bg-card text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            Location
          </button>
        </div>
      </div>

      {/* Type de bien */}
      <div>
        <label htmlFor="type_bien" className="block text-body-sm font-semibold text-primary mb-1.5">
          Type de bien <span className="text-error" aria-hidden="true">*</span>
        </label>
        <select
          id="type_bien"
          name="type_bien"
          value={formData.type_bien}
          onChange={handleChange}
          className={`w-full h-12 px-4 rounded-lg border bg-card text-body-sm text-foreground transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 ${
            errors.type_bien ? "border-error" : "border-border"
          }`}
          aria-invalid={!!errors.type_bien}
          aria-describedby={errors.type_bien ? "error-type_bien" : undefined}
        >
          <option value="">Sélectionne un type</option>
          {TYPES_BIEN.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.type_bien && (
          <p id="error-type_bien" className="text-caption text-error mt-1" role="alert">
            {errors.type_bien}
          </p>
        )}
      </div>

      {/* Adresse avec autocomplétion */}
      <div ref={addressContainerRef} className="relative">
        <label htmlFor="adresse" className="block text-body-sm font-semibold text-primary mb-1.5">
          Adresse complète <span className="text-error" aria-hidden="true">*</span>
        </label>
        <input
          id="adresse"
          name="adresse"
          type="text"
          value={formData.adresse}
          onChange={(e) => handleAddressInput(e.target.value)}
          placeholder="Commence à taper une adresse..."
          autoComplete="off"
          className={`w-full h-12 px-4 rounded-lg border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 ${
            errors.adresse ? "border-error" : "border-border"
          }`}
          aria-invalid={!!errors.adresse}
          aria-describedby={errors.adresse ? "error-adresse" : undefined}
          aria-autocomplete="list"
          aria-controls="address-suggestions"
          aria-expanded={address.isOpen}
        />
        {errors.adresse && (
          <p id="error-adresse" className="text-caption text-error mt-1" role="alert">
            {errors.adresse}
          </p>
        )}

        {/* Suggestions dropdown */}
        {address.isOpen && (
          <ul
            id="address-suggestions"
            role="listbox"
            className="absolute z-20 left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {address.suggestions.map((s, i) => (
              <li
                key={i}
                role="option"
                aria-selected={false}
                onClick={() => selectAddress(s)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") selectAddress(s)
                }}
                tabIndex={0}
                className="px-4 py-3 cursor-pointer hover:bg-secondary-50 transition-colors border-b border-border last:border-b-0"
              >
                <p className="text-body-sm text-foreground font-medium">{s.label}</p>
                <p className="text-caption text-neutral-500">{s.context}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Prix + Surface + Pièces — grille responsive */}
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
        {/* Prix */}
        <div>
          <label htmlFor="prix" className="block text-body-sm font-semibold text-primary mb-1.5">
            {formData.transaction_type === "location" ? "Loyer mensuel" : "Prix"} <span className="text-error" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="prix"
              name="prix"
              type="number"
              inputMode="numeric"
              min="1"
              step={formData.transaction_type === "location" ? "50" : "1000"}
              value={formData.prix}
              onChange={handleChange}
              placeholder={formData.transaction_type === "location" ? "850" : "285 000"}
              className={`w-full h-12 px-4 pr-14 rounded-lg border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 ${
                errors.prix ? "border-error" : "border-border"
              }`}
              aria-invalid={!!errors.prix}
              aria-describedby={errors.prix ? "error-prix" : "hint-prix"}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-neutral-400" aria-hidden="true">
              {formData.transaction_type === "location" ? "€/mois" : "€"}
            </span>
          </div>
          {formData.prix && !errors.prix && (
            <p id="hint-prix" className="text-caption text-neutral-500 mt-1">
              {formatPrix(formData.prix)} {formData.transaction_type === "location" ? "€/mois" : "€"}
            </p>
          )}
          {errors.prix && (
            <p id="error-prix" className="text-caption text-error mt-1" role="alert">
              {errors.prix}
            </p>
          )}
        </div>

        {/* Surface */}
        <div>
          <label htmlFor="surface" className="block text-body-sm font-semibold text-primary mb-1.5">
            Surface <span className="text-error" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="surface"
              name="surface"
              type="number"
              inputMode="numeric"
              min="1"
              value={formData.surface}
              onChange={handleChange}
              placeholder="65"
              className={`w-full h-12 px-4 pr-10 rounded-lg border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 ${
                errors.surface ? "border-error" : "border-border"
              }`}
              aria-invalid={!!errors.surface}
              aria-describedby={errors.surface ? "error-surface" : undefined}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-neutral-400" aria-hidden="true">
              m²
            </span>
          </div>
          {errors.surface && (
            <p id="error-surface" className="text-caption text-error mt-1" role="alert">
              {errors.surface}
            </p>
          )}
        </div>

        {/* Pièces */}
        <div>
          <label htmlFor="pieces" className="block text-body-sm font-semibold text-primary mb-1.5">
            Pièces
          </label>
          <input
            id="pieces"
            name="pieces"
            type="number"
            inputMode="numeric"
            min="1"
            value={formData.pieces}
            onChange={handleChange}
            placeholder="3"
            className="w-full h-12 px-4 rounded-lg border border-border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
          />
        </div>
      </div>

      {/* Points forts */}
      <div>
        <label htmlFor="points_forts" className="block text-body-sm font-semibold text-primary mb-1.5">
          Points forts du bien
        </label>
        <textarea
          id="points_forts"
          name="points_forts"
          value={formData.points_forts}
          onChange={handleChange}
          placeholder="Parquet chêne, double exposition, cave, gardien, balcon 8m²..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 resize-y"
        />
        <p className="text-caption text-neutral-500 mt-1">
          Ces détails rendront ton annonce beaucoup plus percutante
        </p>
      </div>

      {/* Description détaillée */}
      <div>
        <label htmlFor="description_detaillee" className="block text-body-sm font-semibold text-primary mb-1.5">
          Description détaillée <span className="text-caption text-neutral-500 font-normal">(optionnel)</span>
        </label>
        <textarea
          id="description_detaillee"
          name="description_detaillee"
          value={formData.description_detaillee}
          onChange={handleChange}
          placeholder="Toute info supplémentaire qui pourrait enrichir l'annonce : contexte du quartier, travaux récents, vue, luminosité..."
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 resize-y"
        />
      </div>

      {/* Photos du bien — sélection avant création */}
      <div>
        <label className="block text-body-sm font-semibold text-primary mb-1.5">
          Photos du bien
        </label>
        <p className="text-caption text-neutral-400 mb-3">
          JPG, PNG ou WebP · 5 Mo max par photo · Jusqu{"'"}à 10 photos
        </p>

        {/* Previews */}
        {photoPreviews.length > 0 && (
          <div className="grid grid-cols-3 tablet:grid-cols-5 gap-2 mb-3">
            {photoPreviews.map((src, i) => (
              <div key={src} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
                <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-error-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Supprimer la photo ${i + 1}`}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Bouton ajout */}
        {selectedPhotos.length < 10 && (
          <>
            <input
              ref={photoInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handlePhotoSelect}
            />
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 h-12 rounded-lg border-2 border-dashed border-neutral-300 text-body-sm text-neutral-500 hover:border-secondary hover:text-secondary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91M3.75 21h16.5a2.25 2.25 0 002.25-2.25V5.25a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              {selectedPhotos.length === 0 ? "Ajouter des photos" : `Ajouter d'autres photos (${selectedPhotos.length}/10)`}
            </button>
          </>
        )}
      </div>

      {/* Erreur de soumission */}
      {submitError && (
        <div className="rounded-lg bg-error-50 border border-error-200 p-4" role="alert">
          <p className="text-body-sm text-error-700">{submitError}</p>
        </div>
      )}

      {/* Bouton submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full tablet:w-auto flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-secondary text-white font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 hover:text-white hover:shadow-md transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            {submitProgress || "Création en cours..."}
          </>
        ) : (
          selectedPhotos.length > 0 ? `Créer mon bien avec ${selectedPhotos.length} photo${selectedPhotos.length > 1 ? "s" : ""}` : "Créer mon bien"
        )}
      </button>
    </form>
  )
}

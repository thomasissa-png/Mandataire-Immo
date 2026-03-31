"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

// ─── Types ────────────────────────────────────────────────────────

interface BienFormData {
  lien_annonce: string
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

interface ParseResult {
  platform: string
  listing: {
    type_bien: string
    adresse: string
    prix: string
    surface: string
    pieces: string
    description: string
    points_forts: string
  }
  photos: string[]
  photo_urls: string[]
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

// ─── Helpers ──────────────────────────────────────────────────────

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str)
    return ["http:", "https:"].includes(url.protocol)
  } catch {
    return false
  }
}

function platformLabel(platform: string): string {
  switch (platform) {
    case "seloger": return "SeLoger"
    case "leboncoin": return "LeBonCoin"
    case "bienici": return "Bien'ici"
    default: return "l'annonce"
  }
}

// ─── Composant ────────────────────────────────────────────────────

export function BienForm() {
  const router = useRouter()

  const [formData, setFormData] = useState<BienFormData>({
    lien_annonce: "",
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

  // Import state
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ platform: string; photoCount: number } | null>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [importedPhotos, setImportedPhotos] = useState<string[]>([])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // ─── Import depuis URL ──────────────────────────────────────────

  const handleImport = useCallback(async () => {
    const url = formData.lien_annonce.trim()
    if (!url || !isValidUrl(url)) {
      setImportError("Colle un lien valide (commençant par https://)")
      return
    }

    setImporting(true)
    setImportError(null)
    setImportResult(null)

    try {
      const res = await fetch("/api/biens/parse-listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erreur inconnue" }))
        throw new Error(data.error || `Erreur ${res.status}`)
      }

      const data: ParseResult = await res.json()

      // Pré-remplir uniquement les champs vides
      setFormData((prev) => ({
        ...prev,
        type_bien: prev.type_bien || data.listing.type_bien,
        adresse: prev.adresse || data.listing.adresse,
        prix: prev.prix || data.listing.prix,
        surface: prev.surface || data.listing.surface,
        pieces: prev.pieces || data.listing.pieces,
        points_forts: prev.points_forts || data.listing.points_forts,
        description_detaillee: prev.description_detaillee || data.listing.description,
      }))

      setImportedPhotos(data.photos)
      setImportResult({
        platform: data.platform,
        photoCount: data.photos.length,
      })
    } catch (err) {
      setImportError(
        err instanceof Error
          ? err.message
          : "Impossible d'importer l'annonce. Réessaie ou remplis le formulaire manuellement."
      )
    } finally {
      setImporting(false)
    }
  }, [formData.lien_annonce])

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
          lien_annonce: formData.lien_annonce || undefined,
          type_bien: formData.type_bien,
          adresse: formData.adresse,
          prix,
          surface,
          pieces,
          points_forts: formData.points_forts || "À compléter",
          description_detaillee: formData.description_detaillee || undefined,
          imported_photos: importedPhotos.length > 0 ? importedPhotos : undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erreur inconnue" }))
        throw new Error(data.error || `Erreur ${res.status}`)
      }

      const { id } = await res.json()
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Lien annonce existante — EN PREMIER */}
      <div className="rounded-lg border-2 border-warning-300 bg-warning-50/50 p-4">
        <label htmlFor="lien_annonce" className="block text-body-sm font-semibold text-primary mb-1.5">
          Lien d{"'"}annonce existante <span className="text-caption text-neutral-500 font-normal">(optionnel)</span>
        </label>
        <div className="flex gap-2">
          <input
            id="lien_annonce"
            name="lien_annonce"
            type="url"
            value={formData.lien_annonce}
            onChange={handleChange}
            placeholder="Colle le lien SeLoger, LeBonCoin ou Bien'ici"
            className="flex-1 h-12 px-4 rounded-lg border border-border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
          />
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || !formData.lien_annonce.trim()}
            className="flex-shrink-0 h-12 px-5 rounded-lg bg-primary text-white font-display font-bold text-body-sm hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {importing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                Import...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
                Importer
              </>
            )}
          </button>
        </div>

        {/* Import feedback */}
        {importResult && (
          <div className="mt-2 flex items-center gap-2 text-caption text-success-700 bg-success-50 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Importé depuis {platformLabel(importResult.platform)} — {importResult.photoCount} photo{importResult.photoCount > 1 ? "s" : ""} récupérée{importResult.photoCount > 1 ? "s" : ""}. Vérifie et complète les infos ci-dessous.
          </div>
        )}
        {importError && (
          <div className="mt-2 flex items-center gap-2 text-caption text-error-700 bg-error-50 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            {importError}
          </div>
        )}
        {!importResult && !importError && (
          <p className="text-caption text-neutral-500 mt-1.5">
            Colle le lien et clique sur Importer — on récupère les infos et les photos automatiquement.
          </p>
        )}
      </div>

      {/* Imported photos preview */}
      {importedPhotos.length > 0 && (
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-body-sm font-semibold text-primary mb-3">
            {importedPhotos.length} photo{importedPhotos.length > 1 ? "s" : ""} importée{importedPhotos.length > 1 ? "s" : ""}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {importedPhotos.map((key, i) => (
              <img
                key={key}
                src={`/api/images/${encodeURIComponent(key)}`}
                alt={`Photo importée ${i + 1}`}
                className="w-24 h-18 rounded-lg object-cover flex-shrink-0 border border-border"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      )}

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

      {/* Adresse */}
      <div>
        <label htmlFor="adresse" className="block text-body-sm font-semibold text-primary mb-1.5">
          Adresse complète <span className="text-error" aria-hidden="true">*</span>
        </label>
        <input
          id="adresse"
          name="adresse"
          type="text"
          value={formData.adresse}
          onChange={handleChange}
          placeholder="12 rue des Lilas, 69003 Lyon"
          className={`w-full h-12 px-4 rounded-lg border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 ${
            errors.adresse ? "border-error" : "border-border"
          }`}
          aria-invalid={!!errors.adresse}
          aria-describedby={errors.adresse ? "error-adresse" : undefined}
        />
        {errors.adresse && (
          <p id="error-adresse" className="text-caption text-error mt-1" role="alert">
            {errors.adresse}
          </p>
        )}
      </div>

      {/* Prix + Surface + Pièces — grille responsive */}
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
        {/* Prix */}
        <div>
          <label htmlFor="prix" className="block text-body-sm font-semibold text-primary mb-1.5">
            Prix <span className="text-error" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <input
              id="prix"
              name="prix"
              type="number"
              inputMode="numeric"
              min="1"
              step="1000"
              value={formData.prix}
              onChange={handleChange}
              placeholder="285 000"
              className={`w-full h-12 px-4 pr-10 rounded-lg border bg-card text-body-sm text-foreground placeholder:text-neutral-400 transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 ${
                errors.prix ? "border-error" : "border-border"
              }`}
              aria-invalid={!!errors.prix}
              aria-describedby={errors.prix ? "error-prix" : "hint-prix"}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-body-sm text-neutral-400" aria-hidden="true">
              €
            </span>
          </div>
          {formData.prix && !errors.prix && (
            <p id="hint-prix" className="text-caption text-neutral-500 mt-1">
              {formatPrix(formData.prix)} €
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
        className="w-full tablet:w-auto flex items-center justify-center gap-2 h-12 px-8 rounded-full bg-secondary text-primary font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 hover:text-white hover:shadow-md transition-all duration-normal disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" aria-hidden="true" />
            Création en cours...
          </>
        ) : (
          "Créer mon bien"
        )}
      </button>
    </form>
  )
}

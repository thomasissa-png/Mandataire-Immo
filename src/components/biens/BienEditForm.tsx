"use client"

import { useState } from "react"

interface BienEditFormProps {
  propertyId: string
  initialData: {
    titre: string
    type_bien: string
    adresse: string
    prix: number
    surface: number
    pieces: number
    points_forts: string | null
  }
  onSaved: () => void
  onCancel: () => void
}

const BIEN_TYPES = [
  "Appartement",
  "Maison",
  "Terrain",
  "Commerce",
  "Autre",
]

export function BienEditForm({
  propertyId,
  initialData,
  onSaved,
  onCancel,
}: BienEditFormProps) {
  const [titre, setTitre] = useState(initialData.titre)
  const [typeBien, setTypeBien] = useState(initialData.type_bien)
  const [adresse, setAdresse] = useState(initialData.adresse)
  const [prix, setPrix] = useState(String(initialData.prix))
  const [surface, setSurface] = useState(String(initialData.surface))
  const [pieces, setPieces] = useState(String(initialData.pieces))
  const [pointsForts, setPointsForts] = useState(initialData.points_forts || "")

  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError(null)

    try {
      const res = await fetch(`/api/biens/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titre: titre.trim(),
          type_bien: typeBien,
          adresse: adresse.trim(),
          prix: Number(prix),
          surface: Number(surface),
          pieces: Number(pieces),
          points_forts: pointsForts.trim() || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Une erreur est survenue")
        return
      }

      onSaved()
    } catch {
      setError("Impossible de sauvegarder les modifications")
    } finally {
      setIsSaving(false)
    }
  }

  const inputClass =
    "w-full h-12 px-4 rounded-lg border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-error-50 border border-error-200 p-3 text-body-sm text-error-700">
          {error}
        </div>
      )}

      {/* Titre */}
      <div>
        <label
          htmlFor="edit-titre"
          className="block text-caption font-medium text-neutral-600 mb-1"
        >
          Titre du bien
        </label>
        <input
          id="edit-titre"
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      {/* Type + Adresse */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="edit-type"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Type de bien
          </label>
          <select
            id="edit-type"
            value={typeBien}
            onChange={(e) => setTypeBien(e.target.value)}
            className={inputClass}
          >
            {BIEN_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="edit-adresse"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Adresse
          </label>
          <input
            id="edit-adresse"
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
            className={inputClass}
          />
        </div>
      </div>

      {/* Prix + Surface + Pièces */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="edit-prix"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Prix (€)
          </label>
          <input
            id="edit-prix"
            type="number"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            min="0"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="edit-surface"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Surface (m²)
          </label>
          <input
            id="edit-surface"
            type="number"
            value={surface}
            onChange={(e) => setSurface(e.target.value)}
            min="0"
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="edit-pieces"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Pièces
          </label>
          <input
            id="edit-pieces"
            type="number"
            value={pieces}
            onChange={(e) => setPieces(e.target.value)}
            min="0"
            className={inputClass}
          />
        </div>
      </div>

      {/* Points forts */}
      <div>
        <label
          htmlFor="edit-points-forts"
          className="block text-caption font-medium text-neutral-600 mb-1"
        >
          Points forts
        </label>
        <textarea
          id="edit-points-forts"
          value={pointsForts}
          onChange={(e) => setPointsForts(e.target.value)}
          rows={2}
          placeholder="Vue dégagée, parking, terrasse..."
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast resize-y"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="h-10 px-5 rounded-full border-2 border-neutral-300 text-body-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="h-10 px-6 rounded-full bg-secondary text-white font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60"
        >
          {isSaving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  )
}

"use client"

import { useState, useRef, useCallback } from "react"
import type { PropertyPhoto } from "@/types/property"

// ─── Types ────────────────────────────────────────────────────────

interface PhotoUploaderProps {
  propertyId: string
  initialPhotos: PropertyPhoto[]
  onPhotosChange?: (photos: PropertyPhoto[]) => void
}

interface UploadingPhoto {
  id: string
  file: File
  preview: string
  progress: number
  error: string | null
}

const MAX_PHOTOS = 10
const MAX_SIZE_BYTES = 5 * 1024 * 1024 // 5 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]

// ─── Helpers ──────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error("Erreur de lecture du fichier"))
    reader.readAsDataURL(file)
  })
}

// ─── Composant ────────────────────────────────────────────────────

export function PhotoUploader({
  propertyId,
  initialPhotos,
  onPhotosChange,
}: PhotoUploaderProps) {
  const [photos, setPhotos] = useState<PropertyPhoto[]>(initialPhotos)
  const [uploading, setUploading] = useState<UploadingPhoto[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const totalCount = photos.length + uploading.filter((u) => !u.error).length

  const updatePhotos = useCallback(
    (newPhotos: PropertyPhoto[]) => {
      setPhotos(newPhotos)
      onPhotosChange?.(newPhotos)
    },
    [onPhotosChange]
  )

  // ─── Upload d'un fichier ─────────────────────────────────────

  const uploadFile = useCallback(
    async (file: File, uploadId: string) => {
      // Convertir en base64
      let base64: string
      try {
        base64 = await fileToBase64(file)
      } catch {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, error: "Impossible de lire ce fichier" } : u
          )
        )
        return
      }

      // Simuler la progression
      setUploading((prev) =>
        prev.map((u) => (u.id === uploadId ? { ...u, progress: 30 } : u))
      )

      try {
        const res = await fetch(`/api/biens/${propertyId}/photos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photo: base64 }),
        })

        setUploading((prev) =>
          prev.map((u) => (u.id === uploadId ? { ...u, progress: 80 } : u))
        )

        if (!res.ok) {
          const data = await res.json().catch(() => ({ error: "Erreur inconnue" }))
          throw new Error(data.error || `Erreur ${res.status}`)
        }

        const { key, url } = await res.json()

        // Succès : ajouter aux photos et retirer des uploads
        const newPhoto: PropertyPhoto = {
          key,
          url,
          piece: "",
          ordre: photos.length + 1,
        }

        setUploading((prev) => prev.filter((u) => u.id !== uploadId))
        setPhotos((prev) => {
          const updated = [...prev, newPhoto]
          onPhotosChange?.(updated)
          return updated
        })
      } catch (err) {
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? {
                  ...u,
                  progress: 0,
                  error:
                    err instanceof Error
                      ? err.message
                      : "Erreur lors de l'upload",
                }
              : u
          )
        )
      }
    },
    [propertyId, photos.length, onPhotosChange]
  )

  // ─── Traiter les fichiers sélectionnés ───────────────────────

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      setGlobalError(null)
      const fileArray = Array.from(files)
      const remainingSlots = MAX_PHOTOS - totalCount

      if (remainingSlots <= 0) {
        setGlobalError("Maximum 10 photos par bien")
        return
      }

      if (fileArray.length > remainingSlots) {
        setGlobalError(
          `Tu ne peux ajouter que ${remainingSlots} photo${remainingSlots > 1 ? "s" : ""} supplémentaire${remainingSlots > 1 ? "s" : ""}`
        )
      }

      const filesToProcess = fileArray.slice(0, remainingSlots)
      const newUploads: UploadingPhoto[] = []

      for (const file of filesToProcess) {
        // Validation type
        if (!ALLOWED_TYPES.includes(file.type)) {
          newUploads.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: "",
            progress: 0,
            error: "Format non supporté. Utilise JPG, PNG, WebP ou HEIC.",
          })
          continue
        }

        // Validation taille
        if (file.size > MAX_SIZE_BYTES) {
          newUploads.push({
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            progress: 0,
            error: "Cette photo dépasse 5 Mo — réduis sa taille avant upload.",
          })
          continue
        }

        newUploads.push({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
          progress: 0,
          error: null,
        })
      }

      setUploading((prev) => [...prev, ...newUploads])

      // Lancer les uploads valides
      for (const upload of newUploads) {
        if (!upload.error) {
          uploadFile(upload.file, upload.id)
        }
      }
    },
    [totalCount, uploadFile]
  )

  // ─── Suppression ─────────────────────────────────────────────

  const handleDelete = useCallback(
    async (photo: PropertyPhoto) => {
      // Optimistic update
      const prevPhotos = photos
      updatePhotos(photos.filter((p) => p.key !== photo.key))

      try {
        const encodedKey = encodeURIComponent(photo.key)
        const res = await fetch(
          `/api/biens/${propertyId}/photos/${encodedKey}`,
          { method: "DELETE" }
        )

        if (!res.ok) {
          // Rollback
          updatePhotos(prevPhotos)
          setGlobalError("Impossible de supprimer cette photo. Réessaie.")
        }
      } catch {
        updatePhotos(prevPhotos)
        setGlobalError("Erreur réseau. Réessaie.")
      }
    },
    [photos, propertyId, updatePhotos]
  )

  const dismissUploadError = useCallback((uploadId: string) => {
    setUploading((prev) => prev.filter((u) => u.id !== uploadId))
  }, [])

  // ─── Drag & Drop ─────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files)
      }
    },
    [processFiles]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files)
        // Reset l'input pour permettre de re-sélectionner le même fichier
        e.target.value = ""
      }
    },
    [processFiles]
  )

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Erreur globale */}
      {globalError && (
        <div
          className="rounded-lg bg-error-50 border border-error-200 p-3 flex items-center justify-between"
          role="alert"
        >
          <p className="text-body-sm text-error-700">{globalError}</p>
          <button
            type="button"
            onClick={() => setGlobalError(null)}
            className="text-error-400 hover:text-error-600 ml-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Fermer le message d'erreur"
          >
            ×
          </button>
        </div>
      )}

      {/* Zone drag-and-drop */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Glisse tes photos ici ou clique pour sélectionner"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        className={`relative rounded-lg border-2 border-dashed p-8 text-center cursor-pointer transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
          dragOver
            ? "border-secondary bg-secondary-50"
            : "border-border hover:border-secondary/50 hover:bg-neutral-50"
        } ${totalCount >= MAX_PHOTOS ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="hidden"
          onChange={handleInputChange}
          disabled={totalCount >= MAX_PHOTOS}
          aria-hidden="true"
        />

        <div className="w-12 h-12 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-3">
          <svg
            className="w-6 h-6 text-secondary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
            />
          </svg>
        </div>

        <p className="text-body-sm font-semibold text-primary mb-1">
          Glisse tes photos ici ou clique pour sélectionner
        </p>
        <p className="text-caption text-neutral-500">
          JPG, PNG, WebP ou HEIC — max 5 Mo par photo — {photos.length}/{MAX_PHOTOS}{" "}
          photos
        </p>
      </div>

      {/* Photos uploadées */}
      {(photos.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-4 gap-3">
          {/* Photos existantes */}
          {photos.map((photo) => (
            <div
              key={photo.key}
              className="relative group rounded-lg overflow-hidden bg-neutral-100 aspect-[4/3]"
            >
              <img
                src={photo.url}
                alt={photo.piece || `Photo du bien`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay suppression */}
              <button
                type="button"
                onClick={() => handleDelete(photo)}
                className="absolute top-2 right-2 w-8 h-8 min-w-[44px] min-h-[44px] -mt-2 -mr-2 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-white transition-opacity duration-150 hover:bg-error/80"
                aria-label={`Supprimer la photo ${photo.piece || photo.ordre}`}
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              {/* Badge ordre */}
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/50 text-white text-caption font-medium">
                {photo.ordre}
              </span>
            </div>
          ))}

          {/* Photos en cours d'upload */}
          {uploading.map((upload) => (
            <div
              key={upload.id}
              className="relative rounded-lg overflow-hidden bg-neutral-100 aspect-[4/3]"
            >
              {upload.preview && (
                <img
                  src={upload.preview}
                  alt="Aperçu"
                  className={`w-full h-full object-cover ${upload.error ? "opacity-40" : "opacity-60"}`}
                />
              )}

              {/* Barre de progression */}
              {!upload.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30">
                  <div className="w-3/4 h-1.5 rounded-full bg-white/30 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-300"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  <p className="text-caption text-white mt-2 font-medium">
                    Upload...
                  </p>
                </div>
              )}

              {/* Erreur */}
              {upload.error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-error/10 p-2">
                  <p className="text-caption text-error-700 text-center font-medium mb-2">
                    {upload.error}
                  </p>
                  <button
                    type="button"
                    onClick={() => dismissUploadError(upload.id)}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-caption text-error-700 underline hover:text-error-900"
                  >
                    Fermer
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

"use client"

import { useState, useRef, useCallback } from "react"

// ---------- Types ----------

export interface ProfileData {
  prenom: string
  nom: string
  telephone: string
  ville: string
  quartiers: string
  departement: string
  reseau: string
  type_biens: string
  gamme_prix: string
  cible_clients: string
  ton_communication: string
  ce_qui_te_differencie: string
  valeurs: string
  linkedin_url: string
  instagram: string
  facebook: string
  site_web: string
  bio_personnelle: string
  photo_profil_key: string
  confort_camera: string
  experience_annees: string
  nb_transactions_an: string
}

interface ProfileFormProps {
  initialData: ProfileData
}

// ---------- Section config ----------

interface SectionConfig {
  id: string
  title: string
  icon: string
  fields: FieldDef[]
}

interface FieldDef {
  key: keyof ProfileData
  label: string
  type: "text" | "textarea" | "select" | "url"
  placeholder: string
  options?: { value: string; label: string }[]
  helper?: string
}

const SECTIONS: SectionConfig[] = [
  {
    id: "identite",
    title: "Ton identité",
    icon: "👤",
    fields: [
      { key: "prenom", label: "Prénom", type: "text", placeholder: "Sophie" },
      { key: "nom", label: "Nom", type: "text", placeholder: "Martin" },
      { key: "telephone", label: "Téléphone", type: "text", placeholder: "06 12 34 56 78" },
    ],
  },
  {
    id: "zone",
    title: "Ta zone",
    icon: "📍",
    fields: [
      { key: "ville", label: "Ville principale", type: "text", placeholder: "Angers" },
      { key: "quartiers", label: "Quartiers où tu travailles", type: "textarea", placeholder: "La Doutre, Centre-ville, Saint-Serge..." },
      { key: "departement", label: "Département", type: "text", placeholder: "49 - Maine-et-Loire" },
    ],
  },
  {
    id: "metier",
    title: "Ton métier",
    icon: "🏠",
    fields: [
      {
        key: "reseau",
        label: "Ton réseau",
        type: "select",
        placeholder: "",
        options: [
          { value: "", label: "Sélectionne ton réseau..." },
          { value: "IAD", label: "IAD" },
          { value: "SAFTI", label: "SAFTI" },
          { value: "MegAgence", label: "MegAgence" },
          { value: "Capifrance", label: "Capifrance" },
          { value: "Optimhome", label: "Optimhome" },
          { value: "BSK Immobilier", label: "BSK Immobilier" },
          { value: "Proprietes-privees", label: "Propriétés Privées" },
          { value: "Indépendant", label: "Indépendant" },
          { value: "Autre", label: "Autre" },
        ],
      },
      { key: "experience_annees", label: "Années d'expérience", type: "text", placeholder: "2" },
      { key: "nb_transactions_an", label: "Transactions par an", type: "text", placeholder: "5" },
      { key: "type_biens", label: "Types de biens", type: "text", placeholder: "Appartements, maisons, neuf, ancien..." },
      { key: "gamme_prix", label: "Gamme de prix", type: "text", placeholder: "100K - 300K EUR" },
      { key: "cible_clients", label: "Tes clients types", type: "text", placeholder: "Primo-accédants, familles, investisseurs..." },
    ],
  },
  {
    id: "communication",
    title: "Ton style",
    icon: "✍️",
    fields: [
      {
        key: "ton_communication",
        label: "Comment tu parles à tes clients",
        type: "textarea",
        placeholder: "Ex : Je suis directe mais bienveillante. Je tutoie mes clients.",
      },
      {
        key: "valeurs",
        label: "Tes 3 valeurs les plus importantes",
        type: "text",
        placeholder: "Transparence, disponibilité, honnêteté",
      },
      {
        key: "ce_qui_te_differencie",
        label: "Ce que tes clients disent de toi",
        type: "textarea",
        placeholder: "Ex : Je connais chaque rue de La Doutre, j'y vis depuis 10 ans.",
      },
      {
        key: "confort_camera",
        label: "Ton rapport à la vidéo",
        type: "select",
        placeholder: "",
        options: [
          { value: "", label: "Non renseigné" },
          { value: "debutant", label: "Je n'ai jamais fait de vidéo — ça me stresse" },
          { value: "a_laise", label: "J'ai déjà fait quelques vidéos, ça va" },
          { value: "expert", label: "Je suis à l'aise devant la caméra" },
        ],
      },
    ],
  },
  {
    id: "reseaux",
    title: "Tes réseaux sociaux",
    icon: "🔗",
    fields: [
      { key: "linkedin_url", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/sophie-martin" },
      { key: "instagram", label: "Instagram", type: "text", placeholder: "@sophie.immo" },
      { key: "facebook", label: "Page Facebook", type: "text", placeholder: "facebook.com/sophie.immo" },
      { key: "site_web", label: "Site web", type: "url", placeholder: "https://www.sophie-immo.fr" },
    ],
  },
  {
    id: "bio",
    title: "Ta bio",
    icon: "📝",
    fields: [
      {
        key: "bio_personnelle",
        label: "Ton parcours en quelques lignes",
        type: "textarea",
        placeholder: "Ex : Avant l'immobilier, j'étais dans la restauration. J'ai choisi ce métier parce que j'aime les gens et les belles maisons.",
        helper: "Cette bio nous aide à personnaliser tes textes avec ta vraie personnalité.",
      },
    ],
  },
]

// ---------- Status types ----------

type SectionStatus = "idle" | "loading" | "success" | "error"

// ---------- Component ----------

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [data, setData] = useState<ProfileData>({ ...initialData })
  const [sectionStatus, setSectionStatus] = useState<Record<string, SectionStatus>>({})
  const [sectionErrors, setSectionErrors] = useState<Record<string, string>>({})
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoUploading, setPhotoUploading] = useState(false)
  const timeoutRefs = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  // Dirty tracking : compare current data with initial for a given section
  const isSectionDirty = useCallback(
    (section: SectionConfig): boolean => {
      return section.fields.some((f) => data[f.key] !== initialData[f.key])
    },
    [data, initialData]
  )

  const updateField = (key: keyof ProfileData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  // Photo upload (reuse onboarding logic)
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setSectionErrors((prev) => ({ ...prev, identite: "La photo dépasse 5 Mo. Choisis une image plus légère." }))
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
    if (!allowedTypes.includes(file.type)) {
      setSectionErrors((prev) => ({ ...prev, identite: "Format non supporté. Utilise JPG, PNG, WebP ou HEIC." }))
      return
    }

    // Preview
    const reader = new FileReader()
    reader.onload = (event) => {
      setPhotoPreview(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload
    setPhotoUploading(true)
    setSectionErrors((prev) => ({ ...prev, identite: "" }))
    try {
      const base64Reader = new FileReader()
      const base64 = await new Promise<string>((resolve, reject) => {
        base64Reader.onload = (ev) => resolve(ev.target?.result as string)
        base64Reader.onerror = reject
        base64Reader.readAsDataURL(file)
      })

      const res = await fetch("/api/upload-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo: base64 }),
      })

      if (res.ok) {
        const result = await res.json()
        const newKey = result.key || ""
        setData((prev) => ({ ...prev, photo_profil_key: newKey }))

        // Auto-save la nouvelle clé photo
        await fetch("/api/profile", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ photo_profil_key: newKey }),
        })
        setSectionStatus((prev) => ({ ...prev, identite: "success" }))
        clearSuccessAfterDelay("identite")
      } else {
        setSectionErrors((prev) => ({ ...prev, identite: "Erreur lors de l'envoi de la photo. Réessaie." }))
      }
    } catch {
      setSectionErrors((prev) => ({ ...prev, identite: "Erreur réseau. Vérifie ta connexion." }))
    } finally {
      setPhotoUploading(false)
    }
  }

  const clearSuccessAfterDelay = (sectionId: string) => {
    if (timeoutRefs.current[sectionId]) {
      clearTimeout(timeoutRefs.current[sectionId])
    }
    timeoutRefs.current[sectionId] = setTimeout(() => {
      setSectionStatus((prev) => {
        if (prev[sectionId] === "success") return { ...prev, [sectionId]: "idle" }
        return prev
      })
    }, 3000)
  }

  const handleSaveSection = async (section: SectionConfig) => {
    // Validation locale
    const sectionData: Record<string, string> = {}
    for (const field of section.fields) {
      sectionData[field.key] = data[field.key]
    }

    // Champs obligatoires
    if (sectionData.prenom !== undefined && !sectionData.prenom.trim()) {
      setSectionErrors((prev) => ({ ...prev, [section.id]: "Le prénom est requis." }))
      return
    }
    if (sectionData.nom !== undefined && !sectionData.nom.trim()) {
      setSectionErrors((prev) => ({ ...prev, [section.id]: "Le nom est requis." }))
      return
    }
    if (sectionData.ville !== undefined && !sectionData.ville.trim()) {
      setSectionErrors((prev) => ({ ...prev, [section.id]: "La ville est requise." }))
      return
    }

    setSectionStatus((prev) => ({ ...prev, [section.id]: "loading" }))
    setSectionErrors((prev) => ({ ...prev, [section.id]: "" }))

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionData),
      })

      if (res.ok) {
        setSectionStatus((prev) => ({ ...prev, [section.id]: "success" }))
        // Update initialData reference by reloading — here we just mark success
        clearSuccessAfterDelay(section.id)
      } else {
        const errData = await res.json().catch(() => ({ error: "Erreur inconnue" }))
        setSectionErrors((prev) => ({
          ...prev,
          [section.id]: errData.error || "Erreur lors de la sauvegarde.",
        }))
        setSectionStatus((prev) => ({ ...prev, [section.id]: "error" }))
      }
    } catch {
      setSectionErrors((prev) => ({
        ...prev,
        [section.id]: "Erreur réseau. Vérifie ta connexion.",
      }))
      setSectionStatus((prev) => ({ ...prev, [section.id]: "error" }))
    }
  }

  const photoUrl = data.photo_profil_key
    ? `/api/images/${encodeURIComponent(data.photo_profil_key)}`
    : null

  return (
    <div className="space-y-6">
      {/* Photo section — part of identite but visually separate */}
      <div className="rounded-lg bg-card border border-border p-5">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            {photoPreview || photoUrl ? (
              <img
                src={photoPreview || photoUrl || ""}
                alt="Photo de profil"
                className="w-20 h-20 rounded-xl object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-secondary to-secondary-600 flex items-center justify-center">
                <span className="font-display text-h2 font-bold text-white">
                  {(data.prenom[0] || "").toUpperCase()}
                  {(data.nom[0] || "").toUpperCase()}
                </span>
              </div>
            )}
            {photoUploading && (
              <div className="absolute inset-0 rounded-xl bg-white/70 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div>
            <p className="text-body-sm font-semibold text-foreground mb-1">Ta photo de profil</p>
            <p className="text-caption text-neutral-500 mb-2">JPG, PNG ou WebP. 5 Mo max.</p>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-50 text-primary text-body-sm font-medium cursor-pointer hover:bg-primary-100 transition-colors focus-within:ring-2 focus-within:ring-secondary focus-within:ring-offset-2">
              <span>Changer la photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                onChange={handlePhotoChange}
                className="sr-only"
              />
            </label>
          </div>
        </div>
        {sectionErrors.identite && sectionStatus.identite !== "success" && (
          <p className="text-body-sm text-error-600" role="alert">{sectionErrors.identite}</p>
        )}
        {sectionStatus.identite === "success" && (
          <p className="text-body-sm text-success-600 font-medium" role="status">Enregistré !</p>
        )}
      </div>

      {/* Sections */}
      {SECTIONS.map((section) => {
        const status = sectionStatus[section.id] || "idle"
        const error = sectionErrors[section.id] || ""
        const dirty = isSectionDirty(section)
        const isLoading = status === "loading"

        return (
          <section
            key={section.id}
            className="rounded-lg bg-card border border-border p-5"
            aria-label={section.title}
          >
            <h2 className="font-display text-h4 text-primary font-bold mb-4 flex items-center gap-2">
              <span aria-hidden="true">{section.icon}</span>
              {section.title}
            </h2>

            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={`field-${field.key}`}
                    className="block text-body-sm font-medium text-foreground mb-1"
                  >
                    {field.label}
                  </label>
                  {field.helper && (
                    <p className="text-caption text-neutral-500 mb-1">{field.helper}</p>
                  )}

                  {field.type === "select" && field.options ? (
                    <select
                      id={`field-${field.key}`}
                      value={data[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 transition-colors min-h-[44px]"
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={`field-${field.key}`}
                      value={data[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      rows={3}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-body-sm text-foreground placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 transition-colors resize-y min-h-[44px]"
                    />
                  ) : (
                    <input
                      id={`field-${field.key}`}
                      type={field.type === "url" ? "url" : "text"}
                      value={data[field.key]}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full rounded-lg border border-border bg-background px-4 py-3 text-body-sm text-foreground placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 transition-colors h-[44px]"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Footer : save button + feedback */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSaveSection(section)}
                disabled={!dirty || isLoading}
                className="px-5 py-2.5 rounded-lg bg-secondary text-primary font-display font-bold text-body-sm hover:bg-secondary-600 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 min-h-[44px] min-w-[44px]"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Enregistrement...
                  </span>
                ) : (
                  "Enregistrer"
                )}
              </button>

              {status === "success" && (
                <span className="text-body-sm text-success-600 font-medium" role="status">
                  Enregistré !
                </span>
              )}
              {status === "error" && error && (
                <span className="text-body-sm text-error-600" role="alert">
                  {error}
                </span>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}

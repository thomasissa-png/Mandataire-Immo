"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

// ─── ActivatePageButton ────────────────────────────────────────────

interface ActivatePageButtonProps {
  pack: string | null
}

export function ActivatePageButton({ pack }: ActivatePageButtonProps) {
  const router = useRouter()
  const [state, setState] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const activePack = pack || "lancement"

  async function handleActivate() {
    setState("loading")
    setErrorMessage("")

    try {
      const res = await fetch("/api/agent/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pack: activePack }),
      })

      const data = await res.json() as { slug?: string; error?: string }

      if (!res.ok) {
        setState("error")
        setErrorMessage(data.error || "Une erreur est survenue.")
        return
      }

      // Succès — recharger la page pour afficher l'état "page existante"
      router.refresh()
    } catch {
      setState("error")
      setErrorMessage("Erreur de connexion. Réessaie dans quelques instants.")
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleActivate}
        disabled={state === "loading"}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-display font-bold text-body-sm hover:bg-primary-700 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {state === "loading" ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Activation en cours…
          </>
        ) : (
          "Activer ma page →"
        )}
      </button>
      {state === "error" && errorMessage && (
        <p className="mt-3 text-body-sm text-error-600">{errorMessage}</p>
      )}
    </div>
  )
}

// ─── IndexationToggle ──────────────────────────────────────────────

interface IndexationToggleProps {
  slug: string
  initialValue: boolean
}

export function IndexationToggle({ slug, initialValue }: IndexationToggleProps) {
  const [enabled, setEnabled] = useState(initialValue)
  const [saving, setSaving] = useState(false)

  async function handleToggle() {
    const newValue = !enabled
    setEnabled(newValue)
    setSaving(true)

    try {
      const res = await fetch(`/api/agent/${encodeURIComponent(slug)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indexation: newValue }),
      })

      if (!res.ok) {
        // Rollback en cas d'erreur
        setEnabled(!newValue)
      }
    } catch {
      // Rollback en cas d'erreur réseau
      setEnabled(!newValue)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-body-sm font-semibold text-primary">Indexation Google</p>
        <p className="text-caption text-neutral-500">
          {enabled
            ? "Activé — les prospects peuvent te trouver en cherchant ton nom sur Google."
            : "Désactivé — ta page est accessible uniquement via le lien direct que tu partages."}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label="Indexation Google"
        onClick={handleToggle}
        disabled={saving}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 disabled:opacity-60 ${
          enabled ? "bg-secondary" : "bg-neutral-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  )
}

"use client"

import { useState, type FormEvent, type ReactNode } from "react"

interface AdminGateProps {
  children: ReactNode
}

/**
 * Gate d'authentification admin par mot de passe simple.
 * Affiche un formulaire de mot de passe, vérifie via /api/admin/auth,
 * puis affiche le contenu admin après succès (reload pour que le cookie soit lu côté serveur).
 */
export default function AdminGate({ children }: AdminGateProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Erreur inconnue")
        setLoading(false)
        return
      }

      // Cookie posé — on reload pour que le serveur le lise
      window.location.reload()
    } catch {
      setError("Erreur réseau")
      setLoading(false)
    }
  }

  // Si children est rendu, c'est que le serveur a vérifié le cookie.
  // Ce composant n'est montré QUE quand isAuthenticated === false (voir layout).
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-card border border-border rounded-xl p-8 w-full max-w-sm shadow-md"
      >
        <h1 className="font-display text-h2 text-primary mb-2 text-center">
          Admin ImmoCrew
        </h1>
        <p className="text-body-sm text-neutral-500 mb-6 text-center">
          Entre le mot de passe pour accéder au panneau admin.
        </p>

        {error && (
          <div className="bg-error-50 text-error-700 text-body-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <label
          htmlFor="admin-password"
          className="block text-body-sm font-semibold text-foreground mb-1"
        >
          Mot de passe
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent mb-4"
          autoFocus
          required
        />

        <button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-primary text-white font-semibold py-2.5 rounded-full hover:bg-primary-600 transition-colors duration-normal disabled:opacity-50"
        >
          {loading ? "Vérification..." : "Accéder"}
        </button>
      </form>
    </div>
  )
}

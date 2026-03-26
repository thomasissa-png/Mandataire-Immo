"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function SignUpPage() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres.")
      setIsLoading(false)
      return
    }

    try {
      // 1. Creer le compte via l'API
      const res = await fetch("/api/auth/sign-up", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.toLowerCase().trim(),
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Erreur lors de la creation du compte.")
        setIsLoading(false)
        return
      }

      // 2. Connecter automatiquement apres inscription
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        callbackUrl: "/onboarding",
        redirect: false,
      })

      if (result?.error) {
        // Compte cree mais login echoue — rediriger vers sign-in
        window.location.href = "/sign-in"
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch {
      setError("Une erreur est survenue. Reessaie dans quelques instants.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <a href="/" className="font-display text-display-lg font-bold text-primary">
            ImmoCrew
          </a>
          <p className="text-body text-neutral-500 mt-2">
            Cree ton espace en 30 secondes
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-card border border-border p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-caption font-medium text-neutral-600 mb-1"
                >
                  Prenom
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Sophie"
                  className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-caption font-medium text-neutral-600 mb-1"
                >
                  Nom
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Martin"
                  className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-caption font-medium text-neutral-600 mb-1"
              >
                Adresse email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sophie@exemple.fr"
                className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
              />
              <p className="text-caption text-neutral-400 mt-1">
                Utilise la meme adresse que pour ton paiement
              </p>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-caption font-medium text-neutral-600 mb-1"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8 caracteres minimum"
                className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-body-sm text-error" role="alert">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-full bg-secondary text-primary font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
            >
              {isLoading ? "Creation du compte..." : "Creer mon compte"}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-body-sm text-neutral-500">
              Tu as deja un compte ?{" "}
              <a
                href="/sign-in"
                className="text-secondary font-semibold hover:underline"
              >
                Se connecter
              </a>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-body-sm text-neutral-400 hover:text-neutral-600 transition-colors duration-normal"
          >
            Retour au site
          </a>
        </div>
      </div>
    </div>
  )
}

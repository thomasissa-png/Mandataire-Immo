"use client"

import { Suspense, useState } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

function SignInForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const errorParam = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(
    errorParam === "CredentialsSignin"
      ? "Email ou mot de passe incorrect."
      : ""
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await signIn("credentials", {
      email: email.toLowerCase().trim(),
      password,
      callbackUrl,
      redirect: false,
    })

    if (result?.error) {
      setError("Email ou mot de passe incorrect.")
      setIsLoading(false)
    } else if (result?.url) {
      window.location.href = result.url
    }
  }

  return (
    <div className="rounded-2xl bg-card border border-border p-8 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-caption font-medium text-neutral-600 mb-1">
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
        </div>
        <div>
          <label htmlFor="password" className="block text-caption font-medium text-neutral-600 mb-1">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
          />
        </div>
        {error && (
          <p className="text-body-sm text-error" role="alert">{error}</p>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-full bg-secondary text-primary font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:text-white hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-body-sm text-neutral-500">
          Pas encore de compte ?{" "}
          <a href="/sign-up" className="text-secondary font-semibold hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="font-display text-display-lg font-bold text-primary hover:opacity-80 transition-opacity">
            ImmoCrew
          </a>
          <p className="text-body text-neutral-500 mt-2">
            Connecte-toi à ton espace
          </p>
        </div>
        <Suspense fallback={<div className="rounded-2xl bg-card border border-border p-8 shadow-sm animate-pulse h-80" />}>
          <SignInForm />
        </Suspense>
        <div className="text-center mt-6">
          <a href="/" className="text-body-sm text-neutral-400 hover:text-neutral-600 transition-colors duration-normal">
            ← Retour au site
          </a>
        </div>
      </div>
    </div>
  )
}

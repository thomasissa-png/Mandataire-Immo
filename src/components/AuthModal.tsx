"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"

type AuthMode = "sign-in" | "sign-up" | "forgot-password" | "reset-password"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: AuthMode
}

// ---------------------------------------------------------------------------
// Focus-trap helper
// ---------------------------------------------------------------------------
function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  )
  return Array.from(elements)
}

// ---------------------------------------------------------------------------
// Sign-In form
// ---------------------------------------------------------------------------
function SignInForm({
  onSwitchMode,
  onForgotPassword,
  callbackUrl,
}: {
  onSwitchMode: () => void
  onForgotPassword: () => void
  callbackUrl: string
}) {
  const searchParams = useSearchParams()
  const errorParam = searchParams.get("error")

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(
    errorParam === "CredentialsSignin" ? "Email ou mot de passe incorrect." : ""
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
    <>
      <div className="text-center mb-6">
        <span className="font-display text-display-lg font-bold text-primary">
          ImmoCrew
        </span>
        <p className="text-body text-neutral-500 mt-2">
          Connecte-toi à ton espace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="modal-signin-email"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Adresse email
          </label>
          <input
            id="modal-signin-email"
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
          <label
            htmlFor="modal-signin-password"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Mot de passe
          </label>
          <input
            id="modal-signin-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
          />
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-caption text-secondary hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>
        </div>

        {error && (
          <p className="text-body-sm text-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-body-sm text-neutral-500">
          Pas encore de compte ?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-secondary font-semibold hover:underline"
          >
            Créer un compte
          </button>
        </p>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Sign-Up form
// ---------------------------------------------------------------------------
function SignUpForm({ onSwitchMode }: { onSwitchMode: () => void }) {
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
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      setIsLoading(false)
      return
    }

    try {
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
        setError(data.error || "Erreur lors de la création du compte.")
        setIsLoading(false)
        return
      }

      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        callbackUrl: "/onboarding",
        redirect: false,
      })

      if (result?.error) {
        window.location.href = "/sign-in"
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch {
      setError("Une erreur est survenue. Réessaie dans quelques instants.")
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="text-center mb-6">
        <span className="font-display text-display-lg font-bold text-primary">
          ImmoCrew
        </span>
        <p className="text-body text-neutral-500 mt-2">
          Crée ton espace en 30 secondes
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
          <div>
            <label
              htmlFor="modal-signup-firstname"
              className="block text-caption font-medium text-neutral-600 mb-1"
            >
              Prénom
            </label>
            <input
              id="modal-signup-firstname"
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
              htmlFor="modal-signup-lastname"
              className="block text-caption font-medium text-neutral-600 mb-1"
            >
              Nom
            </label>
            <input
              id="modal-signup-lastname"
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

        <div>
          <label
            htmlFor="modal-signup-email"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Adresse email
          </label>
          <input
            id="modal-signup-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sophie@exemple.fr"
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
          />
          <p className="text-caption text-neutral-500 mt-1">
            Tu utiliseras cette adresse pour te connecter
          </p>
        </div>

        <div>
          <label
            htmlFor="modal-signup-password"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Mot de passe
          </label>
          <input
            id="modal-signup-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
          />
        </div>

        {error && (
          <p className="text-body-sm text-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          {isLoading ? "Création du compte..." : "Créer mon compte"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <p className="text-body-sm text-neutral-500">
          Tu as déjà un compte ?{" "}
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-secondary font-semibold hover:underline"
          >
            Se connecter
          </button>
        </p>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Forgot Password form (request reset)
// ---------------------------------------------------------------------------
function ForgotPasswordForm({
  onSwitchMode,
}: {
  onSwitchMode: () => void
}) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.")
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch {
      setError("Une erreur est survenue. Réessaie dans quelques instants.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <div className="text-center mb-6">
          <span className="font-display text-display-lg font-bold text-primary">
            ImmoCrew
          </span>
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-body text-green-800 font-medium">
              C&apos;est envoyé !
            </p>
            <p className="text-body-sm text-green-700 mt-1">
              Si un compte existe avec cette adresse, tu recevras un lien pour
              réinitialiser ton mot de passe. Pense à vérifier tes spams.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <button
            type="button"
            onClick={onSwitchMode}
            className="text-body-sm text-secondary font-semibold hover:underline"
          >
            Retour à la connexion
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="text-center mb-6">
        <span className="font-display text-display-lg font-bold text-primary">
          ImmoCrew
        </span>
        <p className="text-body text-neutral-500 mt-2">
          Pas de panique, ça arrive à tout le monde
        </p>
        <p className="text-body-sm text-neutral-400 mt-1">
          Entre ton adresse email et on t&apos;envoie un lien pour choisir un nouveau mot de passe.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="modal-forgot-email"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Adresse email
          </label>
          <input
            id="modal-forgot-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sophie@exemple.fr"
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
          />
        </div>

        {error && (
          <p className="text-body-sm text-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          {isLoading ? "Envoi en cours..." : "Envoyer le lien"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <button
          type="button"
          onClick={onSwitchMode}
          className="text-body-sm text-secondary font-semibold hover:underline"
        >
          Retour à la connexion
        </button>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// Reset Password form (set new password via token)
// ---------------------------------------------------------------------------
function ResetPasswordForm({
  token,
  onSwitchMode,
}: {
  token: string
  onSwitchMode: () => void
}) {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.")
      setIsLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue.")
        setIsLoading(false)
        return
      }

      setSuccess(true)
    } catch {
      setError("Une erreur est survenue. Réessaie dans quelques instants.")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <>
        <div className="text-center mb-6">
          <span className="font-display text-display-lg font-bold text-primary">
            ImmoCrew
          </span>
          <div className="mt-4 p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-body text-green-800 font-medium">
              Mot de passe réinitialisé !
            </p>
            <p className="text-body-sm text-green-700 mt-1">
              Tu peux maintenant te connecter avec ton nouveau mot de passe.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onSwitchMode}
          className="w-full h-12 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          Se connecter
        </button>
      </>
    )
  }

  return (
    <>
      <div className="text-center mb-6">
        <span className="font-display text-display-lg font-bold text-primary">
          ImmoCrew
        </span>
        <p className="text-body text-neutral-500 mt-2">
          Choisis ton nouveau mot de passe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="modal-reset-password"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Nouveau mot de passe
          </label>
          <input
            id="modal-reset-password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
          />
        </div>

        <div>
          <label
            htmlFor="modal-reset-confirm"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Confirmer le mot de passe
          </label>
          <input
            id="modal-reset-confirm"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Retape ton mot de passe"
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus:border-secondary focus:shadow-inner focus:outline-none transition-all duration-fast"
          />
        </div>

        {error && (
          <p className="text-body-sm text-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        >
          {isLoading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-border text-center">
        <button
          type="button"
          onClick={onSwitchMode}
          className="text-body-sm text-secondary font-semibold hover:underline"
        >
          Retour à la connexion
        </button>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// AuthModal
// ---------------------------------------------------------------------------
export function AuthModal({ isOpen, onClose, defaultMode = "sign-in" }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode)
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Sync defaultMode when prop changes (e.g. opening from different trigger)
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode)
    }
  }, [isOpen, defaultMode])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Focus management: save previous focus, restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      // Small delay to let the modal render before focusing
      const timer = setTimeout(() => {
        if (modalRef.current) {
          const firstFocusable = getFocusableElements(modalRef.current)[0]
          firstFocusable?.focus()
        }
      }, 50)
      return () => clearTimeout(timer)
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus()
      previousFocusRef.current = null
    }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return

      const focusable = getFocusableElements(modalRef.current)
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    []
  )

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"
  const resetToken = searchParams.get("token")

  // Si un token de reset est present dans l'URL, forcer le mode reset-password
  useEffect(() => {
    if (isOpen && resetToken) {
      setMode("reset-password")
    }
  }, [isOpen, resetToken])

  if (!isOpen) return null

  const ariaLabels: Record<AuthMode, string> = {
    "sign-in": "Connexion",
    "sign-up": "Créer un compte",
    "forgot-password": "Mot de passe oublié",
    "reset-password": "Nouveau mot de passe",
  }
  const ariaLabel = ariaLabels[mode]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal card */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-md rounded-xl bg-card border border-border p-8 shadow-xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 flex items-center justify-center w-11 h-11 rounded-lg text-neutral-400 hover:text-foreground hover:bg-neutral-100 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          aria-label="Fermer"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Forms */}
        {mode === "sign-in" && (
          <SignInForm
            onSwitchMode={() => setMode("sign-up")}
            onForgotPassword={() => setMode("forgot-password")}
            callbackUrl={callbackUrl}
          />
        )}
        {mode === "sign-up" && (
          <SignUpForm onSwitchMode={() => setMode("sign-in")} />
        )}
        {mode === "forgot-password" && (
          <ForgotPasswordForm onSwitchMode={() => setMode("sign-in")} />
        )}
        {mode === "reset-password" && resetToken && (
          <ResetPasswordForm
            token={resetToken}
            onSwitchMode={() => setMode("sign-in")}
          />
        )}
      </div>
    </div>
  )
}

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
// Eye toggle button for password fields
// ---------------------------------------------------------------------------
function EyeToggleButton({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 text-neutral-400 hover:text-neutral-600 transition-colors"
      aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
    >
      {show ? (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Password strength indicator (sign-up only)
// ---------------------------------------------------------------------------
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null

  const isLongEnough = password.length >= 8

  return (
    <p
      className={`text-caption mt-1.5 flex items-center gap-1 ${
        isLongEnough ? "text-success-600" : "text-error-600"
      }`}
      aria-live="polite"
    >
      {isLongEnough ? (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {isLongEnough ? "8 caractères minimum — OK" : `${password.length}/8 caractères minimum`}
    </p>
  )
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
  const [showPassword, setShowPassword] = useState(false)
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
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
          />
        </div>
        <div>
          <label
            htmlFor="modal-signin-password"
            className="block text-caption font-medium text-neutral-600 mb-1"
          >
            Mot de passe
          </label>
          <div className="relative">
            <input
              id="modal-signin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full h-12 px-4 pr-12 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
            />
            <EyeToggleButton show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
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
  const [showPassword, setShowPassword] = useState(false)
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
              className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
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
              className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
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
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
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
          <div className="relative">
            <input
              id="modal-signup-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full h-12 px-4 pr-12 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
            />
            <EyeToggleButton show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
          </div>
          <PasswordStrength password={password} />
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
              C{"'"}est envoyé !
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
          Entre ton adresse email et on t{"'"}envoie un lien pour choisir un nouveau mot de passe.
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
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
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
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
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
            className="w-full h-12 px-4 rounded-md border border-neutral-300 bg-white text-body text-foreground placeholder:text-neutral-400 shadow-xs focus-visible:border-secondary focus-visible:shadow-inner focus-visible:outline-none transition-all duration-fast"
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

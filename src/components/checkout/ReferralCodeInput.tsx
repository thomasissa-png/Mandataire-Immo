"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { track } from "@/lib/tracking"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ValidateResponse {
  valid: boolean
  referrer_first_name?: string
  discount_label?: string
  error?: string
}

type ValidationState = "idle" | "loading" | "valid" | "invalid"

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LOCALSTORAGE_KEY = "immocrew_referral_code"

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ReferralCodeInputProps {
  /** Called when validation state changes — parent can read the validated code */
  onValidated?: (code: string | null) => void
  /** Visual variant — "dark" adapts text colors for dark backgrounds */
  variant?: "light" | "dark"
}

export function ReferralCodeInput({ onValidated, variant = "light" }: ReferralCodeInputProps) {
  const isDark = variant === "dark"
  const [code, setCode] = useState("")
  const [validationState, setValidationState] = useState<ValidationState>("idle")
  const [message, setMessage] = useState("")
  const [referrerName, setReferrerName] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Read ?ref= from URL or localStorage on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const refFromUrl = params.get("ref")
    const refFromStorage = localStorage.getItem(LOCALSTORAGE_KEY)

    const prefilled = refFromUrl || refFromStorage || ""
    if (prefilled) {
      setCode(prefilled.toUpperCase())
      // Persist to localStorage for survival across Stripe redirect
      if (refFromUrl) {
        localStorage.setItem(LOCALSTORAGE_KEY, refFromUrl.toUpperCase())
      }
      // Auto-validate
      validateCode(prefilled.toUpperCase())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validateCode = useCallback(async (codeToValidate: string) => {
    const trimmed = codeToValidate.trim().toUpperCase()

    if (!trimmed) {
      setValidationState("idle")
      setMessage("")
      setReferrerName("")
      onValidated?.(null)
      return
    }

    // Abort previous request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setValidationState("loading")
    setMessage("Vérification...")

    try {
      const res = await fetch("/api/referral/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: trimmed }),
        signal: controller.signal,
      })

      const data: ValidateResponse = await res.json()

      if (controller.signal.aborted) return

      if (data.valid) {
        setValidationState("valid")
        setReferrerName(data.referrer_first_name || "")
        setMessage(data.discount_label || "Code valide — 1 semaine offerte sur ton abonnement")
        localStorage.setItem(LOCALSTORAGE_KEY, trimmed)
        onValidated?.(trimmed)
        track("referral_code_validated", {
          code: trimmed,
        })
      } else {
        setValidationState("invalid")
        setReferrerName("")
        setMessage("Code invalide. Vérifie avec ton parrain.")
        localStorage.removeItem(LOCALSTORAGE_KEY)
        onValidated?.(null)
        track("referral_code_invalid", {
          code_prefix: trimmed.slice(0, 8),
        })
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return
      setValidationState("invalid")
      setMessage("Erreur de vérification. Réessaie.")
      onValidated?.(null)
    }
  }, [onValidated])

  const handleBlur = useCallback(() => {
    if (code.trim() && validationState === "idle") {
      validateCode(code)
    }
  }, [code, validationState, validateCode])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    setCode(value)
    // Reset validation when user changes input
    if (validationState !== "idle") {
      setValidationState("idle")
      setMessage("")
      setReferrerName("")
      onValidated?.(null)
    }
  }, [validationState, onValidated])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      validateCode(code)
    }
  }, [code, validateCode])

  const handleClear = useCallback(() => {
    setCode("")
    setValidationState("idle")
    setMessage("")
    setReferrerName("")
    localStorage.removeItem(LOCALSTORAGE_KEY)
    onValidated?.(null)
    inputRef.current?.focus()
  }, [onValidated])

  // Border color based on validation state
  const borderClass = {
    idle: "border-neutral-200 focus-within:border-primary",
    loading: "border-primary-300",
    valid: "border-success-500 ring-1 ring-success-200",
    invalid: "border-error-500 ring-1 ring-error-200",
  }[validationState]

  return (
    <div className="space-y-1.5">
      <label htmlFor="referral-code" className={`text-body-sm font-medium ${isDark ? "text-primary-100" : "text-neutral-700"}`}>
        Code parrainage <span className={isDark ? "text-primary-300 font-normal" : "text-neutral-400 font-normal"}>(optionnel)</span>
      </label>

      <div className={`flex items-center rounded-lg border bg-white transition-colors ${borderClass}`}>
        <input
          ref={inputRef}
          id="referral-code"
          type="text"
          value={code}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder="IMMOCREW-..."
          autoComplete="off"
          spellCheck={false}
          className="flex-1 px-3 py-2.5 text-body-sm text-neutral-800 placeholder-neutral-300 bg-transparent border-none outline-none font-mono tracking-wide"
          aria-describedby="referral-feedback"
        />

        {/* Loading spinner */}
        {validationState === "loading" && (
          <div className="px-3" aria-hidden="true">
            <svg className="w-4 h-4 animate-spin text-primary" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}

        {/* Valid checkmark */}
        {validationState === "valid" && (
          <div className="px-3">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Invalid X */}
        {validationState === "invalid" && (
          <div className="px-3">
            <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        {/* Clear button when code is entered */}
        {code && validationState !== "loading" && (
          <button
            type="button"
            onClick={handleClear}
            className="px-2 text-neutral-400 hover:text-neutral-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-1 rounded"
            aria-label="Effacer le code parrainage"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Feedback message */}
      {message && (
        <p
          id="referral-feedback"
          role="status"
          aria-live="polite"
          className={`text-caption font-medium ${
            validationState === "valid"
              ? isDark ? "text-success-300" : "text-success-700"
              : validationState === "invalid"
                ? isDark ? "text-error-300" : "text-error-600"
                : isDark ? "text-primary-200" : "text-neutral-500"
          }`}
        >
          {validationState === "valid" && referrerName
            ? `Code de ${referrerName} — 1 semaine offerte sur ton abonnement`
            : message}
        </p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Utility: read referral code from localStorage (for checkout API route)
// ---------------------------------------------------------------------------

/**
 * Returns the validated referral code from localStorage.
 * Call this before redirecting to Stripe checkout to include in metadata.
 */
export function getStoredReferralCode(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(LOCALSTORAGE_KEY)
}

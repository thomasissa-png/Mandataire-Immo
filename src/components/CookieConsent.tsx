"use client"

import { useState, useEffect, useRef } from "react"
import posthog from "posthog-js"

const CONSENT_KEY = "immocrew_cookie_consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const acceptRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setVisible(true)
      // Focus the accept button when banner appears
      setTimeout(() => acceptRef.current?.focus(), 100)
      // Opt out by default until consent is given
      if (posthog.__loaded) {
        posthog.opt_out_capturing()
      }
    }
  }, [])

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted")
    if (posthog.__loaded) {
      posthog.opt_in_capturing()
    }
    setVisible(false)
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined")
    if (posthog.__loaded) {
      posthog.opt_out_capturing()
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Consentement cookies"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-border shadow-lg"
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <p className="text-body-sm text-neutral-600">
          On utilise des cookies pour comprendre comment tu utilises le site et
          l&apos;am&eacute;liorer.{" "}
          <a
            href="/confidentialite"
            className="text-primary underline hover:text-secondary"
          >
            Politique de confidentialit&eacute;
          </a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-body-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            Refuser
          </button>
          <button
            ref={acceptRef}
            onClick={accept}
            className="px-6 py-2 rounded-full bg-primary text-white text-body-sm font-semibold hover:bg-primary-600 transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}

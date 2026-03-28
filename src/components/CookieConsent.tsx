"use client"

import { useState, useEffect, useRef } from "react"

const CONSENT_KEY = "immocrew_cookie_consent"

export function CookieConsent() {
  const [visible, setVisible] = useState(false)
  const [show, setShow] = useState(false)
  const acceptRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setVisible(true)
      // Slide in after mount
      setTimeout(() => {
        setShow(true)
        acceptRef.current?.focus()
      }, 100)
    }
  }, [])

  function dismiss(accepted: boolean) {
    localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined")
    // Umami respects DNT and consent natively via its script configuration.
    // If the user declines, we could disable Umami by removing the script,
    // but Umami Cloud is privacy-focused and does not use cookies by default.
    setShow(false)
    // Remove from DOM after animation
    setTimeout(() => setVisible(false), 300)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Consentement cookies"
      className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-border shadow-lg transition-transform duration-300 ${show ? "translate-y-0" : "translate-y-full"}`}
    >
      <div className="max-w-4xl mx-auto flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <p className="text-body-sm text-neutral-600">
          On utilise des cookies pour comprendre comment tu utilises le site et
          l&apos;am&eacute;liorer.{" "}
          <a
            href="/confidentialite"
            className="text-primary underline hover:text-secondary-700 transition-colors"
          >
            Politique de confidentialit&eacute;
          </a>
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => dismiss(false)}
            className="px-4 py-2 min-h-[44px] rounded-md text-body-sm text-neutral-500 hover:text-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            Refuser
          </button>
          <button
            ref={acceptRef}
            onClick={() => dismiss(true)}
            className="px-6 py-2 min-h-[44px] rounded-full bg-primary text-white text-body-sm font-semibold hover:bg-primary-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}

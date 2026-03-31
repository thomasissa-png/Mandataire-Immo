"use client"

import { useState, useEffect } from "react"

const LOCALSTORAGE_KEY = "immocrew_referral_code"

/**
 * Reads the referral code from URL (?ref=) or localStorage.
 * Persists to localStorage on first read from URL.
 * Returns the code or null.
 */
export function useReferralCode(): string | null {
  const [code, setCode] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const refFromUrl = params.get("ref")
    const refFromStorage = localStorage.getItem(LOCALSTORAGE_KEY)

    const resolved = refFromUrl || refFromStorage || null

    if (resolved) {
      const normalized = resolved.toUpperCase()
      setCode(normalized)
      // Always persist so it survives Stripe redirect
      localStorage.setItem(LOCALSTORAGE_KEY, normalized)
    }
  }, [])

  return code
}

/**
 * Appends ?ref=CODE to a checkout href if a referral code is available.
 */
export function appendReferralToHref(href: string, referralCode: string | null): string {
  if (!referralCode) return href
  const separator = href.includes("?") ? "&" : "?"
  return `${href}${separator}ref=${encodeURIComponent(referralCode)}`
}

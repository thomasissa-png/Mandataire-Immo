"use client"

import posthog from "posthog-js"
import { PostHogProvider as PHProvider } from "posthog-js/react"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NEXT_PUBLIC_POSTHOG_KEY &&
      process.env.NEXT_PUBLIC_POSTHOG_HOST
    ) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
        persistence: "localStorage+cookie",
      })
    }
  }, [])

  // Identify user and track login
  useEffect(() => {
    if (status === "authenticated" && session?.user && posthog.__loaded) {
      const email = session.user.email
      posthog.identify(email || undefined, {
        email,
        name: session.user.name,
      })
      posthog.capture("login", { method: "credentials" })
    }
  }, [status, session])

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>
  }

  return <PHProvider client={posthog}>{children}</PHProvider>
}

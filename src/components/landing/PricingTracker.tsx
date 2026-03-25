"use client"

import { useEffect, useRef } from "react"
import { track } from "@/lib/tracking"

export function PricingTracker() {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return

    const section = document.getElementById("pricing")
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !tracked.current) {
          tracked.current = true
          track("pricing_view")
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return null
}

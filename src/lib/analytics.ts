/**
 * Lightweight analytics helper for Umami Cloud.
 * Use `track` / `trackServer` from `@/lib/tracking` for typed events.
 * This file provides a generic `trackEvent` for ad-hoc tracking.
 */
export function trackEvent(name: string, data?: Record<string, string | number>) {
  if (typeof window !== "undefined" && (window as Record<string, unknown>).umami) {
    const umami = (window as Record<string, unknown>).umami as {
      track: (event: string, data?: Record<string, string | number>) => void
    }
    umami.track(name, data)
  }
}

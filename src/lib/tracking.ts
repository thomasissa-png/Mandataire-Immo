import posthog from "posthog-js"

type TrackingEvent =
  | "cta_click"
  | "pricing_view"
  | "lead_form_submit"
  | "onboarding_start"
  | "onboarding_step_complete"
  | "onboarding_step_abandon"
  | "onboarding_complete"
  | "checkout_start"
  | "payment_success"
  | "payment_failed"
  | "subscription_cancel"
  | "login"
  | "deliverable_view"
  | "deliverable_download"
  | "production_started"
  | "production_completed"
  | "admin_trigger_production"
  | "deliverable_generated"
  | "monthly_update_started"
  | "monthly_update_completed"

interface TrackingProperties {
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Track a PostHog event (client-side only).
 * Safe to call server-side — it will no-op.
 */
export function track(event: TrackingEvent, properties?: TrackingProperties) {
  if (typeof window !== "undefined" && posthog.__loaded) {
    posthog.capture(event, properties)
  }
}

/**
 * Track a server-side PostHog event via API.
 * Used in API routes (webhooks, checkout).
 */
export async function trackServer(
  event: TrackingEvent,
  distinctId: string,
  properties?: TrackingProperties
) {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

  if (!apiKey || !host) return

  try {
    await fetch(`${host}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        event,
        distinct_id: distinctId,
        properties: {
          ...properties,
          $lib: "server",
        },
      }),
    })
  } catch {
    console.error(`PostHog server tracking failed for event: ${event}`)
  }
}

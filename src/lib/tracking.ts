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
  | "home_staging_started"
  | "home_staging_completed"
  | "subscription_upgrade"
  | "deliverable_feedback"
  | "deliverable_rewrite"
  | "deliverable_share"
  | "referral_code_copied"
  | "referral_code_validated"
  | "referral_code_invalid"
  | "referral_converted"
  | "referral_credit_applied"

interface TrackingProperties {
  [key: string]: string | number | boolean | null | undefined
}

/**
 * Track an Umami event (client-side only).
 * Safe to call server-side — it will no-op.
 */
export function track(event: TrackingEvent, properties?: TrackingProperties) {
  if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).umami) {
    const umami = (window as unknown as Record<string, unknown>).umami as {
      track: (event: string, data?: Record<string, string | number | boolean | null | undefined>) => void
    }
    umami.track(event, properties)
  }
}

/**
 * Track a server-side event via Umami API.
 * Used in API routes (webhooks, checkout).
 *
 * Umami Cloud does not require a server-side API key for event collection.
 * Server-side events are sent via the Umami collect endpoint.
 */
export async function trackServer(
  event: TrackingEvent,
  distinctId: string,
  properties?: TrackingProperties
) {
  const websiteId = "533b1471-2f40-41dd-8754-02fa0f0615f8"

  try {
    await fetch("https://cloud.umami.is/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "event",
        payload: {
          website: websiteId,
          name: event,
          data: {
            ...properties,
            distinct_id: distinctId,
          },
          url: "/api",
          hostname: "immocrew.fr",
          language: "fr",
        },
      }),
    })
  } catch {
    console.error(`Umami server tracking failed for event: ${event}`)
  }
}

import { NextRequest, NextResponse } from "next/server"
import { stripe, STRIPE_PRICES, type StripePriceKey } from "@/lib/stripe"
import { trackServer } from "@/lib/tracking"
import { getPackPrice } from "@/lib/pricing"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const pack = searchParams.get("pack") as StripePriceKey | null

  if (!pack || !(pack in STRIPE_PRICES)) {
    return NextResponse.json(
      { error: "Invalid pack. Must be one of: mensuel, mensuel-trimestriel, lancement, boost" },
      { status: 400 }
    )
  }

  const priceId = STRIPE_PRICES[pack]
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://immocrew.fr"

  // Determine payment mode based on pack type
  const isSubscription = pack === "mensuel" || pack === "mensuel-trimestriel"

  try {
    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? "subscription" : "payment",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/onboarding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/#pricing`,
      metadata: {
        pack,
        ...(pack === "mensuel-trimestriel" && { engagement_months: "3" }),
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_creation: isSubscription ? undefined : "always",
      locale: "fr",
    })

    await trackServer("checkout_start", session.customer_email || session.id, {
      pack,
      price: getPackPrice(pack),
      currency: "eur",
      source_page: "pricing",
      stripe_session_id: session.id,
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      )
    }

    return NextResponse.redirect(session.url)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("Stripe checkout error:", message)
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    )
  }
}

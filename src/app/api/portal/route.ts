import { NextResponse } from "next/server"
import { currentUser } from "@clerk/nextjs/server"
import { stripe } from "@/lib/stripe"
import { query } from "@/lib/db"

interface ClientRow {
  stripe_customer_id: string | null
}

/**
 * GET /api/portal
 * Cree une session Stripe Customer Portal et redirige le client.
 * Protege par Clerk — le client doit etre authentifie.
 */
export async function GET() {
  const user = await currentUser()

  if (!user) {
    return NextResponse.redirect(
      new URL("/sign-in", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    )
  }

  const primaryEmail = user.emailAddresses[0]?.emailAddress
  if (!primaryEmail) {
    return NextResponse.redirect(
      new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    )
  }

  // Fetch Stripe customer ID from our DB
  const { rows } = await query<ClientRow>(
    "SELECT stripe_customer_id FROM clients WHERE email = $1 LIMIT 1",
    [primaryEmail]
  )

  const stripeCustomerId = rows[0]?.stripe_customer_id
  if (!stripeCustomerId) {
    // Pas de client Stripe — redirect vers dashboard
    return NextResponse.redirect(
      new URL("/dashboard", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
    )
  }

  // Creer la session Customer Portal
  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
  })

  return NextResponse.redirect(portalSession.url)
}

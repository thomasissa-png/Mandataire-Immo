import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { createAdminSupabaseClient } from "@/lib/supabase"

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error(`Stripe webhook signature verification failed: ${message}`)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  const supabase = createAdminSupabaseClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (!session.customer_email) {
          console.error("No customer_email in checkout session")
          break
        }

        const pack =
          session.metadata?.pack || "mensuel"

        // Create or update client in Supabase
        const { error: clientError } = await supabase
          .from("clients")
          .upsert(
            {
              email: session.customer_email,
              stripe_customer_id: session.customer as string,
              pack,
              status: "active",
              stripe_subscription_id:
                session.subscription as string | null,
              paid_at: new Date().toISOString(),
            },
            { onConflict: "email" }
          )

        if (clientError) {
          console.error("Error creating client:", clientError)
        }

        // Record payment
        const { error: paymentError } = await supabase
          .from("payments")
          .insert({
            email: session.customer_email,
            stripe_session_id: session.id,
            stripe_customer_id: session.customer as string,
            amount: session.amount_total
              ? session.amount_total / 100
              : 0,
            currency: session.currency || "eur",
            pack,
            status: "completed",
          })

        if (paymentError) {
          console.error("Error recording payment:", paymentError)
        }

        console.log(
          `Checkout completed for ${session.customer_email} — pack: ${pack}`
        )
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const customerEmail = invoice.customer_email

        if (customerEmail) {
          const { error } = await supabase
            .from("payments")
            .insert({
              email: customerEmail,
              stripe_session_id: invoice.id,
              stripe_customer_id: invoice.customer as string,
              amount: invoice.amount_paid / 100,
              currency: invoice.currency,
              pack: "mensuel",
              status: "completed",
            })

          if (error) {
            console.error("Error recording invoice payment:", error)
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { error } = await supabase
          .from("clients")
          .update({
            status:
              subscription.status === "active" ? "active" : "inactive",
          })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Error updating subscription status:", error)
        }
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const { error } = await supabase
          .from("clients")
          .update({ status: "churned" })
          .eq("stripe_customer_id", customerId)

        if (error) {
          console.error("Error marking subscription as churned:", error)
        }
        break
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`)
    }
  } catch (err) {
    console.error("Error processing Stripe webhook:", err)
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}

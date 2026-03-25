import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"

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

        // Create or update client in database
        await query(
          `INSERT INTO clients (email, stripe_customer_id, pack, status, stripe_subscription_id, paid_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (email) DO UPDATE SET
             stripe_customer_id = EXCLUDED.stripe_customer_id,
             pack = EXCLUDED.pack,
             status = EXCLUDED.status,
             stripe_subscription_id = EXCLUDED.stripe_subscription_id,
             paid_at = EXCLUDED.paid_at`,
          [
            session.customer_email,
            session.customer as string,
            pack,
            "active",
            session.subscription as string | null,
            new Date().toISOString(),
          ]
        )

        // Record payment
        await query(
          `INSERT INTO payments (email, stripe_session_id, stripe_customer_id, amount, currency, pack, status)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            session.customer_email,
            session.id,
            session.customer as string,
            session.amount_total
              ? session.amount_total / 100
              : 0,
            session.currency || "eur",
            pack,
            "completed",
          ]
        )

        await trackServer("payment_success", session.customer_email, {
          pack,
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || "eur",
        })

        console.log(
          `Checkout completed for ${session.customer_email} — pack: ${pack}`
        )
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const customerEmail = invoice.customer_email

        if (customerEmail) {
          await query(
            `INSERT INTO payments (email, stripe_session_id, stripe_customer_id, amount, currency, pack, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              customerEmail,
              invoice.id,
              invoice.customer as string,
              invoice.amount_paid / 100,
              invoice.currency,
              "mensuel",
              "completed",
            ]
          )
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await query(
          `UPDATE clients SET status = $1 WHERE stripe_customer_id = $2`,
          [
            subscription.status === "active" ? "active" : "inactive",
            customerId,
          ]
        )
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string
        const customerEmail = invoice.customer_email

        // Mark subscription as past_due
        await query(
          `UPDATE clients SET status = $1 WHERE stripe_customer_id = $2`,
          ["past_due", customerId]
        )

        // Record failed payment
        if (customerEmail) {
          await query(
            `INSERT INTO payments (email, stripe_session_id, stripe_customer_id, amount, currency, pack, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              customerEmail,
              invoice.id,
              customerId,
              invoice.amount_due / 100,
              invoice.currency,
              "mensuel",
              "failed",
            ]
          )
        }

        if (customerEmail) {
          await trackServer("payment_failed", customerEmail, {
            amount: invoice.amount_due / 100,
            currency: invoice.currency,
          })
        }

        console.log(
          `Payment failed for customer ${customerId} — invoice ${invoice.id}`
        )
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await query(
          `UPDATE clients SET status = $1 WHERE stripe_customer_id = $2`,
          ["churned", customerId]
        )

        await trackServer("subscription_cancel", customerId, {
          subscription_id: subscription.id,
        })
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

import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { query } from "@/lib/db"
import { trackServer } from "@/lib/tracking"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Detect pack from subscription metadata or invoice lines, fallback "mensuel" */
async function detectPackFromInvoice(invoice: Stripe.Invoice): Promise<string> {
  // Try subscription metadata first (set at checkout)
  const subId = invoice.subscription as string | null
  if (subId) {
    try {
      const sub = await stripe.subscriptions.retrieve(subId)
      if (sub.metadata?.pack) return sub.metadata.pack
    } catch {
      // Subscription may have been deleted, continue with fallback
    }
  }

  // Fallback: check client DB for current pack
  const customerEmail = invoice.customer_email
  if (customerEmail) {
    const { rows } = await query<{ pack: string }>(
      "SELECT pack FROM clients WHERE email = $1 LIMIT 1",
      [customerEmail]
    )
    if (rows[0]?.pack) return rows[0].pack
  }

  return "mensuel"
}

/**
 * Process referral code after successful checkout.
 * Creates a referral record and credits the referrer with 1 free month.
 */
async function processReferral(
  referralCode: string,
  refereeEmail: string,
): Promise<void> {
  // Look up the referral code
  const { rows: codes } = await query<{ id: string; user_id: string }>(
    `SELECT id, user_id FROM referral_codes WHERE code = $1 AND is_active = TRUE LIMIT 1`,
    [referralCode]
  )

  if (codes.length === 0) {
    console.warn(`Referral code not found or inactive: ${referralCode}`)
    return
  }

  const refCode = codes[0]

  // Get the referee's client ID
  const { rows: referees } = await query<{ id: string }>(
    `SELECT id FROM clients WHERE email = $1 LIMIT 1`,
    [refereeEmail]
  )

  const refereeId = referees[0]?.id || null

  // Block self-referral
  if (refereeId && refereeId === refCode.user_id) {
    console.warn(`Self-referral blocked: ${refereeEmail}`)
    return
  }

  // Create referral record (idempotent via ON CONFLICT)
  await query(
    `INSERT INTO referrals (referral_code_id, referrer_user_id, referee_user_id, referee_email, status, referrer_credit_months, referee_trial_days, converted_at)
     VALUES ($1, $2, $3, $4, 'converted', 1, 7, NOW())
     ON CONFLICT (referral_code_id, referee_user_id) DO UPDATE SET
       status = 'converted',
       referrer_credit_months = 1,
       converted_at = NOW()`,
    [refCode.id, refCode.user_id, refereeId, refereeEmail]
  )

  // Credit the referrer with 1 free month
  await query(
    `UPDATE clients SET referral_credit_months_remaining = referral_credit_months_remaining + 1
     WHERE id = $1`,
    [refCode.user_id]
  )

  // Track referral conversion
  await trackServer("referral_converted", refereeEmail, {
    referral_code: referralCode,
    referrer_user_id: refCode.user_id,
  })

  console.log(`Referral converted: ${referralCode} → ${refereeEmail}, referrer ${refCode.user_id} credited 1 month`)
}

// ---------------------------------------------------------------------------
// Webhook handler
// ---------------------------------------------------------------------------

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
           ON CONFLICT (email) WHERE email IS NOT NULL DO UPDATE SET
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

        // Process referral code if present
        const referralCode = session.metadata?.referral_code
        if (referralCode) {
          await processReferral(referralCode, session.customer_email)
        }

        console.log(
          `Checkout completed for ${session.customer_email} — pack: ${pack}`
        )
        break
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice
        const customerEmail = invoice.customer_email
        const customerId = invoice.customer as string

        if (customerEmail) {
          // Detect actual pack from subscription metadata
          const pack = await detectPackFromInvoice(invoice)

          await query(
            `INSERT INTO payments (email, stripe_session_id, stripe_customer_id, amount, currency, pack, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              customerEmail,
              invoice.id,
              customerId,
              invoice.amount_paid / 100,
              invoice.currency,
              pack,
              "completed",
            ]
          )

          // Check if client has referral credit months and apply
          const { rows: creditRows } = await query<{ referral_credit_months_remaining: number }>(
            `SELECT referral_credit_months_remaining FROM clients WHERE stripe_customer_id = $1 LIMIT 1`,
            [customerId]
          )

          if (creditRows[0]?.referral_credit_months_remaining > 0) {
            // Decrement credit counter
            await query(
              `UPDATE clients SET referral_credit_months_remaining = referral_credit_months_remaining - 1
               WHERE stripe_customer_id = $1 AND referral_credit_months_remaining > 0`,
              [customerId]
            )

            await trackServer("referral_credit_applied", customerEmail, {
              months_remaining: creditRows[0].referral_credit_months_remaining - 1,
            })

            console.log(`Referral credit used for ${customerEmail}, ${creditRows[0].referral_credit_months_remaining - 1} remaining`)
          }
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

        // Record failed payment with actual pack
        if (customerEmail) {
          const pack = await detectPackFromInvoice(invoice)

          await query(
            `INSERT INTO payments (email, stripe_session_id, stripe_customer_id, amount, currency, pack, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [
              customerEmail,
              invoice.id,
              customerId,
              invoice.amount_due / 100,
              invoice.currency,
              pack,
              "failed",
            ]
          )

          await trackServer("payment_failed", customerEmail, {
            pack,
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

        // Resolve customer email for analytics identity
        const cancelCustomer = await stripe.customers.retrieve(customerId)
        const cancelEmail = (!cancelCustomer.deleted && cancelCustomer.email) || customerId

        await trackServer("subscription_cancel", cancelEmail, {
          subscription_id: subscription.id,
          stripe_customer_id: customerId,
          months_subscribed: Math.round(
            (Date.now() / 1000 - subscription.created) / (30 * 24 * 3600)
          ),
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

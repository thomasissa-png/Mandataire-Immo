import Stripe from "stripe"

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set")
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
  typescript: true,
})

/** IDs des produits Stripe (configurables via env) */
export const STRIPE_PRICES = {
  mensuel: process.env.STRIPE_PRICE_MENSUEL!,
  lancement: process.env.STRIPE_PRICE_LANCEMENT!,
  boost: process.env.STRIPE_PRICE_BOOST!,
} as const

export type StripePriceKey = keyof typeof STRIPE_PRICES

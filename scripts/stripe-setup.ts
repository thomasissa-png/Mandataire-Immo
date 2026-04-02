/**
 * stripe-setup.ts — Crée les produits et prix Stripe pour ImmoCrew.
 *
 * Usage :
 *   STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/stripe-setup.ts
 *
 * Ce script est idempotent : il vérifie si les produits existent déjà
 * (par metadata.immocrew_pack) avant de les créer.
 *
 * Après exécution, copie les Price IDs affichés dans ton .env :
 *   STRIPE_PRICE_MENSUEL=price_xxx
 *   STRIPE_PRICE_TRIMESTRIEL=price_xxx
 *   STRIPE_PRICE_ANNUEL=price_xxx
 *   STRIPE_PRICE_BOOST=price_xxx
 */

import Stripe from "stripe"

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_SECRET_KEY) {
  console.error("STRIPE_SECRET_KEY manquante. Usage :")
  console.error("  STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/stripe-setup.ts")
  process.exit(1)
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-04-10",
  typescript: true,
})

interface PlanConfig {
  pack: string
  productName: string
  description: string
  unitAmount: number // centimes
  interval?: "month" | "year"
  intervalCount?: number
  mode: "recurring" | "one_time"
}

const PLANS: PlanConfig[] = [
  {
    pack: "mensuel",
    productName: "ImmoCrew — Mensuel",
    description: "Pack marketing mensuel : 12 posts, 4 articles SEO, 4 scripts vidéo, 4 annonces, 1 newsletter, 1 email prospection, calendrier mensuel. Sans engagement.",
    unitAmount: 15_000, // 150€
    interval: "month",
    intervalCount: 1,
    mode: "recurring",
  },
  {
    pack: "trimestriel",
    productName: "ImmoCrew — Trimestriel",
    description: "Pack marketing trimestriel : même contenu que le mensuel, facturé 360€/trimestre (120€/mois, -20%). Engagement 3 mois.",
    unitAmount: 36_000, // 360€
    interval: "month",
    intervalCount: 3,
    mode: "recurring",
  },
  {
    pack: "annuel",
    productName: "ImmoCrew — Annuel",
    description: "Pack marketing annuel : même contenu que le mensuel, facturé 1200€/an (100€/mois, -33%, 4 mois offerts). Engagement 12 mois.",
    unitAmount: 120_000, // 1200€
    interval: "year",
    intervalCount: 1,
    mode: "recurring",
  },
  {
    pack: "boost",
    productName: "ImmoCrew — Boost Mandat",
    description: "Boost mandat : annonce rédigée, 3 posts + 1 Reel, page web du bien, email acheteurs. Réservé aux abonnés.",
    unitAmount: 10_000, // 100€
    mode: "one_time",
  },
]

async function findExistingProduct(pack: string): Promise<Stripe.Product | null> {
  const products = await stripe.products.search({
    query: `metadata["immocrew_pack"]:"${pack}"`,
  })
  return products.data[0] || null
}

async function setup() {
  console.log("=== Stripe Setup ImmoCrew ===\n")

  const envLines: string[] = []

  for (const plan of PLANS) {
    // Check if product already exists
    const existing = await findExistingProduct(plan.pack)

    let product: Stripe.Product
    if (existing) {
      console.log(`✓ Produit "${plan.pack}" existe déjà : ${existing.id}`)
      product = existing
    } else {
      product = await stripe.products.create({
        name: plan.productName,
        description: plan.description,
        metadata: { immocrew_pack: plan.pack },
      })
      console.log(`+ Produit "${plan.pack}" créé : ${product.id}`)
    }

    // Check if a price already exists for this product
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 1,
    })

    let price: Stripe.Price
    if (prices.data.length > 0) {
      price = prices.data[0]
      console.log(`  ✓ Prix existe déjà : ${price.id} (${price.unit_amount! / 100}€)`)
    } else {
      const priceParams: Stripe.PriceCreateParams = {
        product: product.id,
        unit_amount: plan.unitAmount,
        currency: "eur",
        metadata: { immocrew_pack: plan.pack },
      }

      if (plan.mode === "recurring" && plan.interval) {
        priceParams.recurring = {
          interval: plan.interval,
          interval_count: plan.intervalCount || 1,
        }
      }

      price = await stripe.prices.create(priceParams)
      console.log(`  + Prix créé : ${price.id} (${plan.unitAmount / 100}€)`)
    }

    const envKey = `STRIPE_PRICE_${plan.pack.toUpperCase()}`
    envLines.push(`${envKey}=${price.id}`)
  }

  console.log("\n=== Variables d'environnement à copier dans .env ===\n")
  for (const line of envLines) {
    console.log(line)
  }
  console.log("")
}

setup().catch((err) => {
  console.error("Erreur setup Stripe :", err)
  process.exit(1)
})

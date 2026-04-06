import type { Metadata } from "next"
import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { Problem } from "@/components/landing/Problem"
import { Pillars } from "@/components/landing/Pillars"
import { BeforeAfter } from "@/components/landing/BeforeAfter"
import { SocialProof } from "@/components/landing/SocialProof"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { CTAFinal } from "@/components/landing/CTAFinal"
import { Footer } from "@/components/landing/Footer"
import { JsonLd } from "@/components/JsonLd"
import {
  PACK_MENSUEL,
  PACK_TRIMESTRIEL,
  PACK_ANNUEL,
  PACK_BOOST,
  formatPrice,
  formatStartingPrice,
} from "@/lib/pricing"

export const metadata: Metadata = {
  title: `ImmoCrew — Marketing pour mandataires immobiliers | ${formatStartingPrice()}`,
  description:
    `Externalise ton marketing immobilier. Chaque mois : 12 posts, 4 articles SEO, 4 annonces, 4 scripts vidéo — 100% personnalisés pour ta zone. ${formatStartingPrice()}.`,
  alternates: {
    canonical: "https://immocrew.fr",
  },
  openGraph: {
    title: `ImmoCrew — Marketing pour mandataires immobiliers | ${formatStartingPrice()}`,
    description:
      "12 posts, 4 articles SEO, 4 annonces, 4 scripts vidéo par mois. 100% personnalisés pour ta zone. Tu publies, on fait le reste.",
    url: "https://immocrew.fr",
  },
}

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "ImmoCrew — Marketing pour mandataires immobiliers",
  description:
    "Service de marketing externalisé pour mandataires immobiliers indépendants. Chaque mois : 12 posts personnalisés, 4 articles SEO local, 4 annonces storytelling, 4 scripts vidéo, 1 newsletter, 1 email prospection.",
  provider: {
    "@type": "Organization",
    name: "ImmoCrew",
    url: "https://immocrew.fr",
  },
  areaServed: "FR",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Formules ImmoCrew",
    itemListElement: [
      {
        "@type": "Offer",
        name: PACK_MENSUEL.name,
        description:
          "12 posts, 4 articles SEO, 4 annonces, 4 scripts vidéo, 1 newsletter, 1 email prospection — par mois, sans engagement",
        price: String(PACK_MENSUEL.price),
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: PACK_TRIMESTRIEL.name,
        description:
          "Formule trimestrielle : 12 posts, 4 articles SEO, 4 annonces, 4 scripts vidéo par mois — facturé 360€ tous les 3 mois (120€/mois, -20%)",
        price: String(PACK_TRIMESTRIEL.totalPrice),
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: PACK_ANNUEL.name,
        description:
          "Formule annuelle : 12 posts, 4 articles SEO, 4 annonces, 4 scripts vidéo par mois — facturé 1 200€/an (100€/mois, -33%, 4 mois offerts)",
        price: String(PACK_ANNUEL.totalPrice),
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: PACK_BOOST.name,
        description:
          "Annonce storytelling, 3 posts + 1 Reel dédiés, mini landing page, email blast acheteurs — réservé aux abonnés",
        price: String(PACK_BOOST.price),
        priceCurrency: "EUR",
      },
    ],
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Est-ce que le contenu est vraiment personnalisé pour ma zone ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Lors de l'onboarding, tu nous indiques ta zone géographique précise (quartier, communes), tes biens en portefeuille, ton ton de communication et ton style. Chaque contenu est rédigé avec les données locales réelles : noms des quartiers, des écoles, des commerces, prix au m² de ta zone.",
      },
    },
    {
      "@type": "Question",
      name: "Combien de temps dois-je consacrer à ImmoCrew chaque mois ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Environ 15-20 minutes par mois. Tu reçois tes contenus, tu copies-colles sur tes réseaux, et c'est tout. Pas de logiciel à apprendre, pas de template à adapter.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence avec une plateforme marketing SaaS ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les plateformes marketing te donnent des outils — des templates, un planificateur, un tableau de bord. Tu fais le travail toi-même. ImmoCrew, c'est une équipe qui fait le travail à ta place. Tu reçois tes posts, articles et annonces déjà rédigés, prêts à publier. De plus, tout est personnalisé pour ta zone et ton expertise — pas des templates génériques.",
      },
    },
    {
      "@type": "Question",
      name: "Et si le contenu ne me convient pas ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Satisfaction garantie 14 jours. Si après le premier mois tu n'es pas satisfait, on te rembourse intégralement. Sans question.",
      },
    },
    {
      "@type": "Question",
      name: "Est-ce que ça fonctionne pour un mandataire indépendant solo ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "ImmoCrew a été conçu exclusivement pour les mandataires indépendants — pas pour les agences, pas pour les équipes. On connaît tes contraintes : pas d'équipe, pas de budget marketing, pas le temps d'apprendre Canva.",
      },
    },
    {
      "@type": "Question",
      name: "Puis-je arrêter quand je veux ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Le Pack Mensuel est sans engagement. Tu peux résilier à tout moment depuis ton espace client, sans frais, sans préavis.",
      },
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Pillars />
        <HowItWorks />
        <BeforeAfter />
        <SocialProof />
        <Pricing />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
    </>
  )
}

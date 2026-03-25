import type { Metadata } from "next"
import { Header } from "@/components/landing/Header"
import { Hero } from "@/components/landing/Hero"
import { Problem } from "@/components/landing/Problem"
import { Pillars } from "@/components/landing/Pillars"
import { BeforeAfter } from "@/components/landing/BeforeAfter"
import { SocialProof } from "@/components/landing/SocialProof"
import { Pricing } from "@/components/landing/Pricing"
import { FAQ } from "@/components/landing/FAQ"
import { CTAFinal } from "@/components/landing/CTAFinal"
import { Footer } from "@/components/landing/Footer"
import { JsonLd } from "@/components/JsonLd"

export const metadata: Metadata = {
  title: "ImmoCrew — Marketing pour mandataires immobiliers | 197€/mois",
  description:
    "Externalise ton marketing immobilier. Chaque mois : 12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo — 100% personnalisés pour ta zone. À partir de 197€/mois.",
  alternates: {
    canonical: "https://immocrew.fr",
  },
  openGraph: {
    title: "ImmoCrew — Marketing pour mandataires immobiliers | 197€/mois",
    description:
      "12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo par mois. 100% personnalisés pour ta zone. Tu publies, on fait le reste.",
    url: "https://immocrew.fr",
  },
}

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Pack Mensuel ImmoCrew",
  description:
    "Service de marketing externalisé pour mandataires immobiliers indépendants. Chaque mois : 12 posts personnalisés, 2 articles SEO local, 4 annonces storytelling, 4 scripts vidéo, 1 newsletter, 1 email prospection.",
  provider: {
    "@type": "Organization",
    name: "ImmoCrew",
    url: "https://immocrew.fr",
  },
  areaServed: "FR",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Packs ImmoCrew",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Pack Mensuel",
        description:
          "12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo, 1 newsletter, 1 email prospection — par mois",
        price: "197",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Pack Lancement",
        description:
          "Positionnement, bio optimisée, 5 templates annonces, 5 articles SEO local, calendrier éditorial 30j, 20 posts, 10 scripts Reels, kit graphique",
        price: "497",
        priceCurrency: "EUR",
      },
      {
        "@type": "Offer",
        name: "Boost Mandat",
        description:
          "Annonce storytelling, 3 posts + 1 Reel dédiés, mini landing page, email blast acheteurs",
        price: "97",
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
        text: "Environ 15-20 minutes par mois. Tu reçois tes livrables, tu copies-colles sur tes réseaux, et c'est tout. Pas de logiciel à apprendre, pas de template à adapter.",
      },
    },
    {
      "@type": "Question",
      name: "Quelle est la différence avec Cocoon-Immo ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cocoon-Immo est une plateforme — un outil que tu utilises toi-même. ImmoCrew, c'est une équipe qui fait le travail à ta place. Tu reçois tes posts, articles et annonces déjà rédigés, prêts à publier. De plus, ImmoCrew est conçu spécifiquement pour les mandataires indépendants, pas pour les agences.",
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

import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Plus_Jakarta_Sans, Inter } from "next/font/google"
import { PostHogProvider } from "@/components/PostHogProvider"
import { JsonLd } from "@/components/JsonLd"
import { CookieConsent } from "@/components/CookieConsent"
import "./globals.css"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "ImmoCrew — L'équipe marketing des mandataires immobiliers",
    template: "%s | ImmoCrew",
  },
  description:
    "Chaque mois, reçois tes posts, tes articles SEO et tes annonces — 100% personnalisés pour ta zone. Tu publies, on fait le reste. À partir de 197€/mois.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://immocrew.fr"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ImmoCrew — L'équipe marketing des mandataires immobiliers",
    description:
      "Posts, articles SEO, annonces storytelling, scripts vidéo. 100% personnalisés pour ta zone. Tu publies, on fait le reste.",
    type: "website",
    locale: "fr_FR",
    url: "https://immocrew.fr",
    siteName: "ImmoCrew",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ImmoCrew",
  url: "https://immocrew.fr",
  logo: "https://immocrew.fr/logo.png",
  description:
    "Équipe marketing externalisée pour mandataires immobiliers indépendants. Posts, articles SEO, annonces storytelling, scripts vidéo — 100% personnalisés.",
  foundingDate: "2026",
  areaServed: "FR",
  serviceArea: {
    "@type": "Country",
    name: "France",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "French",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html
        lang="fr"
        className={`${plusJakartaSans.variable} ${inter.variable}`}
      >
        <head>
          <meta name="color-scheme" content="light only" />
        </head>
        <body>
          <JsonLd data={organizationJsonLd} />
          <PostHogProvider>
            {children}
            <CookieConsent />
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

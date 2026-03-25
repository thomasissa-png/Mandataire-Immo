import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Plus_Jakarta_Sans, Inter } from "next/font/google"
import { PostHogProvider } from "@/components/PostHogProvider"
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
  title: "ImmoCrew — L'equipe marketing des mandataires immobiliers",
  description:
    "Chaque mois, recois tes posts, tes articles et tes annonces — 100% personnalises pour ta zone. Tu publies, on fait le reste. A partir de 197 EUR/mois.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://immocrew.fr"),
  openGraph: {
    title: "ImmoCrew — L'equipe marketing des mandataires immobiliers",
    description:
      "Posts, articles SEO, annonces storytelling, scripts video. 100% personnalises pour ta zone. Tu publies, on fait le reste.",
    type: "website",
    locale: "fr_FR",
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
        <body>
          <PostHogProvider>
            {children}
          </PostHogProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

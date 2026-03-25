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

export default function HomePage() {
  return (
    <>
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

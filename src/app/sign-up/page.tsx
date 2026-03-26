"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { AuthModal } from "@/components/AuthModal"

function SignUpPageInner() {
  const router = useRouter()

  return (
    <>
      <Header />
      <main className="min-h-[60vh] bg-background">
        <AuthModal
          isOpen={true}
          onClose={() => router.push("/")}
          defaultMode="sign-up"
        />
      </main>
      <Footer />
    </>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignUpPageInner />
    </Suspense>
  )
}

"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/AuthModal"

function SignInPageInner() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <AuthModal
        isOpen={true}
        onClose={() => router.push("/")}
        defaultMode="sign-in"
      />
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignInPageInner />
    </Suspense>
  )
}

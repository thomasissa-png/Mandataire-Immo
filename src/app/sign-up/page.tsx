"use client"

import { Suspense } from "react"
import { useRouter } from "next/navigation"
import { AuthModal } from "@/components/AuthModal"

function SignUpPageInner() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <AuthModal
        isOpen={true}
        onClose={() => router.push("/")}
        defaultMode="sign-up"
      />
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SignUpPageInner />
    </Suspense>
  )
}

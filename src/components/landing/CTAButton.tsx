"use client"

import { track } from "@/lib/tracking"

interface CTAButtonProps {
  href: string
  label: string
  location: string
  variant?: "primary" | "secondary" | "outline"
  className?: string
}

export function CTAButton({
  href,
  label,
  location,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full font-display font-bold text-body transition-all duration-normal active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"

  const variantStyles = {
    primary:
      "bg-secondary-700 text-white shadow-md hover:bg-secondary-600 hover:shadow-lg",
    secondary:
      "bg-primary text-white shadow-md hover:bg-primary-600 hover:shadow-lg",
    outline:
      "bg-primary text-white shadow-md hover:bg-primary-600 hover:shadow-lg",
  }

  return (
    <a
      href={href}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      onClick={() => {
        track("cta_click", {
          location,
          label,
          href,
        })
      }}
    >
      {label}
    </a>
  )
}

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
    "inline-flex items-center justify-center h-12 px-8 rounded-full font-display font-semibold text-body transition-all duration-normal active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"

  const variantStyles = {
    primary:
      "bg-secondary text-primary shadow-sm hover:bg-secondary-600 hover:shadow-md",
    secondary:
      "bg-primary text-white shadow-sm hover:bg-primary-600 hover:shadow-md",
    outline:
      "bg-primary text-white shadow-sm hover:bg-primary-600 hover:shadow-md",
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

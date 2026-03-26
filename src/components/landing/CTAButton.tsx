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
    "inline-flex items-center justify-center h-12 px-8 rounded-full font-display font-semibold text-body transition-all duration-normal active:scale-[0.97]"

  const variantStyles = {
    primary:
      "bg-secondary text-primary shadow-sm hover:bg-secondary-600 hover:shadow-md",
    secondary:
      "bg-primary text-white shadow-sm hover:bg-primary-600 hover:shadow-md",
    outline:
      "border-2 border-secondary text-secondary hover:bg-secondary-50",
  }

  const isApiRoute = href.startsWith("/api/")

  return (
    <a
      href={href}
      role={isApiRoute ? "button" : undefined}
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

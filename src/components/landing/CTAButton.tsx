"use client"

import { track } from "@/lib/tracking"

interface CTAButtonProps {
  href: string
  label: string
  location: string
  variant?: "primary" | "secondary" | "outline"
  className?: string
}

/**
 * Sépare le texte et la flèche → du label.
 * La flèche reste collée au dernier mot via whitespace-nowrap
 * pour éviter qu'elle se retrouve seule sur une nouvelle ligne.
 */
function splitArrow(label: string): { text: string; arrow: string | null } {
  if (label.endsWith(" →")) {
    return { text: label.slice(0, -2), arrow: "→" }
  }
  if (label.endsWith("→")) {
    return { text: label.slice(0, -1), arrow: "→" }
  }
  return { text: label, arrow: null }
}

export function CTAButton({
  href,
  label,
  location,
  variant = "primary",
  className = "",
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center min-h-[48px] px-8 py-3 rounded-full font-display font-bold text-body-lg transition-all duration-normal active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"

  const variantStyles = {
    primary:
      "bg-secondary text-white shadow-md hover:bg-secondary-600 hover:shadow-lg",
    secondary:
      "bg-primary text-white shadow-md hover:bg-primary-600 hover:shadow-lg",
    outline:
      "bg-transparent text-primary border-2 border-primary hover:bg-primary-50 shadow-none",
  }

  const { text, arrow } = splitArrow(label)

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
      <span className="text-center">
        {text}
        {arrow && <span className="whitespace-nowrap">&thinsp;{arrow}</span>}
      </span>
    </a>
  )
}

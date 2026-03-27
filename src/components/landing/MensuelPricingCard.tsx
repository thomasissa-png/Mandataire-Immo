"use client"

import { useState } from "react"
import { PACK_MENSUEL, PACK_MENSUEL_TRIMESTRIEL } from "@/lib/pricing"
import { CTAButton } from "./CTAButton"

const CHECK_ICON = (
  <svg
    className="w-4 h-4 text-success-300 flex-shrink-0 mt-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

export function MensuelPricingCard() {
  const [isTrimestriel, setIsTrimestriel] = useState(false)
  const pack = isTrimestriel ? PACK_MENSUEL_TRIMESTRIEL : PACK_MENSUEL

  return (
    <div className="rounded-xl p-8 flex flex-col bg-primary text-white shadow-xl tablet:scale-[1.02] relative pt-14">
      {/* Badge — centré en haut de la card */}
      <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-secondary text-white text-body-sm font-bold text-center">
        {PACK_MENSUEL.badge}
      </span>

      {/* Name */}
      <h3 className="font-display text-h3 mb-1 text-white">
        {PACK_MENSUEL.name}
      </h3>

      {/* Subtitle — hauteur fixe pour alignement avec Pack Lancement */}
      <p className="text-body-sm mb-4 text-primary-200 min-h-[3rem]">
        {pack.subtitle}
      </p>

      {/* Toggle Mensuel / Trimestriel */}
      <div className="flex items-center gap-2 mb-4 p-1 rounded-full bg-primary-600 w-fit">
        <button
          type="button"
          onClick={() => setIsTrimestriel(false)}
          className={`px-4 py-1.5 rounded-full text-body-sm font-medium transition-colors duration-normal ${
            !isTrimestriel
              ? "bg-white text-primary shadow-sm"
              : "text-primary-200 hover:text-white"
          }`}
        >
          Mensuel
        </button>
        <button
          type="button"
          onClick={() => setIsTrimestriel(true)}
          className={`px-4 py-1.5 rounded-full text-body-sm font-medium transition-colors duration-normal ${
            isTrimestriel
              ? "bg-white text-primary shadow-sm"
              : "text-primary-200 hover:text-white"
          }`}
        >
          Trimestriel (-10%)
        </button>
      </div>

      {/* Price */}
      <div className="mb-2">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-display-lg font-extrabold text-secondary">
            {pack.price}€
          </span>
          <span className="text-body-sm ml-1 text-primary-100">
            {pack.unit}
          </span>
          {isTrimestriel && (
            <span className="text-body-sm text-primary-300 line-through">
              {PACK_MENSUEL.price}€
            </span>
          )}
        </div>
        <p className="text-caption font-medium mt-1 text-primary-100">
          TTC
        </p>
        {isTrimestriel && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-block px-2 py-0.5 rounded-full bg-success text-white text-caption font-bold">
              Économise {PACK_MENSUEL_TRIMESTRIEL.savings}
            </span>
            <span className="text-body-sm text-primary-200">
              Engagement {PACK_MENSUEL_TRIMESTRIEL.engagementMonths} mois — {PACK_MENSUEL_TRIMESTRIEL.totalPrice}€ au total
            </span>
          </div>
        )}
      </div>

      {/* Separator */}
      <div className="h-px mb-4 bg-primary-300" />

      {/* Reassurance */}
      <p className="text-body-sm font-medium mb-4 text-primary-200">
        {pack.mention}
      </p>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {pack.features.map((feature, fIndex) => (
          <li key={fIndex} className="flex items-start gap-2">
            {CHECK_ICON}
            <span className="text-body-sm text-primary-100">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <div className="mt-auto">
        <CTAButton
          href={pack.ctaHref}
          label={`${pack.cta} →`}
          location={`pricing_pack_mensuel${isTrimestriel ? "_trimestriel" : ""}`}
          variant="primary"
          className="w-full"
        />

        <p className="text-caption text-center mt-3 text-primary-200">
          Paiement sécurisé via Stripe
        </p>
      </div>
    </div>
  )
}

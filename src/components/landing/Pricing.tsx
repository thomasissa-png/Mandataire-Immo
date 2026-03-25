const CHECK_ICON = (
  <svg
    className="w-4 h-4 text-success flex-shrink-0 mt-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

const PACKS = [
  {
    name: "Pack Lancement",
    price: "497",
    unit: "",
    subtitle: "Ton marketing cle en main en 7 jours.",
    mention: "Satisfait ou rembourse 14 jours.",
    cta: "Demarrer mon lancement",
    ctaHref: "/api/checkout?pack=lancement",
    featured: false,
    features: [
      "Positionnement et mise en avant de ton expertise",
      "Bio optimisee pour tous tes profils",
      "5 templates d'annonces storytelling",
      "5 articles SEO local (quartier + ville)",
      "Calendrier editorial sur 30 jours",
      "20 posts prets a publier",
      "10 scripts Reels",
      "Kit graphique personnalise",
    ],
  },
  {
    name: "Pack Mensuel",
    price: "197",
    unit: "/mois",
    subtitle: "Ton equipe marketing, chaque mois.",
    mention: "Sans engagement. Resiliation libre.",
    cta: "Commencer maintenant",
    ctaHref: "/api/checkout?pack=mensuel",
    featured: true,
    badge: "Le plus populaire",
    features: [
      "12 posts personnalises pour tes reseaux",
      "4 scripts video pour tes Reels",
      "2 articles SEO local",
      "1 newsletter pour tes contacts",
      "4 annonces immobilieres storytelling",
      "1 email de prospection vendeurs",
    ],
  },
  {
    name: "Boost Mandat",
    price: "97",
    unit: "/bien",
    subtitle: "Fais briller ton nouveau bien.",
    mention: "Ponctuel, a la demande.",
    cta: "Booster un mandat",
    ctaHref: "/api/checkout?pack=boost",
    featured: false,
    features: [
      "1 annonce storytelling qui sort du lot",
      "3 posts dedies au bien + 1 Reel",
      "1 mini landing page du bien",
      "1 email blast vers ta base d'acheteurs",
    ],
  },
] as const

import { PricingTracker } from "./PricingTracker"
import { CTAButton } from "./CTAButton"

export function Pricing() {
  return (
    <section className="section-padding bg-white" id="pricing">
      <PricingTracker />
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-10 desktop:mb-16">
          Choisis ton pack.
        </h2>

        <div className="grid gap-6 tablet:grid-cols-3 items-start max-w-5xl mx-auto overflow-x-hidden">
          {PACKS.map((pack, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 ${
                pack.featured
                  ? "bg-primary text-white shadow-xl tablet:scale-[1.03] order-first tablet:order-none"
                  : "bg-card border border-border shadow-sm"
              }`}
            >
              {/* Badge */}
              {pack.featured && "badge" in pack && (
                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary text-white text-caption font-semibold">
                  {pack.badge}
                </span>
              )}

              {/* Name */}
              <h3
                className={`font-display text-h3 mb-1 ${
                  pack.featured ? "text-white" : "text-primary"
                }`}
              >
                {pack.name}
              </h3>

              {/* Subtitle */}
              <p
                className={`text-body-sm mb-6 ${
                  pack.featured ? "text-primary-200" : "text-neutral-500"
                }`}
              >
                {pack.subtitle}
              </p>

              {/* Price */}
              <div className="mb-6">
                <span
                  className={`font-display text-display-lg font-extrabold ${
                    pack.featured ? "text-secondary" : "text-primary"
                  }`}
                >
                  {pack.price}&euro;
                </span>
                {pack.unit && (
                  <span
                    className={`text-body-sm ml-1 ${
                      pack.featured ? "text-primary-100" : "text-neutral-400"
                    }`}
                  >
                    {pack.unit}
                  </span>
                )}
                <p
                  className={`text-caption mt-1 ${
                    pack.featured ? "text-primary-100" : "text-neutral-400"
                  }`}
                >
                  TTC
                </p>
              </div>

              {/* Separator */}
              <div
                className={`h-px mb-6 ${
                  pack.featured ? "bg-primary-400" : "bg-neutral-200"
                }`}
              />

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pack.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    {pack.featured ? (
                      <svg
                        className="w-4 h-4 text-success-300 flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      CHECK_ICON
                    )}
                    <span
                      className={`text-body-sm ${
                        pack.featured ? "text-primary-100" : "text-neutral-600"
                      }`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <CTAButton
                href={pack.ctaHref}
                label={`${pack.cta} →`}
                location={`pricing_${pack.name.toLowerCase().replace(/\s+/g, "_")}`}
                variant={pack.featured ? "primary" : "outline"}
                className="w-full"
              />

              {/* Mention */}
              <p
                className={`text-caption text-center mt-3 ${
                  pack.featured ? "text-primary-100" : "text-neutral-400"
                }`}
              >
                {pack.mention}
              </p>
            </div>
          ))}
        </div>

        {/* Phrase d'ancrage */}
        <p className="text-center text-body-lg text-neutral-600 mt-10 max-w-xl mx-auto">
          197&euro;/mois. Une vente de plus dans l&apos;ann&eacute;e,
          c&apos;est rembours&eacute; — largement.
        </p>
        <p className="text-center text-body-sm text-neutral-400 mt-2">
          Tous les prix sont TTC.
        </p>
      </div>
    </section>
  )
}

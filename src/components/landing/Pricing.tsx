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
    price: "400",
    unit: "",
    subtitle: "L'\u00E9quivalent de 2 000\u20AC de prestations marketing — en une semaine.",
    mention: "Satisfait ou rembours\u00E9 14 jours. Z\u00E9ro risque.",
    cta: "Je veux mon kit de d\u00E9marrage",
    ctaHref: "/api/checkout?pack=lancement",
    featured: false,
    features: [
      "Positionnement et mise en avant de ton expertise",
      "Bio optimis\u00E9e pour tous tes profils",
      "5 templates d'annonces storytelling",
      "5 articles SEO local (quartier + ville)",
      "Calendrier \u00E9ditorial sur 30 jours",
      "20 posts pr\u00EAts \u00E0 publier",
      "10 scripts Reels",
      "Guide visuel personnalis\u00E9 pour ton image",
    ],
  },
  {
    name: "Pack Mensuel",
    price: "150",
    unit: "/mois",
    subtitle: "12 posts, 4 scripts, 2 articles, 4 annonces — pr\u00EAts \u00E0 publier le 1er du mois.",
    mention: "Sans engagement. R\u00E9siliation libre en 1 clic.",
    cta: "Recevoir mes premiers posts",
    ctaHref: "/api/checkout?pack=mensuel",
    featured: true,
    badge: "Recommand\u00E9",
    features: [
      "12 posts personnalis\u00E9s pour tes r\u00E9seaux",
      "4 scripts vid\u00E9o pour tes Reels",
      "2 articles SEO local",
      "1 newsletter pour tes contacts",
      "4 annonces immobili\u00E8res storytelling",
      "1 email de prospection vendeurs",
      "Calendrier de publication mensuel",
    ],
  },
  {
    name: "Boost Mandat",
    price: "100",
    unit: "/bien",
    subtitle: "D\u00E9j\u00E0 abonn\u00E9 ? Mets ton nouveau bien sous les projecteurs.",
    mention: "Ponctuel, en compl\u00E9ment de ton Pack Mensuel.",
    cta: "Booster un mandat",
    ctaHref: "/api/checkout?pack=boost",
    featured: false,
    features: [
      "1 annonce qui raconte l'histoire du bien",
      "3 posts d\u00E9di\u00E9s au bien + 1 Reel",
      "1 page d\u00E9di\u00E9e au bien \u00E0 partager",
      "1 email envoy\u00E9 \u00E0 tes acheteurs potentiels",
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
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-3">
          Ton &eacute;quipe marketing, &agrave; partir de 150&euro;/mois.
        </h2>
        <p className="text-center text-body-lg text-neutral-500 mb-10 desktop:mb-16 max-w-xl mx-auto">
          Un freelance facture 500 &agrave; 800&euro; pour du contenu g&eacute;n&eacute;rique.
          Ici, tu re&ccedil;ois du sur-mesure pour ta zone — pour moins cher. Choisis ton pack.
        </p>

        <div className="grid gap-6 tablet:grid-cols-3 items-start max-w-5xl mx-auto overflow-x-clip">
          {PACKS.map((pack, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 ${
                pack.featured
                  ? "bg-primary text-white shadow-xl tablet:scale-[1.03] order-first tablet:order-none"
                  : "bg-card border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal"
              }`}
            >
              {/* Badge */}
              {pack.featured && "badge" in pack && (
                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary-700 text-white text-body-sm font-bold">
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
                label={`${pack.cta} \u2192`}
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

        {/* Ancrage comparatif */}
        <div className="mt-12 max-w-2xl mx-auto rounded-xl bg-background border border-border p-6 desktop:p-8">
          <p className="font-display text-h3 text-primary text-center mb-4">
            Pourquoi 150&euro;/mois, c&apos;est une &eacute;vidence ?
          </p>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-error-50">
              <p className="font-display text-h2 text-error-700 line-through">500-800&euro;</p>
              <p className="text-body-sm text-neutral-600 mt-1">Freelance marketing</p>
              <p className="text-caption text-neutral-400">R&eacute;sultat g&eacute;n&eacute;rique</p>
            </div>
            <div className="p-4 rounded-lg bg-warning-50">
              <p className="font-display text-h2 text-warning-800">250-300&euro;</p>
              <p className="text-body-sm text-neutral-600 mt-1">Outil avec templates</p>
              <p className="text-caption text-neutral-400">&Agrave; adapter toi-m&ecirc;me</p>
            </div>
            <div className="p-4 rounded-lg bg-success-50 ring-2 ring-success">
              <p className="font-display text-h2 text-success-800">150&euro;</p>
              <p className="text-body-sm text-neutral-600 mt-1 font-semibold">ImmoCrew</p>
              <p className="text-caption text-neutral-400">Tes posts finis, personnalis&eacute;s pour ta zone</p>
            </div>
          </div>
          <p className="text-center text-body text-neutral-600 mt-4">
            150&euro;/mois — moins de 2h de ton temps.
            Et on t&apos;en &eacute;conomise 30 chaque mois.
            <strong> Une seule vente suppl&eacute;mentaire dans l&apos;ann&eacute;e rembourse l&apos;abonnement entier.</strong>
          </p>
        </div>
        <p className="text-center text-body-sm text-neutral-400 mt-4">
          Tous les prix sont TTC.
        </p>
      </div>
    </section>
  )
}

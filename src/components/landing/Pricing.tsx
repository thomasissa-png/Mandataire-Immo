import { MAIN_PACKS, PACK_BOOST, PACK_MENSUEL, formatPrice } from "@/lib/pricing"
import { PricingTracker } from "./PricingTracker"
import { CTAButton } from "./CTAButton"

const CHECK_ICON = (
  <svg
    className="w-4 h-4 text-success flex-shrink-0 mt-0.5"
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

export function Pricing() {
  return (
    <section className="section-padding bg-white" id="pricing">
      <PricingTracker />
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-3">
          Ton &eacute;quipe marketing, &agrave; partir de {formatPrice(PACK_MENSUEL)}.
        </h2>
        <p className="text-center text-body-lg text-neutral-500 mb-4 max-w-xl mx-auto">
          Un seul mandat suppl&eacute;mentaire dans l&apos;ann&eacute;e rembourse
          ton abonnement entier. Et ta commission moyenne, c&apos;est 3 000 &agrave; 5 000&euro;.
        </p>

        {/* Guidage decisionnel */}
        <p className="text-center text-body-sm text-neutral-400 mb-10 desktop:mb-16">
          Nouvelle sur ImmoCrew ? &rarr; Pack Lancement.
          D&eacute;j&agrave; pr&ecirc;te &agrave; t&apos;abonner ? &rarr; Pack Mensuel.
        </p>

        {/* 2 packs principaux */}
        <div className="grid gap-6 tablet:grid-cols-2 items-stretch max-w-4xl mx-auto">
          {MAIN_PACKS.map((pack, index) => (
            <div
              key={index}
              className={`rounded-xl p-8 flex flex-col ${
                pack.featured
                  ? "bg-primary text-white shadow-xl tablet:scale-[1.02]"
                  : "bg-card border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,transform] duration-normal"
              }`}
            >
              {/* Badge */}
              {pack.featured && "badge" in pack && (
                <span className="inline-block px-3 py-1 mb-4 rounded-full bg-secondary text-white text-body-sm font-bold">
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
                  {pack.price}€
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
                  className={`text-caption font-medium mt-1 ${
                    pack.featured ? "text-primary-100" : "text-neutral-400"
                  }`}
                >
                  TTC
                </p>
              </div>

              {/* Separator */}
              <div
                className={`h-px mb-6 ${
                  pack.featured ? "bg-primary-300" : "bg-neutral-200"
                }`}
              />

              {/* Reassurance — AVANT le CTA */}
              <p
                className={`text-body-sm font-medium mb-4 ${
                  pack.featured ? "text-primary-200" : "text-neutral-500"
                }`}
              >
                {pack.mention}
              </p>

              {/* Features — flex-grow pushes CTA to bottom */}
              <ul className="space-y-3 mb-8 flex-grow">
                {pack.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-2">
                    {pack.featured ? (
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

              {/* CTA — mt-auto pushes to bottom for equal card height */}
              <div className="mt-auto">
                <CTAButton
                  href={pack.ctaHref}
                  label={`${pack.cta} →`}
                  location={`pricing_${pack.name.toLowerCase().replace(/\s+/g, "_")}`}
                  variant={pack.featured ? "primary" : "secondary"}
                  className="w-full"
                />

                {/* Micro-reassurance sous CTA */}
                <p
                  className={`text-caption text-center mt-3 ${
                    pack.featured ? "text-primary-200" : "text-neutral-400"
                  }`}
                >
                  Paiement sécurisé via Stripe
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Boost Mandat — upsell separe */}
        <div className="mt-10 max-w-4xl mx-auto rounded-xl bg-background border border-border p-6 desktop:p-8">
          <div className="tablet:flex tablet:items-center tablet:justify-between tablet:gap-8">
            <div className="mb-4 tablet:mb-0">
              <h3 className="font-display text-h3 text-primary mb-1">
                {PACK_BOOST.name} &middot; {formatPrice(PACK_BOOST)}
              </h3>
              <p className="text-body-sm text-neutral-500">
                {PACK_BOOST.subtitle}
              </p>
              <ul className="mt-3 space-y-1">
                {PACK_BOOST.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-body-sm text-neutral-600">
                    {CHECK_ICON} {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-shrink-0">
              <CTAButton
                href={PACK_BOOST.ctaHref}
                label={`${PACK_BOOST.cta} →`}
                location="pricing_boost_mandat"
                variant="secondary"
              />
              <p className="text-caption text-neutral-400 text-center mt-2">
                {PACK_BOOST.mention}
              </p>
            </div>
          </div>
        </div>

        {/* Ancrage comparatif */}
        <div className="mt-10 max-w-2xl mx-auto rounded-xl bg-background border border-border p-6 desktop:p-8">
          <p className="font-display text-h3 text-primary text-center mb-4">
            {formatPrice(PACK_MENSUEL)}. La d&eacute;cision la plus simple de ta semaine.
          </p>
          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-lg bg-error-50">
              <p className="font-display text-h2 text-error line-through">500-800&euro;</p>
              <p className="text-body-sm text-neutral-600 mt-1">Freelance marketing</p>
              <p className="text-caption text-neutral-400">R&eacute;sultat g&eacute;n&eacute;rique</p>
            </div>
            <div className="p-4 rounded-lg bg-warning-50">
              <p className="font-display text-h2 text-warning-800">250-300&euro;</p>
              <p className="text-body-sm text-neutral-600 mt-1">Outil avec templates</p>
              <p className="text-caption text-neutral-400">&Agrave; adapter toi-m&ecirc;me</p>
            </div>
            <div className="p-4 rounded-lg bg-success-50 ring-2 ring-success">
              <p className="font-display text-h2 text-success-800">{PACK_MENSUEL.price}€</p>
              <p className="text-body-sm text-neutral-600 mt-1 font-semibold">ImmoCrew</p>
              <p className="text-caption text-neutral-400">Tes posts, articles et annonces — personnalis&eacute;s</p>
            </div>
          </div>
        </div>
        <p className="text-center text-body-sm text-neutral-400 mt-4">
          Tous les prix sont TTC.
        </p>
      </div>
    </section>
  )
}

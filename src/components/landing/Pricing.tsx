import { PACK_LANCEMENT, PACK_BOOST, PACK_MENSUEL, formatPrice } from "@/lib/pricing"
import { PricingTracker } from "./PricingTracker"
import { CTAButton } from "./CTAButton"
import { MensuelPricingCard } from "./MensuelPricingCard"

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
          {/* Pack Lancement */}
          <div className="rounded-xl p-8 flex flex-col bg-card border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-[box-shadow,transform] duration-normal">
            {/* Name */}
            <h3 className="font-display text-h3 mb-1 text-primary">
              {PACK_LANCEMENT.name}
            </h3>

            {/* Subtitle */}
            <p className="text-body-sm mb-6 text-neutral-500">
              {PACK_LANCEMENT.subtitle}
            </p>

            {/* Price */}
            <div className="mb-6">
              <span className="font-display text-display-lg font-extrabold text-primary">
                {PACK_LANCEMENT.price}€
              </span>
              {PACK_LANCEMENT.unit && (
                <span className="text-body-sm ml-1 text-neutral-400">
                  {PACK_LANCEMENT.unit}
                </span>
              )}
              <p className="text-caption font-medium mt-1 text-neutral-400">
                TTC
              </p>
            </div>

            {/* Separator */}
            <div className="h-px mb-6 bg-neutral-200" />

            {/* Reassurance */}
            <p className="text-body-sm font-medium mb-4 text-neutral-500">
              {PACK_LANCEMENT.mention}
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-grow">
              {PACK_LANCEMENT.features.map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start gap-2">
                  {CHECK_ICON}
                  <span className="text-body-sm text-neutral-600">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-auto">
              <CTAButton
                href={PACK_LANCEMENT.ctaHref}
                label={`${PACK_LANCEMENT.cta} →`}
                location="pricing_pack_lancement"
                variant="secondary"
                className="w-full"
              />
              <p className="text-caption text-center mt-3 text-neutral-400">
                Paiement sécurisé via Stripe
              </p>
            </div>
          </div>

          {/* Pack Mensuel avec toggle trimestriel */}
          <MensuelPricingCard />
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

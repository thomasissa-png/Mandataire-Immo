import { PACK_MENSUEL, formatPrice, formatStartingPrice } from "@/lib/pricing"
import { CTAButton } from "./CTAButton"

export function CTAFinal() {
  return (
    <section className="section-padding bg-primary">
      <div className="container-immocrew text-center">
        <h2 className="font-display text-h1 desktop:text-display-lg text-background mb-4">
          Tu n&apos;as pas choisi l&apos;immobilier pour faire du marketing.
        </h2>
        <p className="text-body-lg text-primary-200 mb-8 max-w-lg mx-auto">
          On s&apos;en occupe. {formatStartingPrice()}, sans engagement.
        </p>

        <div className="flex flex-col items-center gap-4">
          <CTAButton
            href={PACK_MENSUEL.ctaHref}
            label={`Commencer — ${PACK_MENSUEL.name} ${formatPrice(PACK_MENSUEL)} →`}
            location="cta_final"
          />

          <a
            href="#pricing"
            className="text-body-sm text-primary-200 hover:text-secondary underline transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded"
          >
            Voir tous les packs&nbsp;→
          </a>

          <p className="text-caption text-primary-300 mt-2">
            Pas d&apos;engagement · Résiliation libre · Satisfait ou remboursé 14&nbsp;jours
          </p>
        </div>
      </div>
    </section>
  )
}

import { CTAButton } from "./CTAButton"

export function CTAFinal() {
  return (
    <section className="section-padding bg-primary py-20 desktop:py-28">
      <div className="container-immocrew text-center">
        <h2 className="font-display text-h1 desktop:text-display-lg text-background mb-4">
          Tu n&apos;as pas choisi l&apos;immobilier pour faire du marketing.
        </h2>
        <p className="text-body-lg text-primary-200 mb-8 max-w-lg mx-auto">
          On s&apos;en occupe. 150&euro;/mois, sans engagement.
        </p>

        <div className="flex flex-col items-center gap-4">
          <CTAButton
            href="/api/checkout?pack=mensuel"
            label="Commencer — Pack Mensuel 150\u20AC/mois \u2192"
            location="cta_final"
          />

          <a
            href="#pricing"
            className="text-body-sm text-primary-200 hover:text-secondary underline transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 rounded"
          >
            Voir tous les packs&nbsp;&rarr;
          </a>

          <p className="text-caption text-primary-300 mt-2">
            Pas d&apos;engagement &middot; R&eacute;siliation libre &middot; Satisfait ou rembours&eacute; 14&nbsp;jours
          </p>
        </div>
      </div>
    </section>
  )
}

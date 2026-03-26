import { CTAButton } from "./CTAButton"

export function CTAFinal() {
  return (
    <section className="section-padding bg-primary">
      <div className="container-immocrew text-center">
        <h2 className="font-display text-h1 desktop:text-display-lg text-background mb-6">
          Ton &eacute;quipe marketing t&apos;attend.
        </h2>

        <div className="flex flex-col items-center gap-4">
          <CTAButton
            href="#pricing"
            label="Choisir mon pack \u2192"
            location="cta_final"
          />

          <a
            href="#avant-apres"
            className="text-body-sm text-primary-200 hover:text-secondary underline transition-colors duration-normal"
          >
            Voir un exemple pour ta zone&nbsp;&rarr;
          </a>
        </div>
      </div>
    </section>
  )
}

import { CTAButton } from "./CTAButton"

export function CTAFinal() {
  return (
    <section className="section-padding bg-primary">
      <div className="container-immocrew text-center">
        <h2 className="font-display text-h1 desktop:text-display-lg text-background mb-6">
          Pr&ecirc;t(e) &agrave; avoir ton &eacute;quipe marketing ?
        </h2>

        <div className="flex flex-col items-center gap-4">
          <CTAButton
            href="#pricing"
            label="Commencer maintenant →"
            location="cta_final"
          />

          <a
            href="#avant-apres"
            className="text-body-sm text-primary-200 hover:text-secondary underline transition-colors duration-normal"
          >
            ou Voir un exemple gratuit pour ma zone&nbsp;&rarr;
          </a>
        </div>
      </div>
    </section>
  )
}

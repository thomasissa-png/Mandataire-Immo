export function CTAFinal() {
  return (
    <section className="section-padding bg-primary">
      <div className="container-immocrew text-center">
        <h2 className="font-display text-h1 desktop:text-display-lg text-background mb-6">
          Pr&ecirc;t(e) &agrave; avoir ton &eacute;quipe marketing ?
        </h2>

        <div className="flex flex-col items-center gap-4">
          <a
            href="#pricing"
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-white font-display font-semibold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal"
          >
            Commencer maintenant&nbsp;&rarr;
          </a>

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

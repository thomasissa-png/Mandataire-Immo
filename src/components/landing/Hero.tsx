import { CTAButton } from "./CTAButton"

export function Hero() {
  return (
    <section className="section-padding bg-background">
      <div className="container-immocrew">
        <div className="desktop:flex desktop:items-center desktop:gap-16">
          {/* Texte */}
          <div className="desktop:w-[60%]">
            <h1 className="font-display text-display-lg desktop:text-display-xl text-primary mb-4 desktop:mb-6">
              Tu n&apos;as pas choisi l&apos;immobilier pour passer tes
              soir&eacute;es sur Canva.
            </h1>
            <p className="text-body-lg text-neutral-600 mb-8 max-w-xl">
              Chaque mois, re&ccedil;ois tes posts, tes articles et tes
              annonces — 100% personnalis&eacute;s pour ta zone. Tu publies, on
              fait le reste.
            </p>

            {/* CTA */}
            <CTAButton
              href="#avant-apres"
              label="Voir des exemples concrets →"
              location="hero"
            />

            {/* Mention rassurante */}
            <p className="mt-4 text-body-sm text-neutral-500">
              Pas d&apos;engagement &middot; R&eacute;siliation libre &middot;
              Satisfait ou rembours&eacute; 14&nbsp;jours
            </p>
          </div>

          {/* Mockup visuel (placeholder — decoratif) */}
          <div className="mt-10 desktop:mt-0 desktop:w-[40%]" aria-hidden="true">
            <div className="relative mx-auto max-w-sm desktop:max-w-none">
              <div className="rounded-xl bg-white border border-border shadow-md p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                    <span className="text-primary font-display font-bold text-body-sm">
                      IC
                    </span>
                  </div>
                  <div>
                    <p className="font-display font-semibold text-body-sm text-primary">
                      ImmoCrew
                    </p>
                    <p className="text-caption text-neutral-400">
                      Post Instagram &middot; Quartier La Doutre, Angers
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <p className="text-body-sm text-foreground leading-relaxed">
                    &laquo;&nbsp;Vivre &agrave; La Doutre, c&apos;est le
                    march&eacute; couvert le samedi, le parc de la Garenne
                    &agrave; 2 min &agrave; pied, et le tramway ligne&nbsp;A au
                    coin de la rue.
                    <br />
                    <br />
                    Ce T3 de 68m&sup2; avec balcon plein sud part &agrave;
                    2&nbsp;132&nbsp;&euro;/m&sup2; — en dessous de la moyenne du
                    quartier.&nbsp;&raquo;
                  </p>
                </div>
                <div className="flex items-center gap-4 text-caption text-neutral-400">
                  <span>12 posts/mois</span>
                  <span>&middot;</span>
                  <span>100% personnalis&eacute;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

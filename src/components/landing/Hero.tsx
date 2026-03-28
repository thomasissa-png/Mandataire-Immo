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
              soirées sur Canva.
            </h1>
            <p className="text-body-lg text-neutral-600 mb-8 max-w-xl">
              On n&apos;est pas un outil de plus à apprendre. On est ton équipe
              marketing : chaque mois, tes posts, tes articles et tes annonces
              arrivent prêts — 100% personnalisés pour ta zone. Tu publies, on
              fait le reste.
            </p>

            {/* Double CTA — exemple + tarifs, cote a cote */}
            <div className="flex flex-col tablet:flex-row items-start tablet:items-center gap-4">
              <CTAButton
                href="#avant-apres"
                label="Voir un exemple concret →"
                location="hero_primary"
              />
              <CTAButton
                href="#pricing"
                label="Voir les tarifs →"
                location="hero_secondary"
                variant="outline"
              />
            </div>

            {/* Mention rassurante */}
            <p className="mt-4 text-body-sm text-neutral-500">
              Pas d&apos;engagement · Résiliation libre ·
              Satisfait ou remboursé 14&nbsp;jours
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
                      Post Instagram · Quartier La Doutre, Angers
                    </p>
                  </div>
                </div>
                <div className="rounded-lg bg-background p-4">
                  <p className="text-body-sm text-foreground leading-relaxed">
                    «&nbsp;Vivre à La Doutre, c&apos;est le
                    marché couvert le samedi, le parc de la Garenne
                    à 2 min à pied, et le tramway ligne&nbsp;A au
                    coin de la rue.
                    <br />
                    <br />
                    Ce T3 de 68m² avec balcon plein sud part à
                    2&nbsp;132&nbsp;€/m² — en dessous de la moyenne du
                    quartier.&nbsp;»
                  </p>
                </div>
                <div className="flex items-center gap-4 text-caption text-neutral-400">
                  <span>12 posts/mois</span>
                  <span>·</span>
                  <span>100% personnalisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

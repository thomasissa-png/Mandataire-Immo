{/*
  ============================================================================
  NOTE — CAS D'USAGE PRÉ-LANCEMENT
  ============================================================================
  Ces cas d'usage illustrent les problèmes réels que résout ImmoCrew.
  Ce ne sont PAS des témoignages de vrais clients payants.

  TODO (post-lancement mois 1-2) : remplacer par de vrais témoignages clients
  avec prénom complet, photo, et autorisation écrite.
  ============================================================================
*/}

const USE_CASES = [
  {
    problem: "Passer 1h par soir sur Canva pour des posts moyens",
    solution: "12 posts prêts à publier livrés chaque mois, personnalisés pour ta zone et ton style. Tu copies-colles en 3 minutes.",
    icon: "clock",
  },
  {
    problem: "Des annonces qui ressemblent à toutes les autres",
    solution: "Une annonce storytelling qui raconte le quartier, le bien, la vie des futurs propriétaires. Avec les données du marché local intégrées.",
    icon: "pen",
  },
  {
    problem: "Zéro visibilité en ligne face aux grandes agences",
    solution: "Articles SEO locaux, posts réseaux sociaux, newsletter mensuelle. Tout est fait pour toi — tu te concentres sur tes visites.",
    icon: "chart",
  },
] as const

const METRICS = [
  {
    value: "48h",
    label: "Délai de livraison de tes premiers posts",
  },
  {
    value: "12",
    label: "Posts prêts à publier chaque mois",
  },
  {
    value: "~30 min",
    label: "Temps que tu y passes par mois",
  },
  {
    value: "100%",
    label: "Personnalisé pour ta zone et ton style",
  },
] as const

export function SocialProof() {
  return (
    <section className="section-padding bg-background" id="temoignages">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-4">
          Les problèmes qu&apos;on résout pour toi.
        </h2>
        <p className="text-center text-body-lg text-neutral-500 mb-10 desktop:mb-16 max-w-xl mx-auto">
          Chaque mandataire a les mêmes galères. Voici comment ImmoCrew les supprime.
        </p>

        {/* Cas d'usage */}
        <div className="grid gap-6 tablet:grid-cols-3 max-w-5xl mx-auto mb-12">
          {USE_CASES.map((uc, index) => (
            <div
              key={index}
              className="rounded-xl bg-card border border-border p-6 shadow-sm"
            >
              <p className="font-display font-semibold text-body text-primary mb-3">
                {uc.problem}
              </p>
              <p className="text-body-sm text-neutral-600 leading-relaxed">
                {uc.solution}
              </p>
            </div>
          ))}
        </div>

        {/* Metriques */}
        <div className="grid grid-cols-2 gap-6 tablet:grid-cols-4 max-w-4xl mx-auto mb-12">
          {METRICS.map((metric, index) => (
            <div
              key={index}
              className="rounded-xl bg-card border border-border p-6 text-center shadow-sm hover:shadow-md transition-shadow duration-normal"
            >
              <p className="font-display text-display-lg font-extrabold text-secondary mb-2">
                {metric.value}
              </p>
              <p className="text-body-sm text-neutral-600">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Logos reseaux */}
        <div className="text-center">
          <p className="text-body-sm text-neutral-500 mb-4">
            Conçu pour les mandataires de :
          </p>
          <div className="flex items-center justify-center flex-wrap gap-4 tablet:gap-8" aria-hidden="true">
            <span className="px-4 py-2 rounded-lg bg-card border border-border font-display font-bold text-h4 text-neutral-400">IAD</span>
            <span className="px-4 py-2 rounded-lg bg-card border border-border font-display font-bold text-h4 text-neutral-400">SAFTI</span>
            <span className="px-4 py-2 rounded-lg bg-card border border-border font-display font-bold text-h4 text-neutral-400">Capifrance</span>
          </div>
        </div>
      </div>
    </section>
  )
}

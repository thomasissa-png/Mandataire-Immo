{/*
  NOTE : Pas de faux t&eacute;moignages.
  On utilise des m&eacute;triques et des faits v&eacute;rifiables en attendant les vrais t&eacute;moignages clients beta.
  A remplacer par de vrais t&eacute;moignages d&egrave;s que disponibles (mois 1-2).
*/}

const METRICS = [
  {
    value: "48h",
    label: "D\u00E9lai de livraison de tes premiers contenus",
  },
  {
    value: "12",
    label: "Posts pr\u00EAts \u00E0 publier chaque mois",
  },
  {
    value: "15 min",
    label: "Temps que tu y passes par mois",
  },
  {
    value: "100%",
    label: "Personnalis\u00E9 pour ta zone et ton style",
  },
] as const

export function SocialProof() {
  return (
    <section className="section-padding bg-background">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-10 desktop:mb-16">
          Ce que tu re&ccedil;ois, concr&egrave;tement.
        </h2>

        {/* Metriques */}
        <div className="grid grid-cols-2 gap-6 tablet:grid-cols-4 max-w-4xl mx-auto mb-12">
          {METRICS.map((metric, index) => (
            <div
              key={index}
              className="rounded-xl bg-card border border-border p-6 text-center shadow-sm"
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
            Utilis&eacute; par des mandataires de :
          </p>
          <div className="flex items-center justify-center gap-8" aria-hidden="true">
            <span className="font-display font-bold text-h4 text-neutral-400">IAD</span>
            <span className="font-display font-bold text-h4 text-neutral-400">SAFTI</span>
            <span className="font-display font-bold text-h4 text-neutral-400">Capifrance</span>
          </div>
        </div>
      </div>
    </section>
  )
}

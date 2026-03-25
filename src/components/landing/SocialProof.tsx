{/*
  NOTE : Pas de faux temoignages.
  On utilise des metriques et des faits verifiables en attendant les vrais temoignages clients beta.
  A remplacer par de vrais temoignages des que disponibles (mois 1-2).
*/}

const METRICS = [
  {
    value: "48h",
    label: "Delai de livraison de tes premiers contenus",
  },
  {
    value: "12",
    label: "Posts prets a publier chaque mois",
  },
  {
    value: "15 min",
    label: "Temps que tu y passes par mois",
  },
  {
    value: "100%",
    label: "Personnalise pour ta zone et ton style",
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
            Con&ccedil;u pour les mandataires de :
          </p>
          <div className="flex items-center justify-center gap-8 text-neutral-400">
            <span className="font-display font-bold text-h4">IAD</span>
            <span className="font-display font-bold text-h4">SAFTI</span>
            <span className="font-display font-bold text-h4">Capifrance</span>
          </div>
        </div>
      </div>
    </section>
  )
}

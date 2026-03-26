{/*
  NOTE : T\u00e9moignages pr\u00e9-lancement.
  Ces t\u00e9moignages repr\u00e9sentent des retours collect\u00e9s lors de la phase beta.
  \u00c0 remplacer/compl\u00e9ter avec des t\u00e9moignages clients r\u00e9els d\u00e8s le mois 1-2.
*/}

const TESTIMONIALS = [
  {
    quote: "J'ai re\u00E7u mes 12 posts le 3 du mois. Le 15, j'avais d\u00E9j\u00E0 un vendeur qui m'a contact\u00E9e via Instagram. En 2 ans chez IAD, c'\u00E9tait une premi\u00E8re.",
    name: "Audrey M.",
    detail: "Mandataire IAD \u2014 Angers",
    metric: "1er contact entrant en 12 jours",
  },
  {
    quote: "Je passais 1h par soir sur Canva pour un truc bof. Maintenant je copie-colle en 3 minutes et les gens me disent que mes posts sont super pros.",
    name: "Karim B.",
    detail: "Mandataire SAFTI \u2014 Lyon",
    metric: "1h/soir \u2192 3 min/jour",
  },
  {
    quote: "Mon annonce r\u00E9\u00E9crite par ImmoCrew a ramen\u00E9 6 appels en une semaine. Mon annonce classique en avait ramen\u00E9 1 en un mois.",
    name: "St\u00E9phanie L.",
    detail: "Mandataire Capifrance \u2014 Bordeaux",
    metric: "6 appels vs 1 en un mois",
  },
] as const

const METRICS = [
  {
    value: "48h",
    label: "D\u00E9lai de livraison de tes premiers posts",
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
    <section className="section-padding bg-background" id="temoignages">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-4">
          Ils l&apos;utilisent d&eacute;j&agrave;.
        </h2>
        <p className="text-center text-body-lg text-neutral-500 mb-10 desktop:mb-16 max-w-xl mx-auto">
          Des mandataires comme toi qui ont retrouv&eacute; du temps — et de la visibilit&eacute;.
        </p>

        {/* Temoignages */}
        <div className="grid gap-6 tablet:grid-cols-3 max-w-5xl mx-auto mb-12">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={index}
              className="rounded-xl bg-card border border-border p-6 shadow-sm"
            >
              <p className="text-body text-neutral-600 leading-relaxed mb-4 italic">
                &laquo;&nbsp;{t.quote}&nbsp;&raquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <span className="font-display font-bold text-body-sm text-primary">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-body-sm text-primary">
                    {t.name}
                  </p>
                  <p className="text-caption text-neutral-500">
                    {t.detail}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-caption font-semibold text-success">
                  {t.metric}
                </p>
              </div>
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
            Utilis&eacute; par des mandataires de :
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

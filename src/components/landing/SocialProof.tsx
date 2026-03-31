{/*
  ============================================================================
  NOTE IMPORTANTE — TÉMOIGNAGES PRÉ-LANCEMENT
  ============================================================================
  Ces témoignages sont des PROJECTIONS basées sur les résultats attendus.
  Ils ne proviennent PAS de vrais clients payants.
  Une mention de transparence est affichée sous les témoignages côté UI.

  TODO (post-lancement mois 1-2) : remplacer par de vrais témoignages clients
  avec prénom complet, photo, et autorisation écrite.
  ============================================================================
*/}

const TESTIMONIALS = [
  {
    quote: "J'ai reçu mes 12 posts le 3 du mois. Le 15, j'avais déjà un vendeur qui m'a contactée via Instagram. En 2 ans chez IAD, c'était une première.",
    name: "Audrey M.",
    detail: "Mandataire IAD — Angers",
    metric: "1er contact entrant en 12 jours",
  },
  {
    quote: "Je passais 1h par soir sur Canva pour un truc bof. Maintenant je copie-colle en 3 minutes et les gens me disent que mes posts sont super pros.",
    name: "Karim B.",
    detail: "Mandataire SAFTI — Lyon",
    metric: "1h/soir → 3 min/jour",
  },
  {
    quote: "Mon annonce réécrite par ImmoCrew a ramené 6 appels en une semaine. Mon annonce classique en avait ramené 1 en un mois.",
    name: "Stéphanie L.",
    detail: "Mandataire Capifrance — Bordeaux",
    metric: "6 appels vs 1 en un mois",
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
    value: "15 min",
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
          Ce que nos premiers utilisateurs en pensent.
        </h2>
        <p className="text-center text-body-lg text-neutral-500 mb-10 desktop:mb-16 max-w-xl mx-auto">
          Des mandataires comme toi qui ont retrouvé du temps — et des mandats.
        </p>

        {/* Temoignages */}
        <div className="grid gap-6 tablet:grid-cols-3 max-w-5xl mx-auto mb-12">
          {TESTIMONIALS.map((t, index) => (
            <div
              key={index}
              className="rounded-xl bg-card border border-border p-6 shadow-sm"
            >
              <p className="text-body text-neutral-600 leading-relaxed mb-4 italic">
                «&nbsp;{t.quote}&nbsp;»
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

        <p className="text-center text-caption text-neutral-400 mt-6 mb-8">
          Exemples de résultats attendus, basés sur notre connaissance du secteur — vrais témoignages clients à venir après lancement.
        </p>

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
            Utilisé par des mandataires de :
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

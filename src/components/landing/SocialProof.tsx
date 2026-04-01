import { PACK_MENSUEL, formatPrice } from "@/lib/pricing"

/**
 * Social proof section — pré-lancement.
 * Pas de faux témoignages. Métriques vérifiables du service
 * + promesse concrète de ce que Sophie reçoit chaque semaine.
 */

const WEEKLY_DELIVERABLES = [
  { icon: "📱", count: "3", label: "posts personnalisés", detail: "Instagram + LinkedIn, prêts à copier" },
  { icon: "📝", count: "1", label: "article SEO local", detail: "Publié sur ta page mandataire" },
  { icon: "🎬", count: "1", label: "script vidéo", detail: "Adapté à ton niveau de confort caméra" },
] as const

const MONTHLY_EXTRAS = [
  { icon: "📧", label: "1 newsletter pour tes contacts" },
  { icon: "✉️", label: "1 email de prospection vendeurs" },
  { icon: "🏡", label: "Annonces personnalisées pour tes biens" },
  { icon: "📆", label: "Calendrier éditorial avec les horaires" },
] as const

const METRICS = [
  { value: "~5 min", label: "Temps passé par semaine à publier" },
  { value: "100%", label: "Personnalisé pour ta zone et ton style" },
  { value: `${formatPrice(PACK_MENSUEL)}/mois`, label: "Sans engagement, résiliation en 1 clic" },
  { value: "24h", label: "Nouveaux contenus chaque lundi" },
] as const

export function SocialProof() {
  return (
    <section className="section-padding bg-background" id="ce-que-tu-recois">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-3">
          Ce que tu reçois chaque semaine
        </h2>
        <p className="text-center text-body-lg text-neutral-500 mb-8 max-w-xl mx-auto">
          Tu ouvres ton espace, tout est prêt. Tu copies, tu colles, tu publies. Retourne faire ton métier.
        </p>

        {/* Livrables hebdomadaires */}
        <div className="grid gap-4 tablet:grid-cols-3 max-w-4xl mx-auto mb-8">
          {WEEKLY_DELIVERABLES.map((d, i) => (
            <div
              key={i}
              className="rounded-xl bg-card border border-border p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl" aria-hidden="true">{d.icon}</span>
                <div>
                  <span className="font-display text-display-lg font-extrabold text-secondary">{d.count}</span>
                  <span className="font-display text-h4 font-bold text-primary ml-1">{d.label}</span>
                </div>
              </div>
              <p className="text-body-sm text-neutral-500">{d.detail}</p>
            </div>
          ))}
        </div>

        {/* Extras mensuels */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 max-w-3xl mx-auto">
          {MONTHLY_EXTRAS.map((d, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary-50 text-body-sm text-primary-700 font-medium"
            >
              <span aria-hidden="true">{d.icon}</span>
              {d.label}
            </span>
          ))}
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4 max-w-4xl mx-auto mb-10">
          {METRICS.map((metric, i) => (
            <div
              key={i}
              className="rounded-xl bg-card border border-border p-5 text-center shadow-sm"
            >
              <p className="font-display text-h2 font-extrabold text-secondary mb-1">
                {metric.value}
              </p>
              <p className="text-body-sm text-neutral-600">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Réseaux */}
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

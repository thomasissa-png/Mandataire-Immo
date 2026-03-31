import { CTAButton } from "./CTAButton"

const STEPS = [
  {
    number: "1",
    title: "Tu réponds à 8 minutes de questions.",
    text: "Ta zone précise (quartier, communes), tes biens en portefeuille, ton ton de communication, tes réseaux. C'est ce questionnaire qui rend tout personnalisé pour toi — et uniquement pour toi.",
    detail: "Fait une seule fois au démarrage",
  },
  {
    number: "2",
    title: "On prépare tout. Tu reçois dans 48h.",
    text: "Ton premier pack arrive dans ton espace client : 12 posts, 4 scripts vidéo, 2 articles SEO, 4 annonces, 1 newsletter. Et ton plan du mois — ce qu'on te recommande de publier, quand, sur quel réseau.",
    detail: "Livraison sous 48h, chaque mois",
  },
  {
    number: "3",
    title: "Tu publies. On s'adapte. Ton marketing grandit.",
    text: "Chaque mois, ton tableau de bord te montre tes recommandations actualisées. On ajuste selon ta saison, ton portefeuille, ce qui fonctionne pour toi. Tu n'as pas à y penser — on le fait pour toi.",
    detail: "Plan mis à jour chaque mois",
  },
] as const

export function HowItWorks() {
  return (
    <section className="section-padding bg-white" id="comment-ca-marche">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-4">
          Comment ça marche ?
        </h2>
        <p className="text-center text-body-lg text-neutral-500 mb-6 desktop:mb-10 max-w-xl mx-auto">
          Tu t&apos;inscris, on personnalise tout, et chaque mois ton plan
          marketing arrive&nbsp;—&nbsp;prêt à publier.
        </p>

        {/* Steps */}
        <div className="relative max-w-3xl mx-auto">
          {/* Ligne verticale de connexion (desktop) */}
          <div
            className="hidden desktop:block absolute left-[27px] top-12 bottom-12 w-px bg-border"
            aria-hidden="true"
          />

          <div className="space-y-8 desktop:space-y-10">
            {STEPS.map((step, index) => (
              <div key={index} className="flex items-start gap-6">
                {/* Numero */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-secondary flex items-center justify-center shadow-sm z-10">
                  <span className="font-display font-extrabold text-h3 text-white">
                    {step.number}
                  </span>
                </div>

                {/* Contenu */}
                <div className="flex-1 rounded-xl bg-card border border-border p-6 shadow-sm">
                  <h3 className="font-display text-h3 text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-body text-neutral-600 mb-3 leading-relaxed">
                    {step.text}
                  </p>
                  <span className="inline-block text-caption font-semibold text-secondary bg-secondary-50 px-3 py-1 rounded-full">
                    {step.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Apercu dashboard — encadre illustratif */}
        <div className="mt-12 desktop:mt-16 max-w-2xl mx-auto rounded-xl bg-primary border border-primary-600 p-6 desktop:p-8 shadow-xl">
          <p className="text-overline text-secondary uppercase tracking-widest mb-4">
            Ce que tu vois dans ton tableau de bord
          </p>

          {/* Simulation plan du mois */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-primary-700 rounded-lg p-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-white font-display font-bold text-caption flex items-center justify-center">
                1
              </span>
              <div>
                <p className="text-body-sm font-semibold text-white">
                  Publie 3 posts cette semaine
                </p>
                <p className="text-caption text-primary-200 mt-0.5">
                  2 posts quartier + 1 post expertise — tes contenus sont prêts
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-primary-700 rounded-lg p-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-white font-display font-bold text-caption flex items-center justify-center">
                2
              </span>
              <div>
                <p className="text-body-sm font-semibold text-white">
                  Lance ton article SEO dès lundi
                </p>
                <p className="text-caption text-primary-200 mt-0.5">
                  «&nbsp;Acheter un appartement à La Doutre, Angers&nbsp;» — rédigé, publie-le en 3 min
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-primary-700 rounded-lg p-4">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary text-white font-display font-bold text-caption flex items-center justify-center">
                3
              </span>
              <div>
                <p className="text-body-sm font-semibold text-white">
                  Ce mois-ci, priorité aux scripts Reels
                </p>
                <p className="text-caption text-primary-200 mt-0.5">
                  La vidéo est le format qui engage le plus en ce moment — 4 scripts prêts pour toi
                </p>
              </div>
            </div>
          </div>

          <p className="mt-4 text-caption text-primary-300 text-center">
            Exemple de tableau de bord ImmoCrew — ton plan du mois, personnalisé pour ta zone
          </p>
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <CTAButton
            href="#pricing"
            label="Voir les tarifs →"
            location="how_it_works_cta"
            variant="outline"
          />
        </div>
      </div>
    </section>
  )
}

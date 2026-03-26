const PROBLEMS = [
  {
    problem: "Tu postes 2 semaines, puis plus rien pendant 3 mois.",
    solution: "12 posts prêts chaque mois. Tu n'as qu'à publier.",
  },
  {
    problem:
      'Tes annonces disent toutes "bel appartement lumineux, proche commerces".',
    solution:
      "Des annonces qui racontent une histoire — avec le nom de ton quartier, les écoles, les commerces, l'ambiance.",
  },
  {
    problem: '45 minutes devant Canva le soir pour un résultat "bof".',
    solution:
      "Tout est fait. Tu ouvres, tu copies, tu colles, tu publies. 3 minutes, c'est réglé.",
  },
  {
    problem:
      "Zéro mandat entrant via le digital. Tout passe par le porte-à-porte.",
    solution:
      "Tes articles SEO te font apparaître sur Google. Tes posts te rendent visible sur Instagram. Les vendeurs te trouvent.",
  },
] as const

export function Problem() {
  return (
    <section className="section-padding bg-white" id="probleme">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-10 desktop:mb-16">
          Voil&agrave; ce que vivent 9 mandataires sur 10.
        </h2>

        <div className="grid gap-6 tablet:grid-cols-2">
          {PROBLEMS.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-card border border-border p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal"
            >
              {/* Probleme */}
              <div className="flex items-start gap-3 mb-4">
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-error-50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-error"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </span>
                <p className="text-body font-medium text-foreground">
                  {item.problem}
                </p>
              </div>

              {/* Solution */}
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-success-50 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                <p className="text-body text-neutral-600">{item.solution}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PILLARS = [
  {
    label: "C'est fait",
    title: "Tu reçois, tu publies. C'est tout.",
    text: "On ne te donne pas un outil de plus à apprendre. On ne te file pas des templates à personnaliser. Chaque mois, tu reçois tes 12 posts, tes 4 scripts vidéo, tes 4 articles SEO, tes 4 annonces et ton email de prospection. Tout est rédigé, tout est formaté. Tu copies, tu colles, tu retournes faire ton métier.",
    verbatim:
      "Je reçois, je publie, c'est tout. Je n'ai même pas ouvert Canva depuis 2 mois.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "C'est toi",
    title: "Personnalisé pour ta zone, tes biens, ton style.",
    text: "Tes posts parlent de ton quartier — pas \"de ta ville\". Tes articles SEO mentionnent les écoles à 500m, le marché du samedi, le prix au m² de ta rue. Tes annonces racontent l'histoire du bien, pas une fiche technique. Tes voisins vont croire que tu as écrit tout ça toi-même. Sauf que toi, tu aurais mis 3 heures.",
    verbatim:
      "Mes clients me demandent si j'ai pris un rédacteur. Non — j'ai pris ImmoCrew.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "C'est malin",
    title: "Ton plan du mois — tu sais quoi faire, quand, et pourquoi.",
    text: "Chaque mois, tu reçois ton plan de publication avec tes recommandations : combien poster, sur quels réseaux, quel type de contenu en priorité. Ton tableau de bord te dit ce qui fonctionne et ce qu'on te conseille pour le mois. Plus besoin de te demander « je poste quoi aujourd'hui ? » — c'est déjà décidé, et c'est justifié.",
    verbatim:
      "Avant, je postais quand j'y pensais. Maintenant j'ai un vrai plan chaque mois — et les gens me disent qu'ils me voient partout.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
] as const

export function Pillars() {
  return (
    <section className="section-padding bg-background" id="piliers">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-6 desktop:mb-10">
          Voilà ce qui change dès le 1er mois.
        </h2>

        <div className="grid gap-8 tablet:grid-cols-3">
          {PILLARS.map((pillar, index) => (
            <div
              key={index}
              className="rounded-xl bg-card border border-border p-6 desktop:p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-normal"
            >
              {/* Icon + label */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-secondary-50 text-secondary flex items-center justify-center">
                  {pillar.icon}
                </div>
                <span className="text-overline text-secondary uppercase tracking-widest">
                  {pillar.label}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-display text-h3 text-primary mb-3">
                {pillar.title}
              </h3>

              {/* Text */}
              <p className="text-body-sm text-neutral-600 mb-6 leading-relaxed">
                {pillar.text}
              </p>

              {/* Verbatim */}
              <blockquote className="border-l-2 border-secondary-200 pl-4">
                <p className="text-body-sm italic text-neutral-500">
                  «&nbsp;{pillar.verbatim}&nbsp;»
                </p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

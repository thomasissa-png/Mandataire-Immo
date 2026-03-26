const PILLARS = [
  {
    label: "C'est fait",
    title: "Tu re\u00E7ois, tu publies. C'est tout.",
    text: "On ne te donne pas un outil de plus \u00E0 apprendre. On ne te file pas des templates \u00E0 personnaliser. Chaque mois, tu re\u00E7ois tes 12 posts, tes 4 scripts vid\u00E9o, tes 2 articles SEO, tes 4 annonces et ton email de prospection. Tout est r\u00E9dig\u00E9, tout est format\u00E9. Tu copies, tu colles, tu retournes faire ton m\u00E9tier.",
    verbatim:
      "Je re\u00E7ois, je publie, c'est tout. Je n'ai m\u00EAme pas ouvert Canva depuis 2 mois.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "C'est toi",
    title: "Personnalis\u00E9 pour ta zone, tes biens, ton style.",
    text: "Tes posts parlent de ton quartier — pas \"de ta ville\". Tes articles SEO mentionnent les \u00E9coles \u00E0 500m, le march\u00E9 du samedi, le prix au m\u00B2 de ta rue. Tes annonces racontent l'histoire du bien, pas une fiche technique. Tes voisins vont croire que tu as \u00E9crit tout \u00E7a toi-m\u00EAme. Sauf que toi, tu aurais mis 3 heures.",
    verbatim:
      "On dirait que c'est moi qui l'ai \u00E9crit. Sauf que moi, j'aurais mis 3 heures et \u00E7a aurait \u00E9t\u00E9 moins bien.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "C'est malin",
    title: "Une vraie strat\u00E9gie, pas des posts au hasard.",
    text: "Poster 3 fois la m\u00EAme annonce, \u00E7a ne sert \u00E0 rien. Ton calendrier \u00E9ditorial est pens\u00E9 pour varier : posts expertise, posts humains, posts quartier, posts mandats. Tes articles SEO ciblent les requ\u00EAtes que les vendeurs tapent vraiment sur Google. Tout est calcul\u00E9 pour que tu sois visible l\u00E0 o\u00F9 \u00E7a compte.",
    verbatim:
      "Avant, je postais quand j'y pensais. Maintenant j'ai un vrai plan, et les gens me disent qu'ils me voient partout.",
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
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-10 desktop:mb-16">
          Ce qu&apos;ImmoCrew change pour toi.
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
                  &laquo;&nbsp;{pillar.verbatim}&nbsp;&raquo;
                </p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const PILLARS = [
  {
    label: "C'est fait",
    title: "Tu recois, tu publies. C'est tout.",
    text: "On ne te donne pas un outil de plus a apprendre. On ne te file pas des templates a personnaliser. Chaque mois, tu recois tes 12 posts, tes 4 scripts video, tes 2 articles SEO, tes 4 annonces et ton email de prospection. Tout est redige, tout est formate. Tu copies, tu colles, tu retournes faire ton metier.",
    verbatim:
      "Je recois, je publie, c'est tout. Je n'ai meme pas ouvert Canva depuis 2 mois.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "C'est toi",
    title: "Personnalise pour ta zone, tes biens, ton style.",
    text: "Tes posts parlent de ton quartier — pas \"de ta ville\". Tes articles SEO mentionnent les ecoles a 500m, le marche du samedi, le prix au m\u00B2 de ta rue. Tes annonces racontent l'histoire du bien, pas une fiche technique. Tes voisins vont croire que tu as ecrit tout ca toi-meme. Sauf que toi, tu aurais mis 3 heures.",
    verbatim:
      "On dirait que c'est moi qui l'ai ecrit. Sauf que moi, j'aurais mis 3 heures et ca aurait ete moins bien.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "C'est malin",
    title: "Une vraie strategie, pas des posts au hasard.",
    text: "Poster 3 fois la meme annonce, ca ne sert a rien. Ton calendrier editorial est pense pour varier : posts expertise, posts humains, posts quartier, posts mandats. Tes articles SEO ciblent les requetes que les vendeurs tapent vraiment sur Google. Tout est calcule pour que tu sois visible la ou ca compte.",
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

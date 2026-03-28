const EXAMPLES = [
  {
    title: "Appartement T3, quartier La Doutre, Angers",
    before:
      'Bel appartement T3 lumineux de 68m², 2 chambres, séjour traversant, cuisine équipée, balcon, cave et parking. Proche commerces et transports. Copropriété calme. 145 000€. Honoraires charge vendeur.',
    after: [
      "Ce T3 de 68m² à La Doutre, c'est le café du samedi matin sur le balcon plein sud, face au parc de la Garenne. L'école Montessori est à 400m, le marché couvert à 5 minutes à pied, et le tramway ligne A à deux rues.",
      "Deux vraies chambres (pas des \"coins nuit\"), un séjour traversant qui prend la lumière des deux côtés, une cuisine refaite en 2024. Cave et parking inclus. Copropriété de 12 lots, charges maîtrisées (120€/mois).",
      "145 000€ — soit 2 132€/m², en dessous de la moyenne du quartier (2 350€). Les biens à La Doutre partent en 45 jours. Celui-ci ne fera pas exception.",
    ],
  },
  {
    title: "Maison T4, quartier Aiguelongue, Montpellier",
    before:
      'Maison T4 avec jardin, 95m², 3 chambres, garage. Quartier résidentiel calme, proche écoles et commerces. Bon état général. 320 000€.',
    after: [
      "Une maison familiale à Aiguelongue, à 10 minutes à vélo de la Place de la Comédie. Le jardin de 250m² donne sur les vignes du Domaine de Méric — pas sur le mur du voisin.",
      "3 chambres à l'étage (dont une parentale avec placard intégré), un séjour de 35m² ouvert sur la cuisine, un garage reconvertible en bureau. L'école primaire Sibélius est à 600m, le collège Les Aiguerelles à 1,2 km.",
      "320 000€ pour 95m² à Aiguelongue, c'est 3 368€/m² — le quartier affiche 3 600€/m² en moyenne. Dernière maison vendue dans la rue : 345 000€ en février.",
    ],
  },
] as const

export function BeforeAfter() {
  return (
    <section className="section-padding bg-white" id="avant-apres">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-10 desktop:mb-16">
          La différence ? Regarde par toi-même.
        </h2>

        <div className="space-y-6 desktop:space-y-16">
          {EXAMPLES.map((example, index) => (
            <div key={index}>
              <div className="max-w-3xl mx-auto">
                <h3 className="font-display text-h3 text-primary mb-6 text-center">
                  {example.title}
                </h3>

                <div className="grid gap-6 tablet:grid-cols-2">
                  {/* AVANT */}
                  <div className="rounded-xl bg-neutral-100 border-l-4 border-error p-6">
                    <span className="text-overline text-error uppercase tracking-widest mb-3 block">
                      Avant
                    </span>
                    <p className="text-body-sm text-neutral-600 leading-relaxed italic">
                      {example.before}
                    </p>
                  </div>

                  {/* APRES */}
                  <div className="rounded-xl bg-white border-l-4 border-success p-6 shadow-sm">
                    <span className="text-overline text-success uppercase tracking-widest mb-3 block">
                      Après (version ImmoCrew)
                    </span>
                    <div className="space-y-3">
                      {example.after.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="text-body-sm text-foreground leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Separateur entre exemples */}
              {index < EXAMPLES.length - 1 && (
                <hr className="mt-6 desktop:mt-0 border-border max-w-xl mx-auto" />
              )}
            </div>
          ))}
        </div>

        {/* Mention legale */}
        <p className="mt-8 text-center text-caption text-neutral-400">
          Rédigé par l&apos;équipe ImmoCrew à partir de données locales réelles.
        </p>
      </div>
    </section>
  )
}

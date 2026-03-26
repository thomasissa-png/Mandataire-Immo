const EXAMPLES = [
  {
    title: "Appartement T3, quartier La Doutre, Angers",
    before:
      'Bel appartement T3 lumineux de 68m\u00B2, 2 chambres, s\u00E9jour traversant, cuisine \u00E9quip\u00E9e, balcon, cave et parking. Proche commerces et transports. Copropri\u00E9t\u00E9 calme. 145 000\u20AC. Honoraires charge vendeur.',
    after: [
      "Ce T3 de 68m\u00B2 \u00E0 La Doutre, c'est le caf\u00E9 du samedi matin sur le balcon plein sud, face au parc de la Garenne. L'\u00E9cole Montessori est \u00E0 400m, le march\u00E9 couvert \u00E0 5 minutes \u00E0 pied, et le tramway ligne A \u00E0 deux rues.",
      "Deux vraies chambres (pas des \"coins nuit\"), un s\u00E9jour traversant qui prend la lumi\u00E8re des deux c\u00F4t\u00E9s, une cuisine refaite en 2024. Cave et parking inclus. Copropri\u00E9t\u00E9 de 12 lots, charges ma\u00EEtris\u00E9es (120\u20AC/mois).",
      "145 000\u20AC — soit 2 132\u20AC/m\u00B2, en dessous de la moyenne du quartier (2 350\u20AC). Les biens \u00E0 La Doutre partent en 45 jours. Celui-ci ne fera pas exception.",
    ],
  },
  {
    title: "Maison T4, quartier Aiguelongue, Montpellier",
    before:
      'Maison T4 avec jardin, 95m\u00B2, 3 chambres, garage. Quartier r\u00E9sidentiel calme, proche \u00E9coles et commerces. Bon \u00E9tat g\u00E9n\u00E9ral. 320 000\u20AC.',
    after: [
      "Une maison familiale \u00E0 Aiguelongue, \u00E0 10 minutes \u00E0 v\u00E9lo de la Place de la Com\u00E9die. Le jardin de 250m\u00B2 donne sur les vignes du Domaine de M\u00E9ric — pas sur le mur du voisin.",
      "3 chambres \u00E0 l'\u00E9tage (dont une parentale avec placard int\u00E9gr\u00E9), un s\u00E9jour de 35m\u00B2 ouvert sur la cuisine, un garage reconvertible en bureau. L'\u00E9cole primaire Sib\u00E9lius est \u00E0 600m, le coll\u00E8ge Les Aiguerelles \u00E0 1,2 km.",
      "320 000\u20AC pour 95m\u00B2 \u00E0 Aiguelongue, c'est 3 368\u20AC/m\u00B2 — le quartier affiche 3 600\u20AC/m\u00B2 en moyenne. Derni\u00E8re maison vendue dans la rue : 345 000\u20AC en f\u00E9vrier.",
    ],
  },
] as const

export function BeforeAfter() {
  return (
    <section className="section-padding bg-white" id="avant-apres">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-10 desktop:mb-16">
          La diff&eacute;rence ? Regarde par toi-m&ecirc;me.
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
                      Apr&egrave;s (version ImmoCrew)
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

        {/* Mention IA legale */}
        <p className="mt-8 text-center text-caption text-neutral-400">
          Contenu produit avec assistance IA — relu et valid&eacute; par
          l&apos;&eacute;quipe ImmoCrew.
        </p>
      </div>
    </section>
  )
}

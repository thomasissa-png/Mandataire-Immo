const EXAMPLES = [
  {
    title: "Appartement T3, quartier La Doutre, Angers",
    before:
      'Bel appartement T3 lumineux de 68m\u00B2, 2 chambres, sejour traversant, cuisine equipee, balcon, cave et parking. Proche commerces et transports. Copropriete calme. 145 000\u20AC. Honoraires charge vendeur.',
    after: [
      "Ce T3 de 68m\u00B2 a La Doutre, c'est le cafe du samedi matin sur le balcon plein sud, face au parc de la Garenne. L'ecole Montessori est a 400m, le marche couvert a 5 minutes a pied, et le tramway ligne A a deux rues.",
      "Deux vraies chambres (pas des \"coins nuit\"), un sejour traversant qui prend la lumiere des deux cotes, une cuisine refaite en 2024. Cave et parking inclus. Copropriete de 12 lots, charges maitrisees (120\u20AC/mois).",
      "145 000\u20AC — soit 2 132\u20AC/m\u00B2, en dessous de la moyenne du quartier (2 350\u20AC). Les biens a La Doutre partent en 45 jours. Celui-ci ne fera pas exception.",
    ],
  },
  {
    title: "Maison T4, quartier Aiguelongue, Montpellier",
    before:
      'Maison T4 avec jardin, 95m\u00B2, 3 chambres, garage. Quartier residentiel calme, proche ecoles et commerces. Bon etat general. 320 000\u20AC.',
    after: [
      "Une maison familiale a Aiguelongue, a 10 minutes a velo de la Place de la Comedie. Le jardin de 250m\u00B2 donne sur les vignes du Domaine de Meric — pas sur le mur du voisin.",
      "3 chambres a l'etage (dont une parentale avec placard integre), un sejour de 35m\u00B2 ouvert sur la cuisine, un garage reconvertible en bureau. L'ecole primaire Sibelius est a 600m, le college Les Aiguerelles a 1,2 km.",
      "320 000\u20AC pour 95m\u00B2 a Aiguelongue, c'est 3 368\u20AC/m\u00B2 — le quartier affiche 3 600\u20AC/m\u00B2 en moyenne. Derniere maison vendue dans la rue : 345 000\u20AC en fevrier.",
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

        <div className="space-y-10 desktop:space-y-16">
          {EXAMPLES.map((example, index) => (
            <div key={index} className="max-w-3xl mx-auto">
              <h3 className="font-display text-h3 text-primary mb-6 text-center">
                {example.title}
              </h3>

              <div className="grid gap-6 tablet:grid-cols-2">
                {/* AVANT */}
                <div className="rounded-lg bg-neutral-50 border-l-4 border-error p-6">
                  <span className="text-overline text-error uppercase tracking-widest mb-3 block">
                    Avant
                  </span>
                  <p className="text-body-sm text-neutral-600 leading-relaxed italic">
                    {example.before}
                  </p>
                </div>

                {/* APRES */}
                <div className="rounded-lg bg-white border-l-4 border-success p-6 shadow-sm">
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
          ))}
        </div>

        {/* Mention IA legale */}
        <p className="mt-8 text-center text-small text-neutral-400">
          Contenu produit avec assistance IA — relu et valid&eacute; par
          l&apos;&eacute;quipe ImmoCrew.
        </p>
      </div>
    </section>
  )
}

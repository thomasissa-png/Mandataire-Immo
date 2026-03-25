{/*
  NOTE : Les temoignages ci-dessous sont des templates du brand-platform.
  Ils NE DOIVENT PAS etre publies tels quels en production.
  A remplacer par de vrais temoignages des que disponibles.
  En attendant, les metriques et avant/apres font office de preuve sociale.
*/}

const TESTIMONIALS = [
  {
    quote:
      "Je recois mes posts le 1er du mois. Je les publie au fil des jours. Ca me prend 3 minutes par jour et j'ai enfin un Instagram qui ressemble a quelque chose. Mes clients me disent 'je te vois partout en ce moment'. Ca fait plaisir.",
    name: "Marie",
    role: "Mandataire IAD, Toulouse",
    experience: "2 ans d'experience",
  },
  {
    quote:
      "J'avais paye un community manager 600\u20AC/mois. En 3 mois, rien. Avec ImmoCrew, j'ai eu mes premiers contenus en 48h et honnetement, c'est meilleur que ce que le CM faisait.",
    name: "Thomas",
    role: "Mandataire SAFTI, Bordeaux",
    experience: "6 ans d'experience",
  },
] as const

export function SocialProof() {
  return (
    <section className="section-padding bg-background">
      <div className="container-immocrew">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-10 desktop:mb-16">
          Elles font le m&ecirc;me m&eacute;tier que toi.
        </h2>

        {/* Temoignages */}
        <div className="grid gap-6 tablet:grid-cols-2 max-w-3xl mx-auto mb-12">
          {TESTIMONIALS.map((testimonial, index) => (
            <blockquote
              key={index}
              className="rounded-xl bg-card border border-border p-6 shadow-sm"
            >
              <p className="text-body text-foreground leading-relaxed mb-4">
                &laquo;&nbsp;{testimonial.quote}&nbsp;&raquo;
              </p>
              <footer className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                  <span className="font-display font-bold text-body-sm text-primary">
                    {testimonial.name[0]}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-body-sm text-primary">
                    {testimonial.name}
                  </p>
                  <p className="text-caption text-neutral-500">
                    {testimonial.role} &middot; {testimonial.experience}
                  </p>
                </div>
              </footer>
            </blockquote>
          ))}
        </div>

        {/* Logos reseaux */}
        <div className="text-center">
          <p className="text-body-sm text-neutral-500 mb-4">
            Nos clients viennent de :
          </p>
          <div className="flex items-center justify-center gap-8 text-neutral-400">
            <span className="font-display font-bold text-h4">IAD</span>
            <span className="font-display font-bold text-h4">SAFTI</span>
            <span className="font-display font-bold text-h4">Capifrance</span>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState } from "react"

const FAQ_ITEMS = [
  {
    question: "C'est quoi exactement ImmoCrew ?",
    answer:
      "ImmoCrew, c'est ton equipe marketing externalisee. Chaque mois, on redige pour toi tes posts, tes articles SEO, tes annonces immobilieres et tes scripts video. Tout est personnalise pour ta zone, tes biens et ton ton. Tu recois, tu publies, tu te concentres sur ton metier. On n'est pas un outil — on est une equipe qui bosse pour toi.",
  },
  {
    question: "Le contenu est fait par une IA ?",
    answer:
      "On utilise des outils IA pour personnaliser chaque contenu a ta zone (quartier, ecoles, prix au m\u00B2, transports). Mais chaque livrable est relu, ajuste et valide par notre equipe avant de t'etre envoye. Le resultat ? Du contenu qui sonne comme toi, pas comme un robot. On est transparents la-dessus : l'IA nous aide a etre rapides et precis. L'humain garantit que c'est naturel et juste.",
  },
  {
    question: "Comment c'est personnalise pour ma zone ?",
    answer:
      "Quand tu commences, on te pose une vingtaine de questions : ta ville, ton quartier precis, ta specialite (appartements, maisons, neuf, ancien), ton ton de communication, tes biens en cours. A partir de la, chaque contenu integre des donnees locales reelles — les ecoles du quartier, les commerces, les prix au m\u00B2, les transports, l'ambiance. Pas juste le nom de ta ville en gras.",
  },
  {
    question: "150\u20AC/mois, c'est rentable ?",
    answer:
      "Fais le calcul autrement. Combien d'heures passes-tu sur ton marketing par mois — entre Canva, les idees de posts, les annonces a rediger ? Si c'est 10 heures, c'est 10 heures que tu ne passes pas en prospection ou en visites. 150\u20AC/mois, c'est te racheter ces heures-la. Et si en plus ca t'amene un contact vendeur de plus dans l'annee — et ca arrive, parce que tu es enfin visible sur Google — ta commission rembourse 12 mois d'abonnement. Mais meme sans ca : ton temps vaut plus que 5\u20AC par jour.",
  },
  {
    question: "Je n'ai vraiment pas le temps de publier, meme du contenu tout fait.",
    answer:
      "Publier un post ImmoCrew, c'est 3 minutes. Tu ouvres ton espace client, tu copies le texte, tu le colles sur Instagram ou Facebook, tu publies. Pas 45 minutes devant Canva a chercher des idees. 3 minutes par jour, meme entre deux visites. Et si tu preferes tout publier le dimanche soir pour la semaine, ca marche aussi.",
  },
  {
    question: "Mon reseau IAD (ou SAFTI) me donne deja des templates.",
    answer:
      "Les templates de ton reseau, c'est le meme visuel pour 18 000 mandataires. Ton voisin IAD a exactement le meme post que toi. Avec ImmoCrew, chaque contenu parle de ton quartier, de tes biens, de ton expertise a toi. C'est la difference entre porter un uniforme et avoir un costume sur mesure.",
  },
  {
    question: "J'ai deja essaye un community manager freelance et c'etait decevant.",
    answer:
      "On comprend. Le probleme des CM freelance, c'est qu'ils ne connaissent pas l'immobilier. Ils postent des trucs generiques avec des hashtags random. ImmoCrew est fait uniquement pour les mandataires immobiliers. Nos redacteurs connaissent ton metier, tes frustrations, tes clients. Et a 150\u20AC/mois au lieu de 500-800\u20AC, le risque est nettement plus faible.",
  },
  {
    question: "Comment je recois mes livrables ?",
    answer:
      "Tu as un espace client en ligne. Chaque mois, tu te connectes, tes livrables sont la : posts, articles, annonces, scripts video. Tu peux les copier en un clic. Pas de pieces jointes par email, pas de fichiers a telecharger, pas de format bizarre. Tout est pret, tout est accessible depuis ton telephone.",
  },
  {
    question: "Je peux arreter quand je veux ?",
    answer:
      "Oui. Le Pack Mensuel est sans engagement. Tu peux resilier a tout moment, en un clic depuis ton espace client. Pas de frais caches, pas de preavis de 3 mois, pas de coup de fil pour te retenir. Et pour le Pack Lancement, tu as une garantie satisfait ou rembourse de 14 jours.",
  },
  {
    question: "Qui est derriere ImmoCrew ?",
    answer:
      "ImmoCrew a ete cree par un entrepreneur qui a travaille avec des dizaines de mandataires immobiliers et qui connait une frustration universelle : vous etes des pros de l'immobilier, pas du marketing digital. Notre mission, c'est de vous donner acces a une equipe marketing de qualite, a un prix qui fait sens pour un independant. Pas une usine a gaz, pas un logiciel de plus — juste du contenu pro, personnalise, livre chaque mois.",
  },
] as const

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  return (
    <div
      className={`rounded-lg border transition-all duration-slow ${
        isOpen
          ? "border-secondary shadow-sm"
          : "border-border"
      } bg-card`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left px-6 py-4 min-h-[56px] hover:bg-neutral-50 transition-colors duration-fast rounded-t-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
      >
        <span className="font-display text-h4 text-primary pr-4">
          {question}
        </span>
        <svg
          className={`w-5 h-5 text-neutral-400 flex-shrink-0 transition-transform duration-slow ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        id={`faq-panel-${index}`}
        className={`overflow-hidden transition-all duration-slow ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">
          <p className="text-body text-neutral-600 leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="section-padding bg-background" id="faq">
      <div className="container-immocrew max-w-3xl">
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-10 desktop:mb-16">
          Tu as des questions ? C&apos;est normal.
        </h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              index={index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  )
}

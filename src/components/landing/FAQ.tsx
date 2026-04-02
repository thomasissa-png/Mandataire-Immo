"use client"

import { useState } from "react"
import { PACK_MENSUEL, PRIX_MIN_MENSUEL, formatPrice, formatStartingPrice } from "@/lib/pricing"

const FAQ_ITEMS = [
  {
    question: "C'est quoi exactement ImmoCrew ?",
    answer:
      "ImmoCrew, c'est ton équipe marketing externalisée. Chaque mois, on rédige pour toi tes posts, tes articles SEO, tes annonces immobilières et tes scripts vidéo. Tout est personnalisé pour ta zone, tes biens et ton ton. Tu reçois, tu publies, tu te concentres sur ton métier. On n'est pas un outil — on est une équipe qui bosse pour toi, chaque mois, sans que t'aies à demander.",
  },
  {
    question: "Le contenu est fait par une IA ?",
    answer:
      "On utilise des outils IA pour personnaliser chaque texte à ta zone (quartier, écoles, prix au m², transports). Mais chaque contenu est relu, ajusté et validé par notre équipe avant de t'être envoyé. Le résultat ? Du texte qui sonne comme toi, pas comme un robot. On est transparents là-dessus : l'IA nous aide à être rapides et précis. L'humain garantit que c'est naturel et juste.",
  },
  {
    question: "Comment c'est personnalisé pour ma zone ?",
    answer:
      "Quand tu commences, on te pose une vingtaine de questions : ta ville, ton quartier précis, ta spécialité (appartements, maisons, neuf, ancien), ton ton de communication, tes biens en cours. À partir de là, chaque texte intègre des données locales réelles — les écoles du quartier, les commerces, les prix au m², les transports, l'ambiance. Pas juste le nom de ta ville en gras.",
  },
  {
    question: `${formatStartingPrice()}, c'est rentable ?`,
    answer:
      `Fais le calcul autrement. Combien d'heures passes-tu sur ton marketing par mois — entre Canva, les idées de posts, les annonces à rédiger ? Si c'est 10 heures, c'est 10 heures que tu ne passes pas en prospection ou en visites. ${PRIX_MIN_MENSUEL}€ à ${PACK_MENSUEL.price}€/mois, c'est te racheter ces heures-là. Et si en plus ça t'amène un contact vendeur de plus dans l'année — et ça arrive, parce que tu es enfin visible sur Google — ta commission rembourse 12 mois d'abonnement. Mais même sans ça : ton temps vaut plus que 5€ par jour.`,
  },
  {
    question: "Quelle formule choisir ?",
    answer:
      `Tu veux tester sans engagement ? Prends le Mensuel à ${PACK_MENSUEL.price}€/mois — tu peux arrêter quand tu veux. Tu es déjà convaincue et tu veux économiser ? Le Trimestriel à 120€/mois (-20%) est le meilleur rapport qualité-prix. Tu veux le tarif le plus bas possible ? L'Annuel à ${PRIX_MIN_MENSUEL}€/mois te fait économiser 33%, soit 4 mois offerts. Les 3 formules incluent exactement le même contenu et le setup du mois 1.`,
  },
  {
    question: "Je n'ai vraiment pas le temps de publier, même du contenu tout fait.",
    answer:
      "Publier un post ImmoCrew, c'est 3 minutes. Tu ouvres ton espace client, tu copies le texte, tu le colles sur Instagram ou Facebook, tu publies. Pas 45 minutes devant Canva à chercher des idées. 3 minutes par jour, même entre deux visites. Et si tu préfères tout publier le dimanche soir pour la semaine, ça marche aussi.",
  },
  {
    question: "Mon réseau me donne déjà des templates.",
    answer:
      "Les templates de ton réseau, c'est le même visuel pour 18 000 mandataires. Ton voisin a exactement le même post que toi. Avec ImmoCrew, chaque texte parle de ton quartier, de tes biens, de ton expertise à toi. C'est la différence entre porter un uniforme et avoir un costume sur mesure.",
  },
  {
    question: "J'ai déjà essayé un community manager freelance et c'était décevant.",
    answer:
      `On comprend. Le problème des freelances, c'est qu'ils ne connaissent pas l'immobilier. Ils postent des trucs génériques avec des hashtags au hasard. ImmoCrew est fait uniquement pour les mandataires. Nos rédacteurs connaissent ton métier, tes frustrations, tes clients. Et à partir de ${PRIX_MIN_MENSUEL}€/mois au lieu de 500-800€, le risque est nettement plus faible.`,
  },
  {
    question: "Comment je reçois mes posts et articles ?",
    answer:
      "Tu as un espace client en ligne. Chaque mois, tu te connectes, tes posts et articles sont là — prêts à copier en un clic. Pas de pièces jointes par email, pas de fichiers à télécharger, pas de format bizarre. Tout est prêt, tout est accessible depuis ton téléphone.",
  },
  {
    question: "Qu'est-ce que je vois exactement dans mon espace client ?",
    answer:
      "Ton espace client, c'est deux choses. D'abord tes contenus du mois : tes 12 posts, tes articles, tes annonces, tes scripts — prêts à copier. Et ensuite ton plan du mois : ce qu'on te recommande de publier en priorité, sur quel réseau, à quelle fréquence. Tu n'as pas à réfléchir à ce que tu fais — c'est déjà décidé pour toi, avec les explications.",
  },
  {
    question: "Comment tu sais ce qui va marcher pour MOI dans mon quartier ?",
    answer:
      "Tout commence par ton questionnaire d'onboarding : ta zone précise, tes biens, ton style de communication, tes réseaux actifs. À partir de là, chaque contenu et chaque recommandation est calé sur ton profil — pas sur un mandataire générique. On connaît les tendances de ta saison immobilière locale, les requêtes Google de tes futurs vendeurs, les types de posts qui fonctionnent dans ton secteur. C'est ça, la différence entre un template et une vraie stratégie personnalisée.",
  },
  {
    question: "Je peux arrêter quand je veux ?",
    answer:
      "Oui. La formule Mensuel est sans engagement. Tu peux résilier à tout moment, en un clic depuis ton espace client. Pas de frais cachés, pas de préavis de 3 mois, pas de coup de fil pour te retenir. Les formules Trimestriel et Annuel s'engagent sur leur période, avec résiliation à chaque échéance.",
  },
  {
    question: "Qui est derrière ImmoCrew ?",
    answer:
      "ImmoCrew a été créé par un entrepreneur qui a travaillé avec des dizaines de mandataires et qui connaît une frustration universelle : tu es pro de l'immobilier, pas du marketing. Notre mission, c'est de te donner accès à une équipe de qualité, à un prix qui fait sens pour un indépendant. Pas une usine à gaz, pas un outil de plus — juste tes posts et tes articles, personnalisés, livrés chaque mois.",
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
          className={`w-5 h-5 flex-shrink-0 transition-transform duration-slow ${
            isOpen ? "rotate-180 text-secondary" : "text-neutral-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
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
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
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
        <h2 className="font-display text-h1 desktop:text-display-lg text-primary text-center mb-6 desktop:mb-10">
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

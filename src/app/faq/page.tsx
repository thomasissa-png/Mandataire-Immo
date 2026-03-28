import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { JsonLd } from "@/components/JsonLd"
import { PACK_LANCEMENT, PACK_MENSUEL, PACK_BOOST, formatPrice, formatPriceTTC } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "FAQ ImmoCrew — Toutes les réponses pour les mandataires immobiliers",
  description:
    "Questions fréquentes sur ImmoCrew : prix, fonctionnement, personnalisation, résiliation, RGPD. Tout ce qu'un mandataire immobilier doit savoir avant de s'abonner.",
  alternates: {
    canonical: "https://immocrew.fr/faq",
  },
  openGraph: {
    title: "FAQ ImmoCrew — Toutes les réponses pour les mandataires immobiliers",
    description:
      "Questions fréquentes sur ImmoCrew : prix, fonctionnement, personnalisation, résiliation, RGPD.",
    url: "https://immocrew.fr/faq",
  },
}

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Qu'est-ce qu'ImmoCrew ?",
    answer:
      "ImmoCrew est un service de marketing clé en main destiné aux mandataires immobiliers indépendants en France. Chaque mois, le mandataire reçoit ses contenus marketing complets (12 posts réseaux sociaux, 2 articles SEO local, 4 annonces personnalisées, 4 scripts vidéo, 1 newsletter, 1 email de prospection), personnalisés pour sa zone géographique et prêts à publier. Il n'y a aucun outil à configurer, aucun template à adapter.",
  },
  {
    question: "Comment fonctionne ImmoCrew ?",
    answer:
      "Le fonctionnement se résume en 3 étapes. Étape 1 : tu remplis un questionnaire d'onboarding de 7 minutes (ta zone, ton réseau, ta spécialité, ton ton de communication). Étape 2 : l'équipe ImmoCrew produit tes contenus personnalisés avec les données de ta zone. Étape 3 : tu reçois tes contenus le 1er du mois dans ton espace client. Tu copies, tu publies. 3 minutes par post.",
  },
  {
    question: "Combien coûte ImmoCrew ?",
    answer:
      `ImmoCrew propose trois formules. Le ${PACK_MENSUEL.name} à ${formatPriceTTC(PACK_MENSUEL)} par mois (sans engagement) inclut le contenu mensuel complet : 12 posts, 4 scripts vidéo, 2 articles SEO, 4 annonces, 1 newsletter, 1 email de prospection. Le ${PACK_LANCEMENT.name} à ${formatPriceTTC(PACK_LANCEMENT)} (one-shot) fournit un kit de démarrage complet avec 20 posts, 5 articles SEO, 10 scripts Reels et un calendrier éditorial sur 30 jours. Le ${PACK_BOOST.name} à ${formatPriceTTC(PACK_BOOST)} par bien met un bien spécifique en avant avec une annonce storytelling, 3 posts dédiés, 1 Reel, 1 mini landing page et 1 email blast.`,
  },
  {
    question: "Qui utilise ImmoCrew ?",
    answer:
      "ImmoCrew est conçu pour les mandataires immobiliers indépendants rattachés à des réseaux comme IAD France, SAFTI, Capifrance, Optimhome, BSK Immobilier ou Expertimo. Ces professionnels exercent souvent seuls, sans équipe marketing, et n'ont pas le temps de gérer eux-mêmes leur présence digitale. Le marché des mandataires indépendants représente environ 40 000 à 50 000 professionnels actifs en France (source : Baromètre LMDM 2023).",
  },
  {
    question: "Quelle est la différence entre ImmoCrew et un community manager freelance ?",
    answer:
      `Un community manager freelance facture généralement entre 500€ et 800€ par mois pour du contenu souvent générique, avec des délais variables et un résultat dépendant de la personne. ImmoCrew est un service productisé à prix fixe (${formatPrice(PACK_MENSUEL)}) avec un volume de contenus garanti chaque mois, personnalisés pour la zone géographique exacte du mandataire. Le mandataire sait exactement ce qu'il reçoit, quand il le reçoit, et combien ça coûte.`,
  },
  {
    question: "Quelle est la différence entre ImmoCrew et une plateforme SaaS de marketing ?",
    answer:
      "Une plateforme SaaS fournit un outil que le mandataire doit utiliser lui-même : choisir des templates, les adapter, programmer les publications. ImmoCrew est un service, pas un outil. Le mandataire ne configure rien. Il reçoit ses contenus terminés, personnalisés avec les données de sa zone (quartier, prix au m², écoles, commerces), prêts à publier sans modification. C'est la différence entre cuisiner soi-même avec un robot et se faire livrer un plat prêt.",
  },
  {
    question: "Les contenus sont-ils générés par intelligence artificielle ?",
    answer:
      "ImmoCrew utilise des outils d'IA pour personnaliser chaque contenu à la zone et aux biens du mandataire. Tous les contenus sont ensuite relus et validés par l'équipe avant livraison. Conformément au Règlement européen sur l'Intelligence Artificielle (AI Act), la mention « contenu produit avec assistance IA — relu et validé par l'équipe ImmoCrew » figure sur les contenus concernés.",
  },
  {
    question: "Comment sont personnalisés les contenus ?",
    answer:
      "Chaque contenu intègre des données spécifiques à la zone du mandataire : nom du quartier exact (pas juste la ville), établissements scolaires dans un rayon de 1 km, prix au m² moyen de la rue ou du quartier, commerces et transports de proximité. Ces données sont intégrées dans chaque post, article SEO et annonce. Les articles SEO ciblent des requêtes locales précises comme « vendre appartement [quartier] [ville] ».",
  },
  {
    question: "Peut-on résilier à tout moment ?",
    answer:
      "Oui. Le Pack Mensuel est sans engagement. La résiliation est libre, sans frais, depuis l'espace client ou par email à contact@immocrew.fr. Elle prend effet à la fin de la période mensuelle en cours. Les contenus déjà livrés restent accessibles. Le Pack Lancement bénéficie d'une garantie satisfait ou remboursé de 14 jours.",
  },
  {
    question: "Combien de temps faut-il pour publier les contenus ?",
    answer:
      "Environ 3 minutes par post. Le mandataire reçoit ses contenus prêts à publier dans son espace client. Il lui suffit de copier le texte et de le coller sur son réseau social (LinkedIn, Instagram, Facebook). L'onboarding initial (questionnaire) prend environ 7 minutes. Après ça, la routine mensuelle ne demande aucune création de contenu.",
  },
  {
    question: "Qu'est-ce qu'un Boost Mandat ?",
    answer:
      `Le ${PACK_BOOST.name} est une prestation ponctuelle à ${PACK_BOOST.price}€ TTC par bien, en complément du ${PACK_MENSUEL.name}. Il met un bien spécifique en avant avec : 1 annonce storytelling qui sort du lot, 3 posts dédiés au bien et 1 Reel, 1 mini landing page du bien, et 1 email blast vers la base d'acheteurs du mandataire. C'est conçu pour accélérer la vente d'un mandat précis.`,
  },
  {
    question: "ImmoCrew fonctionne-t-il pour tous les réseaux de mandataires ?",
    answer:
      "Oui. ImmoCrew est compatible avec tous les réseaux de mandataires français : IAD France, SAFTI, Capifrance, Optimhome, BSK Immobilier, Expertimo, MegAgence et tout réseau de mandataires indépendants. Les contenus sont personnalisés pour chaque mandataire individuellement, sans contrainte liée au réseau d'appartenance.",
  },
  {
    question: "Comment sont protégées mes données ?",
    answer:
      "ImmoCrew respecte le Règlement Général sur la Protection des Données (RGPD). Les données collectées lors de l'onboarding sont des données professionnelles (zone géographique, spécialité, ton de communication) utilisées uniquement pour produire les contenus. Elles ne sont pas revendues ni partagées avec des tiers. Les données transmises à l'IA de production ne sont pas utilisées pour l'entraînement des modèles. La politique de confidentialité complète est disponible sur immocrew.fr/confidentialite.",
  },
  {
    question: "ImmoCrew crée-t-il mes visuels et mes photos ?",
    answer:
      "Non. ImmoCrew produit les contenus rédactionnels : textes de posts, articles, annonces, scripts vidéo, newsletters. Les visuels (photos de biens, portraits, créations graphiques) ne sont pas inclus dans le service. Le brief d'identité visuelle fourni dans le Pack Lancement donne des recommandations pour créer une identité cohérente, mais la production graphique reste à la charge du mandataire.",
  },
  {
    question: "Puis-je voir un exemple de contenu avant de m'abonner ?",
    answer:
      "Oui. La page d'accueil d'immocrew.fr présente des exemples avant/après d'annonces immobilières produites par ImmoCrew. Ces exemples montrent la différence entre une annonce standard et une annonce storytelling personnalisée pour une zone précise. Le Pack Lancement bénéficie également d'une garantie satisfait ou remboursé de 14 jours.",
  },
  {
    question: "ImmoCrew inclut-il des articles pour le référencement local (SEO) ?",
    answer:
      "Oui. Chaque Pack Mensuel inclut 2 articles SEO local par mois. Ces articles ciblent des requêtes comme « mandataire immobilier [ville] », « vendre appartement [quartier] » ou « estimation bien immobilier [zone] ». Ils sont structurés pour améliorer la visibilité organique du mandataire dans les résultats Google locaux.",
  },
]

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
}

export default function FAQPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <Header />
      <main className="bg-background min-h-screen">
        <div className="container-immocrew py-12 desktop:py-20">
          <article className="max-w-3xl mx-auto">
            {/* H1 */}
            <h1 className="font-display text-h1 desktop:text-display-lg font-bold text-primary mb-3">
              FAQ ImmoCrew &mdash; Toutes les r&eacute;ponses pour les mandataires immobiliers
            </h1>
            <p className="text-body-lg text-neutral-500 mb-10 desktop:mb-14">
              Tu te poses des questions sur ImmoCrew ? Tu trouveras ici les r&eacute;ponses
              les plus fr&eacute;quentes sur le fonctionnement, les prix, la personnalisation
              et les garanties du service.
            </p>

            {/* FAQ items */}
            <div className="space-y-8">
              {FAQ_ITEMS.map((item, index) => (
                <section
                  key={index}
                  className="rounded-xl bg-card border border-border p-6 desktop:p-8"
                >
                  <h2 className="font-display text-h4 font-bold text-primary-800 mb-3">
                    {item.question}
                  </h2>
                  <p className="text-body text-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </section>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-14 rounded-xl bg-primary p-8 desktop:p-10 text-center">
              <p className="font-display text-h3 text-white mb-3">
                Tu n&rsquo;as pas trouv&eacute; ta r&eacute;ponse ?
              </p>
              <p className="text-body text-primary-200 mb-6">
                &Eacute;cris-nous &agrave;{" "}
                <a
                  href="mailto:contact@immocrew.fr"
                  className="text-secondary underline underline-offset-2 hover:text-secondary-300 transition-colors"
                >
                  contact@immocrew.fr
                </a>
                {" "}&mdash; on r&eacute;pond en moins de 24h.
              </p>
              <a
                href="/#pricing"
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                D&eacute;couvrir les offres &rarr;
              </a>
            </div>

            {/* Retour */}
            <div className="mt-12 pt-8 border-t border-primary-100">
              <Link
                href="/"
                className="text-secondary font-semibold hover:text-secondary-700 transition-colors"
              >
                &larr; Retour &agrave; l&rsquo;accueil
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

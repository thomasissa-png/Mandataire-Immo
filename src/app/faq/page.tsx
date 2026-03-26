import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { JsonLd } from "@/components/JsonLd"
import { PACK_LANCEMENT, PACK_MENSUEL, PACK_BOOST, formatPrice, formatPriceTTC } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "FAQ ImmoCrew \u2014 Toutes les r\u00e9ponses pour les mandataires immobiliers",
  description:
    "Questions fr\u00e9quentes sur ImmoCrew : prix, fonctionnement, personnalisation, r\u00e9siliation, RGPD. Tout ce qu\u2019un mandataire immobilier doit savoir avant de s\u2019abonner.",
  alternates: {
    canonical: "https://immocrew.fr/faq",
  },
  openGraph: {
    title: "FAQ ImmoCrew \u2014 Toutes les r\u00e9ponses pour les mandataires immobiliers",
    description:
      "Questions fr\u00e9quentes sur ImmoCrew : prix, fonctionnement, personnalisation, r\u00e9siliation, RGPD.",
    url: "https://immocrew.fr/faq",
  },
}

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "Qu\u2019est-ce qu\u2019ImmoCrew ?",
    answer:
      "ImmoCrew est un service de marketing cl\u00e9 en main destin\u00e9 aux mandataires immobiliers ind\u00e9pendants en France. Chaque mois, le mandataire re\u00e7oit ses contenus marketing complets (12 posts r\u00e9seaux sociaux, 2 articles SEO local, 4 annonces personnalis\u00e9es, 4 scripts vid\u00e9o, 1 newsletter, 1 email de prospection), personnalis\u00e9s pour sa zone g\u00e9ographique et pr\u00eats \u00e0 publier. Il n\u2019y a aucun outil \u00e0 configurer, aucun template \u00e0 adapter.",
  },
  {
    question: "Comment fonctionne ImmoCrew ?",
    answer:
      "Le fonctionnement se r\u00e9sume en 3 \u00e9tapes. \u00c9tape 1 : tu remplis un questionnaire d\u2019onboarding de 7 minutes (ta zone, ton r\u00e9seau, ta sp\u00e9cialit\u00e9, ton ton de communication). \u00c9tape 2 : l\u2019\u00e9quipe ImmoCrew produit tes contenus personnalis\u00e9s avec les donn\u00e9es de ta zone. \u00c9tape 3 : tu re\u00e7ois tes livrables le 1er du mois dans ton espace client. Tu copies, tu publies. 3 minutes par post.",
  },
  {
    question: "Combien co\u00fbte ImmoCrew ?",
    answer:
      `ImmoCrew propose trois formules. Le ${PACK_MENSUEL.name} à ${formatPriceTTC(PACK_MENSUEL)} par mois (sans engagement) inclut le contenu mensuel complet : 12 posts, 4 scripts vidéo, 2 articles SEO, 4 annonces, 1 newsletter, 1 email de prospection. Le ${PACK_LANCEMENT.name} à ${formatPriceTTC(PACK_LANCEMENT)} (one-shot) fournit un kit de démarrage complet avec 20 posts, 5 articles SEO, 10 scripts Reels et un calendrier éditorial sur 30 jours. Le ${PACK_BOOST.name} à ${formatPriceTTC(PACK_BOOST)} par bien met un bien spécifique en avant avec une annonce storytelling, 3 posts dédiés, 1 Reel, 1 mini landing page et 1 email blast.`,
  },
  {
    question: "Qui utilise ImmoCrew ?",
    answer:
      "ImmoCrew est con\u00e7u pour les mandataires immobiliers ind\u00e9pendants rattach\u00e9s \u00e0 des r\u00e9seaux comme IAD France, SAFTI, Capifrance, Optimhome, BSK Immobilier ou Expertimo. Ces professionnels exercent souvent seuls, sans \u00e9quipe marketing, et n\u2019ont pas le temps de g\u00e9rer eux-m\u00eames leur pr\u00e9sence digitale. Le march\u00e9 des mandataires ind\u00e9pendants repr\u00e9sente environ 40 000 \u00e0 50 000 professionnels actifs en France (source : Barom\u00e8tre LMDM 2023).",
  },
  {
    question: "Quelle est la diff\u00e9rence entre ImmoCrew et un community manager freelance ?",
    answer:
      `Un community manager freelance facture généralement entre 500€ et 800€ par mois pour du contenu souvent générique, avec des délais variables et un résultat dépendant de la personne. ImmoCrew est un service productisé à prix fixe (${formatPrice(PACK_MENSUEL)}) avec un volume de livrables garanti chaque mois, personnalisés pour la zone géographique exacte du mandataire. Le mandataire sait exactement ce qu'il reçoit, quand il le reçoit, et combien ça coûte.`,
  },
  {
    question: "Quelle est la diff\u00e9rence entre ImmoCrew et une plateforme SaaS de marketing ?",
    answer:
      "Une plateforme SaaS fournit un outil que le mandataire doit utiliser lui-m\u00eame : choisir des templates, les adapter, programmer les publications. ImmoCrew est un service, pas un outil. Le mandataire ne configure rien. Il re\u00e7oit ses contenus termin\u00e9s, personnalis\u00e9s avec les donn\u00e9es de sa zone (quartier, prix au m\u00b2, \u00e9coles, commerces), pr\u00eats \u00e0 publier sans modification. C\u2019est la diff\u00e9rence entre cuisiner soi-m\u00eame avec un robot et se faire livrer un plat pr\u00eat.",
  },
  {
    question: "Les contenus sont-ils g\u00e9n\u00e9r\u00e9s par intelligence artificielle ?",
    answer:
      "ImmoCrew utilise des outils d\u2019IA pour personnaliser chaque contenu \u00e0 la zone et aux biens du mandataire. Tous les contenus sont ensuite relus et valid\u00e9s par l\u2019\u00e9quipe avant livraison. Conform\u00e9ment au R\u00e8glement europ\u00e9en sur l\u2019Intelligence Artificielle (AI Act), la mention \u00ab contenu produit avec assistance IA \u2014 relu et valid\u00e9 par l\u2019\u00e9quipe ImmoCrew \u00bb figure sur les livrables concern\u00e9s.",
  },
  {
    question: "Comment sont personnalis\u00e9s les contenus ?",
    answer:
      "Chaque contenu int\u00e8gre des donn\u00e9es sp\u00e9cifiques \u00e0 la zone du mandataire : nom du quartier exact (pas juste la ville), \u00e9tablissements scolaires dans un rayon de 1 km, prix au m\u00b2 moyen de la rue ou du quartier, commerces et transports de proximit\u00e9. Ces donn\u00e9es sont int\u00e9gr\u00e9es dans chaque post, article SEO et annonce. Les articles SEO ciblent des requ\u00eates locales pr\u00e9cises comme \u00ab vendre appartement [quartier] [ville] \u00bb.",
  },
  {
    question: "Peut-on r\u00e9silier \u00e0 tout moment ?",
    answer:
      "Oui. Le Pack Mensuel est sans engagement. La r\u00e9siliation est libre, sans frais, depuis l\u2019espace client ou par email \u00e0 contact@immocrew.fr. Elle prend effet \u00e0 la fin de la p\u00e9riode mensuelle en cours. Les livrables d\u00e9j\u00e0 livr\u00e9s restent accessibles. Le Pack Lancement b\u00e9n\u00e9ficie d\u2019une garantie satisfait ou rembours\u00e9 de 14 jours.",
  },
  {
    question: "Combien de temps faut-il pour publier les contenus ?",
    answer:
      "Environ 3 minutes par post. Le mandataire re\u00e7oit ses contenus pr\u00eats \u00e0 publier dans son espace client. Il lui suffit de copier le texte et de le coller sur son r\u00e9seau social (LinkedIn, Instagram, Facebook). L\u2019onboarding initial (questionnaire) prend environ 7 minutes. Apr\u00e8s \u00e7a, la routine mensuelle ne demande aucune cr\u00e9ation de contenu.",
  },
  {
    question: "Qu\u2019est-ce qu\u2019un Boost Mandat ?",
    answer:
      `Le ${PACK_BOOST.name} est une prestation ponctuelle à ${PACK_BOOST.price}€ TTC par bien, en complément du ${PACK_MENSUEL.name}. Il met un bien spécifique en avant avec : 1 annonce storytelling qui sort du lot, 3 posts dédiés au bien et 1 Reel, 1 mini landing page du bien, et 1 email blast vers la base d'acheteurs du mandataire. C'est conçu pour accélérer la vente d'un mandat précis.`,
  },
  {
    question: "ImmoCrew fonctionne-t-il pour tous les r\u00e9seaux de mandataires ?",
    answer:
      "Oui. ImmoCrew est compatible avec tous les r\u00e9seaux de mandataires fran\u00e7ais : IAD France, SAFTI, Capifrance, Optimhome, BSK Immobilier, Expertimo, MegAgence et tout r\u00e9seau de mandataires ind\u00e9pendants. Les contenus sont personnalis\u00e9s pour chaque mandataire individuellement, sans contrainte li\u00e9e au r\u00e9seau d\u2019appartenance.",
  },
  {
    question: "Comment sont prot\u00e9g\u00e9es mes donn\u00e9es ?",
    answer:
      "ImmoCrew respecte le R\u00e8glement G\u00e9n\u00e9ral sur la Protection des Donn\u00e9es (RGPD). Les donn\u00e9es collect\u00e9es lors de l\u2019onboarding sont des donn\u00e9es professionnelles (zone g\u00e9ographique, sp\u00e9cialit\u00e9, ton de communication) utilis\u00e9es uniquement pour produire les contenus. Elles ne sont pas revendues ni partag\u00e9es avec des tiers. Les donn\u00e9es transmises \u00e0 l\u2019IA de production ne sont pas utilis\u00e9es pour l\u2019entra\u00eenement des mod\u00e8les. La politique de confidentialit\u00e9 compl\u00e8te est disponible sur immocrew.fr/confidentialite.",
  },
  {
    question: "ImmoCrew cr\u00e9e-t-il mes visuels et mes photos ?",
    answer:
      "Non. ImmoCrew produit les contenus r\u00e9dactionnels : textes de posts, articles, annonces, scripts vid\u00e9o, newsletters. Les visuels (photos de biens, portraits, cr\u00e9ations graphiques) ne sont pas inclus dans le service. Le brief d\u2019identit\u00e9 visuelle fourni dans le Pack Lancement donne des recommandations pour cr\u00e9er une identit\u00e9 coh\u00e9rente, mais la production graphique reste \u00e0 la charge du mandataire.",
  },
  {
    question: "Puis-je voir un exemple de contenu avant de m\u2019abonner ?",
    answer:
      "Oui. La page d\u2019accueil d\u2019immocrew.fr pr\u00e9sente des exemples avant/apr\u00e8s d\u2019annonces immobili\u00e8res produites par ImmoCrew. Ces exemples montrent la diff\u00e9rence entre une annonce standard et une annonce storytelling personnalis\u00e9e pour une zone pr\u00e9cise. Le Pack Lancement b\u00e9n\u00e9ficie \u00e9galement d\u2019une garantie satisfait ou rembours\u00e9 de 14 jours.",
  },
  {
    question: "ImmoCrew inclut-il des articles pour le r\u00e9f\u00e9rencement local (SEO) ?",
    answer:
      "Oui. Chaque Pack Mensuel inclut 2 articles SEO local par mois. Ces articles ciblent des requ\u00eates comme \u00ab mandataire immobilier [ville] \u00bb, \u00ab vendre appartement [quartier] \u00bb ou \u00ab estimation bien immobilier [zone] \u00bb. Ils sont structur\u00e9s pour am\u00e9liorer la visibilit\u00e9 organique du mandataire dans les r\u00e9sultats Google locaux.",
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

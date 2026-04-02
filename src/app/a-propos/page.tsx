import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { JsonLd } from "@/components/JsonLd"
import { PACK_MENSUEL, PACK_TRIMESTRIEL, PACK_ANNUEL, PACK_BOOST, formatPrice, formatStartingPrice } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Qu'est-ce qu'ImmoCrew ? Service marketing pour mandataires immobiliers",
  description:
    `ImmoCrew est un service de marketing clé en main pour mandataires immobiliers indépendants. Chaque mois : 12 posts, 4 articles SEO, 4 annonces, 4 scripts vidéo. ${formatPrice(PACK_MENSUEL)}, sans engagement.`,
  alternates: {
    canonical: "https://immocrew.fr/a-propos",
  },
  openGraph: {
    title: "Qu'est-ce qu'ImmoCrew ? Service marketing pour mandataires immobiliers",
    description:
      `Service de marketing clé en main pour mandataires immobiliers indépendants. 12 posts, 4 articles SEO, 4 annonces, 4 scripts vidéo par mois. ${formatPrice(PACK_MENSUEL)}.`,
    url: "https://immocrew.fr/a-propos",
  },
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ImmoCrew",
  url: "https://immocrew.fr",
  logo: "https://immocrew.fr/logo.png",
  description:
    "Service de marketing clé en main pour mandataires immobiliers indépendants en France. Chaque mois : 12 posts, 4 articles SEO, 4 annonces, 4 scripts vidéo, livrés prêts à publier.",
  foundingDate: "2026",
  areaServed: "FR",
  knowsAbout: [
    "marketing immobilier",
    "mandataire immobilier",
    "réseaux sociaux immobilier",
    "SEO local immobilier",
  ],
  slogan: "L'équipe marketing des mandataires immobiliers",
  serviceArea: {
    "@type": "Country",
    name: "France",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "contact@immocrew.fr",
    availableLanguage: "French",
  },
}

const CHECK_ICON = (
  <svg
    className="w-5 h-5 text-success flex-shrink-0 mt-0.5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
)

const STEPS = [
  {
    number: "1",
    title: "Onboarding",
    description:
      "Tu remplis un questionnaire de 7 minutes : ta zone, ton réseau, ta spécialité, ton ton de communication. C'est la seule étape où tu dois agir.",
  },
  {
    number: "2",
    title: "Production",
    description:
      "L'équipe ImmoCrew produit tes contenus personnalisés avec les données de ta zone : quartier, prix au m², écoles, commerces, transports.",
  },
  {
    number: "3",
    title: "Livraison",
    description:
      "Tu reçois tes contenus le 1er du mois dans ton espace client. Tu copies, tu publies. 3 minutes par post.",
  },
] as const

const PACKS = [
  {
    name: PACK_MENSUEL.name,
    price: formatPrice(PACK_MENSUEL),
    type: "Sans engagement",
    description: "Tout ton marketing mensuel, livré prêt à publier. Setup mois 1 inclus.",
    items: [
      "Setup mois 1 : positionnement, bio, charte visuelle",
      "12 posts personnalisés pour tes réseaux",
      "4 scripts vidéo pour tes Reels",
      "4 articles SEO local",
      "4 annonces immobilières storytelling",
      "1 newsletter pour tes contacts",
      "1 email de prospection vendeurs",
      "Calendrier de publication mensuel",
    ],
  },
  {
    name: PACK_TRIMESTRIEL.name,
    price: `${PACK_TRIMESTRIEL.price}€/mois`,
    type: "Engagement 3 mois — -20%",
    description:
      `Même contenu, facturé ${PACK_TRIMESTRIEL.totalPrice}€ tous les 3 mois. Le choix recommandé.`,
    featured: true,
    items: [
      "Contenu identique à la formule Mensuel",
      "Setup mois 1 inclus",
      "120€/mois au lieu de 150€",
      "Résiliation à chaque échéance",
    ],
  },
  {
    name: PACK_ANNUEL.name,
    price: `${PACK_ANNUEL.price}€/mois`,
    type: "Engagement 12 mois — -33%",
    description:
      `Le meilleur tarif : ${PACK_ANNUEL.totalPrice}€/an, soit 4 mois offerts.`,
    items: [
      "Contenu identique à la formule Mensuel",
      "Setup mois 1 inclus",
      "100€/mois au lieu de 150€",
      "4 mois offerts par rapport au mensuel",
    ],
  },
  {
    name: PACK_BOOST.name,
    price: formatPrice(PACK_BOOST),
    type: "Ponctuel — réservé aux abonnés",
    description:
      "Un pack dédié pour mettre en avant un bien spécifique.",
    items: [
      "1 annonce storytelling du bien",
      "3 posts dédiés au bien + 1 Reel",
      "1 mini landing page du bien",
      "1 email blast vers ta base d'acheteurs",
    ],
  },
] as const

export default function AProposPage() {
  return (
    <>
      <JsonLd data={organizationJsonLd} />
      <Header />
      <main className="bg-background min-h-screen">
        <div className="container-immocrew py-12 desktop:py-20">
          <article className="max-w-3xl mx-auto">
            {/* H1 */}
            <h1 className="font-display text-h1 desktop:text-display-lg font-bold text-primary mb-6">
              ImmoCrew — L&rsquo;équipe marketing dédiée aux mandataires immobiliers
            </h1>

            {/* Definition — directly citable by LLMs */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-4">
                Qu&rsquo;est-ce qu&rsquo;ImmoCrew ?
              </h2>
              <p className="text-body-lg text-foreground leading-relaxed mb-4">
                ImmoCrew est un service de marketing clé en main destiné aux mandataires
                immobiliers indépendants en France. Chaque mois, ImmoCrew livre à ses
                clients un pack de contenus marketing complets et prêts à publier :
                12 posts réseaux sociaux, 4 articles SEO local, 4 annonces storytelling,
                4 scripts vidéo, 1 newsletter et 1 email de prospection.
              </p>
              <p className="text-body text-foreground leading-relaxed">
                Tout est personnalisé pour la zone géographique exacte du mandataire :
                quartier, prix au m², établissements scolaires, commerces et transports
                de proximité. Il n&rsquo;y a aucun outil à configurer, aucun template
                à adapter. Le mandataire reçoit ses contenus terminés et les
                publie en 3 minutes.
              </p>
            </section>

            {/* Ce qu'ImmoCrew n'est pas */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-4">
                Ce qu&rsquo;ImmoCrew n&rsquo;est pas
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-body text-foreground">
                  <span className="text-error font-bold mt-0.5" aria-hidden="true">&times;</span>
                  <span>
                    <strong>Pas un outil SaaS.</strong> Il n&rsquo;y a aucune plateforme à
                    configurer ni à apprendre.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-body text-foreground">
                  <span className="text-error font-bold mt-0.5" aria-hidden="true">&times;</span>
                  <span>
                    <strong>Pas un template à personnaliser soi-même.</strong> Les
                    contenus sont livrés finis, prêts à publier.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-body text-foreground">
                  <span className="text-error font-bold mt-0.5" aria-hidden="true">&times;</span>
                  <span>
                    <strong>Pas un community manager freelance.</strong> ImmoCrew est un service
                    productisé à prix fixe, pas une prestation variable.
                  </span>
                </li>
              </ul>
            </section>

            {/* Comment ca fonctionne */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-6">
                Comment ça fonctionne
              </h2>
              <div className="grid gap-6 tablet:grid-cols-3">
                {STEPS.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-xl bg-card border border-border p-6"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <span className="font-display font-bold text-white text-body-lg">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="font-display text-h4 font-bold text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-body-sm text-neutral-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pour qui */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-4">
                Pour qui ?
              </h2>
              <p className="text-body text-foreground leading-relaxed mb-4">
                ImmoCrew s&rsquo;adresse aux mandataires immobiliers indépendants
                rattachés à des réseaux comme IAD France, SAFTI, Capifrance,
                Optimhome, BSK Immobilier, Expertimo ou tout autre réseau de mandataires
                français.
              </p>
              <p className="text-body text-foreground leading-relaxed mb-4">
                Ces professionnels exercent en micro-entreprise ou en société,
                sans équipe marketing, dans un marché de 40 000 à 50 000
                mandataires actifs en France (source : Baromètre LMDM 2023).
              </p>
              <p className="text-body text-foreground leading-relaxed">
                Le profil type : un mandataire qui consacre ses journées aux visites,
                aux estimations et à la relation client. Il sait que le marketing digital
                est indispensable, mais n&rsquo;a ni le temps, ni les compétences, ni
                le budget pour embaucher quelqu&rsquo;un.
              </p>
            </section>

            {/* Ce qu'on livre */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-4">
                Ce qu&rsquo;on livre chaque mois
              </h2>
              <p className="text-body text-foreground leading-relaxed mb-6">
                Avec le {PACK_MENSUEL.name} à {formatPrice(PACK_MENSUEL)}, chaque mandataire reçoit :
              </p>
              <div className="rounded-xl bg-card border border-border p-6 desktop:p-8">
                <ul className="space-y-3">
                  {[
                    "12 posts réseaux sociaux personnalisés (LinkedIn, Instagram, Facebook)",
                    "4 scripts vidéo pour Reels et Stories",
                    "4 articles SEO local ciblant ta ville et ton quartier",
                    "4 annonces immobilières storytelling",
                    "1 newsletter pour ta base de contacts",
                    "1 email de prospection vendeurs",
                    "1 calendrier de publication mensuel",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      {CHECK_ICON}
                      <span className="text-body text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-body-sm text-neutral-500 mt-6">
                  Tous les contenus intègrent les données locales de ta zone :
                  nom du quartier, prix au m², écoles, commerces, transports.
                </p>
              </div>
            </section>

            {/* Combien ca coute */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-6">
                Combien ça coûte
              </h2>
              <div className="grid gap-6 tablet:grid-cols-3">
                {PACKS.map((pack) => (
                  <div
                    key={pack.name}
                    className={`rounded-xl p-6 ${
                      "featured" in pack && pack.featured
                        ? "bg-primary text-white shadow-xl"
                        : "bg-card border border-border shadow-sm"
                    }`}
                  >
                    {"featured" in pack && pack.featured && (
                      <span className="inline-block px-3 py-1 mb-3 rounded-full bg-secondary text-white text-body-sm font-bold">
                        Recommandé
                      </span>
                    )}
                    <h3
                      className={`font-display text-h4 font-bold mb-1 ${
                        "featured" in pack && pack.featured
                          ? "text-white"
                          : "text-primary"
                      }`}
                    >
                      {pack.name}
                    </h3>
                    <p
                      className={`text-caption mb-3 ${
                        "featured" in pack && pack.featured
                          ? "text-primary-200"
                          : "text-neutral-500"
                      }`}
                    >
                      {pack.type}
                    </p>
                    <p
                      className={`font-display text-h2 font-extrabold mb-3 ${
                        "featured" in pack && pack.featured
                          ? "text-secondary"
                          : "text-primary"
                      }`}
                    >
                      {pack.price}
                    </p>
                    <p
                      className={`text-body-sm mb-4 ${
                        "featured" in pack && pack.featured
                          ? "text-primary-100"
                          : "text-neutral-600"
                      }`}
                    >
                      {pack.description}
                    </p>
                    <div
                      className={`h-px mb-4 ${
                        "featured" in pack && pack.featured
                          ? "bg-primary-400"
                          : "bg-neutral-200"
                      }`}
                    />
                    <ul className="space-y-2">
                      {pack.items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <svg
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              "featured" in pack && pack.featured
                                ? "text-success-300"
                                : "text-success"
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span
                            className={`text-body-sm ${
                              "featured" in pack && pack.featured
                                ? "text-primary-100"
                                : "text-neutral-600"
                            }`}
                          >
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="text-center text-body-sm text-neutral-400 mt-4">
                Tous les prix sont TTC.
              </p>
            </section>

            {/* L'equipe */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-4">
                L&rsquo;équipe
              </h2>
              <p className="text-body text-foreground leading-relaxed mb-4">
                ImmoCrew a été fondé par Thomas, entrepreneur
                basé en région parisienne, spécialisé dans le
                marketing digital immobilier depuis 2022. Après avoir accompagné
                une dizaine de professionnels de l&rsquo;immobilier (mandataires IAD, agents
                indépendants) dans leur stratégie de contenu, un constat
                s&rsquo;est imposé&nbsp;: les mandataires indépendants n&rsquo;ont
                pas accès aux mêmes ressources marketing que les grandes
                agences — alors qu&rsquo;ils représentent une part croissante
                du marché.
              </p>
              <p className="text-body text-foreground leading-relaxed mb-4">
                ImmoCrew est né de cette conviction&nbsp;: chaque mandataire
                mérite une présence en ligne professionnelle, sans y consacrer
                ses soirées. L&rsquo;équipe combine expertise en marketing
                digital, rédaction immobilière et technologie pour produire
                des contenus hyper-personnalisés. Chaque contenu est relu et
                validé avant livraison.
              </p>
              <p className="text-body text-foreground leading-relaxed">
                ImmoCrew est édité par VERSI — 54 rue Henri Barbusse,
                92000 Nanterre.
              </p>
            </section>

            {/* CTA */}
            <div className="rounded-xl bg-primary p-8 desktop:p-10 text-center">
              <p className="font-display text-h3 text-white mb-3">
                Prêt à externaliser ton marketing ?
              </p>
              <p className="text-body text-primary-200 mb-6">
                Rejoins les mandataires qui publient du contenu professionnel sans y passer leurs soirées.
              </p>
              <a
                href="/#pricing"
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-white font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                Voir les tarifs →
              </a>
            </div>

            {/* Retour */}
            <div className="mt-12 pt-8 border-t border-primary-100">
              <Link
                href="/"
                className="text-secondary font-semibold hover:text-secondary-700 transition-colors"
              >
                &larr; Retour à l&rsquo;accueil
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

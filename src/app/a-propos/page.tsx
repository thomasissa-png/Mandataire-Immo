import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { JsonLd } from "@/components/JsonLd"
import { PACK_LANCEMENT, PACK_MENSUEL, PACK_BOOST, formatPrice } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Qu'est-ce qu'ImmoCrew ? Service marketing pour mandataires immobiliers",
  description:
    `ImmoCrew est un service de marketing clé en main pour mandataires immobiliers indépendants. Chaque mois : 12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo. ${formatPrice(PACK_MENSUEL)}, sans engagement.`,
  alternates: {
    canonical: "https://immocrew.fr/a-propos",
  },
  openGraph: {
    title: "Qu'est-ce qu'ImmoCrew ? Service marketing pour mandataires immobiliers",
    description:
      `Service de marketing clé en main pour mandataires immobiliers indépendants. 12 posts, 2 articles SEO, 4 annonces, 4 scripts vidéo par mois. ${formatPrice(PACK_MENSUEL)}.`,
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
    "Service de marketing cl\u00e9 en main pour mandataires immobiliers ind\u00e9pendants en France. Chaque mois : 12 posts, 2 articles SEO, 4 annonces, 4 scripts vid\u00e9o, livr\u00e9s pr\u00eats \u00e0 publier.",
  foundingDate: "2026",
  areaServed: "FR",
  knowsAbout: [
    "marketing immobilier",
    "mandataire immobilier",
    "r\u00e9seaux sociaux immobilier",
    "SEO local immobilier",
  ],
  slogan: "L'\u00e9quipe marketing des mandataires immobiliers",
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
      "Tu remplis un questionnaire de 7 minutes : ta zone, ton r\u00e9seau, ta sp\u00e9cialit\u00e9, ton ton de communication. C\u2019est la seule \u00e9tape o\u00f9 tu dois agir.",
  },
  {
    number: "2",
    title: "Production",
    description:
      "L\u2019\u00e9quipe ImmoCrew produit tes contenus personnalis\u00e9s avec les donn\u00e9es de ta zone : quartier, prix au m\u00b2, \u00e9coles, commerces, transports.",
  },
  {
    number: "3",
    title: "Livraison",
    description:
      "Tu re\u00e7ois tes livrables le 1er du mois dans ton espace client. Tu copies, tu publies. 3 minutes par post.",
  },
] as const

const PACKS = [
  {
    name: PACK_LANCEMENT.name,
    price: formatPrice(PACK_LANCEMENT),
    type: "One-shot",
    description: "Le kit de démarrage complet pour lancer ta présence en ligne.",
    items: [
      "Positionnement et mise en avant de ton expertise",
      "Bio optimisée pour tous tes profils",
      "20 posts prêts à publier",
      "10 scripts Reels",
      "5 articles SEO local",
      "5 templates d'annonces storytelling",
      "Calendrier éditorial sur 30 jours",
      "Brief d'identité visuelle personnalisé",
    ],
  },
  {
    name: PACK_MENSUEL.name,
    price: formatPrice(PACK_MENSUEL),
    type: "Abonnement sans engagement",
    description:
      "Tout ton marketing mensuel, livré prêt à publier le 1er du mois.",
    featured: true,
    items: [
      "12 posts personnalisés pour tes réseaux",
      "4 scripts vidéo pour tes Reels",
      "2 articles SEO local",
      "4 annonces immobilières storytelling",
      "1 newsletter pour tes contacts",
      "1 email de prospection vendeurs",
      "Calendrier de publication mensuel",
    ],
  },
  {
    name: PACK_BOOST.name,
    price: formatPrice(PACK_BOOST),
    type: "Ponctuel",
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
              ImmoCrew &mdash; L&rsquo;&eacute;quipe marketing d&eacute;di&eacute;e aux mandataires immobiliers
            </h1>

            {/* Definition — directly citable by LLMs */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-4">
                Qu&rsquo;est-ce qu&rsquo;ImmoCrew ?
              </h2>
              <p className="text-body-lg text-foreground leading-relaxed mb-4">
                ImmoCrew est un service de marketing cl&eacute; en main destin&eacute; aux mandataires
                immobiliers ind&eacute;pendants en France. Chaque mois, ImmoCrew livre &agrave; ses
                clients un pack de contenus marketing complets et pr&ecirc;ts &agrave; publier :
                12 posts r&eacute;seaux sociaux, 2 articles SEO local, 4 annonces storytelling,
                4 scripts vid&eacute;o, 1 newsletter et 1 email de prospection.
              </p>
              <p className="text-body text-foreground leading-relaxed">
                Tout est personnalis&eacute; pour la zone g&eacute;ographique exacte du mandataire :
                quartier, prix au m&sup2;, &eacute;tablissements scolaires, commerces et transports
                de proximit&eacute;. Il n&rsquo;y a aucun outil &agrave; configurer, aucun template
                &agrave; adapter. Le mandataire re&ccedil;oit ses contenus termin&eacute;s et les
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
                    <strong>Pas un outil SaaS.</strong> Il n&rsquo;y a aucune plateforme &agrave;
                    configurer ni &agrave; apprendre.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-body text-foreground">
                  <span className="text-error font-bold mt-0.5" aria-hidden="true">&times;</span>
                  <span>
                    <strong>Pas un template &agrave; personnaliser soi-m&ecirc;me.</strong> Les
                    contenus sont livr&eacute;s finis, pr&ecirc;ts &agrave; publier.
                  </span>
                </li>
                <li className="flex items-start gap-3 text-body text-foreground">
                  <span className="text-error font-bold mt-0.5" aria-hidden="true">&times;</span>
                  <span>
                    <strong>Pas un community manager freelance.</strong> ImmoCrew est un service
                    productis&eacute; &agrave; prix fixe, pas une prestation variable.
                  </span>
                </li>
              </ul>
            </section>

            {/* Comment ca fonctionne */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-6">
                Comment &ccedil;a fonctionne
              </h2>
              <div className="grid gap-6 tablet:grid-cols-3">
                {STEPS.map((step) => (
                  <div
                    key={step.number}
                    className="rounded-xl bg-card border border-border p-6"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center mb-4">
                      <span className="font-display font-bold text-primary text-body-lg">
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
                ImmoCrew s&rsquo;adresse aux mandataires immobiliers ind&eacute;pendants
                rattach&eacute;s &agrave; des r&eacute;seaux comme IAD France, SAFTI, Capifrance,
                Optimhome, BSK Immobilier, Expertimo ou tout autre r&eacute;seau de mandataires
                fran&ccedil;ais.
              </p>
              <p className="text-body text-foreground leading-relaxed mb-4">
                Ces professionnels exercent en micro-entreprise ou en soci&eacute;t&eacute;,
                sans &eacute;quipe marketing, dans un march&eacute; de 40 000 &agrave; 50 000
                mandataires actifs en France (source : Barom&egrave;tre LMDM 2023).
              </p>
              <p className="text-body text-foreground leading-relaxed">
                Le profil type : un mandataire qui consacre ses journ&eacute;es aux visites,
                aux estimations et &agrave; la relation client. Il sait que le marketing digital
                est indispensable, mais n&rsquo;a ni le temps, ni les comp&eacute;tences, ni
                le budget pour embaucher quelqu&rsquo;un.
              </p>
            </section>

            {/* Ce qu'on livre */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-4">
                Ce qu&rsquo;on livre chaque mois
              </h2>
              <p className="text-body text-foreground leading-relaxed mb-6">
                Avec le {PACK_MENSUEL.name} &agrave; {formatPrice(PACK_MENSUEL)}, chaque mandataire re&ccedil;oit :
              </p>
              <div className="rounded-xl bg-card border border-border p-6 desktop:p-8">
                <ul className="space-y-3">
                  {[
                    "12 posts r\u00e9seaux sociaux personnalis\u00e9s (LinkedIn, Instagram, Facebook)",
                    "4 scripts vid\u00e9o pour Reels et Stories",
                    "2 articles SEO local ciblant ta ville et ton quartier",
                    "4 annonces immobili\u00e8res storytelling",
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
                  Tous les contenus int&egrave;grent les donn&eacute;es locales de ta zone :
                  nom du quartier, prix au m&sup2;, &eacute;coles, commerces, transports.
                </p>
              </div>
            </section>

            {/* Combien ca coute */}
            <section className="mb-12">
              <h2 className="font-display text-h2 font-bold text-primary-800 mb-6">
                Combien &ccedil;a co&ucirc;te
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
                        Recommand&eacute;
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
                L&rsquo;&eacute;quipe
              </h2>
              <p className="text-body text-foreground leading-relaxed mb-4">
                ImmoCrew a &eacute;t&eacute; fond&eacute; en 2026 par un entrepreneur
                sp&eacute;cialis&eacute; dans le marketing immobilier. Le constat de d&eacute;part :
                les mandataires ind&eacute;pendants n&rsquo;ont pas acc&egrave;s aux m&ecirc;mes
                ressources marketing que les grandes agences, alors qu&rsquo;ils repr&eacute;sentent
                une part croissante du march&eacute; immobilier fran&ccedil;ais.
              </p>
              <p className="text-body text-foreground leading-relaxed">
                L&rsquo;&eacute;quipe combine expertise en marketing digital, r&eacute;daction
                immobili&egrave;re et technologie IA pour produire des contenus personnalis&eacute;s
                &agrave; grande &eacute;chelle. Chaque livrable est relu et valid&eacute; par
                l&rsquo;&eacute;quipe avant livraison.
              </p>
            </section>

            {/* CTA */}
            <div className="rounded-xl bg-primary p-8 desktop:p-10 text-center">
              <p className="font-display text-h3 text-white mb-3">
                Pr&ecirc;t &agrave; externaliser ton marketing ?
              </p>
              <p className="text-body text-primary-200 mb-6">
                Rejoins les mandataires qui publient du contenu professionnel sans y passer leurs soir&eacute;es.
              </p>
              <a
                href="/#pricing"
                className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-secondary text-primary font-display font-bold text-body shadow-sm hover:bg-secondary-600 hover:shadow-md active:scale-[0.97] transition-all duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              >
                Voir les tarifs &rarr;
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

import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { PACK_LANCEMENT, PACK_MENSUEL, PACK_BOOST, formatPrice } from "@/lib/pricing"

export const metadata: Metadata = {
  title: "Conditions Générales de Vente — ImmoCrew",
  description:
    "Conditions Générales de Vente du service ImmoCrew, production de contenu marketing pour mandataires immobiliers.",
}

export default function CGVPage() {
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="container-immocrew py-12 desktop:py-20">
          <article className="max-w-3xl mx-auto">
            <h1 className="font-display text-h1 font-bold text-primary mb-2">
              Conditions Générales de Vente
            </h1>
            <p className="text-caption text-neutral-500 mb-10">
              Dernière mise à jour : 25 mars 2026
            </p>

            {/* Article 1 */}
            <Section title="Article 1 — Préambule et identification de l'éditeur">
              <p>
                Les présentes Conditions Générales de Vente (ci-après « CGV »)
                régissent les relations contractuelles entre :
              </p>
              <p className="mt-3">
                <strong>VERSI</strong>, SAS, au capital social de 1 000 €,
                immatriculée au RCS de Nanterre sous le numéro SIRET 91286261200013,
                dont le siège social est situé au 54 rue Henri Barbusse, 92000 Nanterre,
                numéro de TVA intracommunautaire : FR91912862612,
                ci-après dénommée « ImmoCrew » ou « le Prestataire »,
              </p>
              <p className="mt-3">et</p>
              <p className="mt-3">
                Tout professionnel de l'immobilier (mandataire indépendant, agent commercial,
                agent immobilier) souscrivant aux services proposés sur le site immocrew.fr,
                ci-après dénommé « le Client ».
              </p>
              <p className="mt-4">
                Le service ImmoCrew s'adresse exclusivement à des <strong>professionnels</strong> agissant
                dans le cadre de leur activité commerciale. En souscrivant, le Client déclare agir
                à titre professionnel.
              </p>
            </Section>

            {/* Article 2 */}
            <Section title="Article 2 — Objet">
              <p>
                ImmoCrew est un service de production de contenu marketing personnalisé destiné
                aux professionnels de l'immobilier. Le Prestataire fournit des livrables rédactionnels
                et visuels (posts réseaux sociaux, articles SEO, annonces immobilières, scripts vidéo,
                newsletters) personnalisés en fonction du profil, de la zone géographique et
                de la spécialité du Client.
              </p>
              <p className="mt-3">
                Les présentes CGV définissent les droits et obligations des parties dans le cadre
                de la fourniture de ces services.
              </p>
            </Section>

            {/* Article 3 */}
            <Section title="Article 3 — Acceptation des CGV">
              <p>
                Toute souscription à un service ImmoCrew implique l'acceptation pleine et entière
                des présentes CGV. Le Client reconnaît en avoir pris connaissance avant la souscription.
              </p>
              <p className="mt-3">
                ImmoCrew se réserve le droit de modifier les présentes CGV. Le Client sera informé
                par email au moins 30 jours avant l'entrée en vigueur des modifications.
                L'utilisation du service après cette date vaut acceptation des nouvelles conditions.
              </p>
            </Section>

            {/* Article 4 */}
            <Section title="Article 4 — Description des offres et tarifs">
              <p className="mb-4">
                ImmoCrew propose trois offres, dont les prix sont indiqués toutes taxes comprises (TTC),
                TVA de 20 % incluse :
              </p>

              <div className="space-y-6">
                <OfferCard
                  name={PACK_LANCEMENT.name}
                  price={`${PACK_LANCEMENT.price} € TTC`}
                  type="Paiement unique"
                  items={[
                    "Positionnement et stratégie de personal branding",
                    "Bio optimisée pour les réseaux sociaux",
                    "5 templates d'annonces immobilières personnalisées",
                    "5 articles SEO local",
                    "Calendrier éditorial sur 30 jours",
                    "20 posts réseaux sociaux",
                    "10 scripts Reels / vidéos courtes",
                    "Brief d'identité visuelle personnalisé (positionnement, palette couleurs, style recommandé)",
                  ]}
                />

                <OfferCard
                  name={PACK_MENSUEL.name}
                  price={`${PACK_MENSUEL.price} € TTC / mois`}
                  type="Abonnement mensuel sans engagement"
                  items={[
                    "12 posts réseaux sociaux par mois",
                    "4 scripts vidéo",
                    "4 articles SEO local",
                    "1 newsletter",
                    "4 annonces immobilières personnalisées",
                    "1 email de prospection",
                  ]}
                />

                <OfferCard
                  name={PACK_BOOST.name}
                  price={`${PACK_BOOST.price} € TTC`}
                  type="Paiement unique, par mandat"
                  items={[
                    "Annonce storytelling dédiée au bien",
                    "3 posts réseaux sociaux + 1 script Reel",
                    "Mini landing page pour le bien",
                    "Email blast acheteurs potentiels",
                  ]}
                />
              </div>

              <p className="mt-4">
                Les prix peuvent être révisés par le Prestataire. Toute modification tarifaire
                sera notifiée au Client au moins 30 jours avant son application.
                Le Client pourra résilier sans pénalité s'il refuse le nouveau tarif.
              </p>
            </Section>

            {/* Article 5 */}
            <Section title="Article 5 — Modalités de paiement">
              <p>
                Les paiements sont effectués par carte bancaire via la plateforme sécurisée
                Stripe. Aucune donnée bancaire n'est stockée par ImmoCrew.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>
                  <strong>Pack Lancement et Boost Mandat :</strong> paiement intégral à la commande.
                </li>
                <li>
                  <strong>Pack Mensuel :</strong> prélèvement automatique le jour anniversaire de la souscription.
                </li>
              </ul>
              <p className="mt-3">
                En cas de défaut de paiement, l'accès au service sera suspendu jusqu'à
                régularisation. Des pénalités de retard pourront être appliquées
                conformément à l'article L.441-10 du Code de commerce (taux BCE + 10 points),
                ainsi qu'une indemnité forfaitaire de 40 euros pour frais de recouvrement.
              </p>
            </Section>

            {/* Article 6 */}
            <Section title="Article 6 — Délais de livraison">
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Pack Lancement :</strong> livrables livrés sous 7 jours ouvrés après
                  réception du questionnaire d'onboarding complété.
                </li>
                <li>
                  <strong>Pack Mensuel :</strong> livrables livrés dans les 5 premiers jours ouvrés du mois.
                </li>
                <li>
                  <strong>Boost Mandat :</strong> livrables livrés sous 48 heures ouvrées après
                  réception des informations relatives au bien.
                </li>
              </ul>
              <p className="mt-3">
                Les livrables sont mis à disposition dans l'espace client en ligne, au format
                numérique (texte, PDF, image selon la nature du livrable).
              </p>
            </Section>

            {/* Article 7 */}
            <Section title="Article 7 — Obligation de moyens">
              <p>
                ImmoCrew s'engage à mettre en œuvre tous les moyens nécessaires pour produire
                des livrables de qualité professionnelle, personnalisés et conformes aux informations
                fournies par le Client lors de l'onboarding.
              </p>
              <p className="mt-3">
                Le Prestataire est soumis à une <strong>obligation de moyens</strong>. Il ne garantit aucun
                résultat commercial, marketing ou financier lié à l'utilisation des livrables
                (nombre de vues, de contacts entrants, de mandats signés, etc.).
              </p>
            </Section>

            {/* Article 8 */}
            <Section title="Article 8 — Garantie commerciale « Satisfait ou remboursé »">
              <p>
                Le Prestataire accorde une garantie commerciale de <strong>14 jours</strong> sur le
                Pack Lancement uniquement. Si le Client n'est pas satisfait des livrables reçus,
                il peut demander un remboursement intégral par email à{" "}
                <a href="mailto:contact@immocrew.fr" className="text-secondary-700 font-semibold hover:underline">contact@immocrew.fr</a> dans
                un délai de 14 jours suivant la livraison.
              </p>
              <p className="mt-3">
                Cette garantie ne s'applique pas si les livrables ont déjà été
                publiés ou utilisés publiquement par le Client.
              </p>
              <p className="mt-3">
                Le Pack Mensuel et le Boost Mandat ne bénéficient pas de cette garantie de
                remboursement. Le Client peut toutefois demander des modifications dans les limites
                raisonnables (voir article 9).
              </p>
            </Section>

            {/* Article 9 */}
            <Section title="Article 9 — Révisions et modifications">
              <p>
                Le Client dispose d'un droit de demande de révision sur les livrables livrés,
                dans la limite d'une demande de révision par livrable, à formuler dans les
                7 jours suivant la livraison.
              </p>
              <p className="mt-3">
                Les révisions portent sur des ajustements de ton, de formulation ou de contenu,
                dans le cadre du brief initial. Toute demande sortant du périmètre initial
                pourra faire l'objet d'une facturation complémentaire.
              </p>
            </Section>

            {/* Article 10 */}
            <Section title="Article 10 — Résiliation">
              <p className="font-semibold">Pack Mensuel :</p>
              <p>
                Le Client peut résilier son abonnement à tout moment, sans motif ni pénalité.
                La résiliation prend effet à la fin de la période mensuelle en cours.
                Les livrables du mois en cours restent accessibles. Le Client peut résilier depuis
                son espace client ou par email à{" "}
                <a href="mailto:contact@immocrew.fr" className="text-secondary-700 font-semibold hover:underline">contact@immocrew.fr</a>.
              </p>
              <p className="font-semibold mt-4">Pack Lancement et Boost Mandat :</p>
              <p>
                S'agissant de prestations ponctuelles, aucune résiliation n'est possible
                après validation de la commande, sauf dans le cadre de la garantie commerciale
                prévue à l'article 8.
              </p>
              <p className="font-semibold mt-4">Résiliation par le Prestataire :</p>
              <p>
                Le Prestataire se réserve le droit de résilier le contrat en cas de manquement
                grave du Client à ses obligations (défaut de paiement répété,
                utilisation abusive, comportement contraire aux bonnes mœurs), après mise en
                demeure restée sans effet pendant 15 jours.
              </p>
            </Section>

            {/* Article 11 */}
            <Section title="Article 11 — Propriété intellectuelle">
              <p>
                &Agrave; compter du paiement intégral de la prestation, le Client
                acquiert les <strong>droits d'utilisation, de reproduction et de diffusion</strong> sur
                les livrables produits pour son compte, sans limitation de durée ni de territoire.
              </p>
              <p className="mt-3">
                Le Client est libre de publier, modifier et réutiliser les livrables comme il
                l'entend dans le cadre de son activité professionnelle.
              </p>
              <p className="mt-3">
                Sauf opposition écrite du Client, le Prestataire se réserve le droit de
                mentionner la réalisation dans son portfolio et ses supports commerciaux
                (exemples avant/après anonymisés).
              </p>
            </Section>

            {/* Article 12 */}
            <Section title="Article 12 — Utilisation de l'intelligence artificielle">
              <p>
                Le Client est informé que les livrables sont produits avec l'assistance
                de technologies d'intelligence artificielle générative (API Claude, Anthropic).
              </p>
              <p className="mt-3">
                Chaque livrable fait l'objet d'une <strong>relecture et validation par l'équipe
                ImmoCrew</strong> avant livraison. Le Prestataire garantit la pertinence et la cohérence
                des contenus livrés dans la limite de son obligation de moyens.
              </p>
              <p className="mt-3">
                Les données du Client transmises à l'API IA sont des données professionnelles
                non sensibles (zone géographique, spécialité, ton de communication). Elles
                ne sont pas utilisées pour l'entraînement des modèles IA
                (conformément aux conditions d'utilisation de l'API Anthropic).
              </p>
              <p className="mt-3">
                Conformément au Règlement européen sur l'Intelligence Artificielle
                (AI Act, Règlement UE 2024/1689), le Client est informé de l'utilisation
                d'IA dans le processus de production. Il lui appartient, s'il le souhaite,
                d'informer ses propres audiences de l'origine assistée par IA des contenus publiés.
              </p>
            </Section>

            {/* Article 13 */}
            <Section title="Article 13 — Responsabilité">
              <p>
                La responsabilité du Prestataire est limitée aux dommages directs et prévisibles
                résultant d'un manquement prouvé à ses obligations contractuelles.
              </p>
              <p className="mt-3">
                En tout état de cause, la responsabilité financière du Prestataire est
                plafonnée au montant total payé par le Client au cours des trois (3) derniers
                mois précédant l'événement donnant lieu à réclamation.
              </p>
              <p className="mt-3">
                Le Prestataire ne saurait être tenu responsable des résultats commerciaux
                obtenus par le Client suite à l'utilisation des livrables, ni des conséquences
                de la publication de contenus sur les réseaux sociaux ou sites internet du Client.
              </p>
            </Section>

            {/* Article 14 */}
            <Section title="Article 14 — Protection des données personnelles">
              <p>
                Le Prestataire s'engage à traiter les données personnelles du Client
                conformément au Règlement Général sur la Protection des Données
                (RGPD, Règlement UE 2016/679) et à la loi Informatique et Libertés.
              </p>
              <p className="mt-3">
                Les modalités de collecte, de traitement et de conservation des données
                personnelles sont détaillées dans la{" "}
                <Link
                  href="/confidentialite"
                  className="text-secondary font-semibold underline underline-offset-2 hover:text-secondary-700 transition-colors"
                >
                  Politique de Confidentialité
                </Link>{" "}
                accessible sur le site.
              </p>
            </Section>

            {/* Article 15 */}
            <Section title="Article 15 — Force majeure">
              <p>
                Aucune des parties ne pourra être tenue responsable de l'inexécution ou du retard
                dans l'exécution de ses obligations en cas de force majeure au sens de l'article
                1218 du Code civil (catastrophe naturelle, pandémie, défaillance technique
                majeure d'un prestataire tiers, etc.).
              </p>
              <p className="mt-3">
                La partie affectée informera l'autre dans les meilleurs délais. Si la situation
                de force majeure perdure au-delà de 30 jours, chaque partie pourra résilier
                le contrat sans indemnité.
              </p>
            </Section>

            {/* Article 16 */}
            <Section title="Article 16 — Résolution amiable des litiges">
              <p>
                En cas de différend lié à l'exécution des présentes CGV,
                les parties s'engagent à rechercher une solution amiable dans un délai de
                30 jours à compter de la notification du litige par l'une des parties.
              </p>
            </Section>

            {/* Article 17 */}
            <Section title="Article 17 — Droit applicable et juridiction compétente">
              <p>
                Les présentes CGV sont régies par le droit français.
              </p>
              <p className="mt-3">
                &Agrave; défaut de résolution amiable, tout litige sera soumis à la compétence
                exclusive des tribunaux de <strong>Nanterre</strong>.
              </p>
            </Section>

            {/* Retour */}
            <div className="mt-12 pt-8 border-t border-primary-100">
              <Link
                href="/"
                className="text-secondary font-semibold hover:text-secondary-700 transition-colors"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mb-10">
      <h2
        className="font-display text-h4 font-bold text-primary-800 mb-4"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className="text-body text-foreground leading-relaxed space-y-0">
        {children}
      </div>
    </section>
  )
}

function OfferCard({
  name,
  price,
  type,
  items,
}: {
  name: string
  price: string
  type: string
  items: string[]
}) {
  return (
    <div className="border border-primary-200 rounded-lg p-5 bg-white">
      <div className="flex flex-wrap items-baseline gap-3 mb-1">
        <h3
          className="font-display text-h5 font-bold text-primary-800"
          dangerouslySetInnerHTML={{ __html: name }}
        />
        <span
          className="text-secondary font-bold text-body"
          dangerouslySetInnerHTML={{ __html: price }}
        />
      </div>
      <p className="text-caption text-neutral-500 mb-3">{type}</p>
      <ul className="list-disc pl-5 space-y-1 text-body-sm text-foreground">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

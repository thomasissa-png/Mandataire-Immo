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
              Conditions G&eacute;n&eacute;rales de Vente
            </h1>
            <p className="text-caption text-neutral-500 mb-10">
              Derni&egrave;re mise &agrave; jour : 25 mars 2026
            </p>

            {/* Article 1 */}
            <Section title="Article 1 — Pr&eacute;ambule et identification de l&rsquo;&eacute;diteur">
              <p>
                Les pr&eacute;sentes Conditions G&eacute;n&eacute;rales de Vente (ci-apr&egrave;s &laquo; CGV &raquo;)
                r&eacute;gissent les relations contractuelles entre :
              </p>
              <p className="mt-3">
                <strong>VERSI</strong>, SAS, au capital social de 1&nbsp;000&nbsp;&euro;,
                immatricul&eacute;e au RCS de Nanterre sous le num&eacute;ro SIRET 91286261200013,
                dont le si&egrave;ge social est situ&eacute; au 54 rue Henri Barbusse, 92000 Nanterre,
                num&eacute;ro de TVA intracommunautaire : FR91912862612,
                ci-apr&egrave;s d&eacute;nomm&eacute;e &laquo; ImmoCrew &raquo; ou &laquo; le Prestataire &raquo;,
              </p>
              <p className="mt-3">et</p>
              <p className="mt-3">
                Tout professionnel de l&rsquo;immobilier (mandataire ind&eacute;pendant, agent commercial,
                agent immobilier) souscrivant aux services propos&eacute;s sur le site immocrew.fr,
                ci-apr&egrave;s d&eacute;nomm&eacute; &laquo; le Client &raquo;.
              </p>
              <p className="mt-4">
                Le service ImmoCrew s&rsquo;adresse exclusivement &agrave; des <strong>professionnels</strong> agissant
                dans le cadre de leur activit&eacute; commerciale. En souscrivant, le Client d&eacute;clare agir
                &agrave; titre professionnel.
              </p>
            </Section>

            {/* Article 2 */}
            <Section title="Article 2 — Objet">
              <p>
                ImmoCrew est un service de production de contenu marketing personnalis&eacute; destin&eacute;
                aux professionnels de l&rsquo;immobilier. Le Prestataire fournit des livrables r&eacute;dactionnels
                et visuels (posts r&eacute;seaux sociaux, articles SEO, annonces immobili&egrave;res, scripts vid&eacute;o,
                newsletters) personnalis&eacute;s en fonction du profil, de la zone g&eacute;ographique et
                de la sp&eacute;cialit&eacute; du Client.
              </p>
              <p className="mt-3">
                Les pr&eacute;sentes CGV d&eacute;finissent les droits et obligations des parties dans le cadre
                de la fourniture de ces services.
              </p>
            </Section>

            {/* Article 3 */}
            <Section title="Article 3 — Acceptation des CGV">
              <p>
                Toute souscription &agrave; un service ImmoCrew implique l&rsquo;acceptation pleine et enti&egrave;re
                des pr&eacute;sentes CGV. Le Client reconna&icirc;t en avoir pris connaissance avant la souscription.
              </p>
              <p className="mt-3">
                ImmoCrew se r&eacute;serve le droit de modifier les pr&eacute;sentes CGV. Le Client sera inform&eacute;
                par email au moins 30 jours avant l&rsquo;entr&eacute;e en vigueur des modifications.
                L&rsquo;utilisation du service apr&egrave;s cette date vaut acceptation des nouvelles conditions.
              </p>
            </Section>

            {/* Article 4 */}
            <Section title="Article 4 — Description des offres et tarifs">
              <p className="mb-4">
                ImmoCrew propose trois offres, dont les prix sont indiqu&eacute;s toutes taxes comprises (TTC),
                TVA de 20&nbsp;% incluse :
              </p>

              <div className="space-y-6">
                <OfferCard
                  name={PACK_LANCEMENT.name}
                  price={`${PACK_LANCEMENT.price} &euro; TTC`}
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
                  price={`${PACK_MENSUEL.price} &euro; TTC / mois`}
                  type="Abonnement mensuel sans engagement"
                  items={[
                    "12 posts réseaux sociaux par mois",
                    "4 scripts vidéo",
                    "2 articles SEO local",
                    "1 newsletter",
                    "4 annonces immobilières personnalisées",
                    "1 email de prospection",
                  ]}
                />

                <OfferCard
                  name={PACK_BOOST.name}
                  price={`${PACK_BOOST.price} &euro; TTC`}
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
                Les prix peuvent &ecirc;tre r&eacute;vis&eacute;s par le Prestataire. Toute modification tarifaire
                sera notifi&eacute;e au Client au moins 30 jours avant son application.
                Le Client pourra r&eacute;silier sans p&eacute;nalit&eacute; s&rsquo;il refuse le nouveau tarif.
              </p>
            </Section>

            {/* Article 5 */}
            <Section title="Article 5 — Modalit&eacute;s de paiement">
              <p>
                Les paiements sont effectu&eacute;s par carte bancaire via la plateforme s&eacute;curis&eacute;e
                Stripe. Aucune donn&eacute;e bancaire n&rsquo;est stock&eacute;e par ImmoCrew.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>
                  <strong>Pack Lancement et Boost Mandat :</strong> paiement int&eacute;gral &agrave; la commande.
                </li>
                <li>
                  <strong>Pack Mensuel :</strong> pr&eacute;l&egrave;vement automatique le jour anniversaire de la souscription.
                </li>
              </ul>
              <p className="mt-3">
                En cas de d&eacute;faut de paiement, l&rsquo;acc&egrave;s au service sera suspendu jusqu&rsquo;&agrave;
                r&eacute;gularisation. Des p&eacute;nalit&eacute;s de retard pourront &ecirc;tre appliqu&eacute;es
                conform&eacute;ment &agrave; l&rsquo;article L.441-10 du Code de commerce (taux BCE + 10 points),
                ainsi qu&rsquo;une indemnit&eacute; forfaitaire de 40 euros pour frais de recouvrement.
              </p>
            </Section>

            {/* Article 6 */}
            <Section title="Article 6 — D&eacute;lais de livraison">
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  <strong>Pack Lancement :</strong> livrables livr&eacute;s sous 7 jours ouvr&eacute;s apr&egrave;s
                  r&eacute;ception du questionnaire d&rsquo;onboarding compl&eacute;t&eacute;.
                </li>
                <li>
                  <strong>Pack Mensuel :</strong> livrables livr&eacute;s dans les 5 premiers jours ouvr&eacute;s du mois.
                </li>
                <li>
                  <strong>Boost Mandat :</strong> livrables livr&eacute;s sous 48 heures ouvr&eacute;es apr&egrave;s
                  r&eacute;ception des informations relatives au bien.
                </li>
              </ul>
              <p className="mt-3">
                Les livrables sont mis &agrave; disposition dans l&rsquo;espace client en ligne, au format
                num&eacute;rique (texte, PDF, image selon la nature du livrable).
              </p>
            </Section>

            {/* Article 7 */}
            <Section title="Article 7 — Obligation de moyens">
              <p>
                ImmoCrew s&rsquo;engage &agrave; mettre en &oelig;uvre tous les moyens n&eacute;cessaires pour produire
                des livrables de qualit&eacute; professionnelle, personnalis&eacute;s et conformes aux informations
                fournies par le Client lors de l&rsquo;onboarding.
              </p>
              <p className="mt-3">
                Le Prestataire est soumis &agrave; une <strong>obligation de moyens</strong>. Il ne garantit aucun
                r&eacute;sultat commercial, marketing ou financier li&eacute; &agrave; l&rsquo;utilisation des livrables
                (nombre de vues, de contacts entrants, de mandats sign&eacute;s, etc.).
              </p>
            </Section>

            {/* Article 8 */}
            <Section title="Article 8 — Garantie commerciale &laquo; Satisfait ou rembours&eacute; &raquo;">
              <p>
                Le Prestataire accorde une garantie commerciale de <strong>14 jours</strong> sur le
                Pack Lancement uniquement. Si le Client n&rsquo;est pas satisfait des livrables re&ccedil;us,
                il peut demander un remboursement int&eacute;gral par email &agrave; contact@immocrew.fr dans
                un d&eacute;lai de 14 jours suivant la livraison.
              </p>
              <p className="mt-3">
                Cette garantie ne s&rsquo;applique pas si les livrables ont d&eacute;j&agrave; &eacute;t&eacute;
                publi&eacute;s ou utilis&eacute;s publiquement par le Client.
              </p>
              <p className="mt-3">
                Le Pack Mensuel et le Boost Mandat ne b&eacute;n&eacute;ficient pas de cette garantie de
                remboursement. Le Client peut toutefois demander des modifications dans les limites
                raisonnables (voir article 9).
              </p>
            </Section>

            {/* Article 9 */}
            <Section title="Article 9 — R&eacute;visions et modifications">
              <p>
                Le Client dispose d&rsquo;un droit de demande de r&eacute;vision sur les livrables livr&eacute;s,
                dans la limite d&rsquo;une demande de r&eacute;vision par livrable, &agrave; formuler dans les
                7 jours suivant la livraison.
              </p>
              <p className="mt-3">
                Les r&eacute;visions portent sur des ajustements de ton, de formulation ou de contenu,
                dans le cadre du brief initial. Toute demande sortant du p&eacute;rim&egrave;tre initial
                pourra faire l&rsquo;objet d&rsquo;une facturation compl&eacute;mentaire.
              </p>
            </Section>

            {/* Article 10 */}
            <Section title="Article 10 — R&eacute;siliation">
              <p className="font-semibold">Pack Mensuel :</p>
              <p>
                Le Client peut r&eacute;silier son abonnement &agrave; tout moment, sans motif ni p&eacute;nalit&eacute;.
                La r&eacute;siliation prend effet &agrave; la fin de la p&eacute;riode mensuelle en cours.
                Les livrables du mois en cours restent accessibles. Le Client peut r&eacute;silier depuis
                son espace client ou par email &agrave; contact@immocrew.fr.
              </p>
              <p className="font-semibold mt-4">Pack Lancement et Boost Mandat :</p>
              <p>
                S&rsquo;agissant de prestations ponctuelles, aucune r&eacute;siliation n&rsquo;est possible
                apr&egrave;s validation de la commande, sauf dans le cadre de la garantie commerciale
                pr&eacute;vue &agrave; l&rsquo;article 8.
              </p>
              <p className="font-semibold mt-4">R&eacute;siliation par le Prestataire :</p>
              <p>
                Le Prestataire se r&eacute;serve le droit de r&eacute;silier le contrat en cas de manquement
                grave du Client &agrave; ses obligations (d&eacute;faut de paiement r&eacute;p&eacute;t&eacute;,
                utilisation abusive, comportement contraire aux bonnes m&oelig;urs), apr&egrave;s mise en
                demeure rest&eacute;e sans effet pendant 15 jours.
              </p>
            </Section>

            {/* Article 11 */}
            <Section title="Article 11 — Propri&eacute;t&eacute; intellectuelle">
              <p>
                &Agrave; compter du paiement int&eacute;gral de la prestation, le Client
                acquiert les <strong>droits d&rsquo;utilisation, de reproduction et de diffusion</strong> sur
                les livrables produits pour son compte, sans limitation de dur&eacute;e ni de territoire.
              </p>
              <p className="mt-3">
                Le Client est libre de publier, modifier et r&eacute;utiliser les livrables comme il
                l&rsquo;entend dans le cadre de son activit&eacute; professionnelle.
              </p>
              <p className="mt-3">
                Sauf opposition &eacute;crite du Client, le Prestataire se r&eacute;serve le droit de
                mentionner la r&eacute;alisation dans son portfolio et ses supports commerciaux
                (exemples avant/apr&egrave;s anonymis&eacute;s).
              </p>
            </Section>

            {/* Article 12 */}
            <Section title="Article 12 — Utilisation de l&rsquo;intelligence artificielle">
              <p>
                Le Client est inform&eacute; que les livrables sont produits avec l&rsquo;assistance
                de technologies d&rsquo;intelligence artificielle g&eacute;n&eacute;rative (API Claude, Anthropic).
              </p>
              <p className="mt-3">
                Chaque livrable fait l&rsquo;objet d&rsquo;une <strong>relecture et validation par l&rsquo;&eacute;quipe
                ImmoCrew</strong> avant livraison. Le Prestataire garantit la pertinence et la coh&eacute;rence
                des contenus livr&eacute;s dans la limite de son obligation de moyens.
              </p>
              <p className="mt-3">
                Les donn&eacute;es du Client transmises &agrave; l&rsquo;API IA sont des donn&eacute;es professionnelles
                non sensibles (zone g&eacute;ographique, sp&eacute;cialit&eacute;, ton de communication). Elles
                ne sont pas utilis&eacute;es pour l&rsquo;entra&icirc;nement des mod&egrave;les IA
                (conform&eacute;ment aux conditions d&rsquo;utilisation de l&rsquo;API Anthropic).
              </p>
              <p className="mt-3">
                Conform&eacute;ment au R&egrave;glement europ&eacute;en sur l&rsquo;Intelligence Artificielle
                (AI Act, R&egrave;glement UE 2024/1689), le Client est inform&eacute; de l&rsquo;utilisation
                d&rsquo;IA dans le processus de production. Il lui appartient, s&rsquo;il le souhaite,
                d&rsquo;informer ses propres audiences de l&rsquo;origine assist&eacute;e par IA des contenus publi&eacute;s.
              </p>
            </Section>

            {/* Article 13 */}
            <Section title="Article 13 — Responsabilit&eacute;">
              <p>
                La responsabilit&eacute; du Prestataire est limit&eacute;e aux dommages directs et pr&eacute;visibles
                r&eacute;sultant d&rsquo;un manquement prouv&eacute; &agrave; ses obligations contractuelles.
              </p>
              <p className="mt-3">
                En tout &eacute;tat de cause, la responsabilit&eacute; financi&egrave;re du Prestataire est
                plafonn&eacute;e au montant total pay&eacute; par le Client au cours des trois (3) derniers
                mois pr&eacute;c&eacute;dant l&rsquo;&eacute;v&eacute;nement donnant lieu &agrave; r&eacute;clamation.
              </p>
              <p className="mt-3">
                Le Prestataire ne saurait &ecirc;tre tenu responsable des r&eacute;sultats commerciaux
                obtenus par le Client suite &agrave; l&rsquo;utilisation des livrables, ni des cons&eacute;quences
                de la publication de contenus sur les r&eacute;seaux sociaux ou sites internet du Client.
              </p>
            </Section>

            {/* Article 14 */}
            <Section title="Article 14 — Protection des donn&eacute;es personnelles">
              <p>
                Le Prestataire s&rsquo;engage &agrave; traiter les donn&eacute;es personnelles du Client
                conform&eacute;ment au R&egrave;glement G&eacute;n&eacute;ral sur la Protection des Donn&eacute;es
                (RGPD, R&egrave;glement UE 2016/679) et &agrave; la loi Informatique et Libert&eacute;s.
              </p>
              <p className="mt-3">
                Les modalit&eacute;s de collecte, de traitement et de conservation des donn&eacute;es
                personnelles sont d&eacute;taill&eacute;es dans la{" "}
                <Link
                  href="/confidentialite"
                  className="text-secondary font-semibold underline underline-offset-2 hover:text-secondary-700 transition-colors"
                >
                  Politique de Confidentialit&eacute;
                </Link>{" "}
                accessible sur le site.
              </p>
            </Section>

            {/* Article 15 */}
            <Section title="Article 15 — Force majeure">
              <p>
                Aucune des parties ne pourra &ecirc;tre tenue responsable de l&rsquo;inex&eacute;cution ou du retard
                dans l&rsquo;ex&eacute;cution de ses obligations en cas de force majeure au sens de l&rsquo;article
                1218 du Code civil (catastrophe naturelle, pand&eacute;mie, d&eacute;faillance technique
                majeure d&rsquo;un prestataire tiers, etc.).
              </p>
              <p className="mt-3">
                La partie affect&eacute;e informera l&rsquo;autre dans les meilleurs d&eacute;lais. Si la situation
                de force majeure perdure au-del&agrave; de 30 jours, chaque partie pourra r&eacute;silier
                le contrat sans indemnit&eacute;.
              </p>
            </Section>

            {/* Article 16 */}
            <Section title="Article 16 — R&eacute;solution amiable des litiges">
              <p>
                En cas de diff&eacute;rend li&eacute; &agrave; l&rsquo;ex&eacute;cution des pr&eacute;sentes CGV,
                les parties s&rsquo;engagent &agrave; rechercher une solution amiable dans un d&eacute;lai de
                30 jours &agrave; compter de la notification du litige par l&rsquo;une des parties.
              </p>
            </Section>

            {/* Article 17 */}
            <Section title="Article 17 — Droit applicable et juridiction comp&eacute;tente">
              <p>
                Les pr&eacute;sentes CGV sont r&eacute;gies par le droit fran&ccedil;ais.
              </p>
              <p className="mt-3">
                &Agrave; d&eacute;faut de r&eacute;solution amiable, tout litige sera soumis &agrave; la comp&eacute;tence
                exclusive des tribunaux de <strong>Nanterre</strong>.
              </p>
            </Section>

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

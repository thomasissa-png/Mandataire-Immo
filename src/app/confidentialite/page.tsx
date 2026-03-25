import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Politique de Confidentialité — ImmoCrew",
  description:
    "Politique de confidentialité et protection des données personnelles — ImmoCrew, conforme RGPD.",
}

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="container-immocrew py-12 desktop:py-20">
          <article className="max-w-3xl mx-auto">
            <h1 className="font-display text-h1 font-bold text-primary-900 mb-2">
              Politique de confidentialit&eacute;
            </h1>
            <p className="text-caption text-primary-400 mb-10">
              Derni&egrave;re mise &agrave; jour : 25 mars 2026
            </p>

            <Section title="1. Responsable du traitement">
              <p>Le responsable du traitement des donn&eacute;es personnelles est :</p>
              <dl className="mt-4 space-y-2">
                <InfoRow label="Raison sociale" value="[NOM DE LA SOCI&Eacute;T&Eacute;]" />
                <InfoRow label="Si&egrave;ge social" value="[ADRESSE COMPL&Egrave;TE]" />
                <InfoRow label="SIRET" value="[NUM&Eacute;RO SIRET]" />
                <InfoRow label="Contact DPO" value="dpo@immocrew.fr" />
              </dl>
            </Section>

            <Section title="2. Donn&eacute;es collect&eacute;es et finalit&eacute;s">
              <p>
                ImmoCrew s&rsquo;adresse exclusivement &agrave; des <strong>professionnels</strong> (mandataires
                immobiliers ind&eacute;pendants). Les donn&eacute;es collect&eacute;es sont des donn&eacute;es
                professionnelles, aucune donn&eacute;e sensible au sens de l&rsquo;article 9 du RGPD
                n&rsquo;est trait&eacute;e.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Traitement</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Donn&eacute;es</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Base l&eacute;gale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <DataRow
                      treatment="Cr&eacute;ation de compte"
                      data="Nom, pr&eacute;nom, email, mot de passe (hash&eacute; via Clerk)"
                      basis="Ex&eacute;cution du contrat (Art. 6.1.b RGPD)"
                    />
                    <DataRow
                      treatment="Facturation et paiement"
                      data="Nom, email, donn&eacute;es bancaires (g&eacute;r&eacute;es par Stripe, non stock&eacute;es chez nous)"
                      basis="Obligation l&eacute;gale (Art. 6.1.c) + Ex&eacute;cution du contrat"
                    />
                    <DataRow
                      treatment="Onboarding / questionnaire"
                      data="Zone g&eacute;ographique, sp&eacute;cialit&eacute; immobili&egrave;re, ton de communication, URL r&eacute;seaux sociaux, photo/logo"
                      basis="Ex&eacute;cution du contrat (Art. 6.1.b)"
                    />
                    <DataRow
                      treatment="G&eacute;n&eacute;ration de contenu IA"
                      data="Donn&eacute;es du questionnaire transmises &agrave; l&rsquo;API Anthropic (Claude)"
                      basis="Ex&eacute;cution du contrat (Art. 6.1.b)"
                    />
                    <DataRow
                      treatment="Analytics (PostHog)"
                      data="Donn&eacute;es de navigation anonymis&eacute;es, &eacute;v&eacute;nements d&rsquo;usage"
                      basis="Consentement (Art. 6.1.a)"
                    />
                    <DataRow
                      treatment="Cookies essentiels"
                      data="Identifiants de session (authentification)"
                      basis="Ex&eacute;cution du contrat (Art. 6.1.b)"
                    />
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="3. Sous-traitants et destinataires des donn&eacute;es">
              <p>
                Vos donn&eacute;es personnelles peuvent &ecirc;tre transmises aux sous-traitants suivants,
                dans le cadre strict de la fourniture du service :
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Sous-traitant</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">R&ocirc;le</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Localisation</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Garanties</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border border-primary-200 font-semibold">Clerk</td>
                      <td className="p-3 border border-primary-200">Authentification, gestion des sessions</td>
                      <td className="p-3 border border-primary-200">USA</td>
                      <td className="p-3 border border-primary-200">EU-US Data Privacy Framework (DPF) + Clauses Contractuelles Types (SCC)</td>
                    </tr>
                    <tr className="bg-primary-50/50">
                      <td className="p-3 border border-primary-200 font-semibold">Stripe</td>
                      <td className="p-3 border border-primary-200">Paiement, facturation</td>
                      <td className="p-3 border border-primary-200">USA (Stripe Payments Europe, Ltd. pour les donn&eacute;es UE)</td>
                      <td className="p-3 border border-primary-200">EU-US Data Privacy Framework (DPF) + Clauses Contractuelles Types (SCC)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-primary-200 font-semibold">Replit</td>
                      <td className="p-3 border border-primary-200">H&eacute;bergement de l&rsquo;application et base de donn&eacute;es</td>
                      <td className="p-3 border border-primary-200">USA</td>
                      <td className="p-3 border border-primary-200">Clauses Contractuelles Types (SCC)</td>
                    </tr>
                    <tr className="bg-primary-50/50">
                      <td className="p-3 border border-primary-200 font-semibold">Anthropic</td>
                      <td className="p-3 border border-primary-200">Traitement IA — g&eacute;n&eacute;ration de contenu</td>
                      <td className="p-3 border border-primary-200">USA</td>
                      <td className="p-3 border border-primary-200">Clauses Contractuelles Types (SCC). Les donn&eacute;es transmises via l&rsquo;API ne sont pas utilis&eacute;es pour l&rsquo;entra&icirc;nement.</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-primary-200 font-semibold">PostHog</td>
                      <td className="p-3 border border-primary-200">Analytics</td>
                      <td className="p-3 border border-primary-200">UE (Francfort, Allemagne)</td>
                      <td className="p-3 border border-primary-200">Donn&eacute;es h&eacute;berg&eacute;es en UE — pas de transfert hors UE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="4. Transferts de donn&eacute;es hors Union europ&eacute;enne">
              <p>
                Certains de nos sous-traitants (Clerk, Stripe, Replit, Anthropic) sont
                situ&eacute;s aux &Eacute;tats-Unis. Ces transferts sont encadr&eacute;s par :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  Le <strong>EU-US Data Privacy Framework (DPF)</strong> pour les sous-traitants certifi&eacute;s
                  (Clerk, Stripe).
                </li>
                <li>
                  Les <strong>Clauses Contractuelles Types (SCC)</strong> adopt&eacute;es par la Commission
                  europ&eacute;enne, incluses dans les accords de traitement de donn&eacute;es (DPA)
                  sign&eacute;s avec chaque sous-traitant.
                </li>
              </ul>
              <p className="mt-3">
                Seules des donn&eacute;es professionnelles non sensibles sont concern&eacute;es par ces
                transferts (coordonn&eacute;es professionnelles, zone g&eacute;ographique, sp&eacute;cialit&eacute;).
              </p>
            </Section>

            <Section title="5. Dur&eacute;es de conservation">
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Cat&eacute;gorie</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Dur&eacute;e</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Fondement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <DataRow
                      treatment="Donn&eacute;es de compte (nom, email, profil)"
                      data="Dur&eacute;e du contrat + 3 ans"
                      basis="Prescription civile"
                    />
                    <DataRow
                      treatment="Donn&eacute;es de facturation"
                      data="10 ans"
                      basis="Obligation comptable (Art. L.123-22 Code de commerce)"
                    />
                    <DataRow
                      treatment="Livrables produits"
                      data="Dur&eacute;e du contrat + 1 an"
                      basis="P&eacute;riode de r&eacute;clamation"
                    />
                    <DataRow
                      treatment="Donn&eacute;es d&rsquo;onboarding (questionnaire)"
                      data="Dur&eacute;e du contrat, suppression sous 30 jours apr&egrave;s r&eacute;siliation"
                      basis="Plus de finalit&eacute; apr&egrave;s fin du contrat"
                    />
                    <DataRow
                      treatment="Logs de connexion"
                      data="1 an"
                      basis="Obligation LCEN (Art. 6 II)"
                    />
                    <DataRow
                      treatment="Donn&eacute;es analytics (PostHog)"
                      data="25 mois maximum"
                      basis="Recommandation CNIL"
                    />
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="6. Vos droits">
              <p>
                Conform&eacute;ment au RGPD (articles 15 &agrave; 22), vous disposez des droits suivants
                sur vos donn&eacute;es personnelles :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Droit d&rsquo;acc&egrave;s</strong> (Art. 15) : obtenir la confirmation que vos donn&eacute;es
                  sont trait&eacute;es et en recevoir une copie.
                </li>
                <li>
                  <strong>Droit de rectification</strong> (Art. 16) : corriger des donn&eacute;es inexactes ou
                  incompl&egrave;tes, directement dans votre espace client ou par email.
                </li>
                <li>
                  <strong>Droit &agrave; l&rsquo;effacement</strong> (Art. 17) : demander la suppression de vos
                  donn&eacute;es, sous r&eacute;serve des obligations l&eacute;gales de conservation (facturation,
                  logs).
                </li>
                <li>
                  <strong>Droit &agrave; la limitation du traitement</strong> (Art. 18) : demander la suspension
                  du traitement dans certaines situations.
                </li>
                <li>
                  <strong>Droit &agrave; la portabilit&eacute;</strong> (Art. 20) : recevoir vos donn&eacute;es dans un
                  format structur&eacute; et lisible par machine (JSON ou CSV).
                </li>
                <li>
                  <strong>Droit d&rsquo;opposition</strong> (Art. 21) : vous opposer au traitement de vos
                  donn&eacute;es, notamment &agrave; des fins de prospection (opposition imm&eacute;diate).
                </li>
              </ul>
              <p className="mt-4">
                Pour exercer vos droits, adressez votre demande &agrave; :{" "}
                <a
                  href="mailto:dpo@immocrew.fr"
                  className="text-secondary font-semibold underline underline-offset-2 hover:text-secondary/80 transition-colors"
                >
                  dpo@immocrew.fr
                </a>
              </p>
              <p className="mt-2">
                Nous nous engageons &agrave; r&eacute;pondre dans un d&eacute;lai d&rsquo;<strong>un mois</strong> &agrave;
                compter de la r&eacute;ception de votre demande.
              </p>
              <p className="mt-4">
                Vous disposez &eacute;galement du droit d&rsquo;introduire une r&eacute;clamation aupr&egrave;s de la
                Commission Nationale de l&rsquo;Informatique et des Libert&eacute;s (CNIL) :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary underline underline-offset-2 hover:text-secondary/80 transition-colors"
                >
                  www.cnil.fr
                </a>
              </p>
            </Section>

            <Section title="7. Cookies">
              <p className="font-semibold">Cookies strictement n&eacute;cessaires</p>
              <p>
                Les cookies d&rsquo;authentification (Clerk) sont indispensables au fonctionnement du
                service. Ils ne n&eacute;cessitent pas votre consentement.
              </p>

              <p className="font-semibold mt-4">Cookies analytics</p>
              <p>
                Nous utilisons <strong>PostHog</strong> (h&eacute;berg&eacute; en UE, Francfort) pour analyser
                l&rsquo;utilisation du site et am&eacute;liorer le service. Ces cookies ne sont
                d&eacute;pos&eacute;s qu&rsquo;apr&egrave;s votre <strong>consentement explicite</strong>, recueilli via
                notre bandeau de cookies.
              </p>
              <p className="mt-3">
                Vous pouvez retirer votre consentement &agrave; tout moment en modifiant vos
                pr&eacute;f&eacute;rences de cookies depuis le bandeau ou en nous contactant.
              </p>

              <p className="font-semibold mt-4">Aucun cookie publicitaire</p>
              <p>
                ImmoCrew n&rsquo;utilise aucun cookie publicitaire, de retargeting ou de pistage
                &agrave; des fins commerciales.
              </p>
            </Section>

            <Section title="8. S&eacute;curit&eacute; des donn&eacute;es">
              <p>
                Nous mettons en &oelig;uvre les mesures techniques et organisationnelles
                appropri&eacute;es pour prot&eacute;ger vos donn&eacute;es contre tout acc&egrave;s non autoris&eacute;,
                modification, divulgation ou destruction :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>Chiffrement des communications (HTTPS/TLS)</li>
                <li>Mots de passe hash&eacute;s (via Clerk)</li>
                <li>Donn&eacute;es bancaires g&eacute;r&eacute;es exclusivement par Stripe (certifi&eacute; PCI-DSS)</li>
                <li>Acc&egrave;s aux donn&eacute;es restreint au strict n&eacute;cessaire</li>
              </ul>
            </Section>

            <Section title="9. Contact">
              <p>
                Pour toute question relative &agrave; la protection de vos donn&eacute;es personnelles,
                vous pouvez nous contacter :
              </p>
              <dl className="mt-4 space-y-2">
                <InfoRow label="Email DPO" value="dpo@immocrew.fr" />
                <InfoRow label="Email g&eacute;n&eacute;ral" value="contact@immocrew.fr" />
                <InfoRow label="Adresse postale" value="[ADRESSE COMPL&Egrave;TE]" />
              </dl>
            </Section>

            {/* Retour */}
            <div className="mt-12 pt-8 border-t border-primary-100">
              <Link
                href="/"
                className="text-secondary font-semibold hover:text-secondary/80 transition-colors"
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
      <div className="text-body text-foreground leading-relaxed">
        {children}
      </div>
    </section>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col tablet:flex-row tablet:gap-2">
      <dt
        className="font-semibold text-primary-700 tablet:min-w-[200px]"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <dd dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  )
}

function DataRow({
  treatment,
  data,
  basis,
}: {
  treatment: string
  data: string
  basis: string
}) {
  return (
    <tr className="even:bg-primary-50/50">
      <td
        className="p-3 border border-primary-200 font-semibold"
        dangerouslySetInnerHTML={{ __html: treatment }}
      />
      <td
        className="p-3 border border-primary-200"
        dangerouslySetInnerHTML={{ __html: data }}
      />
      <td
        className="p-3 border border-primary-200"
        dangerouslySetInnerHTML={{ __html: basis }}
      />
    </tr>
  )
}

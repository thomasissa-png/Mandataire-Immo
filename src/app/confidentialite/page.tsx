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
            <h1 className="font-display text-h1 font-bold text-primary mb-2">
              Politique de confidentialité
            </h1>
            <p className="text-caption text-neutral-500 mb-10">
              Dernière mise à jour : 25 mars 2026
            </p>

            <Section title="1. Responsable du traitement">
              <p>Le responsable du traitement des données personnelles est :</p>
              <dl className="mt-4 space-y-2">
                <InfoRow label="Raison sociale" value="VERSI" />
                <InfoRow label="Siège social" value="54 rue Henri Barbusse, 92000 Nanterre" />
                <InfoRow label="SIRET" value="91286261200013" />
                <InfoRow label="Contact DPO" value="dpo@immocrew.fr" />
              </dl>
            </Section>

            <Section title="2. Données collectées et finalités">
              <p>
                ImmoCrew s'adresse exclusivement à des <strong>professionnels</strong> (mandataires
                immobiliers indépendants). Les données collectées sont des données
                professionnelles, aucune donnée sensible au sens de l'article 9 du RGPD
                n'est traitée.
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Traitement</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Données</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Base légale</th>
                    </tr>
                  </thead>
                  <tbody>
                    <DataRow
                      treatment="Création de compte"
                      data="Nom, prénom, email, mot de passe (hashé via bcrypt)"
                      basis="Exécution du contrat (Art. 6.1.b RGPD)"
                    />
                    <DataRow
                      treatment="Facturation et paiement"
                      data="Nom, email, données bancaires (gérées par Stripe, non stockées chez nous)"
                      basis="Obligation légale (Art. 6.1.c) + Exécution du contrat"
                    />
                    <DataRow
                      treatment="Onboarding / questionnaire"
                      data="Zone géographique, spécialité immobilière, ton de communication, URL réseaux sociaux, photo/logo"
                      basis="Exécution du contrat (Art. 6.1.b)"
                    />
                    <DataRow
                      treatment="Génération de contenu IA"
                      data="Données du questionnaire transmises à l'API Anthropic (Claude)"
                      basis="Exécution du contrat (Art. 6.1.b)"
                    />
                    <DataRow
                      treatment="Analytics (Umami Cloud)"
                      data="Données de navigation anonymisées, événements d'usage"
                      basis="Intérêt légitime (Art. 6.1.f) — Umami est privacy-first, sans cookies, conforme RGPD"
                    />
                    <DataRow
                      treatment="Cookies essentiels"
                      data="Identifiants de session (authentification)"
                      basis="Exécution du contrat (Art. 6.1.b)"
                    />
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="3. Sous-traitants et destinataires des données">
              <p>
                Vos données personnelles peuvent être transmises aux sous-traitants suivants,
                dans le cadre strict de la fourniture du service :
              </p>

              <div className="overflow-x-auto mt-4">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Sous-traitant</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Rôle</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Localisation</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Garanties</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-primary-50/50">
                      <td className="p-3 border border-primary-200 font-semibold">Stripe</td>
                      <td className="p-3 border border-primary-200">Paiement, facturation</td>
                      <td className="p-3 border border-primary-200">USA (Stripe Payments Europe, Ltd. pour les données UE)</td>
                      <td className="p-3 border border-primary-200">EU-US Data Privacy Framework (DPF) + Clauses Contractuelles Types (SCC)</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-primary-200 font-semibold">Replit</td>
                      <td className="p-3 border border-primary-200">Hébergement de l'application et base de données</td>
                      <td className="p-3 border border-primary-200">USA</td>
                      <td className="p-3 border border-primary-200">Clauses Contractuelles Types (SCC)</td>
                    </tr>
                    <tr className="bg-primary-50/50">
                      <td className="p-3 border border-primary-200 font-semibold">Anthropic</td>
                      <td className="p-3 border border-primary-200">Traitement IA — génération de contenu</td>
                      <td className="p-3 border border-primary-200">USA</td>
                      <td className="p-3 border border-primary-200">Clauses Contractuelles Types (SCC). Les données transmises via l'API ne sont pas utilisées pour l'entraînement.</td>
                    </tr>
                    <tr>
                      <td className="p-3 border border-primary-200 font-semibold">Umami Cloud</td>
                      <td className="p-3 border border-primary-200">Analytics (privacy-first, sans cookies)</td>
                      <td className="p-3 border border-primary-200">UE</td>
                      <td className="p-3 border border-primary-200">Données hébergées en UE — pas de transfert hors UE. Aucun cookie déposé.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="4. Transferts de données hors Union européenne">
              <p>
                Certains de nos sous-traitants (Stripe, Replit, Anthropic) sont
                situés aux États-Unis. Ces transferts sont encadrés par :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  Le <strong>EU-US Data Privacy Framework (DPF)</strong> pour les sous-traitants certifiés
                  (Stripe).
                </li>
                <li>
                  Les <strong>Clauses Contractuelles Types (SCC)</strong> adoptées par la Commission
                  européenne, incluses dans les accords de traitement de données (DPA)
                  signés avec chaque sous-traitant.
                </li>
              </ul>
              <p className="mt-3">
                Seules des données professionnelles non sensibles sont concernées par ces
                transferts (coordonnées professionnelles, zone géographique, spécialité).
              </p>
            </Section>

            <Section title="5. Durées de conservation">
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-body-sm border-collapse">
                  <thead>
                    <tr className="bg-primary-50">
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Catégorie</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Durée</th>
                      <th className="text-left p-3 font-semibold text-primary-800 border border-primary-200">Fondement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <DataRow
                      treatment="Données de compte (nom, email, profil)"
                      data="Durée du contrat + 3 ans"
                      basis="Prescription civile"
                    />
                    <DataRow
                      treatment="Données de facturation"
                      data="10 ans"
                      basis="Obligation comptable (Art. L.123-22 Code de commerce)"
                    />
                    <DataRow
                      treatment="Livrables produits"
                      data="Durée du contrat + 1 an"
                      basis="Période de réclamation"
                    />
                    <DataRow
                      treatment="Données d'onboarding (questionnaire)"
                      data="Durée du contrat, suppression sous 30 jours après résiliation"
                      basis="Plus de finalité après fin du contrat"
                    />
                    <DataRow
                      treatment="Logs de connexion"
                      data="1 an"
                      basis="Obligation LCEN (Art. 6 II)"
                    />
                    <DataRow
                      treatment="Données analytics (Umami Cloud)"
                      data="25 mois maximum"
                      basis="Recommandation CNIL"
                    />
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="6. Vos droits">
              <p>
                Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants
                sur vos données personnelles :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Droit d'accès</strong> (Art. 15) : obtenir la confirmation que vos données
                  sont traitées et en recevoir une copie.
                </li>
                <li>
                  <strong>Droit de rectification</strong> (Art. 16) : corriger des données inexactes ou
                  incomplètes, directement dans votre espace client ou par email.
                </li>
                <li>
                  <strong>Droit à l'effacement</strong> (Art. 17) : demander la suppression de vos
                  données, sous réserve des obligations légales de conservation (facturation,
                  logs).
                </li>
                <li>
                  <strong>Droit à la limitation du traitement</strong> (Art. 18) : demander la suspension
                  du traitement dans certaines situations.
                </li>
                <li>
                  <strong>Droit à la portabilité</strong> (Art. 20) : recevoir vos données dans un
                  format structuré et lisible par machine (JSON ou CSV).
                </li>
                <li>
                  <strong>Droit d'opposition</strong> (Art. 21) : vous opposer au traitement de vos
                  données, notamment à des fins de prospection (opposition immédiate).
                </li>
              </ul>
              <p className="mt-4">
                Pour exercer vos droits, adressez votre demande à :{" "}
                <a
                  href="mailto:dpo@immocrew.fr"
                  className="text-secondary font-semibold underline underline-offset-2 hover:text-secondary-700 transition-colors"
                >
                  dpo@immocrew.fr
                </a>
              </p>
              <p className="mt-2">
                Nous nous engageons à répondre dans un délai d'<strong>un mois</strong> à
                compter de la réception de votre demande.
              </p>
              <p className="mt-4">
                Vous disposez également du droit d'introduire une réclamation auprès de la
                Commission Nationale de l'Informatique et des Libertés (CNIL) :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary underline underline-offset-2 hover:text-secondary-700 transition-colors"
                >
                  www.cnil.fr
                </a>
              </p>
            </Section>

            <Section title="7. Cookies">
              <p className="font-semibold">Cookies strictement nécessaires</p>
              <p>
                Les cookies d'authentification (NextAuth) sont indispensables au fonctionnement du
                service. Ils ne nécessitent pas votre consentement.
              </p>

              <p className="font-semibold mt-4">Cookies analytics</p>
              <p>
                Nous utilisons <strong>Umami Cloud</strong> (hébergé en UE), une solution
                d'analytics <strong>privacy-first qui ne dépose aucun cookie</strong>. Les données
                collectées sont anonymes et ne permettent pas d'identifier individuellement
                les visiteurs. Aucun consentement n'est requis au titre de la directive ePrivacy.
              </p>
              <p className="mt-3">
                Vous pouvez retirer votre consentement à tout moment en modifiant vos
                préférences de cookies depuis le bandeau ou en nous contactant.
              </p>

              <p className="font-semibold mt-4">Aucun cookie publicitaire</p>
              <p>
                ImmoCrew n'utilise aucun cookie publicitaire, de retargeting ou de pistage
                à des fins commerciales.
              </p>
            </Section>

            <Section title="8. Sécurité des données">
              <p>
                Nous mettons en œuvre les mesures techniques et organisationnelles
                appropriées pour protéger vos données contre tout accès non autorisé,
                modification, divulgation ou destruction :
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1">
                <li>Chiffrement des communications (HTTPS/TLS)</li>
                <li>Mots de passe hashés (bcrypt, stockage local)</li>
                <li>Données bancaires gérées exclusivement par Stripe (certifié PCI-DSS)</li>
                <li>Accès aux données restreint au strict nécessaire</li>
              </ul>
            </Section>

            <Section title="9. Contact">
              <p>
                Pour toute question relative à la protection de vos données personnelles,
                vous pouvez nous contacter :
              </p>
              <dl className="mt-4 space-y-2">
                <InfoRow label="Email DPO" value="dpo@immocrew.fr" />
                <InfoRow label="Email général" value="contact@immocrew.fr" />
                <InfoRow label="Adresse postale" value="54 rue Henri Barbusse, 92000 Nanterre" />
              </dl>
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

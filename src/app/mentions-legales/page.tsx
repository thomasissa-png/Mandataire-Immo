import type { Metadata } from "next"
import Link from "next/link"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"

export const metadata: Metadata = {
  title: "Mentions Légales — ImmoCrew",
  description:
    "Mentions légales du site immocrew.fr — éditeur, hébergeur, propriété intellectuelle.",
}

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="container-immocrew py-12 desktop:py-20">
          <article className="max-w-3xl mx-auto">
            <h1 className="font-display text-h1 font-bold text-primary mb-2">
              Mentions légales
            </h1>
            <p className="text-caption text-neutral-500 mb-10">
              Dernière mise à jour : 25 mars 2026
            </p>

            {/* Editeur */}
            <Section title="1. Éditeur du site">
              <p>
                Le site <strong>immocrew.fr</strong> est édité par :
              </p>
              <dl className="mt-4 space-y-2">
                <InfoRow label="Raison sociale" value="VERSI" />
                <InfoRow label="Forme juridique" value="SAS" />
                <InfoRow label="Capital social" value="1 000 €" />
                <InfoRow label="Siège social" value="54 rue Henri Barbusse, 92000 Nanterre" />
                <InfoRow label="SIRET" value="91286261200013" />
                <InfoRow label="RCS" value="Nanterre B 912862612" />
                <InfoRow label="Numéro de TVA intracommunautaire" value="FR91912862612" />
                <InfoRow label="Email" value="contact@immocrew.fr" />
              </dl>
            </Section>

            {/* Directeur publication */}
            <Section title="2. Directeur de la publication">
              <p>
                <strong>Thomas Issa</strong>, en qualité de Président.
              </p>
              <p className="mt-2">
                Contact : <a href="mailto:contact@immocrew.fr" className="text-secondary underline underline-offset-2 hover:text-secondary-700 transition-colors">contact@immocrew.fr</a>
              </p>
            </Section>

            {/* Hebergeur */}
            <Section title="3. Hébergeur">
              <dl className="space-y-2">
                <InfoRow label="Raison sociale" value="Replit, Inc." />
                <InfoRow label="Adresse" value="350 Mission Street, San Francisco, CA 94105, USA" />
                <InfoRow label="Site web" value="https://replit.com" />
              </dl>
            </Section>

            {/* Propriete intellectuelle */}
            <Section title="4. Propriété intellectuelle">
              <p>
                L&rsquo;ensemble du contenu du site immocrew.fr (textes, images, graphismes, logo,
                icônes, mise en page, logiciels) est la propriété exclusive de
                VERSI ou de ses partenaires, et est protégé
                par les lois françaises et internationales relatives à la propriété
                intellectuelle.
              </p>
              <p className="mt-3">
                Toute reproduction, représentation, modification, publication, transmission ou
                dénaturation, totale ou partielle, du site ou de son contenu, par quelque
                procédé que ce soit, et sur quelque support que ce soit, est interdite
                sans l&rsquo;autorisation écrite préalable de VERSI.
              </p>
            </Section>

            {/* Credits */}
            <Section title="5. Crédits et transparence IA">
              <p>
                Certains contenus présentés sur ce site (textes de démonstration,
                exemples de livrables) sont produits avec l&rsquo;assistance de technologies
                d&rsquo;intelligence artificielle générative (Claude, Anthropic).
              </p>
              <p className="mt-3">
                Les livrables fournis aux clients dans le cadre des prestations ImmoCrew
                sont également produits avec assistance IA et font l&rsquo;objet d&rsquo;une relecture
                et validation humaine avant livraison.
              </p>
              <p className="mt-3">
                Cette mention est faite conformément aux obligations de transparence
                du Règlement européen sur l&rsquo;Intelligence Artificielle (AI Act,
                Règlement UE 2024/1689).
              </p>
            </Section>

            {/* Donnees personnelles */}
            <Section title="6. Données personnelles">
              <p>
                Le traitement des données personnelles collectées sur ce site est
                détaillé dans notre{" "}
                <Link
                  href="/confidentialite"
                  className="text-secondary font-semibold underline underline-offset-2 hover:text-secondary-700 transition-colors"
                >
                  Politique de Confidentialité
                </Link>
                .
              </p>
              <p className="mt-3">
                Conformément au Règlement Général sur la Protection des Données
                (RGPD), vous disposez d&rsquo;un droit d&rsquo;accès, de rectification, de suppression
                et de portabilité de vos données. Pour exercer ces droits, contactez :
                {" "}<a href="mailto:contact@immocrew.fr" className="text-secondary underline underline-offset-2 hover:text-secondary-700 transition-colors">contact@immocrew.fr</a>.
              </p>
              <p className="mt-3">
                Vous pouvez également adresser une réclamation à la CNIL :{" "}
                <a
                  href="https://www.cnil.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary underline underline-offset-2 hover:text-secondary-700 transition-colors"
                >
                  www.cnil.fr
                </a>
                .
              </p>
            </Section>

            {/* Conditions generales */}
            <Section title="7. Conditions générales">
              <p>
                L&rsquo;utilisation du service ImmoCrew est soumise à nos{" "}
                <Link
                  href="/cgv"
                  className="text-secondary font-semibold underline underline-offset-2 hover:text-secondary-700 transition-colors"
                >
                  Conditions Générales de Vente
                </Link>
                .
              </p>
            </Section>

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
        className="font-semibold text-primary-700 tablet:min-w-[280px]"
        dangerouslySetInnerHTML={{ __html: label }}
      />
      <dd dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  )
}

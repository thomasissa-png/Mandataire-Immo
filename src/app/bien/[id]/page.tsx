import { Metadata } from "next"
import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import type { PropertyPage } from "@/types/property"
import { PropertyGallery } from "@/components/property/PropertyGallery"
import { PropertyMap } from "@/components/property/PropertyMap"
import { PropertyDVF } from "@/components/property/PropertyDVF"
import { PropertyDPE } from "@/components/property/PropertyDPE"
import { PropertyContact } from "@/components/property/PropertyContact"
import { PrintButton } from "@/components/property/PrintButton"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import { JsonLd } from "@/components/JsonLd"

interface PageProps {
  params: Promise<{ id: string }>
}

async function getProperty(id: string): Promise<PropertyPage | null> {
  const { rows } = await query<PropertyPage>(
    `SELECT * FROM property_pages WHERE (id = $1 OR slug = $1) AND status = 'published'`,
    [id]
  )
  return rows[0] || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) {
    return { title: "Bien non trouvé" }
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://immocrew.fr"
  const slug = property.slug || id
  const title = property.titre_annonce || property.titre
  const description =
    property.accroche_courte ||
    `${property.type_bien} ${property.pieces} pièces - ${property.surface}m² à ${property.city || property.adresse} - ${property.prix.toLocaleString("fr-FR")} EUR`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}/bien/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      locale: "fr_FR",
      images:
        property.photos_staging.length > 0
          ? [{ url: property.photos_staging[0].url, width: 1024, height: 1024 }]
          : property.photos_originales.length > 0
            ? [{ url: property.photos_originales[0].url, width: 1024, height: 1024 }]
            : [],
    },
  }
}

function buildPropertyJsonLd(property: PropertyPage) {
  const titre = property.titre_annonce || property.titre
  const ville = property.city
    ? `${property.city}${property.postcode ? `, ${property.postcode}` : ""}`
    : property.adresse
  const photos = [
    ...property.photos_staging.map((p) => p.url),
    ...property.photos_originales.map((p) => p.url),
  ].slice(0, 10)

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: titre,
    description:
      property.accroche_courte ||
      `${property.type_bien} ${property.pieces} pièces — ${property.surface} m² à ${ville}`,
    url: property.slug
      ? `https://immocrew.fr/bien/${property.slug}`
      : `https://immocrew.fr/bien/${property.id}`,
    datePosted: property.published_at || property.created_at,
    price: property.prix,
    priceCurrency: "EUR",
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.surface,
      unitCode: "MTK",
    },
    numberOfRooms: property.pieces,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.adresse,
      addressLocality: property.city ?? undefined,
      postalCode: property.postcode ?? undefined,
      addressCountry: "FR",
    },
  }

  if (photos.length > 0) {
    jsonLd.image = photos
  }

  if (property.lat !== null && property.lon !== null) {
    jsonLd.geo = {
      "@type": "GeoCoordinates",
      latitude: property.lat,
      longitude: property.lon,
    }
  }

  if (property.dpe_classe !== null) {
    jsonLd.energyConsumptionDetails = {
      "@type": "EnergyConsumptionDetails",
      hasEnergyEfficiencyCategory:
        `https://schema.org/EUEnergyEfficiencyCategory${property.dpe_classe}`,
    }
  }

  if (property.nom_mandataire) {
    jsonLd.seller = {
      "@type": "RealEstateAgent",
      name: property.nom_mandataire,
      email: property.email_contact ?? undefined,
      telephone: property.telephone_contact ?? undefined,
    }
  }

  return jsonLd
}

export default async function PropertyPageRoute({ params }: PageProps) {
  const { id } = await params
  const property = await getProperty(id)
  if (!property) notFound()

  const hasStaging = property.photos_staging.length > 0
  const hasOriginals = property.photos_originales.length > 0
  const hasDVF = property.dvf_prix_m2_moyen !== null
  const hasDPE = property.dpe_classe !== null
  const hasMap = property.lat !== null && property.lon !== null
  const propertyJsonLd = buildPropertyJsonLd(property)

  return (
    <>
    <JsonLd data={propertyJsonLd} />
    <Header />
    <main className="min-h-screen bg-background">
      {/* Header du bien */}
      <section className="bg-primary text-white section-padding">
        <div className="container-immocrew">
          <p className="text-caption uppercase tracking-wider text-secondary-300 mb-2">
            {property.type_bien} · {property.pieces} pièces · {property.surface}m²
          </p>
          <h1 className="text-display-lg tablet:text-display-xl text-white mb-4">
            {property.titre_annonce || property.titre}
          </h1>
          <p className="text-body-lg text-neutral-300">
            {property.city ? `${property.city} (${property.postcode})` : property.adresse}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <p className="text-h2 text-secondary">
              {property.prix.toLocaleString("fr-FR")} €
            </p>
            <PrintButton />
          </div>
        </div>
      </section>

      {/* Galerie avant/apres */}
      {(hasStaging || hasOriginals) && (
        <section className="section-padding">
          <div className="container-immocrew">
            <h2 className="text-h2 mb-8">
              {hasStaging ? "Visuels du bien" : "Photos"}
            </h2>
            <PropertyGallery
              originales={property.photos_originales}
              staging={property.photos_staging}
            />
          </div>
        </section>
      )}

      {/* Annonce storytelling */}
      {property.annonce_longue && (
        <section className="section-padding bg-card">
          <div className="container-immocrew max-w-3xl">
            <h2 className="text-h2 mb-8">Découvrir ce bien</h2>
            <div
              className="prose prose-lg max-w-none text-foreground"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(property.annonce_longue),
              }}
            />
          </div>
        </section>
      )}

      {/* Donnees DVF + DPE + Carte — grille */}
      {(hasDVF || hasDPE || hasMap) && (
        <section className="section-padding">
          <div className="container-immocrew">
            <h2 className="text-h2 mb-8">Informations du quartier</h2>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
              {hasMap && (
                <div className="tablet:col-span-2">
                  <PropertyMap lat={property.lat!} lon={property.lon!} titre={property.titre} />
                </div>
              )}
              {hasDVF && (
                <PropertyDVF
                  prix_m2_moyen={property.dvf_prix_m2_moyen!}
                  transactions={property.dvf_transactions}
                />
              )}
              {hasDPE && (
                <PropertyDPE
                  classe={property.dpe_classe!}
                  ges_classe={property.dpe_ges_classe}
                  valeur_energie={property.dpe_valeur_energie}
                  valeur_ges={property.dpe_valeur_ges}
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* CTA Contact */}
      <section className="section-padding bg-primary">
        <div className="container-immocrew">
          <PropertyContact
            nom={property.nom_mandataire}
            email={property.email_contact}
            telephone={property.telephone_contact}
            titre_bien={property.titre}
          />
        </div>
      </section>

      {/* Mentions legales */}
      <footer className="py-6 bg-neutral-100">
        <div className="container-immocrew text-center">
          <p className="text-caption text-neutral-500">
            Les prix s&apos;entendent frais d&apos;agence inclus.
            {hasDPE && property.dpe_classe && (
              <> DPE : {property.dpe_classe}.</>
            )}
          </p>
          {hasStaging && (
            <p className="text-caption text-neutral-500 mt-1">
              Home staging virtuel — les visuels meublés sont des projections non contractuelles.
              Le bien est livré dans son état actuel (photos originales disponibles ci-dessus).
            </p>
          )}
        </div>
      </footer>
    </main>
    <Footer />
    </>
  )
}

/**
 * Conversion markdown basique vers HTML.
 * Pas de dependance externe — couvre les cas du storytelling immobilier.
 */
/** Whitelist de balises HTML autorisees apres conversion markdown */
const ALLOWED_TAGS = new Set(["h1", "h2", "h3", "p", "strong", "em", "br", "ul", "li"])

/** Supprime toutes les balises HTML non-autorisees (protection XSS) */
function sanitizeHtml(html: string): string {
  return html.replace(/<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/gi, (match, tag) => {
    const normalized = tag.toLowerCase()
    if (ALLOWED_TAGS.has(normalized)) {
      // Garder uniquement la balise sans attributs (sauf les self-closing comme <br>)
      const isClosing = match.startsWith("</")
      return isClosing ? `</${normalized}>` : `<${normalized}>`
    }
    return "" // Supprimer les balises non autorisees
  })
}

function markdownToHtml(md: string): string {
  const raw = md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/gim, "<em>$1</em>")
    .replace(/\n\n/gim, "</p><p>")
    .replace(/\n/gim, "<br>")
    .replace(/^(.+)$/gim, "<p>$1</p>")
    .replace(/<p><\/p>/gim, "")
    .replace(/<p><h([1-3])>/gim, "<h$1>")
    .replace(/<\/h([1-3])><\/p>/gim, "</h$1>")
  return sanitizeHtml(raw)
}

/**
 * Enrichissement de donnees immobilieres via APIs publiques (gratuit, sans cle).
 * 1. Geocoding : API Adresse data.gouv.fr
 * 2. Prix au m2 : API DVF (Demandes de Valeurs Foncieres) via cquest.org
 * 3. DPE : API ADEME (observatoire DPE) — recherche par coordonnees GPS
 */

import type { DPEData } from "@/types/property"

// ─── Types ───────────────────────────────────────────────────────────

export interface EnrichedProperty {
  lat: number
  lon: number
  city: string
  postcode: string
  prix_m2_moyen: number | null
  dernieres_transactions: DVFTransaction[]
}

export interface DVFTransaction {
  date: string
  prix: number
  surface: number
  prix_m2: number
  type: string
}

interface GeocodingResult {
  lat: number
  lon: number
  label: string
  postcode: string
  city: string
}

// ─── Geocoding : API Adresse gouv ────────────────────────────────────

async function geocodeAddress(adresse: string): Promise<GeocodingResult | null> {
  try {
    const res = await fetch(
      `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(adresse)}&limit=1`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) return null

    const data = await res.json()
    const feature = data.features?.[0]
    if (!feature) return null

    const [lon, lat] = feature.geometry.coordinates as [number, number]
    const props = feature.properties as Record<string, string>

    return {
      lat,
      lon,
      label: props.label || adresse,
      postcode: props.postcode || "",
      city: props.city || "",
    }
  } catch {
    return null
  }
}

// ─── DVF : Demandes de Valeurs Foncieres ─────────────────────────────

async function fetchDVFData(
  lat: number,
  lon: number
): Promise<{ prix_m2_moyen: number | null; transactions: DVFTransaction[] }> {
  try {
    const res = await fetch(
      `https://api.cquest.org/dvf?lat=${lat}&lon=${lon}&dist=500`,
      { signal: AbortSignal.timeout(8000) }
    )
    if (!res.ok) return { prix_m2_moyen: null, transactions: [] }

    const data = await res.json()
    const results = (data.resultats || []) as Array<{
      date_mutation: string
      valeur_fonciere: number
      surface_reelle_bati: number
      type_local: string
    }>

    if (results.length === 0) return { prix_m2_moyen: null, transactions: [] }

    const transactions: DVFTransaction[] = results
      .filter((r) => r.valeur_fonciere > 0 && r.surface_reelle_bati > 0)
      .slice(0, 10)
      .map((r) => ({
        date: r.date_mutation,
        prix: r.valeur_fonciere,
        surface: r.surface_reelle_bati,
        prix_m2: Math.round(r.valeur_fonciere / r.surface_reelle_bati),
        type: r.type_local || "",
      }))

    const prixM2Values = transactions.map((t) => t.prix_m2).filter((v) => v > 0)
    const prix_m2_moyen =
      prixM2Values.length > 0
        ? Math.round(prixM2Values.reduce((a, b) => a + b, 0) / prixM2Values.length)
        : null

    return { prix_m2_moyen, transactions }
  } catch {
    return { prix_m2_moyen: null, transactions: [] }
  }
}

// ─── DPE : API ADEME (observatoire-dpe.ademe.fr) ────────────────────

/**
 * Recherche le DPE d'un bien via l'API ouverte de l'ADEME.
 * API publique, gratuite, sans cle. Limite : 50 req/s.
 * Documentation : https://data.ademe.fr/datasets/dpe-v2-logements-existants
 *
 * Note : l'API ADEME recherche par code INSEE + adresse.
 * On utilise les coordonnees GPS pour trouver les DPE proches
 * via l'endpoint geo de l'API DPE de l'ADEME.
 *
 * Fallback : si l'API ADEME ne repond pas ou ne trouve rien,
 * on retourne null (pas de fabrication de donnees).
 */
async function fetchDPEData(
  lat: number,
  lon: number
): Promise<DPEData | null> {
  try {
    // API ADEME DPE v2 — endpoint geographique
    // Recherche dans un rayon de 100m autour des coordonnees
    const res = await fetch(
      `https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?geo_distance=${lat},${lon},100&size=1&select=classe_consommation_energie,classe_estimation_ges,consommation_energie,estimation_ges&sort=-date_etablissement_dpe`,
      { signal: AbortSignal.timeout(8000) }
    )

    if (!res.ok) {
      console.warn(`[DPE ADEME] API returned ${res.status}`)
      return null
    }

    const data = await res.json()
    const results = data.results as Array<{
      classe_consommation_energie?: string
      classe_estimation_ges?: string
      consommation_energie?: number
      estimation_ges?: number
    }> | undefined

    if (!results || results.length === 0) {
      console.log("[DPE ADEME] Aucun DPE trouve pour ces coordonnees")
      return null
    }

    const dpe = results[0]
    return {
      classe: dpe.classe_consommation_energie || null,
      ges_classe: dpe.classe_estimation_ges || null,
      valeur_energie: dpe.consommation_energie ?? null,
      valeur_ges: dpe.estimation_ges ?? null,
    }
  } catch {
    console.warn("[DPE ADEME] Erreur lors de la requete — DPE non disponible")
    return null
  }
}

// ─── Generation version courte d'annonce ────────────────────────────

/**
 * Tronque une annonce longue en version courte (max 1500 caracteres)
 * adaptee aux portails immobiliers (SeLoger, LeBonCoin).
 *
 * Strategie : garder l'accroche + les infos cles + le CTA,
 * sans couper en plein milieu d'une phrase.
 */
export function generateShortAnnonce(annonceLongue: string, maxLength: number = 1500): string {
  if (annonceLongue.length <= maxLength) return annonceLongue

  // Retirer le formatage Markdown pour le portail
  let text = annonceLongue
    .replace(/#{1,6}\s/g, "")          // titres markdown
    .replace(/\*\*(.*?)\*\*/g, "$1")   // bold
    .replace(/\*(.*?)\*/g, "$1")       // italic
    .replace(/\n{3,}/g, "\n\n")        // espaces multiples

  // Si encore trop long, couper a la derniere phrase complete avant la limite
  if (text.length > maxLength) {
    const truncated = text.slice(0, maxLength)
    const lastPeriod = truncated.lastIndexOf(".")
    const lastExclamation = truncated.lastIndexOf("!")
    const lastQuestion = truncated.lastIndexOf("?")
    const cutPoint = Math.max(lastPeriod, lastExclamation, lastQuestion)

    if (cutPoint > maxLength * 0.5) {
      text = truncated.slice(0, cutPoint + 1)
    } else {
      // Couper au dernier espace pour eviter les mots tronques
      const lastSpace = truncated.lastIndexOf(" ")
      text = truncated.slice(0, lastSpace) + "..."
    }
  }

  return text.trim()
}

// ─── Fonction principale ─────────────────────────────────────────────

/**
 * Enrichit une adresse avec coordonnees GPS et prix au m2 du quartier.
 * Utilise uniquement des APIs publiques gratuites (pas de cle requise).
 *
 * @param adresse - Adresse postale complete (ex: "12 rue de la Paix, 75002 Paris")
 * @returns Donnees enrichies ou null si geocoding echoue
 */
export async function enrichProperty(adresse: string): Promise<EnrichedProperty | null> {
  const geo = await geocodeAddress(adresse)
  if (!geo) return null

  const dvf = await fetchDVFData(geo.lat, geo.lon)

  return {
    lat: geo.lat,
    lon: geo.lon,
    city: geo.city,
    postcode: geo.postcode,
    prix_m2_moyen: dvf.prix_m2_moyen,
    dernieres_transactions: dvf.transactions.slice(0, 5),
  }
}

// ─── Enrichissement etendu (avec DPE) ───────────────────────────────

/**
 * Version etendue de enrichProperty qui inclut aussi le DPE ADEME.
 * Appelle geocoding + DVF + DPE en parallele (DVF et DPE dependent du geocoding).
 *
 * @param adresse - Adresse postale complete
 * @returns Donnees enrichies avec DPE ou null si geocoding echoue
 */
export async function enrichPropertyExtended(
  adresse: string
): Promise<{
  lat: number
  lon: number
  city: string
  postcode: string
  prix_m2_moyen: number | null
  dernieres_transactions: DVFTransaction[]
  dpe: DPEData | null
} | null> {
  const geo = await geocodeAddress(adresse)
  if (!geo) return null

  // DVF et DPE en parallele (les deux dependent uniquement des coordonnees)
  const [dvf, dpe] = await Promise.all([
    fetchDVFData(geo.lat, geo.lon),
    fetchDPEData(geo.lat, geo.lon),
  ])

  return {
    lat: geo.lat,
    lon: geo.lon,
    city: geo.city,
    postcode: geo.postcode,
    prix_m2_moyen: dvf.prix_m2_moyen,
    dernieres_transactions: dvf.transactions.slice(0, 5),
    dpe,
  }
}

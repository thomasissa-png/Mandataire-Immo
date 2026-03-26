/**
 * Enrichissement de donnees immobilieres via APIs publiques (gratuit, sans cle).
 * 1. Geocoding : API Adresse data.gouv.fr
 * 2. Prix au m2 : API DVF (Demandes de Valeurs Foncieres) via cquest.org
 */

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

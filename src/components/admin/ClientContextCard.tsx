interface ClientContextCardProps {
  context: Record<string, unknown>
}

const LABELS: Record<string, string> = {
  prenom: "Prénom",
  nom: "Nom",
  telephone: "Téléphone",
  reseau: "Réseau",
  experience_annees: "Années d'expérience",
  nb_transactions_an: "Transactions/an",
  ville: "Ville",
  quartiers: "Quartiers",
  departement: "Département",
  type_biens: "Types de biens",
  gamme_prix: "Gamme de prix",
  cible_clients: "Clients cibles",
  ton_communication: "Ton de communication",
  valeurs: "Valeurs",
  ce_qui_te_differencie: "Ce qui te différencie",
  linkedin_url: "LinkedIn",
  bio_personnelle: "Bio",
  confort_camera: "Confort caméra",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn (compte)",
  site_web: "Site web",
  prix_m2_moyen: "Prix moyen au m²",
  photo_profil_key: "Photo de profil",
}

interface Section {
  title: string
  keys: string[]
}

const SECTION_ORDER: Section[] = [
  { title: "Identité", keys: ["prenom", "nom", "telephone"] },
  { title: "Réseau & expérience", keys: ["reseau", "experience_annees", "nb_transactions_an"] },
  { title: "Zone", keys: ["ville", "quartiers", "departement"] },
  { title: "Spécialité", keys: ["type_biens", "gamme_prix", "cible_clients"] },
  { title: "Style", keys: ["ton_communication", "valeurs", "ce_qui_te_differencie"] },
  { title: "Profil", keys: ["linkedin_url", "bio_personnelle", "photo_profil_key"] },
  { title: "Réseaux sociaux", keys: ["instagram", "facebook", "linkedin", "site_web"] },
  { title: "Vidéo", keys: ["confort_camera"] },
  { title: "Données locales", keys: ["prix_m2_moyen"] },
]

function formatValue(key: string, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—"
  if (key === "prix_m2_moyen" && value) return `${String(value)} €/m²`
  if (key === "confort_camera") {
    const map: Record<string, string> = {
      debutant: "Débutant",
      a_laise: "À l'aise",
      expert: "Expert",
    }
    return map[String(value)] || String(value) || "—"
  }
  if (typeof value === "string" && value.startsWith("http")) {
    return value
  }
  return String(value)
}

function isLink(value: string): boolean {
  return value.startsWith("http")
}

interface BienData {
  titre?: string
  type?: string
  adresse?: string
  prix?: string
  surface?: string
  pieces?: string
  points_forts?: string
  lien_annonce?: string
}

interface DVFTransaction {
  type: string
  surface: number
  prix_m2: number
  date: string
}

function SectionCard({ section, context }: { section: Section; context: Record<string, unknown> }) {
  const fields = section.keys
    .map((key) => ({ key, display: formatValue(key, context[key]) }))
    .filter((f) => f.display !== "—")

  if (fields.length === 0) return null

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="font-display text-body font-semibold text-primary mb-3">
        {section.title}
      </h3>
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-x-6 gap-y-2">
        {fields.map((f) => (
          <div key={f.key} className="py-1">
            <p className="text-caption text-neutral-500">{LABELS[f.key] || f.key}</p>
            {isLink(f.display) ? (
              <a href={f.display} target="_blank" rel="noopener noreferrer" className="text-body-sm text-secondary hover:underline break-all">
                {f.display}
              </a>
            ) : (
              <p className="text-body-sm text-foreground">{f.display}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function LocalDataCard({ context }: { context: Record<string, unknown> }) {
  const donneesLocales = typeof context.donnees_locales === "object" && context.donnees_locales !== null
    ? (context.donnees_locales as Record<string, unknown>)
    : null

  const postcode = donneesLocales ? String(donneesLocales.postcode || "") : ""
  const lat = donneesLocales && typeof donneesLocales.lat === "number" ? donneesLocales.lat : null
  const lon = donneesLocales && typeof donneesLocales.lon === "number" ? donneesLocales.lon : null
  const prixM2 = context.prix_m2_moyen ? String(context.prix_m2_moyen) : ""
  const transactions = donneesLocales && Array.isArray(donneesLocales.dernieres_transactions)
    ? (donneesLocales.dernieres_transactions as DVFTransaction[])
    : []

  if (!postcode && lat === null && !prixM2) return null

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="font-display text-body font-semibold text-primary mb-3">
        Données locales (auto-enrichies)
      </h3>
      <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
        {postcode ? (
          <div>
            <p className="text-caption text-neutral-500">Code postal</p>
            <p className="text-body-sm text-foreground">{postcode}</p>
          </div>
        ) : null}
        {prixM2 ? (
          <div>
            <p className="text-caption text-neutral-500">Prix moyen m²</p>
            <p className="text-body-sm font-semibold text-foreground">{prixM2} €/m²</p>
          </div>
        ) : null}
        {lat !== null && lon !== null ? (
          <div>
            <p className="text-caption text-neutral-500">Coordonnées</p>
            <p className="text-body-sm text-foreground font-mono text-caption">
              {lat.toFixed(4)}, {lon.toFixed(4)}
            </p>
          </div>
        ) : null}
      </div>
      {transactions.length > 0 ? (
        <div className="mt-3">
          <p className="text-caption text-neutral-500 mb-2">Dernières transactions DVF</p>
          <div className="space-y-1">
            {transactions.slice(0, 5).map((t, i) => (
              <p key={i} className="text-caption text-neutral-600">
                {t.type} {t.surface}m² — {t.prix_m2} €/m² ({t.date})
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function BiensCard({ biens }: { biens: BienData[] }) {
  if (biens.length === 0) return null

  return (
    <div className="rounded-xl bg-card border border-border p-5">
      <h3 className="font-display text-body font-semibold text-primary mb-3">
        Biens en cours ({biens.length})
      </h3>
      <div className="space-y-3">
        {biens.map((bien, i) => (
          <div key={i} className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
            <p className="text-body-sm font-semibold text-foreground">
              {bien.titre || `Bien ${i + 1}`}
            </p>
            {bien.lien_annonce ? (
              <a
                href={bien.lien_annonce}
                target="_blank"
                rel="noopener noreferrer"
                className="text-caption text-secondary hover:underline break-all block mt-1"
              >
                {bien.lien_annonce}
              </a>
            ) : null}
            <div className="flex flex-wrap gap-3 mt-2 text-caption text-neutral-500">
              {bien.type ? <span>{bien.type}</span> : null}
              {bien.adresse ? <span>{bien.adresse}</span> : null}
              {bien.prix ? <span>{bien.prix} €</span> : null}
              {bien.surface ? <span>{bien.surface} m²</span> : null}
              {bien.pieces ? <span>{bien.pieces} pièces</span> : null}
            </div>
            {bien.points_forts ? (
              <p className="text-caption text-neutral-600 mt-1">{bien.points_forts}</p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ClientContextCard({ context }: ClientContextCardProps) {
  const biens = Array.isArray(context.biens) ? (context.biens as BienData[]) : []

  return (
    <div className="space-y-4 mb-6">
      {SECTION_ORDER.map((section) => (
        <SectionCard key={section.title} section={section} context={context} />
      ))}
      <LocalDataCard context={context} />
      <BiensCard biens={biens} />
    </div>
  )
}

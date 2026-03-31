/**
 * Page publique mandataire — /agent/[slug]
 * Rendu SSR : données dynamiques par mandataire, SEO conditionnel.
 */
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { query } from "@/lib/db"
import type { AgentPage, AgentProfile, AgentBienSummary } from "@/types/agent"
import { Header } from "@/components/landing/Header"
import { Footer } from "@/components/landing/Footer"
import {
  HeroSection,
  QuiSuisJeSection,
  MaZoneSection,
  MesBiensSection,
  ContactSection,
  ReseauxSection,
} from "@/components/agent/AgentPageSections"

interface PageProps {
  params: Promise<{ slug: string }>
}

// ─── DB row types ───────────────────────────────────────────────────

interface AgentPageRow {
  id: string
  client_id: string
  slug: string
  status: string
  indexation: boolean
  bio_generee: string | null
  edition_locked: boolean
  activated_at: string | null
  client_context: Record<string, unknown> | null
  first_name: string | null
  last_name: string | null
  email: string
}

interface PropertyRow {
  id: string
  slug: string | null
  titre: string
  titre_annonce: string | null
  city: string | null
  prix: number
  type_bien: string
  surface: number
  pieces: number
  photos_staging: { url: string }[] | string | null
  photos_originales: { url: string }[] | string | null
}

// ─── Data fetching ──────────────────────────────────────────────────

async function getAgentData(slug: string): Promise<{
  page: AgentPage
  profile: AgentProfile
  email: string
} | null> {
  const { rows } = await query<AgentPageRow>(
    `SELECT
      ap.id, ap.client_id, ap.slug, ap.status, ap.indexation,
      ap.bio_generee, ap.edition_locked, ap.activated_at,
      c.client_context, c.first_name, c.last_name, c.email
    FROM agent_pages ap
    JOIN clients c ON ap.client_id = c.id
    WHERE ap.slug = $1 AND ap.status IN ('active', 'frozen')
    LIMIT 1`,
    [slug]
  )

  if (rows.length === 0) return null

  const row = rows[0]
  const ctx = (row.client_context ?? {}) as Record<string, unknown>

  const getString = (key: string, fallback = ""): string =>
    typeof ctx[key] === "string" ? (ctx[key] as string) : fallback

  const page: AgentPage = {
    id: row.id,
    client_id: row.client_id,
    slug: row.slug,
    status: row.status as AgentPage["status"],
    indexation: row.indexation,
    bio_generee: row.bio_generee,
    edition_locked: row.edition_locked,
    activated_at: row.activated_at,
  }

  const profile: AgentProfile = {
    prenom: getString("prenom") || row.first_name || "",
    nom: getString("nom") || row.last_name || "",
    telephone: getString("telephone"),
    photo_profil_key: getString("photo_profil_key"),
    reseau: getString("reseau"),
    ville: getString("ville"),
    quartiers: getString("quartiers"),
    departement: getString("departement"),
    specialites: getString("specialites"),
    type_biens: getString("type_biens"),
    gamme_prix: getString("gamme_prix"),
    bio_personnelle: getString("bio_personnelle"),
    bio_generee: row.bio_generee,
    ce_qui_te_differencie: getString("ce_qui_te_differencie"),
    valeurs: getString("valeurs"),
    experience_annees: getString("experience_annees"),
    nb_transactions_an: getString("nb_transactions_an"),
    linkedin_url: getString("linkedin_url"),
    instagram: getString("instagram"),
    facebook: getString("facebook"),
    site_web: getString("site_web"),
  }

  return { page, profile, email: row.email }
}

async function getAgentBiens(clientId: string): Promise<AgentBienSummary[]> {
  const { rows } = await query<PropertyRow>(
    `SELECT id, slug, titre, titre_annonce, city, prix, type_bien, surface, pieces,
            photos_staging, photos_originales
     FROM property_pages
     WHERE client_id = $1 AND status = 'published'
     ORDER BY created_at DESC
     LIMIT 6`,
    [clientId]
  )

  return rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    titre: r.titre,
    titre_annonce: r.titre_annonce,
    city: r.city,
    prix: r.prix,
    type_bien: r.type_bien,
    surface: r.surface,
    pieces: r.pieces,
    photos_staging: parsePhotos(r.photos_staging),
    photos_originales: parsePhotos(r.photos_originales),
  }))
}

/** Parse les photos depuis JSONB (peut etre string ou array) */
function parsePhotos(raw: { url: string }[] | string | null): { url: string }[] {
  if (!raw) return []
  if (Array.isArray(raw)) return raw
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

// ─── Metadata ───────────────────────────────────────────────────────

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getAgentData(slug)

  if (!data) {
    return { title: "Mandataire non trouvé" }
  }

  const { profile, page } = data
  const title = `${profile.prenom} ${profile.nom} — Mandataire ${profile.reseau} à ${profile.ville}`
  const description = (page.bio_generee || profile.bio_personnelle || "").slice(0, 150)

  const robots = page.indexation
    ? { index: true, follow: true }
    : { index: false, follow: false }

  return {
    title,
    description,
    robots,
    openGraph: {
      title,
      description,
      type: "profile",
      locale: "fr_FR",
    },
  }
}

// ─── Page ───────────────────────────────────────────────────────────

export default async function AgentPageRoute({ params }: PageProps) {
  const { slug } = await params
  const data = await getAgentData(slug)
  if (!data) notFound()

  const { page, profile, email } = data
  const biens = await getAgentBiens(page.client_id)

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <HeroSection profile={profile} />
        <QuiSuisJeSection profile={profile} bioGeneree={page.bio_generee} />
        <MaZoneSection profile={profile} />
        <MesBiensSection biens={biens} />
        <ContactSection profile={profile} email={email} />
        <ReseauxSection profile={profile} />
      </main>
      <Footer />
    </>
  )
}

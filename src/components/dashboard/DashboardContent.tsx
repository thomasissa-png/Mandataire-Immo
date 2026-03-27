"use client"

import { useState, useMemo } from "react"
import { DeliverableCard } from "./DeliverableCard"

type DeliverableType =
  | "post"
  | "article_seo"
  | "annonce"
  | "script_video"
  | "newsletter"
  | "email_prospection"
  | "bio"
  | "brief_graphique"
  | "calendrier"
  | "positionnement"
  | "landing_page"

interface Deliverable {
  id: string
  type: DeliverableType
  title: string
  month: string
  status: "draft" | "delivered"
  created_at: string
}

interface DashboardContentProps {
  userName: string
  pack: string | null
  stripeCustomerId: string | null
  showMonthlyBanner: boolean
  deliverables: Deliverable[]
  profile: {
    prenom: string
    nom: string
    reseau: string
    ville: string
    departement: string
    telephone: string
    photo_profil_key: string
    experience_annees: string
    nb_transactions_an: string
    type_biens: string
    linkedin_url: string
    biens: Array<{
      titre: string
      type: string
      adresse: string
      prix: string
      surface: string
      pieces: string
      points_forts: string
      lien_annonce: string
    }>
  } | null
}

/* ------------------------------------------------------------------ */
/*  Category definitions                                               */
/* ------------------------------------------------------------------ */

type CategoryKey = "posts" | "annonces" | "articles" | "scripts" | "emails" | "strategie"

interface CategoryDef {
  key: CategoryKey
  label: string
  pillLabel: string
  icon: string
  types: DeliverableType[]
  bgClass: string
  iconBgClass: string
}

const CATEGORIES: CategoryDef[] = [
  {
    key: "posts",
    label: "Posts réseaux sociaux",
    pillLabel: "Posts",
    icon: "📱",
    types: ["post"],
    bgClass: "bg-secondary-50",
    iconBgClass: "bg-secondary-50",
  },
  {
    key: "articles",
    label: "Articles SEO",
    pillLabel: "Articles",
    icon: "📝",
    types: ["article_seo"],
    bgClass: "bg-info-50",
    iconBgClass: "bg-info-50",
  },
  {
    key: "annonces",
    label: "Annonces immobilières",
    pillLabel: "Annonces",
    icon: "🏠",
    types: ["annonce"],
    bgClass: "bg-success-50",
    iconBgClass: "bg-success-50",
  },
  {
    key: "scripts",
    label: "Scripts vidéo",
    pillLabel: "Scripts",
    icon: "🎬",
    types: ["script_video"],
    bgClass: "bg-warning-50",
    iconBgClass: "bg-warning-50",
  },
  {
    key: "emails",
    label: "Emails",
    pillLabel: "Emails",
    icon: "📧",
    types: ["newsletter", "email_prospection"],
    bgClass: "bg-primary-50",
    iconBgClass: "bg-primary-50",
  },
  {
    key: "strategie",
    label: "Stratégie",
    pillLabel: "Stratégie",
    icon: "📋",
    types: ["positionnement", "bio", "calendrier", "brief_graphique", "landing_page"],
    bgClass: "bg-neutral-100",
    iconBgClass: "bg-neutral-100",
  },
]

const TYPE_LABELS: Record<string, string> = {
  post: "Post",
  article_seo: "Article SEO",
  annonce: "Annonce",
  script_video: "Script vidéo",
  newsletter: "Newsletter",
  email_prospection: "Email prospection",
  bio: "Bio",
  brief_graphique: "Brief graphique",
  calendrier: "Calendrier",
  positionnement: "Positionnement",
  landing_page: "Landing page",
}

const TYPE_COLORS: Record<string, string> = {
  post: "bg-secondary-50 text-secondary-700",
  article_seo: "bg-info-50 text-info-700",
  annonce: "bg-success-50 text-success-700",
  script_video: "bg-warning-50 text-warning-800",
  newsletter: "bg-primary-50 text-primary-700",
  email_prospection: "bg-error-50 text-error-700",
  bio: "bg-secondary-50 text-secondary-600",
  brief_graphique: "bg-neutral-100 text-neutral-600",
  calendrier: "bg-warning-50 text-warning-700",
  positionnement: "bg-primary-50 text-primary-700",
  landing_page: "bg-success-50 text-success-700",
}

/* ------------------------------------------------------------------ */
/*  SVG icons                                                          */
/* ------------------------------------------------------------------ */

function IconCheck() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconClock() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}

function IconGrid() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}

function IconArchive() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-5 h-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function DashboardContent({
  userName,
  pack,
  stripeCustomerId,
  showMonthlyBanner,
  deliverables,
  profile,
}: DashboardContentProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryKey | "all">("all")
  const [collapsedSections, setCollapsedSections] = useState<Set<CategoryKey>>(new Set())

  /* Group deliverables by category */
  const categorized = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      ...cat,
      items: deliverables.filter((d) => cat.types.includes(d.type)),
    })).filter((cat) => cat.items.length > 0)
  }, [deliverables])

  /* Visible categories based on active filter */
  const visibleCategories = activeFilter === "all"
    ? categorized
    : categorized.filter((cat) => cat.key === activeFilter)

  /* Stats */
  const totalDelivered = deliverables.filter((d) => d.status === "delivered").length
  const totalDraft = deliverables.filter((d) => d.status === "draft").length
  const activeCategories = categorized.length

  const toggleSection = (key: CategoryKey) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  // Initiales pour l'avatar
  const initials = profile
    ? `${(profile.prenom[0] || "").toUpperCase()}${(profile.nom[0] || "").toUpperCase()}`
    : userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  const photoUrl = profile?.photo_profil_key
    ? `/api/images/${encodeURIComponent(profile.photo_profil_key)}`
    : null

  const packLabel = pack === "mensuel" ? "Pack Mensuel" : pack === "lancement" ? "Pack Lancement" : pack ? `Pack ${pack}` : null

  return (
    <div className="space-y-8">
      {/* Carte profil */}
      <div className="rounded-lg bg-card border border-border overflow-hidden shadow-sm">
        {/* Bannière dégradée */}
        <div className="h-28 bg-gradient-to-r from-primary via-primary-600 to-primary-800 relative">
          {packLabel && (
            <span className="absolute top-3 right-4 px-3 py-1 rounded-full bg-card text-primary text-caption font-bold shadow-sm">
              {packLabel}
            </span>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="-mt-10 mb-4 flex items-end gap-4">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt={`Photo de ${profile?.prenom || userName}`}
                className="w-20 h-20 rounded-xl border-4 border-card shadow-md object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl border-4 border-card shadow-md bg-secondary flex items-center justify-center">
                <span className="font-display text-h2 font-bold text-white">{initials}</span>
              </div>
            )}
            <div className="pb-1">
              <h1 className="font-display text-h2 text-primary leading-tight">
                {profile ? `${profile.prenom} ${profile.nom}` : userName}
              </h1>
              {profile?.reseau && (
                <p className="text-body-sm text-neutral-500">{profile.reseau}</p>
              )}
            </div>
          </div>

          {/* Infos clés en ligne */}
          {profile && (
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {profile.ville && (
                <div className="flex items-center gap-1.5 text-body-sm text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {profile.ville}{profile.departement ? ` (${profile.departement})` : ""}
                </div>
              )}
              {profile.experience_annees && (
                <div className="flex items-center gap-1.5 text-body-sm text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {profile.experience_annees} an{Number(profile.experience_annees) > 1 ? "s" : ""} d'expérience
                </div>
              )}
              {profile.nb_transactions_an && (
                <div className="flex items-center gap-1.5 text-body-sm text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                  {profile.nb_transactions_an} transaction{Number(profile.nb_transactions_an) > 1 ? "s" : ""}/an
                </div>
              )}
              {profile.type_biens && (
                <div className="flex items-center gap-1.5 text-body-sm text-neutral-600">
                  <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  {profile.type_biens}
                </div>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-body-sm text-secondary-700 hover:text-secondary hover:underline transition-colors duration-normal"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section Mes biens */}
      {profile && profile.biens.length > 0 && (
        <div className="rounded-lg bg-card border border-border overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-border bg-neutral-50/50">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              <h2 className="font-display text-h3 text-primary">Mes biens ({profile.biens.length})</h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {profile.biens.map((bien, i) => (
              <div key={i} className="p-5 hover:bg-neutral-50/50 transition-colors duration-normal">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg" aria-hidden="true">🏠</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-body font-semibold text-primary leading-snug">
                      {bien.titre || `Bien ${i + 1}`}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {bien.type ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-50 text-caption font-medium text-primary-700">{bien.type}</span> : null}
                      {bien.adresse ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">
                          📍 {bien.adresse}
                        </span>
                      ) : null}
                      {bien.prix ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-success-50 text-caption font-bold text-success-700">{Number(bien.prix).toLocaleString("fr-FR")} €</span> : null}
                      {bien.surface ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">{bien.surface} m²</span> : null}
                      {bien.pieces ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">{bien.pieces} pièce{Number(bien.pieces) > 1 ? "s" : ""}</span> : null}
                    </div>
                    {bien.points_forts ? <p className="text-body-sm text-neutral-500 mt-2 italic">{bien.points_forts}</p> : null}
                    {bien.lien_annonce ? (
                      <a href={bien.lien_annonce} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-body-sm text-secondary-700 font-semibold hover:text-secondary hover:underline transition-colors duration-normal">
                        🔗 Voir l'annonce
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly update banner */}
      {showMonthlyBanner && (
        <a
          href="/dashboard/monthly-update"
          className="group block rounded-lg border border-secondary/30 bg-gradient-to-r from-secondary-50 to-card p-5 hover:shadow-md transition-all duration-normal"
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary-200 transition-colors duration-normal">
              <svg className="w-5 h-5 text-secondary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-h4 text-primary">
                Mise à jour mensuelle
              </p>
              <p className="text-body-sm text-neutral-500 mt-0.5">
                10 min pour des contenus encore plus personnalisés ce mois-ci
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-body-sm font-semibold text-secondary-700 group-hover:text-secondary-800 transition-colors duration-normal">
                Mettre à jour
              </span>
              <svg className="w-4 h-4 text-secondary-700 group-hover:translate-x-0.5 transition-transform duration-normal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>
      )}

      {/* Sous-titre contenus */}
      <div>
        <p className="text-body text-neutral-500">
          {deliverables.length} contenu{deliverables.length !== 1 ? "s" : ""} prêt{deliverables.length !== 1 ? "s" : ""}
        </p>
      </div>

      {deliverables.length === 0 ? (
        /* ----- Empty state ----- */
        <div className="rounded-lg bg-card border border-border p-10 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-secondary-50 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl" aria-hidden="true">✍️</span>
          </div>
          <h2 className="font-display text-h2 text-primary mb-3">
            Bienvenue dans ton espace !
          </h2>
          <p className="text-body text-neutral-600 mb-6">
            Ton équipe est au travail. Tes premiers contenus arrivent sous 24h.
          </p>
          <div className="rounded-lg bg-background p-5 text-left">
            <p className="text-body-sm text-neutral-500 font-semibold mb-3">
              Ce que tu vas recevoir :
            </p>
            <ul className="text-body-sm text-neutral-600 space-y-2">
              {pack === "lancement" ? (
                <>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 20 posts prêts à publier</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 5 articles SEO local</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 5 annonces storytelling</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 10 scripts vidéo</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> Kit graphique personnalisé</li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 12 posts prêts à publier</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 2 articles SEO local</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 4 annonces personnalisées</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 4 scripts vidéo</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">✓</span> 1 newsletter + 1 email prospection</li>
                </>
              )}
            </ul>
          </div>
          <p className="text-caption text-neutral-500 mt-4">
            On t'envoie un email dès que c'est prêt.
          </p>
        </div>
      ) : (
        <>
          {/* ----- Stat cards ----- */}
          <div className="grid grid-cols-2 tablet:grid-cols-4 gap-4">
            <StatCard
              icon={<IconArchive />}
              label="Total"
              value={deliverables.length}
              colorClass="text-primary bg-primary-50"
            />
            <StatCard
              icon={<IconCheck />}
              label="Livrés"
              value={totalDelivered}
              colorClass="text-success-700 bg-success-50"
            />
            <StatCard
              icon={<IconClock />}
              label="En cours"
              value={totalDraft}
              colorClass="text-warning-700 bg-warning-50"
            />
            <StatCard
              icon={<IconGrid />}
              label="Catégories"
              value={activeCategories}
              colorClass="text-info-700 bg-info-50"
            />
          </div>

          {/* ----- Filter pills ----- */}
          {/* overflow-x-auto + no-wrap : scroll horizontal sur mobile, pas de retour à la ligne */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 tablet:mx-0 tablet:px-0 tablet:flex-wrap scrollbar-hide">
            <FilterPill
              label="Tout"
              count={deliverables.length}
              active={activeFilter === "all"}
              onClick={() => setActiveFilter("all")}
            />
            {categorized.map((cat) => (
              <FilterPill
                key={cat.key}
                label={`${cat.icon} ${cat.pillLabel}`}
                count={cat.items.length}
                active={activeFilter === cat.key}
                onClick={() => setActiveFilter(activeFilter === cat.key ? "all" : cat.key)}
              />
            ))}
          </div>

          {/* ----- Category sections ----- */}
          <div className="space-y-8">
            {visibleCategories.map((cat) => {
              const isCollapsed = collapsedSections.has(cat.key)

              return (
                <section key={cat.key} aria-labelledby={`section-${cat.key}-heading`}>
                  {/* Section header */}
                  <button
                    type="button"
                    id={`section-${cat.key}-heading`}
                    className="w-full flex items-center justify-between gap-3 group mb-4"
                    onClick={() => toggleSection(cat.key)}
                    aria-expanded={!isCollapsed}
                    aria-controls={`section-${cat.key}-grid`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${cat.iconBgClass} text-lg`}
                        aria-hidden="true"
                      >
                        {cat.icon}
                      </span>
                      <h2 className="font-display text-h3 text-primary">
                        {cat.label}
                      </h2>
                      <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-neutral-100 text-caption text-neutral-600 font-semibold">
                        {cat.items.length}
                      </span>
                    </div>
                    <span className="text-neutral-400 group-hover:text-primary transition-colors duration-normal">
                      <ChevronIcon open={!isCollapsed} />
                    </span>
                  </button>

                  {/* Cards grid */}
                  {!isCollapsed && (
                    <div id={`section-${cat.key}-grid`} className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                      {cat.items.map((d) => (
                        <DeliverableCard
                          key={d.id}
                          id={d.id}
                          type={d.type}
                          typeLabel={TYPE_LABELS[d.type] || d.type}
                          typeColor={TYPE_COLORS[d.type] || "bg-neutral-100 text-neutral-600"}
                          title={d.title}
                          status={d.status}
                        />
                      ))}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        </>
      )}

      {/* Manage subscription */}
      {stripeCustomerId && (
        <div className="mt-2 pt-6 border-t border-border">
          <a
            href="/api/portal"
            className="text-body-sm text-neutral-600 hover:text-secondary-700 underline transition-colors duration-normal"
          >
            Gérer mon abonnement
          </a>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  colorClass,
}: {
  icon: React.ReactNode
  label: string
  value: number
  colorClass: string
}) {
  return (
    <div className="rounded-lg bg-card border border-border p-4 flex items-center gap-3 shadow-xs hover:shadow-sm transition-shadow duration-normal">
      <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${colorClass}`}>
        {icon}
      </div>
      <div>
        <p className="font-display text-h3 font-bold text-primary leading-none">{value}</p>
        <p className="text-caption text-neutral-500 mt-1">{label}</p>
      </div>
    </div>
  )
}

function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-body-sm font-semibold transition-all duration-normal ${
        active
          ? "bg-primary text-white shadow-sm"
          : "bg-card border border-border text-neutral-600 hover:border-secondary/40 hover:text-primary"
      }`}
      onClick={onClick}
    >
      {label}
      <span
        className={`inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-caption font-bold ${
          active ? "bg-white/20 text-white" : "bg-neutral-100 text-neutral-500"
        }`}
      >
        {count}
      </span>
    </button>
  )
}

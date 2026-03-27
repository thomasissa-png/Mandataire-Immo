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
/*  Type labels & colors                                               */
/* ------------------------------------------------------------------ */

const TYPE_LABELS: Record<string, string> = {
  post: "Post",
  article_seo: "Article local",
  annonce: "Annonce",
  script_video: "Script vidéo",
  newsletter: "Newsletter",
  email_prospection: "Email prospection",
  bio: "Bio",
  brief_graphique: "Kit graphique",
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
/*  Platform detection for posts                                       */
/* ------------------------------------------------------------------ */

function detectPlatform(title: string): { icon: string; name: string } {
  const lower = title.toLowerCase()
  if (lower.includes("instagram") || lower.includes("insta") || lower.includes("reel"))
    return { icon: "📸", name: "Instagram" }
  if (lower.includes("linkedin"))
    return { icon: "💼", name: "LinkedIn" }
  if (lower.includes("facebook") || lower.includes("fb"))
    return { icon: "📘", name: "Facebook" }
  if (lower.includes("tiktok") || lower.includes("tik tok"))
    return { icon: "🎵", name: "TikTok" }
  if (lower.includes("twitter") || lower.includes("x "))
    return { icon: "🐦", name: "X / Twitter" }
  return { icon: "📱", name: "Réseaux sociaux" }
}

/* ------------------------------------------------------------------ */
/*  Matching annonces to biens by index                                */
/* ------------------------------------------------------------------ */

function matchAnnoncesToBiens(
  annonces: Deliverable[],
  biensCount: number
): { matched: Map<number, Deliverable[]>; unmatched: Deliverable[] } {
  const matched = new Map<number, Deliverable[]>()
  const unmatched: Deliverable[] = []

  for (const annonce of annonces) {
    const lower = annonce.title.toLowerCase()
    let found = false

    // Try to match "Bien X" pattern in the title
    const bienMatch = lower.match(/bien\s+(\d+)/)
    if (bienMatch) {
      const bienIndex = parseInt(bienMatch[1], 10) - 1 // 0-based
      if (bienIndex >= 0 && bienIndex < biensCount) {
        const existing = matched.get(bienIndex) || []
        existing.push(annonce)
        matched.set(bienIndex, existing)
        found = true
      }
    }

    if (!found) {
      unmatched.push(annonce)
    }
  }

  return { matched, unmatched }
}

/* ------------------------------------------------------------------ */
/*  Format date                                                        */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

/* ------------------------------------------------------------------ */
/*  Section header component                                           */
/* ------------------------------------------------------------------ */

function SectionHeader({
  icon,
  title,
  count,
  isOpen,
  onToggle,
  sectionId,
  defaultClosed,
}: {
  icon: React.ReactNode
  title: string
  count: number
  isOpen: boolean
  onToggle: () => void
  sectionId: string
  defaultClosed?: boolean
}) {
  return (
    <button
      type="button"
      id={`${sectionId}-heading`}
      className="w-full flex items-center justify-between gap-3 group"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls={`${sectionId}-panel`}
    >
      <div className="flex items-center gap-3">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary-50 text-lg"
          aria-hidden="true"
        >
          {icon}
        </span>
        <h2 className="font-display text-h3 text-primary">{title}</h2>
        <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 rounded-full bg-neutral-100 text-caption text-neutral-600 font-semibold">
          {count}
        </span>
      </div>
      <span className="text-neutral-500 group-hover:text-primary transition-colors duration-normal">
        <ChevronIcon open={isOpen} />
      </span>
    </button>
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
  // Sections that start collapsed: only "strategie"
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set(["strategie"]))

  const toggleSection = (key: string) => {
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

  /* Categorize deliverables by context */
  const { posts, articles, annonces, scripts, emails, strategie } = useMemo(() => {
    const posts: Deliverable[] = []
    const articles: Deliverable[] = []
    const annonces: Deliverable[] = []
    const scripts: Deliverable[] = []
    const emails: Deliverable[] = []
    const strategie: Deliverable[] = []

    for (const d of deliverables) {
      switch (d.type) {
        case "post":
          posts.push(d)
          break
        case "article_seo":
          articles.push(d)
          break
        case "annonce":
          annonces.push(d)
          break
        case "script_video":
          scripts.push(d)
          break
        case "newsletter":
        case "email_prospection":
          emails.push(d)
          break
        case "positionnement":
        case "bio":
        case "calendrier":
        case "brief_graphique":
        case "landing_page":
          strategie.push(d)
          break
      }
    }

    // Sort posts by created_at descending (newest first)
    posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return { posts, articles, annonces, scripts, emails, strategie }
  }, [deliverables])

  /* Match annonces to biens */
  const biensCount = profile?.biens.length ?? 0
  const { matched: matchedAnnonces, unmatched: unmatchedAnnonces } = useMemo(
    () => matchAnnoncesToBiens(annonces, biensCount),
    [annonces, biensCount]
  )

  // Initiales pour l'avatar
  const initials = profile
    ? `${(profile.prenom[0] || "").toUpperCase()}${(profile.nom[0] || "").toUpperCase()}`
    : userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?"

  const photoUrl = profile?.photo_profil_key
    ? `/api/images/${encodeURIComponent(profile.photo_profil_key)}`
    : null

  const packLabel = pack === "mensuel" ? "Pack Mensuel" : pack === "lancement" ? "Pack Lancement" : pack ? `Pack ${pack}` : null

  const [showWelcome, setShowWelcome] = useState(() =>
    typeof window !== "undefined" && !localStorage.getItem("immocrew_welcome_dismissed")
  )

  return (
    <div className="space-y-8">
      {/* Message d'accueil premier acces */}
      {showWelcome && deliverables.length > 0 && (
        <div className="rounded-lg bg-secondary-50 border border-secondary/20 p-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-body-sm text-secondary-800 font-semibold mb-1">
              Comment utiliser ton espace
            </p>
            <p className="text-body-sm text-secondary-700">
              Clique sur une carte pour voir le contenu complet, puis <strong>Copier</strong> pour le coller directement dans ton appli. C{"'"}est tout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { localStorage.setItem("immocrew_welcome_dismissed", "1"); setShowWelcome(false) }}
            className="text-secondary-400 hover:text-secondary-600 flex-shrink-0 text-xl leading-none mt-0.5"
            aria-label="Fermer le message de bienvenue"
          >
            \u00d7
          </button>
        </div>
      )}
      {/* ============================================================ */}
      {/*  1. Carte profil                                              */}
      {/* ============================================================ */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-lg">
        {/* Banniere premium avec cercles decoratifs */}
        <div className="h-36 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1a2744 100%)" }}>
          {/* Cercles decoratifs semi-transparents */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute top-12 right-24 w-20 h-20 rounded-full bg-white/[0.07]" />
          <div className="absolute -bottom-6 left-16 w-28 h-28 rounded-full bg-white/[0.04]" />
          <div className="absolute top-6 left-1/2 w-12 h-12 rounded-full bg-white/[0.06]" />

          {/* Texte bienvenue */}
          <p className="absolute top-4 left-5 text-white/70 text-body-sm font-medium tracking-wide">
            Bienvenue dans ton espace
          </p>

          {/* Badge pack */}
          {packLabel && (
            <span className="absolute top-3 right-4 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-caption font-bold border border-white/10 shadow-sm">
              {packLabel}
            </span>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Avatar debordant sur la banniere */}
          <div className="-mt-12 mb-4">
            <div className="flex items-end gap-4">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={`Photo de ${profile?.prenom || userName}`}
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)" }}
                >
                  <span className="font-display text-h1 font-bold text-white">{initials}</span>
                </div>
              )}
              <div className="pb-2">
                <h1 className="font-display text-h1 text-primary leading-tight font-bold">
                  {profile ? `${profile.prenom} ${profile.nom}` : userName}
                </h1>
                {profile?.reseau && (
                  <p className="text-body text-neutral-500 mt-0.5">
                    Mandataire {profile.reseau}{profile.ville ? ` \u00b7 ${profile.ville}` : ""}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Infos metier en grille de mini-cards */}
          {profile && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {profile.experience_annees && (
                <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-caption text-blue-600/70 font-medium">Exp{"\u00e9"}rience</p>
                    <p className="text-body-sm font-semibold text-blue-900">{profile.experience_annees} an{Number(profile.experience_annees) > 1 ? "s" : ""}</p>
                  </div>
                </div>
              )}
              {profile.nb_transactions_an && (
                <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-caption text-emerald-600/70 font-medium">Transactions</p>
                    <p className="text-body-sm font-semibold text-emerald-900">{profile.nb_transactions_an}/an</p>
                  </div>
                </div>
              )}
              {profile.type_biens && (
                <div className="flex items-center gap-3 rounded-xl bg-orange-50 px-4 py-3">
                  <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-caption text-orange-600/70 font-medium">Sp{"\u00e9"}cialit{"\u00e9"}</p>
                    <p className="text-body-sm font-semibold text-orange-900">{profile.type_biens}</p>
                  </div>
                </div>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Voir le profil LinkedIn (s'ouvre dans un nouvel onglet)"
                  className="flex items-center gap-3 rounded-xl bg-[#EBF4FB] px-4 py-3 hover:bg-[#D6E9F6] transition-colors duration-normal group"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#D6E9F6] group-hover:bg-[#C0DCF0] flex items-center justify-center flex-shrink-0 transition-colors duration-normal">
                    <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-caption text-[#0A66C2]/70 font-medium">Profil</p>
                    <p className="text-body-sm font-semibold text-[#0A66C2]">LinkedIn</p>
                  </div>
                </a>
              )}
            </div>
          )}
        </div>
      </div>

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
                Dis-nous ce qui a chang{"\u00e9"} ce mois-ci
              </p>
              <p className="text-body-sm text-neutral-500 mt-0.5">
                10 min, et tes prochains contenus seront encore plus dans le mille.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-body-sm font-semibold text-secondary-700 group-hover:text-secondary-800 transition-colors duration-normal">
                C{"'"}est parti
              </span>
              <svg className="w-4 h-4 text-secondary-700 group-hover:translate-x-0.5 transition-transform duration-normal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </a>
      )}

      {deliverables.length === 0 ? (
        /* ----- Empty state ----- */
        <div className="rounded-lg bg-card border border-border p-10 text-center max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-secondary-50 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl" aria-hidden="true">{"\u270d\ufe0f"}</span>
          </div>
          <h2 className="font-display text-h2 text-primary mb-3">
            Bienvenue dans ton espace !
          </h2>
          <p className="text-body text-neutral-600 mb-6">
            Ton {"\u00e9"}quipe est au travail. Tes premiers contenus arrivent sous 24h.
          </p>
          <div className="rounded-lg bg-background p-5 text-left">
            <p className="text-body-sm text-neutral-500 font-semibold mb-3">
              Ce que tu vas recevoir :
            </p>
            <ul className="text-body-sm text-neutral-600 space-y-2">
              {pack === "lancement" ? (
                <>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 20 posts pr{"\u00ea"}ts {"\u00e0"} publier</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 5 articles SEO local</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 5 annonces storytelling</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 10 scripts vid{"\u00e9"}o</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> Kit graphique personnalis{"\u00e9"}</li>
                </>
              ) : (
                <>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 12 posts pr{"\u00ea"}ts {"\u00e0"} publier</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 2 articles SEO local</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 4 annonces personnalis{"\u00e9"}es</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 4 scripts vid{"\u00e9"}o</li>
                  <li className="flex items-center gap-2"><span className="text-success-700" aria-hidden="true">{"\u2713"}</span> 1 newsletter + 1 email prospection</li>
                </>
              )}
            </ul>
          </div>
          <p className="text-caption text-neutral-500 mt-4">
            On t{"'"}envoie un email d{"\u00e8"}s que c{"'"}est pr{"\u00ea"}t.
          </p>
        </div>
      ) : (
        <div className="space-y-10">

          {/* ============================================================ */}
          {/*  Accroche personnalisee                                        */}
          {/* ============================================================ */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-h2 text-primary">
                Salut {profile?.prenom || userName.split(" ")[0] || userName} !
              </h2>
              <p className="text-body text-neutral-500 mt-1">
                Tes contenus sont pr{"\u00ea"}ts. Tu copies, tu publies, c{"'"}est fait.
              </p>
            </div>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success-50 text-success-700 text-caption font-semibold">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {deliverables.filter((d) => d.status === "delivered").length} contenus pr{"\u00ea"}ts
            </span>
          </div>

          {/* ============================================================ */}
          {/*  Navigation rapide (ancres de section)                        */}
          {/* ============================================================ */}
          <nav aria-label="Aller directement à une section" className="flex flex-wrap gap-2">
            {(profile?.biens?.length ?? 0) > 0 && annonces.length > 0 && (
              <a href="#section-biens" className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-neutral-100 hover:bg-secondary-100 text-caption font-semibold text-neutral-600 hover:text-secondary-700 transition-colors duration-normal">
                Biens
              </a>
            )}
            {(!profile || profile.biens.length === 0) && annonces.length > 0 && (
              <a href="#section-annonces" className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-neutral-100 hover:bg-secondary-100 text-caption font-semibold text-neutral-600 hover:text-secondary-700 transition-colors duration-normal">
                Annonces
              </a>
            )}
            {posts.length > 0 && (
              <a href="#section-posts" className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-neutral-100 hover:bg-secondary-100 text-caption font-semibold text-neutral-600 hover:text-secondary-700 transition-colors duration-normal">
                Posts ({posts.length})
              </a>
            )}
            {articles.length > 0 && (
              <a href="#section-articles" className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-neutral-100 hover:bg-secondary-100 text-caption font-semibold text-neutral-600 hover:text-secondary-700 transition-colors duration-normal">
                Articles
              </a>
            )}
            {scripts.length > 0 && (
              <a href="#section-scripts" className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-neutral-100 hover:bg-secondary-100 text-caption font-semibold text-neutral-600 hover:text-secondary-700 transition-colors duration-normal">
                Scripts
              </a>
            )}
            {emails.length > 0 && (
              <a href="#section-emails" className="inline-flex items-center gap-1.5 px-3 py-1.5 min-h-[36px] rounded-full bg-neutral-100 hover:bg-secondary-100 text-caption font-semibold text-neutral-600 hover:text-secondary-700 transition-colors duration-normal">
                Emails
              </a>
            )}
          </nav>

          {/* ============================================================ */}
          {/*  2. Section "Mes biens" + annonces rattachees                 */}
          {/* ============================================================ */}
          {profile && profile.biens.length > 0 && (
            <section id="section-biens" aria-labelledby="section-biens-heading">
              <div className="rounded-lg bg-card border border-border overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-border bg-neutral-50/50">
                  <SectionHeader
                    icon={<span>{"\ud83c\udfe0"}</span>}
                    title={`Mes biens (${profile.biens.length})`}
                    count={annonces.length}
                    isOpen={!collapsedSections.has("biens")}
                    onToggle={() => toggleSection("biens")}
                    sectionId="section-biens"
                  />
                </div>

                {!collapsedSections.has("biens") && (
                  <div id="section-biens-panel" className="divide-y divide-border accordion-enter">
                    {profile.biens.map((bien, i) => {
                      const bienAnnonces = matchedAnnonces.get(i) || []
                      return (
                        <div key={i} className="p-5">
                          {/* Bien card */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-lg" aria-hidden="true">{"\ud83c\udfe0"}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-display text-body font-semibold text-primary leading-snug">
                                {bien.titre || `Bien ${i + 1}`}
                              </h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {bien.type ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-primary-50 text-caption font-medium text-primary-700">{bien.type}</span> : null}
                                {bien.adresse ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">
                                    {"\ud83d\udccd"} {bien.adresse}
                                  </span>
                                ) : null}
                                {bien.prix ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-success-50 text-caption font-bold text-success-700">{Number(bien.prix).toLocaleString("fr-FR")} {"\u20ac"}</span> : null}
                                {bien.surface ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">{bien.surface} m{"\u00b2"}</span> : null}
                                {bien.pieces ? <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600">{bien.pieces} pi{"\u00e8"}ce{Number(bien.pieces) > 1 ? "s" : ""}</span> : null}
                              </div>
                              {bien.points_forts ? <p className="text-body-sm text-neutral-500 mt-2 italic">{bien.points_forts}</p> : null}
                              {bien.lien_annonce ? (
                                <a href={bien.lien_annonce} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-body-sm text-secondary-700 font-semibold hover:text-secondary hover:underline transition-colors duration-normal">
                                  {"\ud83d\udd17"} Voir l{"'"}annonce originale
                                </a>
                              ) : null}
                            </div>
                          </div>

                          {/* Annonces rattachees a ce bien */}
                          {bienAnnonces.length > 0 && (
                            <div className="mt-4 ml-16 space-y-3">
                              <p className="text-body-sm font-semibold text-neutral-600 flex items-center gap-1.5">
                                {"\ud83d\udcdd"} Annonces pour ce bien
                              </p>
                              {bienAnnonces.map((annonce) => (
                                <DeliverableCard
                                  key={annonce.id}
                                  id={annonce.id}
                                  type={annonce.type}
                                  typeLabel={TYPE_LABELS[annonce.type] || annonce.type}
                                  typeColor={TYPE_COLORS[annonce.type] || "bg-neutral-100 text-neutral-600"}
                                  title={annonce.title}
                                  status={annonce.status}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {/* Annonces non rattachees */}
                    {unmatchedAnnonces.length > 0 && (
                      <div className="p-5">
                        <p className="text-body-sm font-semibold text-neutral-600 flex items-center gap-1.5 mb-2">
                          📝 Annonces générales
                        </p>
                        <p className="text-caption text-neutral-400 mb-3">
                          Ces annonces ne sont pas liées à un bien spécifique — elles servent pour ta communication générale.
                        </p>
                        <div className="space-y-3">
                          {unmatchedAnnonces.map((annonce) => (
                            <DeliverableCard
                              key={annonce.id}
                              id={annonce.id}
                              type={annonce.type}
                              typeLabel={TYPE_LABELS[annonce.type] || annonce.type}
                              typeColor={TYPE_COLORS[annonce.type] || "bg-neutral-100 text-neutral-600"}
                              title={annonce.title}
                              status={annonce.status}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Annonces sans biens (si pas de biens dans le profil) */}
          {(!profile || profile.biens.length === 0) && annonces.length > 0 && (
            <section id="section-annonces" aria-labelledby="section-annonces-heading">
              <SectionHeader
                icon={<span>{"\ud83c\udfe0"}</span>}
                title="Mes annonces"
                count={annonces.length}
                isOpen={!collapsedSections.has("annonces")}
                onToggle={() => toggleSection("annonces")}
                sectionId="section-annonces"
              />
              {!collapsedSections.has("annonces") && (
                <div id="section-annonces-panel" className="mt-4 grid grid-cols-1 tablet:grid-cols-2 gap-4 accordion-enter">
                  {annonces.map((d) => (
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
          )}

          {/* ============================================================ */}
          {/*  3. Section "Ma timeline" — posts en flux social              */}
          {/* ============================================================ */}
          {posts.length > 0 && (() => {
            const currentMonth = new Date().toISOString().slice(0, 7)
            const postsThisMonth = posts.filter(p => p.month === currentMonth || p.created_at.startsWith(currentMonth)).length
            return (
            <section id="section-posts" aria-labelledby="section-posts-heading">
              <SectionHeader
                icon={<span>{"\ud83d\udcf1"}</span>}
                title={`Mes posts \u00e0 publier${postsThisMonth > 0 ? ` \u2014 ${postsThisMonth} ce mois` : ""}`}
                count={posts.length}
                isOpen={!collapsedSections.has("posts")}
                onToggle={() => toggleSection("posts")}
                sectionId="section-posts"
              />

              {!collapsedSections.has("posts") && (
                <div id="section-posts-panel" className="mt-6 relative accordion-enter">
                  {/* Guidage action — rappel de la promesse ImmoCrew */}
                  <p className="text-caption text-neutral-400 mb-4 pl-12">
                    Copie, colle, publie. Ton {"\u00e9"}quipe a fait le reste.
                  </p>
                  {/* Ligne verticale de timeline */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary/40 via-secondary/20 to-transparent" aria-hidden="true" />

                  <div className="space-y-1">
                    {posts.map((post, index) => {
                      const platform = detectPlatform(post.title)
                      return (
                        <div key={post.id} className="relative pl-12">
                          {/* Pastille plateforme sur la ligne */}
                          <div className="absolute left-2 top-5 w-7 h-7 rounded-full bg-card border-2 border-secondary/30 flex items-center justify-center text-sm shadow-xs" aria-hidden="true">
                            {platform.icon}
                          </div>

                          {/* Date du post */}
                          <p className="text-caption text-neutral-400 mb-1">
                            {post.month || new Date(post.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                          </p>
                          <DeliverableCard
                            id={post.id}
                            type={post.type}
                            typeLabel={platform.name}
                            typeColor={TYPE_COLORS[post.type] || "bg-secondary-50 text-secondary-700"}
                            title={post.title}
                            status={post.status}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </section>
          )})()}

          {/* ============================================================ */}
          {/*  4. Section "Mes articles" — preview magazine                 */}
          {/* ============================================================ */}
          {articles.length > 0 && (
            <section id="section-articles" aria-labelledby="section-articles-heading">
              <SectionHeader
                icon={<span>{"\ud83d\udcdd"}</span>}
                title="Mes articles"
                count={articles.length}
                isOpen={!collapsedSections.has("articles")}
                onToggle={() => toggleSection("articles")}
                sectionId="section-articles"
              />

              {!collapsedSections.has("articles") && (
                <div id="section-articles-panel" className="mt-4 space-y-4 accordion-enter">
                  {articles.map((article) => (
                    <DeliverableCard
                      key={article.id}
                      id={article.id}
                      type={article.type}
                      typeLabel={TYPE_LABELS[article.type] || article.type}
                      typeColor={TYPE_COLORS[article.type] || "bg-info-50 text-info-700"}
                      title={article.title}
                      status={article.status}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ============================================================ */}
          {/*  5. Section "Mes scripts video"                               */}
          {/* ============================================================ */}
          {scripts.length > 0 && (
            <section id="section-scripts" aria-labelledby="section-scripts-heading">
              <SectionHeader
                icon={<span>{"\ud83c\udfac"}</span>}
                title="Mes scripts vid\u00e9o"
                count={scripts.length}
                isOpen={!collapsedSections.has("scripts")}
                onToggle={() => toggleSection("scripts")}
                sectionId="section-scripts"
              />

              {!collapsedSections.has("scripts") && (
                <div id="section-scripts-panel" className="mt-4 accordion-enter">
                  <p className="text-caption text-neutral-400 mb-4">
                    Chaque script est pr\u00eat \u00e0 lire face cam\u00e9ra. Filme-toi avec ton iPhone, c{"'"}est suffisant.
                  </p>
                  <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                  {scripts.map((script) => {
                    const titleLower = script.title.toLowerCase()
                    const format = titleLower.includes("reel") || titleLower.includes("story") || titleLower.includes("court")
                      ? "Reel / Story \u00b7 30-60 sec"
                      : titleLower.includes("pr\u00e9sentation") || titleLower.includes("bien")
                        ? "Vid\u00e9o bien \u00b7 1-2 min"
                        : "Vid\u00e9o \u00b7 30-90 sec"
                    return (
                    <div key={script.id}>
                      <p className="text-caption text-neutral-400 mb-1">{format}</p>
                      <DeliverableCard
                        id={script.id}
                        type={script.type}
                        typeLabel={TYPE_LABELS[script.type] || script.type}
                        typeColor={TYPE_COLORS[script.type] || "bg-warning-50 text-warning-800"}
                        title={script.title}
                        status={script.status}
                      />
                    </div>
                    )})}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ============================================================ */}
          {/*  6. Section "Mes emails"                                      */}
          {/* ============================================================ */}
          {emails.length > 0 && (
            <section id="section-emails" aria-labelledby="section-emails-heading">
              <SectionHeader
                icon={<span>{"\ud83d\udce7"}</span>}
                title="Mes emails"
                count={emails.length}
                isOpen={!collapsedSections.has("emails")}
                onToggle={() => toggleSection("emails")}
                sectionId="section-emails"
              />

              {!collapsedSections.has("emails") && (
                <div id="section-emails-panel" className="mt-4 grid grid-cols-1 tablet:grid-cols-2 gap-4 accordion-enter">
                  {emails.map((email) => (
                    <DeliverableCard
                      key={email.id}
                      id={email.id}
                      type={email.type}
                      typeLabel={TYPE_LABELS[email.type] || email.type}
                      typeColor={TYPE_COLORS[email.type] || "bg-primary-50 text-primary-700"}
                      title={email.title}
                      status={email.status}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ============================================================ */}
          {/*  7. Section "Ma strategie" (repliee par defaut)               */}
          {/* ============================================================ */}
          {strategie.length > 0 && (
            <section id="section-strategie" aria-labelledby="section-strategie-heading">
              <SectionHeader
                icon={<span>{"\ud83d\udccb"}</span>}
                title="Mon identité pro"
                count={strategie.length}
                isOpen={!collapsedSections.has("strategie")}
                onToggle={() => toggleSection("strategie")}
                sectionId="section-strategie"
              />

              {!collapsedSections.has("strategie") && (
                <div id="section-strategie-panel" className="mt-4 grid grid-cols-1 tablet:grid-cols-2 gap-4 accordion-enter">
                  {strategie.map((d) => (
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
          )}
        </div>
      )}

      {/* Footer — abonnement + support */}
      <div className="mt-2 pt-6 border-t border-border flex flex-wrap items-center gap-4">
        {stripeCustomerId ? (
          <a
            href="/api/portal"
            className="text-body-sm text-neutral-600 hover:text-secondary-700 underline transition-colors duration-normal"
          >
            G\u00e9rer mon abonnement
          </a>
        ) : null}
        <a
          href="mailto:support@immocrew.fr"
          className="text-body-sm text-neutral-600 hover:text-secondary-700 underline transition-colors duration-normal"
        >
          Une question sur tes contenus ?
        </a>
      </div>
    </div>
  )
}

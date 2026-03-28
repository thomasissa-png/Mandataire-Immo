"use client"

import { useState, useMemo } from "react"
import { DeliverableCard } from "./DeliverableCard"
import { MesBiensSection } from "./MesBiensSection"

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
    quartiers: string
    gamme_prix: string
    ton_communication: string
    cible_clients: string
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
  profileIncomplete?: boolean
}

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

const STRATEGY_HINTS: Record<string, string> = {
  bio: "Copie-la sur Instagram, LinkedIn et Facebook",
  positionnement: "Ton argumentaire unique — à utiliser dans tes échanges",
  brief_graphique: "Pour tes visuels Canva ou ton graphiste",
  calendrier: "Ton planning de publication pour le mois",
  landing_page: "Ta page web personnalisée",
}

const TYPE_COLORS: Record<string, string> = {
  post: "bg-secondary-50 text-secondary-700",
  article_seo: "bg-blue-50 text-blue-700",
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


function detectPlatform(title: string) {
  const t = title.toLowerCase()
  if (t.includes("instagram") || t.includes("reel") || t.includes("story")) return { icon: "📸", name: "Instagram" }
  if (t.includes("linkedin")) return { icon: "💼", name: "LinkedIn" }
  if (t.includes("facebook")) return { icon: "📘", name: "Facebook" }
  if (t.includes("tiktok")) return { icon: "🎵", name: "TikTok" }
  return { icon: "📱", name: "Post" }
}

/* ------------------------------------------------------------------ */
/* NAV SECTION                                                         */
/* ------------------------------------------------------------------ */

interface NavItem { id: string; label: string; icon: string; count: number }

function DashboardNav({ items, active, onSelect }: { items: NavItem[]; active: string; onSelect: (id: string) => void }) {
  return (
    <nav className="lg:hidden sticky top-14 z-10 bg-card/95 backdrop-blur-sm py-2 -mx-4 px-4 border-b border-border" aria-label="Sections">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id === active ? "" : item.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-body font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
              active === item.id
                ? "bg-primary text-white"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
            {item.count > 0 ? <span className="text-caption opacity-70">({item.count})</span> : null}
          </button>
        ))}
      </div>
    </nav>
  )
}

/* ------------------------------------------------------------------ */
/* SECTION HEADER                                                      */
/* ------------------------------------------------------------------ */

function SectionHeader({ icon, title, count, isOpen, onToggle }: {
  icon: string; title: string; count: number; isOpen: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 group"
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <h2 className="font-display text-h3 text-primary">{title}</h2>
        <span className="text-caption text-neutral-400 ml-1">({count})</span>
      </div>
      <svg
        className={`w-5 h-5 text-neutral-400 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )
}

/* ------------------------------------------------------------------ */
/* MAIN COMPONENT                                                      */
/* ------------------------------------------------------------------ */

export function DashboardContent({
  userName,
  pack,
  stripeCustomerId,
  showMonthlyBanner,
  deliverables,
  profile,
  profileIncomplete,
}: DashboardContentProps) {
  const [activeNav, setActiveNav] = useState("")
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [showWelcome, setShowWelcome] = useState(() =>
    typeof window !== "undefined" && !localStorage.getItem("immocrew_welcome_dismissed")
  )

  const toggle = (id: string) => setCollapsed((prev) => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const firstName = profile?.prenom || userName.split(" ")[0] || userName
  const photoUrl = profile?.photo_profil_key ? `/api/images/${encodeURIComponent(profile.photo_profil_key)}` : null
  const initials = profile
    ? `${(profile.prenom[0] || "").toUpperCase()}${(profile.nom[0] || "").toUpperCase()}`
    : "?"
  const packLabel = pack === "mensuel" ? "Pack Mensuel" : pack === "lancement" ? "Pack Lancement" : null
  const currentMonth = new Date().toISOString().slice(0, 7)

  // Group deliverables
  const { posts, articles, annonces, scripts, emails, strategie } = useMemo(() => {
    const r = { posts: [] as Deliverable[], articles: [] as Deliverable[], annonces: [] as Deliverable[], scripts: [] as Deliverable[], emails: [] as Deliverable[], strategie: [] as Deliverable[] }
    for (const d of deliverables) {
      if (d.type === "post") r.posts.push(d)
      else if (d.type === "article_seo") r.articles.push(d)
      else if (d.type === "annonce") r.annonces.push(d)
      else if (d.type === "script_video") r.scripts.push(d)
      else if (d.type === "newsletter" || d.type === "email_prospection") r.emails.push(d)
      else r.strategie.push(d)
    }
    r.posts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    return r
  }, [deliverables])

  const biensCount = profile?.biens.length ?? 0

  const postsThisMonth = posts.filter(p => p.month === currentMonth || p.created_at.startsWith(currentMonth)).length

  // Nav items
  const navItems: NavItem[] = [
    strategie.length > 0 ? { id: "identite", label: "Mon profil", icon: "👤", count: strategie.length } : null,
    { id: "biens", label: "Biens & annonces", icon: "🏠", count: biensCount + annonces.length },
    posts.length > 0 ? { id: "posts", label: "Calendrier & posts", icon: "📅", count: posts.length } : null,
    articles.length > 0 ? { id: "articles", label: "Articles", icon: "📝", count: articles.length } : null,
    scripts.length > 0 ? { id: "scripts", label: "Scripts vidéo", icon: "🎬", count: scripts.length } : null,
    emails.length > 0 ? { id: "emails", label: "Emails", icon: "📧", count: emails.length } : null,
  ].filter((x): x is NavItem => x !== null)

  const isVisible = (id: string) => !activeNav || activeNav === id

  // ============================================================
  // EMPTY STATE
  // ============================================================
  if (deliverables.length === 0) {
    return (
      <div className="rounded-lg bg-card border border-border p-10 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-6">
          <span className="text-secondary text-3xl" aria-hidden="true">✍️</span>
        </div>
        <h2 className="font-display text-h2 text-primary mb-3">Bienvenue dans ton espace !</h2>
        <p className="text-body text-neutral-600 mb-4">
          Ton équipe est au travail. Tes premiers contenus arrivent sous 24h.
        </p>
        <p className="text-caption text-neutral-400">
          On t{"'"}envoie un email dès que c{"'"}est prêt.
        </p>
      </div>
    )
  }

  // ============================================================
  // MAIN LAYOUT
  // ============================================================
  return (
    <div className="lg:flex lg:gap-6">

      {/* SIDEBAR DESKTOP (≥1024px) */}
      <aside className="hidden lg:block lg:w-56 lg:flex-shrink-0">
        <div className="sticky top-20 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNav(item.id === activeNav ? "" : item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-body-sm flex items-center gap-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
                activeNav === item.id
                  ? "bg-primary-50 text-primary font-semibold"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <span aria-hidden="true">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              <span className="text-caption text-neutral-400">{item.count}</span>
            </button>
          ))}
          <hr className="my-3 border-border" />
          <a
            href="/dashboard/profile"
            className="w-full text-left px-3 py-2.5 rounded-lg text-body-sm flex items-center gap-2 text-neutral-600 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">✏️</span>
            <span>Modifier mon profil</span>
          </a>
          <a
            href="mailto:support@immocrew.fr"
            className="w-full text-left px-3 py-2.5 rounded-lg text-body-sm flex items-center gap-2 text-neutral-600 hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            <span aria-hidden="true">💬</span>
            <span>Support</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 min-w-0 space-y-4">

      {/* WELCOME BANNER (first access only) */}
      {showWelcome && (
        <div className="rounded-lg bg-secondary-50 border border-secondary/20 p-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-body-sm text-secondary-800 font-semibold mb-1">Comment utiliser ton espace</p>
            <p className="text-body-sm text-secondary-700">
              Clique sur une carte pour voir le contenu, puis <strong>Copier</strong> pour le coller dans ton appli. C{"'"}est tout.
            </p>
          </div>
          <button
            type="button"
            onClick={() => { localStorage.setItem("immocrew_welcome_dismissed", "1"); setShowWelcome(false) }}
            className="text-secondary-400 hover:text-secondary-600 flex-shrink-0 text-xl"
            aria-label="Fermer"
          >
            {"×"}
          </button>
        </div>
      )}

      {/* BANDEAU PAS DE PACK */}
      {!pack ? (
        <a href="/#pricing" className="block rounded-lg bg-gradient-to-r from-secondary-50 to-primary-50 border border-secondary/20 p-4 hover:shadow-md transition-all group">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl" aria-hidden="true">🚀</span>
            </div>
            <div className="flex-1">
              <p className="font-display text-h4 text-primary mb-1">Tu n{"'"}as pas encore de pack</p>
              <p className="text-body-sm text-neutral-600">Découvre nos offres et lance ta visibilité locale dès aujourd{"'"}hui.</p>
            </div>
            <span className="flex-shrink-0 px-5 py-2.5 rounded-full bg-secondary text-primary font-display font-bold text-body-sm group-hover:bg-secondary-600 group-hover:text-white transition-all shadow-sm">
              Voir les offres →
            </span>
          </div>
        </a>
      ) : null}

      {/* BANDEAU PROFIL INCOMPLET */}
      {profileIncomplete ? (
        <a href="/onboarding" className="block rounded-lg bg-warning-50 border border-warning-200 p-4 hover:bg-warning-100 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-xl" aria-hidden="true">📝</span>
            <div>
              <p className="text-body-sm font-semibold text-warning-800">Ton profil est incomplet</p>
              <p className="text-caption text-warning-700">Reprends l{"'"}onboarding pour recevoir tes contenus personnalisés — 5 min max.</p>
            </div>
          </div>
        </a>
      ) : null}

      {/* ============================================================ */}
      {/* PROFILE CARD — compact, inline                                */}
      {/* ============================================================ */}
      <div className="rounded-lg bg-card border border-border p-4">
        <div className="flex items-center gap-4">
          {photoUrl ? (
            <img src={photoUrl} alt={`Photo de ${firstName}`} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary-600 flex items-center justify-center flex-shrink-0">
              <span className="font-display text-h3 font-bold text-white">{initials}</span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-display text-h3 text-primary font-bold">{profile ? `${profile.prenom} ${profile.nom}` : userName}</h1>
              {packLabel ? <span className="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary text-caption font-semibold">{packLabel}</span> : null}
              <a
                href="/dashboard/profile"
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                aria-label="Modifier mon profil"
              >
                <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </a>
            </div>
            {profile?.reseau ? (
              <p className="text-body-sm text-neutral-500">Mandataire {profile.reseau}{profile.ville ? ` · ${profile.ville}` : ""}</p>
            ) : null}
          </div>
        </div>

        {/* Info pills */}
        {profile ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.experience_annees ? <span className="px-2.5 py-1 rounded-lg bg-primary-50 text-caption font-medium text-primary-700">{profile.experience_annees} ans d{"'"}expérience</span> : null}
            {profile.nb_transactions_an ? <span className="px-2.5 py-1 rounded-lg bg-success-50 text-caption font-medium text-success-700">{profile.nb_transactions_an} transactions/an</span> : null}
            {profile.type_biens ? <span className="px-2.5 py-1 rounded-lg bg-secondary-50 text-caption font-medium text-secondary-700">{profile.type_biens}</span> : null}
            {profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-blue-50 text-caption font-medium text-blue-700 hover:bg-blue-100 transition-colors">LinkedIn</a> : null}
            <a href="/dashboard/profile" className="px-2.5 py-1 rounded-lg bg-secondary-50 text-caption font-medium text-secondary-700 hover:bg-secondary-100 transition-colors">Modifier mon profil</a>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 mt-3">
            <a href="/dashboard/profile" className="px-2.5 py-1 rounded-lg bg-secondary-50 text-caption font-medium text-secondary-700 hover:bg-secondary-100 transition-colors">Modifier mon profil</a>
          </div>
        )}
      </div>

      {/* PLAN STRATEGIQUE — résumé + recommandations */}
      {profile ? (
        <div className="rounded-lg bg-card border border-border p-4">
          <h2 className="font-display text-h3 text-primary mb-3">👋 Salut {firstName} — ton plan du mois</h2>
          <p className="text-body-sm text-neutral-600 mb-4">
            On te connaît : mandataire {profile.reseau || ""} à {profile.ville || "ta zone"}, spécialisée {profile.type_biens || "immobilier"}.
            Voici ce qu{"'"}on te recommande ce mois.
          </p>
          <div className="space-y-3">
            {strategie.length > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary-50/50">
                <span className="text-lg mt-0.5" aria-hidden="true">1️⃣</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">Mets à jour tes bios et ton positionnement</p>
                  <p className="text-caption text-neutral-500">Copie-les sur Instagram, Facebook et LinkedIn.</p>
                </div>
              </div>
            ) : null}
            {posts.length > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary-50/50">
                <span className="text-lg mt-0.5" aria-hidden="true">2️⃣</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">Publie tes posts — {postsThisMonth > 0 ? `${postsThisMonth} ce mois` : `${posts.length} prêts`}</p>
                  <p className="text-caption text-neutral-500">On te conseille 3 posts/semaine : lundi, mercredi, vendredi à 18h.</p>
                </div>
              </div>
            ) : null}
            {scripts.length > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning-50/50">
                <span className="text-lg mt-0.5" aria-hidden="true">3️⃣</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">Tourne tes vidéos — {scripts.length} scripts prêts</p>
                  <p className="text-caption text-neutral-500">Filme-toi avec ton iPhone face caméra. 30 à 60 secondes, c{"'"}est suffisant.</p>
                </div>
              </div>
            ) : null}
            {annonces.length > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success-50/50">
                <span className="text-lg mt-0.5" aria-hidden="true">4️⃣</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">Publie tes annonces sur SeLoger et LeBonCoin</p>
                  <p className="text-caption text-neutral-500">{annonces.length} annonce{annonces.length > 1 ? "s" : ""} personnalisée{annonces.length > 1 ? "s" : ""} pour tes biens.</p>
                </div>
              </div>
            ) : null}
          </div>
          {/* Question / feedback */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-body-sm text-neutral-500">
              Un truc à changer ? Un bien à ajouter ?{" "}
              <a href="mailto:support@immocrew.fr?subject=Retour%20sur%20mes%20contenus" className="text-secondary-700 font-semibold hover:underline">
                Écris-nous, on répond sous 4h
              </a>
            </p>
          </div>
        </div>
      ) : null}

      {/* ============================================================ */}
      {/* MES BIENS (self-service — property_pages)                       */}
      {/* ============================================================ */}
      <MesBiensSection />

      {/* CTA Passer au mensuel — APRÈS le plan, pas avant */}
      {pack === "lancement" ? (
        <div className="rounded-lg bg-gradient-to-r from-primary to-primary-700 p-4 flex flex-col tablet:flex-row items-start tablet:items-center justify-between gap-4 text-white">
          <div>
            <p className="font-display text-h4 text-white">Continue sur ta lancée — passe au mensuel</p>
            <p className="text-body-sm text-primary-200 mt-1">12 posts, 2 articles, 4 scripts, 4 annonces — livrés chaque mois. 150€/mois, sans engagement.</p>
          </div>
          <a href="/api/checkout?pack=mensuel" className="flex-shrink-0 px-6 py-2.5 rounded-full bg-secondary text-primary font-display font-bold text-body-sm hover:bg-secondary-600 hover:text-white transition-all shadow-sm">
            Commencer le mensuel →
          </a>
        </div>
      ) : null}

      {/* Monthly update banner */}
      {showMonthlyBanner ? (
        <a href="/dashboard/monthly-update" className="group block rounded-lg border border-secondary/30 bg-gradient-to-r from-secondary-50 to-card p-4 hover:shadow-md transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-secondary-700" aria-hidden="true">📝</span>
            </div>
            <div className="flex-1">
              <p className="text-body-sm font-semibold text-primary">Dis-nous ce qui a changé ce mois-ci</p>
              <p className="text-caption text-neutral-500">10 min, et tes prochains contenus seront encore plus dans le mille.</p>
            </div>
          </div>
        </a>
      ) : null}

      {/* NAVIGATION */}
      {navItems.length > 1 ? <DashboardNav items={navItems} active={activeNav} onSelect={setActiveNav} /> : null}

      {/* ============================================================ */}
      {/* 1. MON IDENTITÉ PRO (stratégie — EN PREMIER)                  */}
      {/* ============================================================ */}
      {isVisible("identite") && strategie.length > 0 ? (
        <section>
          <SectionHeader icon="👤" title="Mon profil et identité" count={strategie.length} isOpen={!collapsed.has("identite")} onToggle={() => toggle("identite")} />
          {!collapsed.has("identite") ? (
            <div className="mt-3 grid grid-cols-1 tablet:grid-cols-2 gap-3">
              {strategie.map((d) => (
                <DeliverableCard key={d.id} id={d.id} type={d.type} typeLabel={TYPE_LABELS[d.type] || d.type} typeColor={TYPE_COLORS[d.type] || "bg-neutral-100 text-neutral-600"} title={d.title} status={d.status} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 2. ANNONCES (livrables uniquement — les biens sont dans        */}
      {/*    MesBiensSection plus haut)                                  */}
      {/* ============================================================ */}
      {isVisible("biens") && annonces.length > 0 ? (
        <section>
          <SectionHeader icon="📝" title="Mes annonces" count={annonces.length} isOpen={!collapsed.has("biens")} onToggle={() => toggle("biens")} />
          {!collapsed.has("biens") ? (
            <div className="mt-3 space-y-2">
              {annonces.map((a) => (
                <DeliverableCard key={a.id} id={a.id} type={a.type} typeLabel="Annonce" typeColor="bg-success-50 text-success-700" title={a.title} status={a.status} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 3. MON CALENDRIER & POSTS                                     */}
      {/* ============================================================ */}
      {isVisible("posts") && posts.length > 0 ? (
        <section>
          <SectionHeader icon="📅" title={`Mon calendrier — ${postsThisMonth > 0 ? `${postsThisMonth} posts ce mois` : `${posts.length} posts`}`} count={posts.length} isOpen={!collapsed.has("posts")} onToggle={() => toggle("posts")} />
          {!collapsed.has("posts") ? (
            <div className="mt-3">
              <p className="text-caption text-neutral-400 mb-3">Copie, colle, publie. Ton équipe a fait le reste.</p>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-secondary/20" aria-hidden="true" />
                <div className="space-y-2">
                  {(() => {
                    let lastMonth = ""
                    return posts.map((post) => {
                      const platform = detectPlatform(post.title)
                      const monthKey = post.month || post.created_at.slice(0, 7)
                      const showMonthHeader = monthKey !== lastMonth
                      if (showMonthHeader) lastMonth = monthKey
                      const monthLabel = monthKey ? new Date(monthKey + "-01").toLocaleDateString("fr-FR", { month: "long", year: "numeric" }) : ""
                      return (
                        <div key={post.id}>
                          {showMonthHeader && monthLabel ? (
                            <div className="flex items-center gap-3 py-3 pl-10">
                              <div className="h-px flex-1 bg-border" />
                              <span className="text-caption font-semibold text-primary capitalize">{monthLabel}</span>
                              <div className="h-px flex-1 bg-border" />
                            </div>
                          ) : null}
                          <div className="relative pl-10">
                            <div className="absolute left-2 top-4 w-5 h-5 rounded-full bg-card border-2 border-secondary/30 flex items-center justify-center text-xs" aria-hidden="true">
                              {platform.icon}
                            </div>
                            <DeliverableCard id={post.id} type={post.type} typeLabel={platform.name} typeColor="bg-secondary-50 text-secondary-700" title={post.title} status={post.status} />
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 4. MES ARTICLES                                               */}
      {/* ============================================================ */}
      {isVisible("articles") && articles.length > 0 ? (
        <section>
          <SectionHeader icon="📝" title="Mes articles" count={articles.length} isOpen={!collapsed.has("articles")} onToggle={() => toggle("articles")} />
          {!collapsed.has("articles") ? (
            <div className="mt-3 space-y-3">
              {articles.map((d) => (
                <DeliverableCard key={d.id} id={d.id} type={d.type} typeLabel="Article local" typeColor="bg-blue-50 text-blue-700" title={d.title} status={d.status} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 5. MES SCRIPTS VIDÉO                                          */}
      {/* ============================================================ */}
      {isVisible("scripts") && scripts.length > 0 ? (
        <section>
          <SectionHeader icon="🎬" title="Mes scripts vidéo" count={scripts.length} isOpen={!collapsed.has("scripts")} onToggle={() => toggle("scripts")} />
          {!collapsed.has("scripts") ? (
            <div className="mt-3">
              <p className="text-caption text-neutral-400 mb-3">Filme-toi avec ton iPhone, c{"'"}est suffisant. Chaque script est prêt à lire face caméra.</p>
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
                {scripts.map((d) => (
                  <DeliverableCard key={d.id} id={d.id} type={d.type} typeLabel="Script vidéo" typeColor="bg-warning-50 text-warning-800" title={d.title} status={d.status} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* ============================================================ */}
      {/* 6. MES EMAILS                                                 */}
      {/* ============================================================ */}
      {isVisible("emails") && emails.length > 0 ? (
        <section>
          <SectionHeader icon="📧" title="Mes emails" count={emails.length} isOpen={!collapsed.has("emails")} onToggle={() => toggle("emails")} />
          {!collapsed.has("emails") ? (
            <div className="mt-3 grid grid-cols-1 tablet:grid-cols-2 gap-3">
              {emails.map((d) => (
                <DeliverableCard key={d.id} id={d.id} type={d.type} typeLabel={TYPE_LABELS[d.type] || d.type} typeColor={TYPE_COLORS[d.type] || "bg-neutral-100 text-neutral-600"} title={d.title} status={d.status} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {/* FOOTER */}
      <div className="pt-6 border-t border-border flex flex-wrap items-center gap-4">
        {stripeCustomerId ? (
          <a href="/api/portal" className="text-body-sm text-neutral-500 hover:text-secondary-700 underline transition-colors">Gérer mon abonnement (modifier, résilier)</a>
        ) : null}
        <a href="mailto:support@immocrew.fr" className="text-body-sm text-neutral-500 hover:text-secondary-700 underline transition-colors">Une question sur tes contenus ?</a>
      </div>

      </div>
    </div>
  )
}

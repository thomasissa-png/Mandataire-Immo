"use client"

import { useState } from "react"
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
}

interface Category {
  id: string
  label: string
  icon: string
  types: DeliverableType[]
}

const CATEGORIES: Category[] = [
  { id: "posts", label: "Posts", icon: "📱", types: ["post"] },
  { id: "annonces", label: "Annonces", icon: "🏠", types: ["annonce"] },
  { id: "articles", label: "Articles SEO", icon: "📝", types: ["article_seo"] },
  { id: "scripts", label: "Scripts vidéo", icon: "🎬", types: ["script_video"] },
  { id: "emails", label: "Emails", icon: "📧", types: ["newsletter", "email_prospection"] },
  { id: "strategie", label: "Stratégie", icon: "🎯", types: ["positionnement", "bio", "calendrier", "brief_graphique", "landing_page"] },
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

export function DashboardContent({
  userName,
  pack,
  stripeCustomerId,
  showMonthlyBanner,
  deliverables,
}: DashboardContentProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all")

  // Grouper les livrables par catégorie
  const categorizedDeliverables = CATEGORIES.map((cat) => ({
    ...cat,
    items: deliverables.filter((d) => cat.types.includes(d.type)),
  })).filter((cat) => cat.items.length > 0)

  // Filtrer selon le filtre actif
  const visibleCategories =
    activeFilter === "all"
      ? categorizedDeliverables
      : categorizedDeliverables.filter((cat) => cat.id === activeFilter)

  return (
    <div>
      {/* Monthly update banner */}
      {showMonthlyBanner && (
        <a
          href="/dashboard/monthly-update"
          className="block mb-6 p-4 rounded-xl border border-secondary/30 bg-secondary-50 hover:bg-secondary-100 transition-colors duration-normal"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-body-sm font-semibold text-primary">Tes infos du mois</p>
              <p className="text-caption text-neutral-500">10 min pour des livrables encore plus personnalisés</p>
            </div>
            <svg className="w-5 h-5 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </a>
      )}

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-display text-h1 text-primary mb-1">
          Bonjour {userName}
        </h1>
        <p className="text-body text-neutral-500">
          {pack === "mensuel"
            ? "Voici tes livrables du mois."
            : "Voici tes livrables."}
        </p>
      </div>

      {deliverables.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl bg-card border border-border p-10 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-6">
            <span className="text-secondary text-display-lg" aria-hidden="true">✍</span>
          </div>
          <h2 className="font-display text-h2 text-primary mb-3">Bienvenue dans ton espace !</h2>
          <p className="text-body text-neutral-600 mb-4">
            Ton équipe est au travail. Tu recevras tes premiers livrables sous 24h.
          </p>
          <div className="rounded-lg bg-background p-4 mb-4 text-left">
            <p className="text-body-sm text-neutral-500 font-semibold mb-2">Ce que tu vas recevoir :</p>
            <ul className="text-body-sm text-neutral-600 space-y-1">
              {pack === "lancement" ? (
                <>
                  <li>✓ 20 posts prêts à publier</li>
                  <li>✓ 5 articles SEO local</li>
                  <li>✓ 5 annonces storytelling</li>
                  <li>✓ 10 scripts vidéo</li>
                  <li>✓ Kit graphique personnalisé</li>
                </>
              ) : (
                <>
                  <li>✓ 12 posts prêts à publier</li>
                  <li>✓ 2 articles SEO local</li>
                  <li>✓ 4 annonces personnalisées</li>
                  <li>✓ 4 scripts vidéo</li>
                  <li>✓ 1 newsletter + 1 email prospection</li>
                </>
              )}
            </ul>
          </div>
          <p className="text-caption text-neutral-400">On t&apos;envoie un email dès que c&apos;est prêt.</p>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 tablet:grid-cols-6 gap-3 mb-6">
            {CATEGORIES.map((cat) => {
              const count = deliverables.filter((d) => cat.types.includes(d.type)).length
              if (count === 0) return null
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveFilter(activeFilter === cat.id ? "all" : cat.id)}
                  className={`rounded-xl p-3 text-center transition-all duration-normal border ${
                    activeFilter === cat.id
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-card border-border hover:border-secondary/30 hover:shadow-sm"
                  }`}
                >
                  <span className="text-lg block mb-0.5" aria-hidden="true">{cat.icon}</span>
                  <p className={`font-display text-h3 ${activeFilter === cat.id ? "text-white" : "text-primary"}`}>
                    {count}
                  </p>
                  <p className={`text-caption ${activeFilter === cat.id ? "text-primary-100" : "text-neutral-500"}`}>
                    {cat.label}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              type="button"
              onClick={() => setActiveFilter("all")}
              className={`px-4 py-1.5 rounded-full text-body-sm font-medium transition-colors duration-normal ${
                activeFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              Tout ({deliverables.length})
            </button>
            {categorizedDeliverables.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveFilter(activeFilter === cat.id ? "all" : cat.id)}
                className={`px-4 py-1.5 rounded-full text-body-sm font-medium transition-colors duration-normal ${
                  activeFilter === cat.id
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                {cat.icon} {cat.label} ({cat.items.length})
              </button>
            ))}
          </div>

          {/* Categorized deliverables */}
          <div className="space-y-8">
            {visibleCategories.map((cat) => (
              <section key={cat.id}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl" aria-hidden="true">{cat.icon}</span>
                  <h2 className="font-display text-h3 text-primary">
                    {cat.label}
                  </h2>
                  <span className="text-caption text-neutral-400 ml-1">
                    ({cat.items.length})
                  </span>
                </div>
                <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
                  {cat.items.map((deliverable) => (
                    <DeliverableCard
                      key={deliverable.id}
                      id={deliverable.id}
                      type={deliverable.type}
                      typeLabel={TYPE_LABELS[deliverable.type] || deliverable.type}
                      typeColor={TYPE_COLORS[deliverable.type] || "bg-neutral-100 text-neutral-600"}
                      title={deliverable.title}
                      status={deliverable.status}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {/* Manage subscription */}
      {stripeCustomerId && (
        <div className="mt-10 pt-6 border-t border-border">
          <a
            href="/api/portal"
            className="text-body-sm text-neutral-500 hover:text-secondary underline transition-colors duration-normal"
          >
            Gérer mon abonnement
          </a>
        </div>
      )}
    </div>
  )
}

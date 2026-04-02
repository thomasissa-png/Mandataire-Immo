"use client"

import { useState, useMemo } from "react"
import { MesBiensSection } from "./MesBiensSection"
import { ReferralSection } from "./ReferralSection"
import { SupportSection } from "./SupportSection"
import type { Deliverable } from "@/types/deliverable"

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
    instagram: string
    facebook: string
    site_web: string
    confort_camera: string
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
  recommendedArticles?: Array<{ slug: string; title: string; description: string }>
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
  recommendedArticles = [],
}: DashboardContentProps) {
  const [showWelcome, setShowWelcome] = useState(() =>
    typeof window !== "undefined" && !localStorage.getItem("immocrew_welcome_dismissed")
  )

  const firstName = profile?.prenom || userName.split(" ")[0] || userName
  const photoUrl = profile?.photo_profil_key ? `/api/images/${encodeURIComponent(profile.photo_profil_key)}` : null
  const initials = profile
    ? `${(profile.prenom[0] || "").toUpperCase()}${(profile.nom[0] || "").toUpperCase()}`
    : "?"
  const packLabel = pack === "mensuel" ? "Mensuel" : pack === "trimestriel" ? "Trimestriel" : pack === "annuel" ? "Annuel" : null

  const missingFields: string[] = []
  if (profile) {
    if (!profile.telephone) missingFields.push("téléphone")
    if (!profile.quartiers) missingFields.push("quartiers")
    if (!profile.type_biens) missingFields.push("types de biens")
    if (!profile.experience_annees) missingFields.push("expérience")
    if (!profile.nb_transactions_an) missingFields.push("transactions/an")
    if (!profile.gamme_prix) missingFields.push("gamme de prix")
  }

  const currentMonth = new Date().toISOString().slice(0, 7)

  // Group deliverables — counts for plan marketing, annonces for biens
  const counts = useMemo(() => {
    const r = { annonces: [] as Deliverable[], strategie: 0, posts: 0, postsThisMonth: 0, scripts: 0, articles: 0, emails: 0 }
    for (const d of deliverables) {
      if (d.type === "annonce") r.annonces.push(d)
      else if (d.type === "post") {
        r.posts++
        if (d.month === currentMonth || String(d.created_at).startsWith(currentMonth)) r.postsThisMonth++
      }
      else if (d.type === "script_video") r.scripts++
      else if (d.type === "article_seo") r.articles++
      else if (d.type === "newsletter" || d.type === "email_prospection") r.emails++
      else if (["bio", "positionnement", "landing_page"].includes(d.type)) r.strategie++
    }
    return r
  }, [deliverables, currentMonth])

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
        <a
          href="/dashboard/biens/nouveau"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-primary text-white font-display font-bold text-body-sm hover:bg-primary-700 transition-colors shadow-sm"
        >
          Ajoute ton premier bien →
        </a>
      </div>
    )
  }

  // ============================================================
  // MAIN LAYOUT
  // ============================================================
  return (
    <div className="space-y-4">

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
            <span className="flex-shrink-0 px-5 py-2.5 rounded-full bg-secondary text-white font-display font-bold text-body-sm group-hover:bg-secondary-600 group-hover:text-white transition-all shadow-sm">
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
              <p className="text-caption text-warning-700">
                {missingFields.length > 0
                  ? `Il manque : ${missingFields.join(", ")}. Complète ton profil pour des contenus plus précis.`
                  : "Reprends l'onboarding pour recevoir tes contenus personnalisés — 5 min max."}
              </p>
            </div>
          </div>
        </a>
      ) : null}

      {/* Monthly update banner — en haut pour visibilité maximale */}
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

      {/* ============================================================ */}
      {/* PROFILE CARD — compact, inline                                */}
      {/* ============================================================ */}
      <div className="rounded-lg bg-card border border-border p-4">
        <div className="flex items-center gap-4">
          <a href="/dashboard/profile#section-identite" className="relative group flex-shrink-0" aria-label="Changer ma photo de profil">
            {photoUrl ? (
              <img src={photoUrl} alt={`Photo de ${firstName}`} className="w-14 h-14 rounded-xl object-cover" />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary-600 flex items-center justify-center">
                <span className="font-display text-h3 font-bold text-white">{initials}</span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shadow-sm group-hover:bg-primary-700 transition-colors">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
              </svg>
            </div>
          </a>
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
              <p className="text-body-sm text-neutral-500">Mandataire{profile.reseau ? ` ${profile.reseau}` : ""}{profile.ville ? ` · ${profile.ville}` : ""}</p>
            ) : null}
          </div>
        </div>

        {/* Info pills */}
        {profile ? (
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.experience_annees ? <span className="px-2.5 py-1 rounded-lg bg-primary-50 text-caption font-medium text-primary-700">{profile.experience_annees} ans d{"'"}expérience</span> : null}
            {profile.nb_transactions_an ? <span className="px-2.5 py-1 rounded-lg bg-success-50 text-caption font-medium text-success-700">{profile.nb_transactions_an} transactions/an</span> : null}
            {profile.type_biens ? <span className="px-2.5 py-1 rounded-lg bg-secondary-50 text-caption font-medium text-secondary-700">{profile.type_biens}</span> : null}
            {profile.linkedin_url ? <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-info-50 text-caption font-medium text-info-700 hover:bg-info-100 transition-colors">LinkedIn</a> : null}
            {profile.instagram ? <a href={`https://instagram.com/${profile.instagram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-secondary-50 text-caption font-medium text-secondary-700 hover:bg-secondary-100 transition-colors">Instagram</a> : null}
            {profile.facebook ? <a href={profile.facebook} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-info-50 text-caption font-medium text-info-700 hover:bg-info-100 transition-colors">Facebook</a> : null}
            {profile.site_web ? <a href={profile.site_web.startsWith("http") ? profile.site_web : `https://${profile.site_web}`} target="_blank" rel="noopener noreferrer" className="px-2.5 py-1 rounded-lg bg-neutral-100 text-caption font-medium text-neutral-600 hover:bg-neutral-200 transition-colors">Site web</a> : null}
          </div>
        ) : null}
      </div>

      {/* CARTE PAGE MANDATAIRE */}
      <div className="rounded-lg bg-card border border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div>
              <p className="text-body-sm font-semibold text-primary">Ta page mandataire</p>
              <p className="text-caption text-neutral-500">Ton profil public visible par tes prospects</p>
            </div>
          </div>
          <a
            href="/dashboard/ma-page"
            className="px-4 py-2 rounded-full bg-secondary text-white font-display font-bold text-caption hover:bg-secondary-600 hover:text-white transition-all shadow-sm"
          >
            Gérer ma page →
          </a>
        </div>
      </div>

      {/* PLAN STRATEGIQUE — résumé + recommandations */}
      {profile ? (
        <div className="rounded-lg bg-card border border-border p-5">
          <h2 className="font-display text-h3 text-primary mb-3">👋 Salut {firstName} — ton plan du mois</h2>

          {/* Section résumé profil */}
          <div className="text-body-sm text-neutral-600 mb-4 space-y-1">
            <p>
              Tes contenus sont calibrés pour ton marché{profile.ville ? ` à ${profile.ville}` : ""}{profile.quartiers ? ` (${profile.quartiers})` : ""}{profile.reseau ? `, réseau ${profile.reseau}` : ""}.
            </p>
            {(profile.type_biens || profile.cible_clients) && (
              <p>
                {profile.type_biens && profile.cible_clients
                  ? `Spécialité : ${profile.type_biens.toLowerCase()}${profile.gamme_prix ? ` (${profile.gamme_prix})` : ""}, ciblant ${profile.cible_clients.toLowerCase()}.`
                  : profile.type_biens
                    ? `Spécialité : ${profile.type_biens.toLowerCase()}${profile.gamme_prix ? ` (${profile.gamme_prix})` : ""}.`
                    : `Cible : ${profile.cible_clients!.toLowerCase()}.`}
              </p>
            )}
            <p className="font-medium text-primary-700">Voici ton plan d{"'"}action du mois.</p>
          </div>

          <p className="text-body-sm text-neutral-500 mb-4 italic">
            Commence par mettre à jour tes bios (une seule fois), puis publie tes posts au fil de la semaine, et tourne tes vidéos quand tu as un créneau calme.
          </p>

          <div className="space-y-3">
            {/* STRATEGIE — bios & positionnement */}
            {counts.strategie > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary-50/50">
                <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">👤</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">Mets à jour tes bios et ton positionnement</p>
                  <p className="text-caption text-neutral-500">Copie-les sur {[profile.instagram && "Instagram", profile.linkedin_url && "LinkedIn", profile.facebook && "Facebook"].filter(Boolean).join(", ") || "tes réseaux sociaux"}.</p>
                  <p className="text-caption mt-1.5">
                    <a href="/dashboard/strategie" className="text-secondary-700 font-semibold hover:underline">Voir mes bios →</a>
                  </p>
                </div>
              </div>
            ) : null}

            {/* POSTS */}
            {counts.posts > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary-50/50">
                <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">📱</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">Tes {counts.postsThisMonth > 0 ? counts.postsThisMonth : counts.posts} posts sont prêts</p>
                  <p className="text-caption text-neutral-500">
                    {[
                      profile.linkedin_url && "LinkedIn (7h-9h, pour les pros)",
                      profile.instagram && "Instagram (18h-20h, pour les particuliers)",
                      profile.facebook && "Facebook (12h-13h)",
                    ].filter(Boolean).join(" · ") || "Publie sur tes réseaux aux heures de forte activité."}
                  </p>
                  <p className="text-caption mt-1.5">
                    <a href="/dashboard/posts" className="text-secondary-700 font-semibold hover:underline">Voir mes posts →</a>
                  </p>
                </div>
              </div>
            ) : null}

            {/* SCRIPTS VIDEO */}
            {counts.scripts > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-warning-50/50">
                <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">🎬</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">{counts.scripts} script{counts.scripts > 1 ? "s" : ""} vidéo prêt{counts.scripts > 1 ? "s" : ""} à tourner</p>
                  <p className="text-caption text-neutral-500">
                    {profile.confort_camera === "debutant" || !profile.confort_camera
                      ? "Pas besoin de te filmer ! Prends des photos et crée un diaporama avec texte animé sur Instagram Reels. Smartphone en mode portrait, lumière naturelle."
                      : "Format Reel (30-60 sec) vertical. Filme-toi face caméra en lumière naturelle. L'authenticité marche mieux que la production."}
                  </p>
                  <p className="text-caption mt-1.5">
                    <a href="/dashboard/scripts" className="text-secondary-700 font-semibold hover:underline">Voir mes scripts →</a>
                  </p>
                </div>
              </div>
            ) : null}

            {/* ANNONCES */}
            {counts.annonces.length > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-success-50/50">
                <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">📝</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">{counts.annonces.length} annonce{counts.annonces.length > 1 ? "s" : ""} prête{counts.annonces.length > 1 ? "s" : ""} pour les portails</p>
                  <p className="text-caption text-neutral-500">
                    Copie-les sur LeBonCoin et Bien{"'"}ici. Chaque annonce inclut un lien vers ta page publique ImmoCrew.
                  </p>
                </div>
              </div>
            ) : null}

            {/* ARTICLES SEO */}
            {counts.articles > 0 ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-info-50/50">
                <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">📰</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary">{counts.articles} article{counts.articles > 1 ? "s" : ""} SEO pour ta visibilité locale</p>
                  <p className="text-caption text-neutral-500">
                    Tes articles sont publiés automatiquement sur ta page mandataire. Partage le lien sur LinkedIn pour plus de visibilité. Le SEO local met 2-3 mois à porter ses fruits — la régularité est la clé.
                  </p>
                  <p className="text-caption mt-1.5">
                    <a href="/dashboard/articles" className="text-secondary-700 font-semibold hover:underline">Voir mes articles →</a>
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          {/* Lien calendrier éditorial — après les contenus, avant les recommandations */}
          <a
            href="/dashboard/calendrier"
            className="group flex items-center gap-3 p-4 mt-4 rounded-lg border-l-4 border-l-secondary bg-secondary-50/40 hover:bg-secondary-50 transition-all"
          >
            <span className="text-2xl flex-shrink-0" aria-hidden="true">📆</span>
            <div className="flex-1">
              <p className="text-body-sm font-semibold text-primary group-hover:text-secondary-700 transition-colors">Voir ton calendrier éditorial</p>
              <p className="text-caption text-neutral-500">Visualise la répartition de tes contenus sur le mois</p>
            </div>
            <span className="text-secondary-600 font-semibold text-body-sm group-hover:translate-x-0.5 transition-transform" aria-hidden="true">→</span>
          </a>

          {/* Recommandations de lecture du mois — dynamiques */}
          {recommendedArticles.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50">
                <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">📚</span>
                <div>
                  <p className="text-body-sm font-semibold text-primary mb-1">Nos recommandations de lecture</p>
                  <ul className="space-y-1.5">
                    {recommendedArticles.map((article) => (
                      <li key={article.slug}>
                        <a href={`/blog/${article.slug}`} target="_blank" rel="noopener noreferrer" className="text-caption text-secondary-700 font-medium hover:underline inline-flex items-center gap-1">
                          {article.title}
                          <svg className="w-3 h-3 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
                        </a>
                        <p className="text-caption text-neutral-400">{article.description.slice(0, 80)}{article.description.length > 80 ? "..." : ""}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Question / feedback */}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-body-sm text-neutral-500">
              Une question ? Un souci avec un contenu ?{" "}
              <a href="mailto:contact@immocrew.fr?subject=Retour%20sur%20mes%20contenus" className="text-secondary-700 font-semibold hover:underline">
                Écris-nous, on te répond au plus vite
              </a>
            </p>
          </div>
        </div>
      ) : null}

      {/* ============================================================ */}
      {/* PARRAINAGE — visible pour tous les clients avec un pack        */}
      {/* ============================================================ */}
      {pack && <ReferralSection />}

      {/* ============================================================ */}
      {/* MES BIENS (self-service — property_pages)                       */}
      {/* ============================================================ */}
      <MesBiensSection annonces={counts.annonces} />

      {/* CTA Support — APRÈS le plan, pas avant */}

      {/* SUPPORT / FEEDBACK */}
      <SupportSection />

      {/* FOOTER */}
      <div className="pt-6 border-t border-border flex flex-wrap items-center gap-4">
        {stripeCustomerId ? (
          <a href="/api/portal" className="text-body-sm text-neutral-500 hover:text-secondary-700 underline transition-colors">Gérer mon abonnement (modifier, résilier)</a>
        ) : null}
        <a href="mailto:contact@immocrew.fr" className="text-body-sm text-neutral-500 hover:text-secondary-700 underline transition-colors">Une question sur tes contenus ?</a>
      </div>

    </div>
  )
}

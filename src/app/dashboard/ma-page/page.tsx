/**
 * /dashboard/ma-page — Gestion de la page mandataire
 * Rendu SSR : fetch direct via query() pour afficher l'état de la page.
 */
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { ActivatePageButton, IndexationToggle } from "@/components/dashboard/AgentPageManager"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { CopyLinkButton } from "@/components/ui/CopyLinkButton"

interface ClientRow {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  pack: string | null
  client_context: Record<string, unknown> | null
}

interface AgentPageRow {
  id: string
  slug: string
  status: string
  indexation: boolean
  edition_locked: boolean
  bio_generee: string | null
  activated_at: string | null
}

export default async function MaPageMandatairePage() {
  const user = await getSessionUser()
  if (!user) {
    redirect("/login")
  }

  const { rows: clients } = await query<ClientRow>(
    "SELECT id, email, first_name, last_name, pack, client_context FROM clients WHERE email = $1 LIMIT 1",
    [user.email]
  )

  const client = clients[0] ?? null
  if (!client) {
    redirect("/login")
  }

  const { rows: pages } = await query<AgentPageRow>(
    "SELECT id, slug, status, indexation, edition_locked, bio_generee, activated_at FROM agent_pages WHERE client_id = $1 LIMIT 1",
    [client.id]
  )

  const agentPage = pages[0] ?? null
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://immocrew.fr"

  return (
    <DashboardPageLayout
      icon="🌐"
      title="Ma page mandataire"
      description="Gère ta vitrine publique visible par tes prospects."
    >
      <div className="max-w-2xl">
      {!agentPage ? (
        /* ── PAS DE PAGE ACTIVÉE ── */
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="font-display text-h2 text-primary font-bold mb-3">
            Active ta page mandataire
          </h1>
          <p className="text-body text-neutral-600 mb-3">
            Crée ta vitrine publique en un clic. Ton profil sera accessible à{" "}
            <span className="font-semibold text-primary">/agent/ton-nom</span> et partageable partout.
          </p>
          <p className="text-body-sm text-neutral-500 mb-6">
            Ta page sera construite automatiquement à partir de ton profil (photo, bio, zone, biens).
            Tu pourras la modifier à tout moment.
          </p>

          {/* Aperçu de ce qui sera affiché */}
          {(() => {
            const ctx = (client.client_context ?? {}) as Record<string, unknown>
            const prenom = String(ctx.prenom || client.first_name || "")
            const nom = String(ctx.nom || client.last_name || "")
            const ville = String(ctx.ville || "")
            const reseau = String(ctx.reseau || "")
            const photoKey = String(ctx.photo_profil_key || "")
            const hasProfile = prenom || nom || ville

            if (!hasProfile) return null

            return (
              <div className="rounded-lg border border-border bg-card p-5 mb-6 text-left">
                <p className="text-caption font-semibold text-neutral-400 uppercase tracking-wider mb-3">Aperçu de ta future page</p>
                <div className="flex items-center gap-4">
                  {photoKey ? (
                    <img src={`/api/images/${encodeURIComponent(photoKey)}`} alt="" className="w-14 h-14 rounded-xl object-cover" />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary-600 flex items-center justify-center">
                      <span className="font-display text-h3 font-bold text-white">
                        {(prenom[0] || "").toUpperCase()}{(nom[0] || "").toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-display text-h4 text-primary font-bold">{prenom} {nom}</p>
                    {(reseau || ville) && (
                      <p className="text-body-sm text-neutral-500">
                        {reseau ? `Mandataire ${reseau}` : ""}{reseau && ville ? " · " : ""}{ville}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-caption text-neutral-400 mt-3">
                  Ces infos viennent de ton profil.{" "}
                  <a href="/dashboard/profile" className="text-secondary-700 font-semibold hover:underline">Modifier mon profil</a>
                </p>
              </div>
            )
          })()}

          <ActivatePageButton pack={client.pack} />
        </div>
      ) : (
        /* ── PAGE EXISTANTE ── */
        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <p className="text-body text-neutral-600">
              Ta page est accessible ici :{" "}
              <a
                href={`${baseUrl}/agent/${agentPage.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-700 font-semibold hover:underline"
              >
                {baseUrl}/agent/{agentPage.slug}
              </a>
            </p>
            <CopyLinkButton url={`${baseUrl}/agent/${agentPage.slug}`} />
          </div>

          {/* Lien édition profil */}
          <div className="rounded-lg bg-info-50 border border-info-200 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-info-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
              <div>
                <p className="text-body-sm font-semibold text-info-800">
                  Envie de modifier ta page ?
                </p>
                <p className="text-caption text-info-700 mt-1">
                  Les modifications de ton profil se reflètent automatiquement sur ta page publique.
                </p>
                <a
                  href="/dashboard/profile"
                  className="inline-flex items-center gap-1 mt-2 text-caption font-semibold text-info-800 hover:underline"
                >
                  Modifier mon profil →
                </a>
              </div>
            </div>
          </div>

          {/* Toggle indexation */}
          <div className="rounded-lg bg-card border border-border p-5">
            <IndexationToggle slug={agentPage.slug} initialValue={agentPage.indexation} />
            <p className="text-caption text-neutral-400 mt-2">
              Active cette option pour que ta page apparaisse dans les résultats Google quand quelqu{"'"}un cherche ton nom + ta ville.
            </p>
          </div>

          {/* Avertissement edition_locked */}
          {agentPage.edition_locked && (
            <div className="rounded-lg bg-warning-50 border border-warning-200 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0" aria-hidden="true">🔒</span>
                <div>
                  <p className="text-body-sm font-semibold text-warning-800">
                    L{"'"}édition est verrouillée
                  </p>
                  <p className="text-caption text-warning-700">
                    Passe au Pack Mensuel pour continuer à modifier ta page.
                  </p>
                  <a
                    href="/#pricing"
                    className="inline-flex items-center gap-1 mt-2 text-caption font-semibold text-warning-800 hover:underline"
                  >
                    Voir les offres →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Avertissement page figée (status frozen) */}
          {agentPage.status === "frozen" && (
            <div className="rounded-lg bg-error-50 border border-error-200 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0" aria-hidden="true">❄️</span>
                <div>
                  <p className="text-body-sm font-semibold text-error-800">
                    Ta page est figée
                  </p>
                  <p className="text-caption text-error-700">
                    Réabonne-toi pour la modifier et la garder à jour.
                  </p>
                  <a
                    href="/#pricing"
                    className="inline-flex items-center gap-1 mt-2 text-caption font-semibold text-error-800 hover:underline"
                  >
                    Voir les offres →
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Aperçu rapide */}
          <div className="rounded-lg bg-card border border-border p-5">
            <h2 className="font-display text-h4 text-primary font-bold mb-3">Aperçu</h2>
            {agentPage.bio_generee ? (
              <p className="text-body-sm text-neutral-600 mb-4 line-clamp-3">
                {agentPage.bio_generee}
              </p>
            ) : (
              <div className="mb-4">
                <p className="text-body-sm text-neutral-400 italic">
                  Aucune bio générée pour le moment.
                </p>
                <p className="text-caption text-neutral-400 mt-1">
                  Ta bio sera générée automatiquement lors de ta prochaine production de contenus.
                  En attendant, tu peux{" "}
                  <a href="/dashboard/profile" className="text-secondary-700 font-semibold hover:underline">
                    rédiger ta propre bio depuis ton profil
                  </a>.
                </p>
              </div>
            )}
            <a
              href={`/agent/${agentPage.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-secondary text-white font-display font-bold text-body-sm hover:bg-secondary-600 hover:text-white transition-all shadow-sm"
            >
              Voir ma page →
            </a>
          </div>
        </div>
      )}
      </div>
    </DashboardPageLayout>
  )
}

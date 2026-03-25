import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { query } from "@/lib/db"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Versions des prompts — Admin ImmoCrew",
}

interface PromptVersionRow {
  id: string
  prompt_type: string
  version_number: number
  prompt_text: string
  prompt_hash: string
  changelog: string | null
  created_by: string | null
  is_active: boolean
  created_at: string
  image_count: number
  pending_audit_count: number
}

const PROMPT_TYPE_LABELS: Record<string, string> = {
  photo_annonce: "Photo annonce",
  photo_profil: "Photo profil",
  visuel_post: "Visuel post",
  cover_article: "Cover article",
  kit_graphique: "Kit graphique",
  miniature_video: "Miniature vidéo",
}

export default async function AdminPromptsPage() {
  const user = await currentUser()
  const adminEmail = process.env.ADMIN_EMAIL
  const userEmail = user?.emailAddresses[0]?.emailAddress

  if (!userEmail || userEmail !== adminEmail) {
    redirect("/dashboard")
  }

  // Fetch all prompt versions with image counts
  const { rows: versions } = await query<PromptVersionRow>(
    `SELECT pv.*,
       COUNT(gi.id)::int as image_count,
       COUNT(gi.id) FILTER (WHERE gi.audit_status IS NULL)::int as pending_audit_count
     FROM prompt_versions pv
     LEFT JOIN generated_images gi ON gi.prompt_version_id = pv.id
     GROUP BY pv.id
     ORDER BY pv.prompt_type ASC, pv.version_number DESC`
  )

  // Group by type
  const groupedByType = versions.reduce<Record<string, PromptVersionRow[]>>(
    (acc, v) => {
      if (!acc[v.prompt_type]) acc[v.prompt_type] = []
      acc[v.prompt_type].push(v)
      return acc
    },
    {}
  )

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-primary text-white border-b border-primary-600">
        <div className="container-immocrew flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <a href="/admin" className="font-display text-h3 font-bold">
              ImmoCrew
            </a>
            <span className="text-caption bg-secondary px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
          <nav className="flex items-center gap-4 text-body-sm">
            <a href="/admin" className="text-primary-200 hover:text-white transition-colors">
              Clients
            </a>
            <a href="/admin/prompts" className="text-white font-semibold">
              Prompts
            </a>
            <a href="/admin/images" className="text-primary-200 hover:text-white transition-colors">
              Audit images
            </a>
          </nav>
        </div>
      </header>

      <main className="container-immocrew py-8">
        <div className="mb-8">
          <h1 className="font-display text-h1 text-primary mb-2">
            Versions des prompts
          </h1>
          <p className="text-body text-neutral-500">
            Chaque image g&eacute;n&eacute;r&eacute;e est associ&eacute;e
            &agrave; une version de prompt. Quand vous auditez une image,
            v&eacute;rifiez toujours la version du prompt utilis&eacute;e.
          </p>
        </div>

        {Object.keys(groupedByType).length === 0 ? (
          <div className="rounded-xl bg-card border border-border p-12 text-center">
            <p className="text-body text-neutral-500">
              Aucune version de prompt enregistr&eacute;e.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedByType).map(([type, typeVersions]) => (
              <div key={type} className="rounded-xl bg-card border border-border overflow-hidden">
                <div className="bg-neutral-50 px-6 py-4 border-b border-border flex items-center justify-between">
                  <h2 className="font-display text-h3 text-primary">
                    {PROMPT_TYPE_LABELS[type] || type}
                  </h2>
                  <span className="text-caption text-neutral-500">
                    {typeVersions.length} version{typeVersions.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="divide-y divide-border">
                  {typeVersions.map((version) => (
                    <div key={version.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-caption font-semibold ${
                              version.is_active
                                ? "bg-success-50 text-success-800"
                                : "bg-neutral-100 text-neutral-500"
                            }`}
                          >
                            v{version.version_number}
                            {version.is_active ? " (active)" : ""}
                          </span>
                          <code className="text-caption text-neutral-400 font-mono">
                            #{version.prompt_hash}
                          </code>
                        </div>
                        <div className="flex items-center gap-4 text-caption text-neutral-500">
                          <span>{version.image_count} image{version.image_count !== 1 ? "s" : ""}</span>
                          {version.pending_audit_count > 0 && (
                            <span className="text-warning-600 font-semibold">
                              {version.pending_audit_count} en attente d&apos;audit
                            </span>
                          )}
                        </div>
                      </div>

                      {version.changelog && (
                        <p className="text-body-sm text-neutral-600 mb-2">
                          <span className="font-semibold">Changement :</span>{" "}
                          {version.changelog}
                        </p>
                      )}

                      <details className="mt-2">
                        <summary className="text-body-sm text-secondary cursor-pointer hover:underline">
                          Voir le prompt complet
                        </summary>
                        <pre className="mt-2 p-4 bg-neutral-50 rounded-lg text-caption text-neutral-700 whitespace-pre-wrap overflow-x-auto max-h-64 overflow-y-auto">
                          {version.prompt_text}
                        </pre>
                      </details>

                      <div className="mt-2 flex items-center gap-4 text-caption text-neutral-400">
                        <span>
                          {new Date(version.created_at).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {version.created_by && (
                          <span>par {version.created_by}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

import { redirect, notFound } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { markdownToHtml } from "@/lib/markdownRenderer"
import { ArticleCopyButton } from "./ArticleCopyButton"

interface DeliverableRow {
  id: string
  title: string
  content: string
  metadata: Record<string, unknown>
  created_at: string
  status: string
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  const { rows } = await query<DeliverableRow>(
    `SELECT id, title, content, metadata, created_at, status
     FROM deliverables
     WHERE id = $1 AND client_email = $2 AND type = 'article_seo'
     LIMIT 1`,
    [id, user.email]
  )

  if (rows.length === 0) notFound()

  const article = rows[0]
  const html = markdownToHtml(article.content)
  const formattedDate = new Date(article.created_at).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <DashboardPageLayout
      icon="📝"
      title={article.title}
      description={`Article SEO · ${formattedDate}`}
    >
      {/* Navigation */}
      <div className="flex items-center justify-between mb-4">
        <a
          href="/dashboard/articles"
          className="inline-flex items-center gap-1.5 text-body-sm text-neutral-500 hover:text-secondary-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Retour aux articles
        </a>
        <ArticleCopyButton content={article.content} />
      </div>

      {/* Article content */}
      <article className="rounded-lg bg-card border border-border p-6 tablet:p-8">
        <div
          className="prose-deliverable max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
    </DashboardPageLayout>
  )
}

import { redirect, notFound } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { ArticleEditor } from "./ArticleEditor"

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
      <ArticleEditor
        id={article.id}
        initialContent={article.content}
        title={article.title}
      />
    </DashboardPageLayout>
  )
}

export type DeliverableType =
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

export interface Deliverable {
  id: string
  type: DeliverableType
  title: string
  month: string
  status: "draft" | "delivered" | "archived"
  created_at: string
}

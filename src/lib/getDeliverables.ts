import { query } from "@/lib/db"
import type { DeliverableType, Deliverable } from "@/types/deliverable"

export type { DeliverableType, Deliverable }

/**
 * Récupère les deliverables d'un client, optionnellement filtrés par type(s).
 */
export async function getDeliverables(
  email: string,
  types?: DeliverableType[]
): Promise<Deliverable[]> {
  try {
    if (types && types.length > 0) {
      const placeholders = types.map((_, i) => `$${i + 2}`).join(", ")
      const { rows } = await query<Deliverable>(
        `SELECT id, type, title, status, month, created_at FROM deliverables
         WHERE client_email = $1 AND status IN ('draft', 'delivered') AND type IN (${placeholders})
         ORDER BY created_at DESC`,
        [email, ...types]
      )
      return rows || []
    }

    const { rows } = await query<Deliverable>(
      `SELECT id, type, title, status, month, created_at FROM deliverables
       WHERE client_email = $1 AND status IN ('draft', 'delivered')
       ORDER BY created_at DESC`,
      [email]
    )
    return rows || []
  } catch (err) {
    console.error("[getDeliverables] Error:", err)
    return []
  }
}

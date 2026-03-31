import { query } from "@/lib/db"
import type { DeliverableType, Deliverable } from "@/types/deliverable"

export type { DeliverableType, Deliverable }

interface GetDeliverablesOptions {
  /** Inclure les livrables archivés (défaut : false) */
  includeArchived?: boolean
  /** Filtrer par mois au format "YYYY-MM" (ex: "2026-03") */
  month?: string
}

/**
 * Récupère les deliverables d'un client, optionnellement filtrés par type(s),
 * mois et statut d'archivage.
 */
export async function getDeliverables(
  email: string,
  types?: DeliverableType[],
  options?: GetDeliverablesOptions
): Promise<Deliverable[]> {
  const { includeArchived = false, month } = options ?? {}

  try {
    const conditions: string[] = ["client_email = $1"]
    const params: unknown[] = [email]
    let paramIndex = 2

    // Filtre statut
    if (includeArchived) {
      conditions.push(`status IN ('draft', 'delivered', 'archived')`)
    } else {
      conditions.push(`status IN ('draft', 'delivered')`)
    }

    // Filtre type(s)
    if (types && types.length > 0) {
      const placeholders = types.map((_, i) => `$${paramIndex + i}`).join(", ")
      conditions.push(`type IN (${placeholders})`)
      params.push(...types)
      paramIndex += types.length
    }

    // Filtre mois (format "YYYY-MM")
    if (month) {
      conditions.push(`month = $${paramIndex}`)
      params.push(month)
      paramIndex += 1
    }

    const whereClause = conditions.join(" AND ")
    const { rows } = await query<Deliverable>(
      `SELECT id, type, title, status, month, created_at FROM deliverables
       WHERE ${whereClause}
       ORDER BY created_at DESC`,
      params
    )
    return rows || []
  } catch (err) {
    console.error("[getDeliverables] Error:", err)
    return []
  }
}

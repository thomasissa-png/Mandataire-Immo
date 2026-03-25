import { Pool, type QueryResultRow } from "pg"

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
})

/**
 * Execute une requete SQL parametree.
 * Utiliser $1, $2, etc. pour les parametres (prevention injection SQL).
 *
 * @example
 * const { rows } = await query<Client>("SELECT * FROM clients WHERE email = $1", [email])
 */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<{ rows: T[]; rowCount: number | null }> {
  const result = await pool.query<T>(text, params)
  return { rows: result.rows, rowCount: result.rowCount }
}

/**
 * Recupere un client du pool pour des transactions multi-requetes.
 * IMPORTANT : toujours appeler client.release() dans un finally.
 *
 * @example
 * const client = await getClient()
 * try {
 *   await client.query("BEGIN")
 *   await client.query("INSERT INTO ...", [...])
 *   await client.query("COMMIT")
 * } catch (err) {
 *   await client.query("ROLLBACK")
 *   throw err
 * } finally {
 *   client.release()
 * }
 */
export async function getClient() {
  return pool.connect()
}

export { pool }

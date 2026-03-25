import { query } from "@/lib/db"
import crypto from "crypto"

/**
 * Systeme de versioning des prompts de generation d'images.
 *
 * Chaque image generee est associee a une version de prompt.
 * Yann et Lucas peuvent auditer les images en sachant exactement
 * quel prompt a ete utilise pour les generer.
 *
 * Usage :
 *   const version = await registerPromptVersion("photo_annonce", promptText, "Ajout angle exterieur")
 *   // ... generer l'image ...
 *   await linkImageToPromptVersion(imageId, version.id)
 */

export interface PromptVersion {
  id: string
  prompt_type: string
  version_number: number
  prompt_text: string
  prompt_hash: string
  changelog: string | null
  created_by: string | null
  is_active: boolean
  created_at: string
}

export interface GeneratedImage {
  id: string
  client_id: string
  prompt_version_id: string
  storage_path: string
  status: string
  audit_status: string | null
  audit_notes: string | null
  audited_by: string | null
  audited_at: string | null
  created_at: string
}

/**
 * Genere un hash SHA-256 du contenu du prompt.
 * Permet de detecter si le prompt a change sans comparer le texte entier.
 */
function hashPrompt(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex").slice(0, 16)
}

/**
 * Enregistre une nouvelle version de prompt.
 * Si le prompt est identique (meme hash), retourne la version existante.
 * Desactive automatiquement les anciennes versions du meme type.
 */
export async function registerPromptVersion(
  promptType: string,
  promptText: string,
  changelog: string | null = null,
  createdBy: string | null = null
): Promise<PromptVersion> {
  const promptHash = hashPrompt(promptText)

  // Verifier si un prompt identique existe deja
  const { rows: existing } = await query<PromptVersion>(
    `SELECT * FROM prompt_versions
     WHERE prompt_type = $1 AND prompt_hash = $2 AND is_active = true`,
    [promptType, promptHash]
  )

  if (existing.length > 0) {
    return existing[0]
  }

  // Recuperer le numero de version le plus recent pour ce type
  const { rows: latest } = await query<{ max_version: number }>(
    `SELECT COALESCE(MAX(version_number), 0) as max_version
     FROM prompt_versions WHERE prompt_type = $1`,
    [promptType]
  )
  const nextVersion = (latest[0]?.max_version ?? 0) + 1

  // Desactiver les anciennes versions de ce type
  await query(
    `UPDATE prompt_versions SET is_active = false WHERE prompt_type = $1`,
    [promptType]
  )

  // Inserer la nouvelle version
  const { rows } = await query<PromptVersion>(
    `INSERT INTO prompt_versions
       (prompt_type, version_number, prompt_text, prompt_hash, changelog, created_by, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, true)
     RETURNING *`,
    [promptType, nextVersion, promptText, promptHash, changelog, createdBy]
  )

  return rows[0]
}

/**
 * Recupere la version active d'un type de prompt.
 */
export async function getActivePromptVersion(
  promptType: string
): Promise<PromptVersion | null> {
  const { rows } = await query<PromptVersion>(
    `SELECT * FROM prompt_versions
     WHERE prompt_type = $1 AND is_active = true
     ORDER BY version_number DESC LIMIT 1`,
    [promptType]
  )
  return rows[0] || null
}

/**
 * Recupere l'historique complet des versions d'un type de prompt.
 */
export async function getPromptVersionHistory(
  promptType: string
): Promise<PromptVersion[]> {
  const { rows } = await query<PromptVersion>(
    `SELECT * FROM prompt_versions
     WHERE prompt_type = $1
     ORDER BY version_number DESC`,
    [promptType]
  )
  return rows
}

/**
 * Recupere toutes les versions actives (une par type).
 */
export async function getAllActivePromptVersions(): Promise<PromptVersion[]> {
  const { rows } = await query<PromptVersion>(
    `SELECT * FROM prompt_versions
     WHERE is_active = true
     ORDER BY prompt_type ASC`
  )
  return rows
}

/**
 * Associe une image generee a sa version de prompt.
 */
export async function saveGeneratedImage(
  clientId: string,
  promptVersionId: string,
  storagePath: string
): Promise<GeneratedImage> {
  const { rows } = await query<GeneratedImage>(
    `INSERT INTO generated_images
       (client_id, prompt_version_id, storage_path, status)
     VALUES ($1, $2, $3, 'generated')
     RETURNING *`,
    [clientId, promptVersionId, storagePath]
  )
  return rows[0]
}

/**
 * Met a jour le statut d'audit d'une image.
 * Utilise par Yann et Lucas depuis l'interface admin.
 */
export async function auditImage(
  imageId: string,
  auditStatus: "approved" | "rejected" | "needs_revision",
  auditNotes: string | null,
  auditedBy: string
): Promise<GeneratedImage> {
  const { rows } = await query<GeneratedImage>(
    `UPDATE generated_images
     SET audit_status = $1, audit_notes = $2, audited_by = $3, audited_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [auditStatus, auditNotes, auditedBy, imageId]
  )
  return rows[0]
}

/**
 * Recupere les images generees d'un client avec les infos de version de prompt.
 */
export async function getClientImagesWithVersions(
  clientId: string
): Promise<(GeneratedImage & { prompt_type: string; version_number: number; prompt_hash: string })[]> {
  const { rows } = await query<GeneratedImage & { prompt_type: string; version_number: number; prompt_hash: string }>(
    `SELECT gi.*, pv.prompt_type, pv.version_number, pv.prompt_hash
     FROM generated_images gi
     JOIN prompt_versions pv ON gi.prompt_version_id = pv.id
     WHERE gi.client_id = $1
     ORDER BY gi.created_at DESC`,
    [clientId]
  )
  return rows
}

/**
 * Recupere toutes les images en attente d'audit.
 */
export async function getPendingAuditImages(): Promise<
  (GeneratedImage & {
    prompt_type: string
    version_number: number
    prompt_hash: string
    client_email: string
  })[]
> {
  const { rows } = await query<
    GeneratedImage & {
      prompt_type: string
      version_number: number
      prompt_hash: string
      client_email: string
    }
  >(
    `SELECT gi.*, pv.prompt_type, pv.version_number, pv.prompt_hash, c.email as client_email
     FROM generated_images gi
     JOIN prompt_versions pv ON gi.prompt_version_id = pv.id
     JOIN clients c ON gi.client_id = c.id
     WHERE gi.audit_status IS NULL
     ORDER BY gi.created_at DESC`
  )
  return rows
}

/** Types de prompts standard du systeme */
export const PROMPT_TYPES = {
  PHOTO_ANNONCE: "photo_annonce",
  PHOTO_PROFIL: "photo_profil",
  VISUEL_POST: "visuel_post",
  COVER_ARTICLE: "cover_article",
  KIT_GRAPHIQUE: "kit_graphique",
  MINIATURE_VIDEO: "miniature_video",
} as const

export type PromptType = (typeof PROMPT_TYPES)[keyof typeof PROMPT_TYPES]

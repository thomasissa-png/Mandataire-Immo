import { Client } from "@replit/object-storage"

const storage = new Client()

/**
 * Upload un fichier dans Replit Object Storage.
 *
 * @param key - Chemin/cle du fichier (ex: "clients/123/avatar.png")
 * @param data - Contenu du fichier (Buffer ou string)
 * @returns Le chemin du fichier uploade
 */
export async function uploadFile(
  key: string,
  data: Buffer | string
): Promise<string> {
  const result = await storage.uploadFromBytes(
    key,
    typeof data === "string" ? Buffer.from(data) : data
  )
  if (!result.ok) {
    throw new Error(`Upload failed for key "${key}": ${result.error}`)
  }
  return key
}

/**
 * Verifie qu'un fichier existe et retourne sa cle.
 * Sur Replit Object Storage, les fichiers sont identifies par leur cle.
 *
 * @param key - Chemin/cle du fichier
 * @returns La cle du fichier ou null si non trouve
 */
export async function getFileUrl(key: string): Promise<string | null> {
  const result = await storage.downloadAsBytes(key)
  if (result.ok) {
    return key
  }
  return null
}

/**
 * Recupere le contenu d'un fichier sous forme de Buffer.
 *
 * @param key - Chemin/cle du fichier
 * @returns Le contenu du fichier ou null si non trouve
 */
export async function getFileContent(key: string): Promise<Buffer | null> {
  const result = await storage.downloadAsBytes(key)
  if (result.ok) {
    return result.value[0]
  }
  return null
}

/**
 * Supprime un fichier de Replit Object Storage.
 *
 * @param key - Chemin/cle du fichier
 */
export async function deleteFile(key: string): Promise<void> {
  const result = await storage.delete(key)
  if (!result.ok) {
    throw new Error(`Delete failed for key "${key}": ${result.error}`)
  }
}

export { storage }

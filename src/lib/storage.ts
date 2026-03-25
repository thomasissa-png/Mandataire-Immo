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
  await storage.uploadFromBytes(key, typeof data === "string" ? Buffer.from(data) : data)
  return key
}

/**
 * Recupere l'URL publique d'un fichier.
 * Sur Replit Object Storage, les fichiers sont accessibles via le client.
 *
 * @param key - Chemin/cle du fichier
 * @returns L'URL du fichier ou null si non trouve
 */
export async function getFileUrl(key: string): Promise<string | null> {
  try {
    const exists = await storage.downloadAsBytes(key)
    if (exists) {
      return key
    }
    return null
  } catch {
    return null
  }
}

/**
 * Recupere le contenu d'un fichier sous forme de Buffer.
 *
 * @param key - Chemin/cle du fichier
 * @returns Le contenu du fichier ou null si non trouve
 */
export async function getFileContent(key: string): Promise<Buffer | null> {
  try {
    const data = await storage.downloadAsBytes(key)
    return Buffer.from(data)
  } catch {
    return null
  }
}

/**
 * Supprime un fichier de Replit Object Storage.
 *
 * @param key - Chemin/cle du fichier
 */
export async function deleteFile(key: string): Promise<void> {
  await storage.delete(key)
}

export { storage }

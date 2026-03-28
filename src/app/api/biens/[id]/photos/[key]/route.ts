/**
 * DELETE /api/biens/[id]/photos/[key]
 * Supprime une photo d'un bien.
 * Vérifie ownership, supprime du Object Storage, retire du JSONB photos_originales.
 *
 * Rendu : SSR (mutation authentifiée)
 */

import { NextRequest, NextResponse } from "next/server"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { deleteFile } from "@/lib/storage"
import type { PropertyPhoto } from "@/types/property"

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; key: string }> }
) {
  const { id: propertyId, key: photoKey } = await params

  // Auth
  const user = await getSessionUser()
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  if (!propertyId || !photoKey) {
    return NextResponse.json(
      { error: "ID du bien et clé de la photo requis" },
      { status: 400 }
    )
  }

  // Vérifier ownership
  const { rows: propertyRows } = await query<{
    client_id: string
    photos_originales: PropertyPhoto[] | null
  }>(
    "SELECT client_id, photos_originales FROM property_pages WHERE id = $1 LIMIT 1",
    [propertyId]
  )

  if (propertyRows.length === 0) {
    return NextResponse.json({ error: "Bien non trouvé" }, { status: 404 })
  }

  if (propertyRows[0].client_id !== user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  const existingPhotos = propertyRows[0].photos_originales || []

  // Trouver la photo à supprimer par sa clé
  // Le key dans l'URL est le dernier segment — la clé complète est dans le JSONB
  const photoToDelete = existingPhotos.find(
    (p) => p.key === photoKey || p.key.endsWith(`/${photoKey}`)
  )

  if (!photoToDelete) {
    return NextResponse.json(
      { error: "Photo non trouvée sur ce bien" },
      { status: 404 }
    )
  }

  // Supprimer du Object Storage
  try {
    await deleteFile(photoToDelete.key)
  } catch (err) {
    console.error(
      `[Photo delete] Erreur suppression Object Storage pour ${photoToDelete.key}:`,
      err
    )
    // On continue quand même pour retirer la référence en base
    // (le fichier a peut-être déjà été supprimé)
  }

  // Retirer du JSONB photos_originales
  const updatedPhotos = existingPhotos.filter(
    (p) => p.key !== photoToDelete.key
  )

  // Renuméroter les ordres
  const reorderedPhotos = updatedPhotos.map((p, index) => ({
    ...p,
    ordre: index + 1,
  }))

  await query(
    `UPDATE property_pages
     SET photos_originales = $1::jsonb,
         updated_at = NOW()
     WHERE id = $2`,
    [JSON.stringify(reorderedPhotos), propertyId]
  )

  return NextResponse.json({ success: true })
}

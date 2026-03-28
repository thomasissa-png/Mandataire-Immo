/**
 * /dashboard/profile — Page de modification du profil
 * Rendu SSR : fetch direct via query() pour pré-remplir le formulaire.
 * Le composant client ProfileForm gère l'édition et les PATCH.
 */
import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { ProfileForm } from "@/components/dashboard/ProfileForm"
import { ProfileSectionNav } from "@/components/dashboard/ProfileSectionNav"

interface ClientRow {
  email: string
  first_name: string | null
  last_name: string | null
  client_context: Record<string, unknown> | null
}

export default async function ProfilePage() {
  const user = await getSessionUser()
  if (!user) {
    redirect("/login")
  }

  const { rows } = await query<ClientRow>(
    "SELECT email, first_name, last_name, client_context FROM clients WHERE email = $1",
    [user.email]
  )

  const client = rows[0] ?? null
  const ctx = (client?.client_context ?? {}) as Record<string, unknown>

  const profile = {
    prenom: (ctx.prenom as string) ?? client?.first_name ?? "",
    nom: (ctx.nom as string) ?? client?.last_name ?? "",
    telephone: (ctx.telephone as string) ?? "",
    ville: (ctx.ville as string) ?? "",
    quartiers: (ctx.quartiers as string) ?? "",
    departement: (ctx.departement as string) ?? "",
    reseau: (ctx.reseau as string) ?? "",
    specialites: (ctx.specialites as string) ?? "",
    type_biens: (ctx.type_biens as string) ?? "",
    gamme_prix: (ctx.gamme_prix as string) ?? "",
    cible_clients: (ctx.cible_clients as string) ?? "",
    ton_communication: (ctx.ton_communication as string) ?? "",
    ce_qui_te_differencie: (ctx.ce_qui_te_differencie as string) ?? "",
    valeurs: (ctx.valeurs as string) ?? "",
    linkedin_url: (ctx.linkedin_url as string) ?? "",
    instagram: (ctx.instagram as string) ?? "",
    facebook: (ctx.facebook as string) ?? "",
    site_web: (ctx.site_web as string) ?? "",
    bio_personnelle: (ctx.bio_personnelle as string) ?? "",
    photo_profil_key: (ctx.photo_profil_key as string) ?? "",
    confort_camera: (ctx.confort_camera as string) ?? "",
    experience_annees: (ctx.experience_annees as string) ?? "",
    nb_transactions_an: (ctx.nb_transactions_an as string) ?? "",
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <a
          href="/dashboard"
          className="text-body-sm text-neutral-500 hover:text-secondary-700 transition-colors duration-normal"
        >
          ← Retour au dashboard
        </a>
      </div>
      <h1 className="font-display text-h2 text-primary font-bold mb-2">
        Mon profil
      </h1>
      <p className="text-body text-neutral-500 mb-8">
        Modifie tes infos pour que tes contenus soient toujours dans le mille.
      </p>
      <ProfileSectionNav />
      <ProfileForm initialData={profile} />
    </div>
  )
}

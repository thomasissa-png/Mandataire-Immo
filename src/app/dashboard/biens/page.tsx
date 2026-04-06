import { redirect } from "next/navigation"
import { getSessionUser } from "@/lib/getSessionUser"
import { query } from "@/lib/db"
import { DashboardPageLayout } from "@/components/dashboard/DashboardPageLayout"
import { BienCard } from "@/components/biens/BienCard"
import type { PropertyPage } from "@/types/property"

export default async function MesBiensPage() {
  const user = await getSessionUser()
  if (!user) redirect("/sign-in")

  const { rows: biens } = await query<PropertyPage>(
    `SELECT id, client_id, client_email, titre, type_bien, adresse, prix, surface, pieces,
            points_forts, photos_originales, photos_staging,
            status, slug, published_at, created_at, updated_at
     FROM property_pages
     WHERE client_id = $1
     ORDER BY created_at DESC`,
    [user.id]
  )

  return (
    <DashboardPageLayout
      icon="🏡"
      title="Mes biens"
      description="Tes biens en vente. Clique sur un bien pour modifier ses photos et générer une annonce."
      count={biens.length}
    >
      {biens.length === 0 ? (
        <div className="rounded-lg bg-card border border-border p-8 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-full bg-secondary-50 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
            </svg>
          </div>
          <h2 className="font-display text-h3 text-primary mb-2">Aucun bien pour le moment</h2>
          <p className="text-body-sm text-neutral-500 mb-4">
            Ajoute ton premier bien pour recevoir des annonces personnalisées et une page publique.
          </p>
          <a
            href="/dashboard/biens/nouveau"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-secondary text-white font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Ajouter un bien
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {/* CTA ajouter en haut */}
          <div className="flex justify-end">
            <a
              href="/dashboard/biens/nouveau"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-secondary text-white font-display font-bold text-caption hover:bg-secondary-600 transition-all shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Ajouter un bien
            </a>
          </div>

          {/* Grille de biens */}
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
            {biens.map((bien) => (
              <BienCard key={bien.id} bien={bien} />
            ))}
          </div>
        </div>
      )}
    </DashboardPageLayout>
  )
}

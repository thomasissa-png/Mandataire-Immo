import type { DVFTransactionRow } from "@/types/property"

interface PropertyDVFProps {
  prix_m2_moyen: number
  transactions: DVFTransactionRow[]
}

/**
 * Affiche les donnees DVF (prix au m2, dernieres transactions).
 * Server Component — pas d'interactivite.
 */
export function PropertyDVF({ prix_m2_moyen, transactions }: PropertyDVFProps) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-h3 mb-4">Prix du quartier</h3>

      <div className="mb-6">
        <p className="text-caption text-neutral-500 uppercase">Prix moyen au m&sup2;</p>
        <p className="text-h1 text-primary">
          {prix_m2_moyen.toLocaleString("fr-FR")} &euro;/m&sup2;
        </p>
        <p className="text-small text-neutral-400">
          Source : Demandes de Valeurs Foncieres (DVF) — donnees publiques
        </p>
      </div>

      {transactions.length > 0 && (
        <div>
          <p className="text-caption text-neutral-500 uppercase mb-3">
            Dernieres transactions a proximite
          </p>
          <div className="space-y-2">
            {transactions.slice(0, 5).map((t, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
              >
                <div>
                  <p className="text-body-sm font-medium">{t.type || "Bien"}</p>
                  <p className="text-caption text-neutral-400">
                    {t.surface}m&sup2; &middot; {formatDate(t.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-body-sm font-medium">
                    {t.prix.toLocaleString("fr-FR")} &euro;
                  </p>
                  <p className="text-caption text-neutral-400">
                    {t.prix_m2.toLocaleString("fr-FR")} &euro;/m&sup2;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString("fr-FR", {
      month: "short",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

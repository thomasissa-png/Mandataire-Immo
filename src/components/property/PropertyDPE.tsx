interface PropertyDPEProps {
  classe: string
  ges_classe: string | null
  valeur_energie: number | null
  valeur_ges: number | null
}

/** Couleurs officielles DPE France */
const DPE_COLORS: Record<string, string> = {
  A: "#319834",
  B: "#33CC31",
  C: "#CBFC34",
  D: "#FBFE06",
  E: "#FBCC05",
  F: "#FC9935",
  G: "#FC1A20",
}

const DPE_LABELS: Record<string, string> = {
  A: "Excellent",
  B: "Tres bon",
  C: "Bon",
  D: "Moyen",
  E: "Mediocre",
  F: "Mauvais",
  G: "Tres mauvais",
}

/**
 * Affiche le Diagnostic de Performance Energetique (DPE).
 * Representation visuelle avec l'echelle A-G officielle.
 */
export function PropertyDPE({
  classe,
  ges_classe,
  valeur_energie,
  valeur_ges,
}: PropertyDPEProps) {
  const classes = ["A", "B", "C", "D", "E", "F", "G"]

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
      <h3 className="text-h3 mb-4">Performance energetique</h3>

      {/* Echelle DPE */}
      <div className="mb-6">
        <p className="text-caption text-neutral-500 uppercase mb-3">DPE — Consommation energetique</p>
        <div className="space-y-1">
          {classes.map((c) => {
            const isActive = c === classe.toUpperCase()
            const width = 30 + classes.indexOf(c) * 10 // 30% -> 90%
            return (
              <div key={c} className="flex items-center gap-2">
                <div
                  className={`h-7 rounded-r-md flex items-center px-2 text-small font-bold transition-all ${
                    isActive ? "ring-2 ring-primary ring-offset-1" : ""
                  }`}
                  style={{
                    width: `${width}%`,
                    backgroundColor: DPE_COLORS[c] || "#ccc",
                    color: ["A", "B", "F", "G"].includes(c) ? "white" : "#1B2A4A",
                  }}
                >
                  {c}
                  {isActive && valeur_energie !== null && (
                    <span className="ml-auto text-caption">
                      {Math.round(valeur_energie)} kWh/m&sup2;/an
                    </span>
                  )}
                </div>
                {isActive && (
                  <span className="text-caption font-medium text-primary">
                    {DPE_LABELS[c] || ""}
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* GES */}
      {ges_classe && (
        <div>
          <p className="text-caption text-neutral-500 uppercase mb-2">
            GES — Emissions de gaz a effet de serre
          </p>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center text-h3 font-bold text-white"
              style={{
                backgroundColor: DPE_COLORS[ges_classe.toUpperCase()] || "#ccc",
              }}
            >
              {ges_classe.toUpperCase()}
            </div>
            <div>
              <p className="text-body-sm font-medium">
                {DPE_LABELS[ges_classe.toUpperCase()] || ""}
              </p>
              {valeur_ges !== null && (
                <p className="text-caption text-neutral-400">
                  {Math.round(valeur_ges)} kgCO&sub2;/m&sup2;/an
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <p className="text-caption text-neutral-400 mt-4">
        Source : ADEME — Observatoire DPE
      </p>
    </div>
  )
}

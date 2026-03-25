"use client"

import { useState } from "react"

interface TriggerProductionButtonProps {
  clientId: string
  clientPack: string | null
}

export function TriggerProductionButton({
  clientId,
  clientPack,
}: TriggerProductionButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    status: "success" | "error"
    message: string
  } | null>(null)
  const [mois, setMois] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  })

  const handleTrigger = async (
    packType: "mensuel" | "lancement" | "boost"
  ) => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/admin/trigger-production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_id: clientId,
          pack_type: packType,
          mois: packType === "mensuel" ? mois : undefined,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          status: "success",
          message: `Production terminee : ${data.count || 0} livrables generes.`,
        })
      } else {
        setResult({
          status: "error",
          message: data.error || "Erreur lors de la production",
        })
      }
    } catch (err) {
      setResult({
        status: "error",
        message: err instanceof Error ? err.message : "Erreur reseau",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Mois selector for mensuel */}
      <div className="flex items-center gap-3 mb-4">
        <label
          htmlFor="mois"
          className="text-body-sm text-neutral-600 font-medium"
        >
          Mois cible :
        </label>
        <input
          id="mois"
          type="month"
          value={mois}
          onChange={(e) => setMois(e.target.value)}
          className="h-10 px-3 rounded-md border border-neutral-300 bg-white text-body-sm text-foreground"
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleTrigger("mensuel")}
          disabled={isLoading}
          className="h-10 px-5 rounded-full bg-secondary text-white font-display font-semibold text-body-sm shadow-sm hover:bg-secondary-600 active:scale-[0.97] transition-all duration-normal disabled:opacity-60 disabled:cursor-wait"
        >
          {isLoading ? "Generation..." : "Lancer Pack Mensuel"}
        </button>

        <button
          type="button"
          onClick={() => handleTrigger("lancement")}
          disabled={isLoading}
          className="h-10 px-5 rounded-full bg-primary text-white font-display font-semibold text-body-sm shadow-sm hover:bg-primary-600 active:scale-[0.97] transition-all duration-normal disabled:opacity-60 disabled:cursor-wait"
        >
          {isLoading ? "Generation..." : "Lancer Pack Lancement"}
        </button>
      </div>

      {/* Pack info */}
      {clientPack && (
        <p className="text-caption text-neutral-500 mt-2">
          Pack actif : <span className="font-semibold capitalize">{clientPack}</span>
        </p>
      )}

      {/* Result feedback */}
      {result && (
        <div
          className={`mt-4 p-3 rounded-lg text-body-sm ${
            result.status === "success"
              ? "bg-success-50 text-success-800"
              : "bg-error-50 text-error-700"
          }`}
        >
          {result.message}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 p-3 rounded-lg bg-info-50 text-info-700 text-body-sm">
          Generation en cours... Cela peut prendre plusieurs minutes (appels Claude API sequentiels).
        </div>
      )}
    </div>
  )
}

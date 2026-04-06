"use client"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="rounded-xl bg-card border border-border p-10 text-center max-w-lg mx-auto mt-12">
      <div className="w-16 h-16 rounded-full bg-error-50 flex items-center justify-center mx-auto mb-6">
        <span className="text-error-600 text-3xl" aria-hidden="true">⚠️</span>
      </div>
      <h2 className="font-display text-h2 text-primary mb-3">
        Oups, quelque chose a planté
      </h2>
      <p className="text-body text-neutral-600 mb-2">
        {error.message || "Une erreur inattendue est survenue."}
      </p>
      {error.digest && (
        <p className="text-caption text-neutral-400 mb-4">
          Réf : {error.digest}
        </p>
      )}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-secondary text-white font-display font-bold text-body-sm shadow-sm hover:bg-secondary-600 transition-all"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center h-11 px-6 rounded-full border-2 border-primary text-primary font-display font-bold text-body-sm hover:bg-primary hover:text-white transition-all"
        >
          Retour à l{"'"}accueil
        </a>
      </div>
    </div>
  )
}

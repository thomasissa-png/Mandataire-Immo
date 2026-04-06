"use client"

/**
 * Bouton "Télécharger en PDF" — utilise window.print() avec le mode
 * "Enregistrer en PDF" du navigateur. Le rendu est fidèle à la page
 * grâce aux styles @media print dans globals.css.
 */
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-full border-2 border-white/30 text-white text-body-sm font-semibold hover:bg-white/10 transition-all"
      aria-label="Télécharger en PDF"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
      Télécharger en PDF
    </button>
  )
}

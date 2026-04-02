"use client"

import { useRef } from "react"

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

/**
 * Accordéon FAQ basé sur <details>/<summary> HTML natifs.
 *
 * Avantages SEO :
 * - Contenu visible dans le HTML initial (SSR) — pas besoin de JS pour accéder
 *   aux réponses. Bing et les crawlers à rendu JS limité indexent toutes les réponses.
 * - Le premier item est ouvert par défaut (attribut `open`) — signal fort pour Google.
 * - L'animation CSS douce (max-height + opacity) reste gérée côté client
 *   sans cacher le contenu au niveau HTML.
 *
 * Comportement :
 * - Ferme les autres items quand on en ouvre un (accordion classique).
 * - Sans JS : <details> fonctionne nativement, tous les items sont cliquables.
 */
function FAQAccordionItem({
  question,
  answer,
  defaultOpen,
  index,
  onOpen,
}: {
  question: string
  answer: string
  defaultOpen: boolean
  index: number
  onOpen: (ref: HTMLDetailsElement) => void
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const panelId = `faq-page-panel-${index}`

  function handleToggle() {
    const el = detailsRef.current
    if (!el) return
    // Si on vient d'ouvrir cet item, fermer les autres via le callback parent
    if (el.open) {
      onOpen(el)
    }
  }

  return (
    <details
      ref={detailsRef}
      open={defaultOpen}
      onToggle={handleToggle}
      className="group rounded-xl bg-card border border-border overflow-hidden"
    >
      <summary
        id={`faq-page-heading-${index}`}
        aria-controls={panelId}
        className="flex items-center justify-between w-full text-left px-6 py-5 desktop:px-8 desktop:py-6 cursor-pointer hover:bg-neutral-50 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 list-none"
      >
        <span className="font-display text-h4 font-bold text-primary-800 pr-4">
          {question}
        </span>
        {/* Chevron — rotate quand l'item est ouvert (group-open = details[open]) */}
        <svg
          className="w-5 h-5 flex-shrink-0 transition-transform duration-300 group-open:rotate-180 group-open:text-secondary text-neutral-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>

      <div
        id={panelId}
        role="region"
        aria-labelledby={`faq-page-heading-${index}`}
        className="px-6 pb-6 desktop:px-8 desktop:pb-8"
      >
        <p className="text-body text-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </details>
  )
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  // Référence vers tous les <details> pour pouvoir fermer les autres
  const allDetailsRefs = useRef<Map<number, HTMLDetailsElement>>(new Map())

  function handleOpen(openedEl: HTMLDetailsElement) {
    // Fermer tous les autres items
    allDetailsRefs.current.forEach((el) => {
      if (el !== openedEl && el.open) {
        el.open = false
      }
    })
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <FAQAccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          defaultOpen={index === 0}
          index={index}
          onOpen={(el) => {
            allDetailsRefs.current.set(index, el)
            handleOpen(el)
          }}
        />
      ))}
    </div>
  )
}

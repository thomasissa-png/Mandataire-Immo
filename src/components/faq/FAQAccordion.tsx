"use client"

import { useState } from "react"

interface FAQItem {
  question: string
  answer: string
}

interface FAQAccordionProps {
  items: FAQItem[]
}

function FAQAccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  index,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
  index: number
}) {
  const panelId = `faq-page-panel-${index}`
  const headingId = `faq-page-heading-${index}`

  return (
    <section className="rounded-xl bg-card border border-border overflow-hidden transition-all duration-slow">
      <h2>
        <button
          type="button"
          id={headingId}
          onClick={onToggle}
          className="flex items-center justify-between w-full text-left px-6 py-5 desktop:px-8 desktop:py-6 hover:bg-neutral-50 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className="font-display text-h4 font-bold text-primary-800 pr-4">
            {question}
          </span>
          <svg
            className={`w-5 h-5 flex-shrink-0 transition-transform duration-slow ${
              isOpen ? "rotate-180 text-secondary" : "text-neutral-400"
            }`}
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
        </button>
      </h2>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headingId}
        className={`overflow-hidden transition-all duration-slow ${
          isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6 desktop:px-8 desktop:pb-8">
          <p className="text-body text-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </section>
  )
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <FAQAccordionItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          index={index}
          onToggle={() =>
            setOpenIndex(openIndex === index ? -1 : index)
          }
        />
      ))}
    </div>
  )
}

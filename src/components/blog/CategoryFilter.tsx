"use client"

import { useState, useCallback } from "react"

interface CategoryFilterProps {
  categories: string[]
  onFilter: (category: string | null) => void
}

export function CategoryFilter({ categories, onFilter }: CategoryFilterProps) {
  const [active, setActive] = useState<string | null>(null)

  const handleClick = useCallback(
    (cat: string | null) => {
      setActive(cat)
      onFilter(cat)
    },
    [onFilter]
  )

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide" role="tablist" aria-label="Filtrer par catégorie">
      <button
        role="tab"
        aria-selected={active === null}
        onClick={() => handleClick(null)}
        className={`whitespace-nowrap px-4 py-2 min-h-[44px] rounded-full text-body-sm font-medium transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
          active === null
            ? "bg-primary text-white"
            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
        }`}
      >
        Tous
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          role="tab"
          aria-selected={active === cat}
          onClick={() => handleClick(cat)}
          className={`whitespace-nowrap px-4 py-2 min-h-[44px] rounded-full text-body-sm font-medium transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
            active === cat
              ? "bg-primary text-white"
              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

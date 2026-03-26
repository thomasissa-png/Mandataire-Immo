"use client"

import { useState, useRef, useEffect } from "react"
import { signOut, useSession } from "next-auth/react"

/**
 * Composant de menu utilisateur.
 * Avatar avec initiales + dropdown de d&eacute;connexion.
 */
export function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Keyboard: Escape closes menu
  useEffect(() => {
    if (!isOpen) return
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen])

  const userName = session?.user?.name || ""
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?"

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full bg-secondary text-primary font-display font-bold text-body-sm flex items-center justify-center hover:bg-secondary-600 hover:text-white transition-colors duration-normal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
        aria-label="Menu utilisateur"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {initials}
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl bg-white border border-border shadow-lg py-1 z-50"
          role="menu"
          aria-label="Options du compte"
        >
          <div className="px-4 py-3 border-b border-border">
            <p className="text-body-sm font-semibold text-foreground truncate">
              {userName || "Utilisateur"}
            </p>
            <p className="text-caption text-neutral-500 truncate">
              {session?.user?.email || ""}
            </p>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full text-left px-4 py-3 text-body-sm text-foreground hover:bg-neutral-50 transition-colors duration-fast"
          >
            Se d&eacute;connecter
          </button>
        </div>
      )}
    </div>
  )
}

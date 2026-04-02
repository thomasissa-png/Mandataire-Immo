"use client"

import { useState, useCallback } from "react"

type FeedbackType = "amelioration" | "bug" | "question" | "autre"

const TYPES: { value: FeedbackType; label: string; icon: string }[] = [
  { value: "amelioration", label: "Suggestion d'amélioration", icon: "💡" },
  { value: "bug", label: "Problème ou bug", icon: "🐛" },
  { value: "question", label: "Question sur mes contenus", icon: "❓" },
  { value: "autre", label: "Autre", icon: "💬" },
]

export function SupportSection() {
  const [type, setType] = useState<FeedbackType>("amelioration")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!message.trim() || sending) return
    setSending(true)
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message }),
      })
      setSent(true)
      setMessage("")
      setTimeout(() => setSent(false), 5000)
    } catch {
      // Erreur réseau — message explicite, pas de redirection silencieuse
      setSent(false)
      alert("L'envoi a échoué. Tu peux nous écrire directement à contact@immocrew.fr")
    } finally {
      setSending(false)
    }
  }, [type, message, sending])

  return (
    <div className="rounded-lg bg-card border border-border p-5">
      <div className="mb-3">
        <h2 className="font-display text-h4 text-primary">Un retour ? Une idée ?</h2>
      </div>
      <p className="text-body-sm text-neutral-500 mb-4">
        On lit chaque message. Ton retour nous aide à améliorer le service.
      </p>

      {sent ? (
        <div className="rounded-lg bg-success-50 border border-success-200 p-4 text-center">
          <p className="text-body-sm font-semibold text-success-700">
            Merci pour ton retour ! On te répond sous 24h.
          </p>
        </div>
      ) : (
        <>
          {/* Type de feedback */}
          <div className="flex flex-wrap gap-2 mb-3">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-medium transition-all ${
                  type === t.value
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                }`}
              >
                <span aria-hidden="true">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Message */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Décris le problème ou ton idée en quelques mots..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg border border-border bg-background text-body-sm text-foreground placeholder:text-neutral-400 resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50 mb-3"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!message.trim() || sending}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-secondary text-white font-display font-bold text-body-sm hover:bg-secondary-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Envoi..." : "Envoyer"}
          </button>
        </>
      )}
    </div>
  )
}

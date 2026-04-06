"use client"

import { useState, useEffect, useCallback } from "react"
import { track } from "@/lib/tracking"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReferralStats {
  total_referrals: number
  converted: number
  pending: number
  credit_months_remaining: number
}

interface ReferralEntry {
  id: string
  referee_email: string
  status: "pending" | "converted" | "expired"
  converted_at: string | null
  created_at: string
}

interface MyCodeResponse {
  code: string
  stats: ReferralStats
}

interface ReferralListResponse {
  referrals: ReferralEntry[]
}

type LoadingState = "loading" | "error" | "empty" | "default" | "success"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const APP_URL = "https://immocrew.fr"

function maskEmail(email: string): string {
  const [local, domain] = email.split("@")
  if (!local || !domain) return email
  return `${local[0]}${"*".repeat(Math.max(local.length - 1, 1))}@${domain}`
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function CopyButton({ text, label, type }: { text: string; label: string; type: "code" | "link" }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      track("referral_code_copied", { type })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      track("referral_code_copied", { type })
      setTimeout(() => setCopied(false), 2000)
    }
  }, [text, type])

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-caption font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2 ${
        copied
          ? "bg-success-100 text-success-700"
          : "bg-primary-100 text-primary-700 hover:bg-primary-200"
      }`}
      aria-label={copied ? "Copié" : label}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copié !
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
          </svg>
          {label}
        </>
      )}
    </button>
  )
}

function StatusBadge({ status }: { status: "pending" | "converted" | "expired" }) {
  const config = {
    pending: {
      label: "En attente",
      className: "bg-warning-100 text-warning-800",
    },
    converted: {
      label: "Converti",
      className: "bg-success-100 text-success-800",
    },
    expired: {
      label: "Expiré",
      className: "bg-neutral-100 text-neutral-500",
    },
  }

  const { label, className } = config[status]

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-caption font-semibold ${className}`}>
      {label}
    </span>
  )
}

function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      {/* Header skeleton */}
      <div className="rounded-t-lg bg-gradient-to-r from-primary to-primary-700 p-5">
        <div className="h-5 w-64 bg-primary-400 rounded" />
        <div className="h-4 w-48 bg-primary-400 rounded mt-2" />
      </div>
      {/* Body skeleton */}
      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-52 bg-neutral-200 rounded-lg" />
          <div className="h-8 w-16 bg-neutral-200 rounded-lg" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-8 w-72 bg-neutral-200 rounded-lg" />
          <div className="h-8 w-24 bg-neutral-200 rounded-lg" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-neutral-200 rounded" />
          <div className="h-4 w-24 bg-neutral-200 rounded" />
          <div className="h-4 w-32 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function ReferralSection() {
  const [state, setState] = useState<LoadingState>("loading")
  const [code, setCode] = useState("")
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [referrals, setReferrals] = useState<ReferralEntry[]>([])

  const fetchData = useCallback(async () => {
    setState("loading")

    try {
      const [codeRes, listRes] = await Promise.all([
        fetch("/api/referral/my-code", { credentials: "include" }),
        fetch("/api/referral/list", { credentials: "include" }),
      ])

      if (!codeRes.ok || !listRes.ok) {
        setState("error")
        return
      }

      const codeData: MyCodeResponse = await codeRes.json()
      const listData: ReferralListResponse = await listRes.json()

      setCode(codeData.code)
      setStats(codeData.stats)
      setReferrals(listData.referrals)

      // Check if there's a recent conversion (within 7 days) for success state
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      const hasRecentConversion = listData.referrals.some(
        (r) => r.status === "converted" && r.converted_at && new Date(r.converted_at).getTime() > sevenDaysAgo
      )

      if (listData.referrals.length === 0) {
        setState("empty")
      } else if (hasRecentConversion) {
        setState("success")
      } else {
        setState("default")
      }
    } catch {
      setState("error")
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ========================================================================
  // LOADING STATE
  // ========================================================================
  if (state === "loading") {
    return (
      <div className="rounded-lg bg-card border border-border overflow-hidden">
        <SkeletonLoader />
      </div>
    )
  }

  // ========================================================================
  // ERROR STATE
  // ========================================================================
  if (state === "error") {
    return (
      <div className="rounded-lg bg-card border border-border overflow-hidden">
        <div className="rounded-t-lg bg-gradient-to-r from-primary to-primary-700 p-5">
          <h2 className="font-display text-h4 text-white">Parraine tes collègues mandataires</h2>
        </div>
        <div className="p-5 text-center">
          <div className="w-12 h-12 rounded-full bg-error-50 flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-body-sm text-neutral-600 mb-3">
            Impossible de charger tes parrainages. Réessaie dans quelques instants.
          </p>
          <button
            type="button"
            onClick={fetchData}
            className="px-4 py-2 rounded-lg bg-primary text-white text-caption font-semibold hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  // ========================================================================
  // DEFAULT / EMPTY / SUCCESS STATES
  // ========================================================================
  const referralLink = `${APP_URL}/rejoindre?ref=${code}`

  return (
    <div className="rounded-lg bg-card border border-border overflow-hidden">
      {/* ── Gradient header ── */}
      <div className="rounded-t-lg bg-gradient-to-r from-primary to-primary-700 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
          </div>
          <div>
            <h2 className="font-display text-h4 text-white">Parraine tes collègues mandataires</h2>
            <p className="text-body-sm text-primary-200">Gagne 1 mois gratuit par filleul abonné — ton filleul reçoit 1 semaine offerte</p>
          </div>
        </div>
      </div>

      {/* ── Content body ── */}
      <div className="p-5 space-y-5">

        {/* Success badge — visible for 7 days after conversion */}
        {state === "success" && stats && stats.credit_months_remaining > 0 && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-success-50 border border-success-200">
            <span className="relative flex h-3 w-3" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500" />
            </span>
            <p className="text-body-sm font-semibold text-success-800">
              {stats.credit_months_remaining} mois gratuit{stats.credit_months_remaining > 1 ? "s" : ""} crédité{stats.credit_months_remaining > 1 ? "s" : ""} !
            </p>
          </div>
        )}

        {/* Code display */}
        <div>
          <p className="text-caption text-neutral-500 mb-2">Ton code parrainage</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-primary-50 border border-primary-200 font-display text-h4 text-primary tracking-wide select-all">
              {code}
            </span>
            <CopyButton text={code} label="Copier" type="code" />
          </div>
        </div>

        {/* Link display */}
        <div>
          <p className="text-caption text-neutral-500 mb-2">Lien direct à partager</p>
          <div className="flex flex-col tablet:flex-row tablet:items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-caption text-neutral-600 truncate max-w-full select-all">
              {referralLink}
            </span>
            <CopyButton text={referralLink} label="Copier le lien" type="link" />
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="flex flex-wrap gap-4 text-body-sm">
            <span className="text-neutral-500">
              <span className="font-semibold text-warning-700">{stats.pending}</span> en attente
            </span>
            <span className="text-neutral-500">
              <span className="font-semibold text-success-700">{stats.converted}</span> converti{stats.converted > 1 ? "s" : ""}
            </span>
            <span className="text-neutral-500">
              <span className="font-semibold text-primary-700">{stats.credit_months_remaining}</span> mois crédité{stats.credit_months_remaining > 1 ? "s" : ""}
            </span>
          </div>
        )}

        {/* Empty state message */}
        {state === "empty" && (
          <div className="rounded-lg bg-neutral-50 border border-neutral-200 p-4 text-center">
            <p className="text-body-sm text-neutral-600 mb-1">
              Tu n{"'"}as pas encore parrainé de collègue.
            </p>
            <p className="text-caption text-neutral-400">
              Partage ton code ou ton lien par DM LinkedIn, WhatsApp ou dans un groupe Facebook.
            </p>
          </div>
        )}

        {/* Referrals list */}
        {referrals.length > 0 && (
          <div>
            <p className="text-caption text-neutral-500 mb-2">Tes parrainages</p>
            <div className="rounded-lg border border-neutral-200 divide-y divide-neutral-100">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-body-sm text-neutral-700 truncate">
                    {maskEmail(referral.referee_email)}
                  </span>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={referral.status} />
                    <span className="text-caption text-neutral-400 hidden tablet:inline">
                      {formatDate(referral.converted_at || referral.created_at)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sharing tips */}
        <div className="rounded-lg bg-secondary-50/50 border border-secondary/10 p-3">
          <p className="text-caption text-secondary-700">
            <span className="font-semibold">Astuce :</span> un DM LinkedIn personnalisé convertit bien mieux qu{"'"}un post public ou un email générique.
          </p>
        </div>
      </div>
    </div>
  )
}

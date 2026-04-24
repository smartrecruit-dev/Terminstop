"use client"

import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"

export type LockReason = "trial_expired" | "trial_limit" | "paused" | "payment" | "cancelled" | null

export interface AccessState {
  locked: boolean
  reason: LockReason
  loading: boolean
}

/**
 * Checks whether this company account is locked.
 *
 * Lock conditions:
 *  1. paused = true  (admin, payment failed, or cancelled)
 *  2. plan = "trial" AND created_at > 14 days ago
 *  3. plan = "trial" AND sms_count_month >= sms_limit  (SMS limit during trial)
 *
 * Usage:
 *   const { locked, loading } = useAccessGuard(companyId)
 *   if (locked) → redirect or show read-only
 *
 * The hook redirects automatically for most pages.
 * Pass redirectOnLock=false for the calendar (read-only instead of redirect).
 */
export function useAccessGuard(
  companyId: string | null,
  redirectOnLock = true
): AccessState {
  const [state, setState] = useState<AccessState>({ locked: false, reason: null, loading: true })

  useEffect(() => {
    if (!companyId) return

    supabase
      .from("companies")
      .select("paused, plan, created_at, sms_count_month, sms_limit")
      .eq("id", companyId)
      .single()
      .then(({ data: co }) => {
        if (!co) { setState({ locked: false, reason: null, loading: false }); return }

        const plan = co.plan || "trial"
        let reason: LockReason = null

        // 1. Paused by admin / payment / cancellation
        if (co.paused) {
          reason = plan === "cancelled" ? "cancelled"
                 : plan === "trial"     ? "trial_expired"
                 : "payment"
        }

        // 2. Trial expired (14 days)
        if (!reason && plan === "trial" && co.created_at) {
          const expired = Date.now() - new Date(co.created_at).getTime() > 14 * 24 * 60 * 60 * 1000
          if (expired) reason = "trial_expired"
        }

        // 3. Trial SMS limit reached
        if (!reason && plan === "trial") {
          const used  = co.sms_count_month ?? 0
          const limit = co.sms_limit ?? 50
          if (used >= limit) reason = "trial_limit"
        }

        const locked = reason !== null

        if (locked && redirectOnLock) {
          const urlReason =
            reason === "payment"    ? "payment"   :
            reason === "cancelled"  ? "cancelled" : "trial"
          window.location.href = `/blocked?reason=${urlReason}&plan=${plan}`
          return
        }

        setState({ locked, reason, loading: false })
      })
  }, [companyId, redirectOnLock])

  return state
}

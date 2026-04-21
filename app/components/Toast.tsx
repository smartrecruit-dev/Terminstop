"use client"

import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react"

// ── Types ─────────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastContextValue {
  toast: (opts: Omit<Toast, "id">) => void
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
}

// ── Context ───────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const ICONS: Record<ToastType, string> = {
  success: "✓",
  error:   "✕",
  info:    "i",
  warning: "!",
}

const COLORS: Record<ToastType, { bg: string; border: string; icon: string; iconBg: string }> = {
  success: { bg: "#fff",     border: "#D1FAE5", icon: "#059669", iconBg: "#ECFDF5" },
  error:   { bg: "#fff",     border: "#FEE2E2", icon: "#DC2626", iconBg: "#FEF2F2" },
  info:    { bg: "#fff",     border: "#DBEAFE", icon: "#2563EB", iconBg: "#EFF6FF" },
  warning: { bg: "#fff",     border: "#FEF3C7", icon: "#D97706", iconBg: "#FFFBEB" },
}

// ── Single Toast Item ─────────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const c = COLORS[toast.type]

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, toast.duration ?? 4000)
    return () => clearTimeout(t)
  }, [])

  function dismiss() {
    setLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  return (
    <div
      onClick={dismiss}
      style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 14,
        padding: "14px 16px",
        boxShadow: "0 8px 32px -8px rgba(15,27,45,0.18), 0 2px 8px -2px rgba(15,27,45,0.08)",
        cursor: "pointer",
        maxWidth: 360,
        width: "100%",
        transform: visible && !leaving ? "translateY(0) scale(1)" : "translateY(12px) scale(0.97)",
        opacity: visible && !leaving ? 1 : 0,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
      }}
    >
      {/* Icon */}
      <div style={{
        width: 28, height: 28, borderRadius: 8, background: c.iconBg,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, fontWeight: 900, color: c.icon, flexShrink: 0, marginTop: 1,
      }}>
        {ICONS[toast.type]}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0F1B2D", lineHeight: 1.3 }}>
          {toast.title}
        </div>
        {toast.message && (
          <div style={{ fontSize: 13, color: "#5B6779", marginTop: 3, lineHeight: 1.4 }}>
            {toast.message}
          </div>
        )}
      </div>

      {/* Close */}
      <div style={{ color: "#9CA3AF", fontSize: 16, fontWeight: 400, flexShrink: 0, lineHeight: 1 }}>×</div>
    </div>
  )
}

// ── Provider ──────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((opts: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev.slice(-4), { ...opts, id }]) // max 5 visible
  }, [])

  const value: ToastContextValue = {
    toast:   add,
    success: (title, message) => add({ type: "success", title, message }),
    error:   (title, message) => add({ type: "error",   title, message }),
    info:    (title, message) => add({ type: "info",    title, message }),
    warning: (title, message) => add({ type: "warning", title, message }),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast container */}
      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9999,
        display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-end",
        pointerEvents: "none",
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

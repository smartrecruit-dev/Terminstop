// Centralized security utilities for TerminStop

/** Simple in-memory sliding window rate limiter */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const map = new Map<string, { count: number; resetAt: number }>()

  // Cleanup old entries every 5 minutes
  setInterval(() => {
    const now = Date.now()
    for (const [key, val] of map.entries()) {
      if (now > val.resetAt) map.delete(key)
    }
  }, 5 * 60_000)

  return function isLimited(key: string): boolean {
    const now = Date.now()
    const entry = map.get(key)
    if (!entry || now > entry.resetAt) {
      map.set(key, { count: 1, resetAt: now + windowMs })
      return false
    }
    if (entry.count >= maxRequests) return true
    entry.count++
    return false
  }
}

/** Sanitize a string: trim + max length */
export function sanitize(val: unknown, maxLen = 200): string {
  if (typeof val !== "string") return ""
  return val.trim().slice(0, maxLen)
}

/** Validate email format */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)
}

/** Validate German/international phone numbers */
export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-().+]/g, "")
  return /^\d{7,15}$/.test(cleaned)
}

/** Format phone to international format */
export function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("0")) cleaned = "+49" + cleaned.substring(1)
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned
  return cleaned
}

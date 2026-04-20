import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Basis-Sicherheitsheader
  res.headers.set("X-Frame-Options", "DENY")
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
  res.headers.set("X-XSS-Protection", "1; mode=block")

  // HSTS: HTTPS für 1 Jahr erzwingen (nur in Produktion aktiv)
  res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

  // Content-Security-Policy: Inline-Scripts erlaubt (Next.js benötigt es),
  // aber externe Scripts nur von bekannten Quellen
  res.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      "connect-src 'self' https://*.supabase.co https://gateway.seven.io",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ")
  )

  return res
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] }

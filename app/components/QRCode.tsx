"use client"

import { useState } from "react"

interface QRCodeProps {
  url: string
  size?: number
  label?: string
}

export default function QRCode({ url, size = 180, label }: QRCodeProps) {
  const [copied, setCopied] = useState(false)
  const [downloaded, setDownloaded] = useState(false)

  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=${size * 2}x${size * 2}&data=${encodeURIComponent(url)}&margin=8&color=1F2A37&bgcolor=FFFFFF`

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  async function downloadQR() {
    try {
      const res = await fetch(qrSrc)
      const blob = await res.blob()
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = "buchungslink-qr.png"
      a.click()
      setDownloaded(true)
      setTimeout(() => setDownloaded(false), 2000)
    } catch {
      window.open(qrSrc, "_blank")
    }
  }

  const G = "#18A66D"
  const GL = "#F0FBF6"
  const GB = "#D1F5E3"

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderRadius: 16,
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 16,
      maxWidth: 280,
    }}>
      {/* QR Code */}
      <div style={{
        background: "#fff",
        border: "2px solid #E5E7EB",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <img
          src={qrSrc}
          alt="QR-Code Buchungslink"
          width={size}
          height={size}
          style={{ display: "block", borderRadius: 4 }}
        />
      </div>

      {/* Label */}
      {label && (
        <p style={{ fontSize: 12, color: "#6B7280", textAlign: "center", margin: 0, lineHeight: 1.5 }}>
          {label}
        </p>
      )}

      {/* URL Preview */}
      <div style={{
        background: "#F9FAFB",
        border: "1px solid #E5E7EB",
        borderRadius: 10,
        padding: "8px 12px",
        width: "100%",
        boxSizing: "border-box",
      }}>
        <p style={{ fontSize: 11, color: "#6B7280", margin: "0 0 2px", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.4 }}>Dein Link</p>
        <p style={{ fontSize: 12, color: "#111827", margin: 0, wordBreak: "break-all", fontWeight: 500 }}>{url}</p>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, width: "100%" }}>
        <button
          onClick={copyLink}
          style={{
            flex: 1, padding: "9px 0",
            background: copied ? GL : "#F9FAFB",
            border: `1px solid ${copied ? GB : "#E5E7EB"}`,
            borderRadius: 10, fontSize: 12, fontWeight: 700,
            color: copied ? G : "#6B7280",
            cursor: "pointer", transition: "all .15s",
          }}>
          {copied ? "✓ Kopiert!" : "🔗 Link kopieren"}
        </button>
        <button
          onClick={downloadQR}
          style={{
            flex: 1, padding: "9px 0",
            background: downloaded ? GL : G,
            border: `1px solid ${downloaded ? GB : G}`,
            borderRadius: 10, fontSize: 12, fontWeight: 700,
            color: downloaded ? G : "#fff",
            cursor: "pointer", transition: "all .15s",
          }}>
          {downloaded ? "✓ Gespeichert!" : "⬇ QR laden"}
        </button>
      </div>
    </div>
  )
}

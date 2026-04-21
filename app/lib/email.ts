// TerminStop Email System via Resend
// Docs: https://resend.com/docs

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = "TerminStop <hallo@terminstop.de>"

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email")
    return
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error("[email] Resend error:", err)
  }
}

// ── Email Templates ───────────────────────────────────────────────────────────

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TerminStop</title>
</head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

        <!-- Logo -->
        <tr><td style="padding-bottom:32px;text-align:center;">
          <a href="https://terminstop.de" style="text-decoration:none;font-size:22px;font-weight:900;color:#0F1B2D;">
            Termin<span style="color:#18A66D;">Stop</span>
          </a>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#ffffff;border-radius:20px;padding:40px 40px;box-shadow:0 4px 24px rgba(15,27,45,0.08);border:1px solid #E8ECF1;">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:28px 0 0;text-align:center;">
          <p style="font-size:12px;color:#9CA3AF;margin:0;line-height:1.7;">
            © ${new Date().getFullYear()} TerminStop ·
            <a href="https://terminstop.de/impressum" style="color:#9CA3AF;">Impressum</a> ·
            <a href="https://terminstop.de/datenschutz" style="color:#9CA3AF;">Datenschutz</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Welcome Email ─────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, companyName: string) {
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h1 style="font-size:24px;font-weight:900;color:#0F1B2D;margin:0 0 10px;">Willkommen bei TerminStop!</h1>
      <p style="font-size:15px;color:#5B6779;line-height:1.6;margin:0;">
        Hallo ${companyName},<br>dein Konto ist eingerichtet und bereit. Dein 14-tägiger Testzeitraum läuft.
      </p>
    </div>

    <div style="background:#F0FBF6;border:1px solid #D1F5E3;border-radius:14px;padding:20px 20px;margin-bottom:28px;">
      <p style="font-size:13px;font-weight:700;color:#0A6B43;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Deine nächsten Schritte</p>
      ${[
        ["📅", "Ersten Termin eintragen", "Trage deinen ersten Kunden ein"],
        ["🔗", "Buchungsseite aktivieren", "Teile deinen Link mit Kunden"],
        ["📱", "SMS testen", "Schick dir selbst eine Test-SMS"],
      ].map(([icon, title, desc]) => `
        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:10px;">
          <span style="font-size:18px;flex-shrink:0;">${icon}</span>
          <div>
            <div style="font-size:14px;font-weight:700;color:#0F1B2D;">${title}</div>
            <div style="font-size:13px;color:#5B6779;">${desc}</div>
          </div>
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;">
      <a href="https://terminstop.de/dashboard" style="display:inline-block;background:linear-gradient(135deg,#18A66D,#0F8A57);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;box-shadow:0 4px 16px rgba(10,107,67,0.3);">
        Zum Dashboard →
      </a>
    </div>
  `)
  await sendEmail(to, "Willkommen bei TerminStop! 🎉", html)
}

// ── Payment Confirmation Email ────────────────────────────────────────────────
export async function sendPaymentConfirmationEmail(to: string, companyName: string, plan: string) {
  const planNames: Record<string, string> = { starter: "Starter", pro: "Pro", business: "Business" }
  const planPrices: Record<string, string> = { starter: "39 €", pro: "109 €", business: "229 €" }
  const planName = planNames[plan] || plan
  const planPrice = planPrices[plan] || ""

  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;margin-bottom:12px;">✅</div>
      <h1 style="font-size:24px;font-weight:900;color:#0F1B2D;margin:0 0 10px;">Zahlung bestätigt!</h1>
      <p style="font-size:15px;color:#5B6779;line-height:1.6;margin:0;">
        Danke, ${companyName}! Dein <strong>${planName}-Paket</strong> ist jetzt aktiv.
      </p>
    </div>

    <div style="background:#F9FAFB;border:1px solid #E8ECF1;border-radius:14px;padding:20px 20px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#5B6779;padding:6px 0;">Paket</td>
          <td style="font-size:14px;font-weight:700;color:#0F1B2D;text-align:right;padding:6px 0;">${planName}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#5B6779;padding:6px 0;">Preis</td>
          <td style="font-size:14px;font-weight:700;color:#0F1B2D;text-align:right;padding:6px 0;">${planPrice} / Monat</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#5B6779;padding:6px 0;">Status</td>
          <td style="text-align:right;padding:6px 0;"><span style="background:#D1FAE5;color:#059669;font-size:12px;font-weight:700;padding:3px 10px;border-radius:980px;">Aktiv</span></td>
        </tr>
      </table>
    </div>

    <p style="font-size:13px;color:#5B6779;text-align:center;line-height:1.6;margin:0 0 24px;">
      Du kannst dein Abo jederzeit über die Einstellungen verwalten oder kündigen.
    </p>

    <div style="text-align:center;">
      <a href="https://terminstop.de/dashboard" style="display:inline-block;background:linear-gradient(135deg,#18A66D,#0F8A57);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;">
        Zum Dashboard →
      </a>
    </div>
  `)
  await sendEmail(to, `Zahlung bestätigt – ${planName}-Paket aktiv ✅`, html)
}

// ── Trial Reminder Email ──────────────────────────────────────────────────────
export async function sendTrialReminderEmail(to: string, companyName: string, daysLeft: number) {
  const isUrgent = daysLeft <= 3
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:48px;margin-bottom:12px;">${isUrgent ? "⏰" : "📅"}</div>
      <h1 style="font-size:24px;font-weight:900;color:#0F1B2D;margin:0 0 10px;">
        Noch ${daysLeft} Tag${daysLeft !== 1 ? "e" : ""} im Testzeitraum
      </h1>
      <p style="font-size:15px;color:#5B6779;line-height:1.6;margin:0;">
        Hallo ${companyName},<br>
        ${isUrgent
          ? "dein Testzeitraum läuft bald ab. Wähle jetzt dein Paket um ununterbrochen weiter SMS zu senden."
          : "wir hoffen, du bist zufrieden mit TerminStop! Hier ein kurzer Überblick über deine Optionen."}
      </p>
    </div>

    <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:28px;">
      ${[
        ["⚡", "Starter", "39 €/Monat", "Bis 100 SMS monatlich"],
        ["🚀", "Pro",     "109 €/Monat", "Bis 400 SMS · Empfohlen"],
        ["🏢", "Business","229 €/Monat", "Bis 1.000 SMS monatlich"],
      ].map(([icon, name, price, desc]) => `
        <div style="display:flex;align-items:center;gap:14px;border:1px solid #E8ECF1;border-radius:12px;padding:14px 16px;background:#fff;">
          <span style="font-size:20px;">${icon}</span>
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:700;color:#0F1B2D;">${name}</div>
            <div style="font-size:12px;color:#5B6779;">${desc}</div>
          </div>
          <div style="font-size:14px;font-weight:700;color:#18A66D;">${price}</div>
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;">
      <a href="https://terminstop.de/settings" style="display:inline-block;background:linear-gradient(135deg,#18A66D,#0F8A57);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;box-shadow:0 4px 16px rgba(10,107,67,0.3);">
        Paket wählen →
      </a>
    </div>
  `)
  const subject = isUrgent
    ? `⏰ Noch ${daysLeft} Tag${daysLeft !== 1 ? "e" : ""} – Testzeitraum endet bald`
    : `📅 Dein TerminStop-Test läuft noch ${daysLeft} Tage`
  await sendEmail(to, subject, html)
}

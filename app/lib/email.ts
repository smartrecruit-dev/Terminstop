// TerminStop Email System via Resend
// Docs: https://resend.com/docs

const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = "TerminStop <hallo@terminstop.de>"

async function sendEmail(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) {
    console.warn("[email] RESEND_API_KEY not set — skipping email")
    return
  }
  try {
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
  } catch (e: any) {
    console.error("[email] Network error:", e.message)
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
            &copy; ${new Date().getFullYear()} TerminStop &middot;
            <a href="https://terminstop.de/impressum" style="color:#9CA3AF;">Impressum</a> &middot;
            <a href="https://terminstop.de/datenschutz" style="color:#9CA3AF;">Datenschutz</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function iconBox(color: string, svgPath: string) {
  return `<div style="width:52px;height:52px;background:${color}15;border:1.5px solid ${color}30;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
    <svg width="24" height="24" fill="none" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">${svgPath}</svg>
  </div>`
}

// ── Welcome Email ─────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, companyName: string) {
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      ${iconBox("#18A66D", '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>')}
      <h1 style="font-size:24px;font-weight:900;color:#0F1B2D;margin:0 0 10px;">Willkommen bei TerminStop!</h1>
      <p style="font-size:15px;color:#5B6779;line-height:1.6;margin:0;">
        Hallo ${companyName},<br>dein Konto ist eingerichtet und bereit. Dein 14-tägiger Testzeitraum läuft.
      </p>
    </div>

    <div style="background:#F0FBF6;border:1px solid #D1F5E3;border-radius:14px;padding:20px 20px;margin-bottom:28px;">
      <p style="font-size:13px;font-weight:700;color:#0A6B43;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Deine nächsten Schritte</p>
      ${[
        ["Ersten Termin eintragen", "Trage deinen ersten Kunden ein"],
        ["Buchungsseite aktivieren", "Teile deinen Link mit Kunden"],
        ["SMS testen", "Schick dir selbst eine Test-SMS"],
      ].map(([title, desc], i) => `
        <div style="display:flex;gap:12px;align-items:flex-start;margin-bottom:${i < 2 ? "10px" : "0"};">
          <div style="width:24px;height:24px;background:#18A66D;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <span style="color:#fff;font-size:11px;font-weight:800;">${i + 1}</span>
          </div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#0F1B2D;">${title}</div>
            <div style="font-size:13px;color:#5B6779;">${desc}</div>
          </div>
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;">
      <a href="https://terminstop.de/dashboard" style="display:inline-block;background:linear-gradient(135deg,#18A66D,#0F8A57);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;box-shadow:0 4px 16px rgba(10,107,67,0.3);">
        Zum Dashboard &rarr;
      </a>
    </div>
  `)
  await sendEmail(to, "Willkommen bei TerminStop — dein Test startet jetzt", html)
}

// ── Payment Confirmation Email ────────────────────────────────────────────────
export async function sendPaymentConfirmationEmail(to: string, companyName: string, plan: string) {
  const planNames: Record<string, string> = { starter: "Starter", pro: "Pro", business: "Business" }
  const planPrices: Record<string, string> = { starter: "39 €", pro: "109 €", business: "229 €" }
  const planName = planNames[plan] || plan
  const planPrice = planPrices[plan] || ""

  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      ${iconBox("#18A66D", '<polyline points="20 6 9 17 4 12"/>')}
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
        Zum Dashboard &rarr;
      </a>
    </div>
  `)
  await sendEmail(to, `Zahlung bestätigt — ${planName}-Paket ist jetzt aktiv`, html)
}

// ── SMS Topup Confirmation Email ──────────────────────────────────────────────
export async function sendSmsTopupEmail(to: string, companyName: string, smsAmount: number, priceLabel: string) {
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      ${iconBox("#18A66D", '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>')}
      <h1 style="font-size:24px;font-weight:900;color:#0F1B2D;margin:0 0 10px;">SMS-Paket aktiviert!</h1>
      <p style="font-size:15px;color:#5B6779;line-height:1.6;margin:0;">
        Hallo ${companyName},<br>dein Extra-Paket wurde erfolgreich gebucht und sofort gutgeschrieben.
      </p>
    </div>

    <div style="background:#F0FBF6;border:1px solid #D1F5E3;border-radius:14px;padding:20px 20px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:13px;color:#5B6779;padding:6px 0;">Extra-SMS</td>
          <td style="font-size:16px;font-weight:900;color:#18A66D;text-align:right;padding:6px 0;">+${smsAmount} SMS</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#5B6779;padding:6px 0;">Betrag</td>
          <td style="font-size:14px;font-weight:700;color:#0F1B2D;text-align:right;padding:6px 0;">${priceLabel}</td>
        </tr>
        <tr>
          <td style="font-size:13px;color:#5B6779;padding:6px 0;">Status</td>
          <td style="text-align:right;padding:6px 0;"><span style="background:#D1FAE5;color:#059669;font-size:12px;font-weight:700;padding:3px 10px;border-radius:980px;">Sofort verfügbar</span></td>
        </tr>
      </table>
    </div>

    <p style="font-size:13px;color:#5B6779;text-align:center;line-height:1.6;margin:0 0 24px;">
      Die SMS-Erinnerungen laufen ab sofort wieder. Die Extra-SMS werden am Ende des Monats zurückgesetzt.
    </p>

    <div style="text-align:center;">
      <a href="https://terminstop.de/dashboard" style="display:inline-block;background:linear-gradient(135deg,#18A66D,#0F8A57);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;">
        Zum Dashboard &rarr;
      </a>
    </div>
  `)
  await sendEmail(to, `${smsAmount} Extra-SMS wurden deinem Konto gutgeschrieben`, html)
}

// ── Payment Failed Email ───────────────────────────────────────────────────────
export async function sendPaymentFailedEmail(to: string, companyName: string) {
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      ${iconBox("#DC2626", '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>')}
      <h1 style="font-size:24px;font-weight:900;color:#0F1B2D;margin:0 0 10px;">Zahlung fehlgeschlagen</h1>
      <p style="font-size:15px;color:#5B6779;line-height:1.6;margin:0;">
        Hallo ${companyName},<br>
        wir konnten deine Zahlung leider nicht einziehen. Dein Konto wurde vorübergehend gesperrt.
      </p>
    </div>

    <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:14px;padding:20px 20px;margin-bottom:28px;">
      <p style="font-size:14px;font-weight:700;color:#DC2626;margin:0 0 8px;">Was jetzt zu tun ist:</p>
      <p style="font-size:13px;color:#5B6779;line-height:1.7;margin:0;">
        Bitte aktualisiere deine Zahlungsmethode im Kundenportal. Deine SMS-Erinnerungen werden danach automatisch wieder aktiviert. Deine Daten bleiben vollständig erhalten.
      </p>
    </div>

    <div style="text-align:center;margin-bottom:16px;">
      <a href="https://terminstop.de/blocked?reason=payment" style="display:inline-block;background:linear-gradient(135deg,#18A66D,#0F8A57);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;box-shadow:0 4px 16px rgba(10,107,67,0.3);">
        Zahlungsmethode aktualisieren &rarr;
      </a>
    </div>

    <p style="font-size:12px;color:#9CA3AF;text-align:center;margin:0;">
      Fragen? Schreib uns: <a href="mailto:terminstop.business@gmail.com" style="color:#18A66D;">terminstop.business@gmail.com</a>
    </p>
  `)
  await sendEmail(to, "Zahlung fehlgeschlagen — bitte Zahlungsmethode aktualisieren", html)
}

// ── Subscription Cancelled Email ──────────────────────────────────────────────
export async function sendSubscriptionCancelledEmail(to: string, companyName: string) {
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      ${iconBox("#6B7280", '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>')}
      <h1 style="font-size:24px;font-weight:900;color:#0F1B2D;margin:0 0 10px;">Dein Abo wurde beendet</h1>
      <p style="font-size:15px;color:#5B6779;line-height:1.6;margin:0;">
        Hallo ${companyName},<br>
        dein TerminStop-Abo wurde gekündigt. Wir hoffen, du warst zufrieden!
      </p>
    </div>

    <div style="background:#F9FAFB;border:1px solid #E8ECF1;border-radius:14px;padding:20px 20px;margin-bottom:28px;">
      <p style="font-size:13px;color:#5B6779;line-height:1.7;margin:0;">
        <strong style="color:#0F1B2D;">Deine Daten sind sicher.</strong> Alle Termine und Kundendaten bleiben gespeichert.
        Du kannst jederzeit mit einem neuen Paket weitermachen — alles ist noch da.
      </p>
    </div>

    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:28px;">
      ${[
        ["Starter",  "39 €/Monat",  "100 SMS/Monat"],
        ["Pro",      "109 €/Monat", "400 SMS/Monat · Empfohlen"],
        ["Business", "229 €/Monat", "1.000 SMS/Monat"],
      ].map(([name, price, desc]) => `
        <div style="display:flex;align-items:center;gap:12px;border:1px solid #E8ECF1;border-radius:10px;padding:12px 14px;background:#fff;">
          <div style="flex:1;"><div style="font-size:13px;font-weight:700;color:#0F1B2D;">${name}</div><div style="font-size:12px;color:#5B6779;">${desc}</div></div>
          <div style="font-size:13px;font-weight:700;color:#18A66D;">${price}</div>
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;">
      <a href="https://terminstop.de/blocked?reason=cancelled" style="display:inline-block;background:linear-gradient(135deg,#18A66D,#0F8A57);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;">
        Jetzt neu starten &rarr;
      </a>
    </div>
  `)
  await sendEmail(to, "Dein TerminStop-Abo wurde beendet", html)
}

// ── Trial Reminder Email ──────────────────────────────────────────────────────
export async function sendTrialReminderEmail(to: string, companyName: string, daysLeft: number) {
  const isUrgent = daysLeft <= 3
  const html = baseTemplate(`
    <div style="text-align:center;margin-bottom:28px;">
      ${isUrgent
        ? iconBox("#DC2626", '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>')
        : iconBox("#F59E0B", '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>')}
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
        ["Starter",  "39 €/Monat",  "Bis 100 SMS monatlich"],
        ["Pro",      "109 €/Monat", "Bis 400 SMS · Empfohlen"],
        ["Business", "229 €/Monat", "Bis 1.000 SMS monatlich"],
      ].map(([name, price, desc], i) => `
        <div style="display:flex;align-items:center;gap:14px;border:${i === 1 ? "2px solid #18A66D" : "1px solid #E8ECF1"};border-radius:12px;padding:14px 16px;background:${i === 1 ? "#F0FBF6" : "#fff"};">
          <div style="flex:1;">
            <div style="font-size:14px;font-weight:700;color:#0F1B2D;">${name}${i === 1 ? ' <span style="background:#18A66D;color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:99px;margin-left:6px;">Empfohlen</span>' : ""}</div>
            <div style="font-size:12px;color:#5B6779;">${desc}</div>
          </div>
          <div style="font-size:14px;font-weight:700;color:#18A66D;">${price}</div>
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;">
      <a href="https://terminstop.de/settings" style="display:inline-block;background:linear-gradient(135deg,#18A66D,#0F8A57);color:#fff;text-decoration:none;padding:14px 32px;border-radius:12px;font-size:15px;font-weight:700;box-shadow:0 4px 16px rgba(10,107,67,0.3);">
        Paket wählen &rarr;
      </a>
    </div>
  `)
  const subject = isUrgent
    ? `Noch ${daysLeft} Tag${daysLeft !== 1 ? "e" : ""} — dein Testzeitraum endet bald`
    : `Dein TerminStop-Test läuft noch ${daysLeft} Tage`
  await sendEmail(to, subject, html)
}

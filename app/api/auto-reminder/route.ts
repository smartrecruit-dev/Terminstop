import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendTrialReminderEmail } from "@/app/lib/email"
import { createClient as createAdminClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Admin client (service role) for auth.admin calls
const supabaseAdmin = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Current month as YYYYMM integer (e.g. 202604)
function currentMonth() {
  const d = new Date()
  return d.getFullYear() * 100 + (d.getMonth() + 1)
}

async function sendSMS(to: string, message: string): Promise<void> {
  if (!process.env.SEVEN_API_KEY) {
    throw new Error("SEVEN_API_KEY ist nicht gesetzt")
  }

  const response = await fetch("https://gateway.seven.io/api/sms", {
    method: "POST",
    headers: {
      "X-Api-Key": process.env.SEVEN_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to,
      text: message,
      from: "TerminStop",
      // Kein Mitarbeitername im SMS — der Mitarbeiter ist nur intern im Kalender sichtbar
    }),
  })

  if (!response.ok) {
    const raw = await response.text()
    throw new Error(`Seven.io HTTP ${response.status}: ${raw}`)
  }

  // seven.io antwortet entweder:
  //   - Plain text "100" (Erfolg) oder "900" (Fehler)
  //   - JSON {"success":"100",...} wenn json=1 gesetzt (bei uns nicht)
  // Wir prüfen den raw-Text direkt.
  const raw = await response.text()
  const code = raw.trim().startsWith("{")
    ? (() => { try { return String((JSON.parse(raw) as any).success ?? raw.trim()) } catch { return raw.trim() } })()
    : raw.trim()

  if (code !== "100") {
    throw new Error(`Seven.io Fehlercode ${code}: ${raw}`)
  }
}

function cleanName(raw: string) {
  return raw.replace(/\s*\[.*?\]\s*/g, "").trim()
}

function formatPhone(phone: string) {
  let cleaned = phone.replace(/\s+/g, "")
  if (cleaned.startsWith("0")) cleaned = "+49" + cleaned.substring(1)
  if (!cleaned.startsWith("+")) cleaned = "+" + cleaned
  return cleaned
}

function getNowInBerlin(): Date {
  const now = new Date()
  const berlinTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  )
  return berlinTime
}

function parseLocalDate(date: string, time: string): Date {
  const berlinNow = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Berlin" })
  )
  const [year, month, day] = date.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  const result = new Date(berlinNow)
  result.setFullYear(year, month - 1, day)
  result.setHours(hour, minute, 0, 0)
  return result
}

export async function GET(req: NextRequest) {
  // ── Auth-Check: nur Aufrufe mit gültigem CRON_SECRET erlaubt ──
  const authHeader = req.headers.get("authorization")
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const now = getNowInBerlin()
    console.log("NOW (Berlin):", now.toString())

    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .eq("reminded", false)
      .neq("status", "cancelled")
      // Online-Buchungen nur erinnern wenn bereits bestätigt
      .or("online_booking.is.null,online_booking.eq.false,status.eq.confirmed")

    if (error) {
      console.log("DB ERROR:", error)
      return NextResponse.json({ success: false, error })
    }

    console.log(`[reminder] ${data?.length ?? 0} offene Termine gefunden`)
    let sentCount = 0

    for (const a of data || []) {
      const appointmentDate = parseLocalDate(a.date, a.time)
      const diffMs    = appointmentDate.getTime() - now.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)

      console.log(`[reminder] Termin ${a.id}: ${a.date} ${a.time}, diffHours=${diffHours.toFixed(2)}, phone=${a.phone}`)

      if (!(diffHours <= 24 && diffHours > 0)) {
        console.log(`[reminder] → übersprungen (nicht im 24h-Fenster)`)
        continue
      }

      try {
        const { data: company, error: compErr } = await supabase
          .from("companies")
          .select("name, sms_limit, sms_count_month, sms_month, sms_extra_month, paused, plan")
          .eq("id", a.company_id)
          .single()

        if (compErr) {
          console.error(`[reminder] company fetch failed for ${a.company_id}:`, compErr.message)
          continue
        }

        // ── Skip if company is paused ──
        if (company?.paused) {
          console.log(`[reminder] → übersprungen (company paused)`)
          continue
        }

        // ── Monthly reset: if new month, reset counter + extra ──
        const month = currentMonth()
        if (company && (company.sms_month || 0) !== month) {
          await supabase.from("companies").update({
            sms_count_month: 0,
            sms_extra_month: 0,
            sms_month: month,
          }).eq("id", a.company_id)
          company.sms_count_month = 0
          company.sms_extra_month = 0
        }

        // ── SMS-Limit check (inkl. dazugekaufte Extra-SMS) ──
        const smsUsed  = company?.sms_count_month ?? 0
        const smsExtra = company?.sms_extra_month ?? 0
        const smsLimit = (company?.sms_limit ?? 100) + smsExtra

        console.log(`[reminder] → SMS-Stand: ${smsUsed}/${smsLimit}, plan=${company?.plan}`)

        if (smsUsed >= smsLimit) {
          console.log(`[reminder] → übersprungen (SMS-Limit erreicht)`)
          await supabase.from("appointments").update({ reminded: true, sms_sent_at: null }).eq("id", a.id)
          continue
        }

        // ── SMS-Text: NUR Kundenname + Betriebsname + Uhrzeit ──
        // Mitarbeitername ist NICHT im SMS — er ist nur intern im Kalender sichtbar
        const companyName  = company?.name || "unserem Unternehmen"
        const customerName = cleanName(a.name || "Kunde")  // entfernt [Online: ...] etc.
        const message = `Hallo ${customerName}, Ihr Termin bei ${companyName} ist morgen um ${a.time} Uhr. Wir freuen uns auf Sie!`

        await sendSMS(formatPhone(a.phone), message)

        await supabase
          .from("appointments")
          .update({ reminded: true, sms_sent_at: new Date().toISOString() })
          .eq("id", a.id)

        await supabase.rpc("increment_sms_count", { company_id_input: a.company_id })

        sentCount++
        console.log(`[reminder] ✓ SMS gesendet an ${a.phone} (Termin ${a.id})`)

      } catch (smsError: any) {
        console.error(`[reminder] ✗ SMS fehlgeschlagen (Termin ${a.id}):`, smsError.message)
        // Nicht als "reminded" markieren — nächster Cron-Lauf versucht es erneut
      }
    }

    // ── Trial Reminder E-Mails ────────────────────────────────────────────────
    // Sende Erinnerungen an Firmen die noch im Trial sind (Tag 7, 11, 13)
    try {
      const TRIAL_DAYS = 14
      const REMINDER_DAYS = [7, 3, 1] // Tage VOR Ablauf (= Tage nach Start: 7, 11, 13)

      const { data: trialCompanies } = await supabase
        .from("companies")
        .select("id, user_id, name, created_at")
        .eq("plan", "trial")
        .eq("paused", false)

      for (const co of trialCompanies || []) {
        if (!co.created_at) continue
        const daysSinceStart = Math.floor(
          (now.getTime() - new Date(co.created_at).getTime()) / (1000 * 60 * 60 * 24)
        )
        const daysLeft = TRIAL_DAYS - daysSinceStart

        // Send only on specific days to avoid spam
        if (!REMINDER_DAYS.includes(daysLeft)) continue

        try {
          const { data: userData } = await supabaseAdmin.auth.admin.getUserById(co.user_id)
          if (userData?.user?.email) {
            await sendTrialReminderEmail(userData.user.email, co.name, daysLeft)
            console.log(`[reminder] Trial reminder sent (${daysLeft} days left) to company ${co.id}`)
          }
        } catch (e) {
          console.error("[reminder] Trial email error:", e)
        }
      }
    } catch (e) {
      console.error("[reminder] Trial reminder block error:", e)
    }

    return NextResponse.json({ success: true, sent: sentCount })

  } catch (err) {
    console.log("GLOBAL ERROR:", err)
    return NextResponse.json({ success: false, error: err })
  }
}

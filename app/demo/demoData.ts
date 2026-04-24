// ─── Demo-Daten – komplett fiktiv, kein Supabase ───────────────
// Alle Termine werden dynamisch relativ zu "heute" erzeugt,
// sodass die Demo immer aktuell aussieht.

export const DEMO_COMPANY = "Friseursalon Mustermann"

export const DEMO_EMPLOYEES = [
  { id: "e01", name: "Sarah K.",   color: "#18A66D", initials: "SK" },
  { id: "e02", name: "Tom B.",     color: "#3B82F6", initials: "TB" },
  { id: "e03", name: "Nina W.",    color: "#8B5CF6", initials: "NW" },
]

export const DEMO_SERVICES = [
  { id: "s01", name: "Haarschnitt",    duration: 45,  price: 35  },
  { id: "s02", name: "Färben",         duration: 90,  price: 65  },
  { id: "s03", name: "Pflege-Ritual",  duration: 60,  price: 45  },
  { id: "s04", name: "Bartpflege",     duration: 30,  price: 20  },
]

export const DEMO_CUSTOMERS = [
  { id: "c01", name: "Anna Köhler",    phone: "+49 151 2847 0011", note: "Stammkundin · Farbe: Dunkelbraun" },
  { id: "c02", name: "Thomas Becker",  phone: "+49 152 3948 0022", note: "Monatlicher Besuch" },
  { id: "c03", name: "Sandra Müller",  phone: "+49 153 4859 0033", note: "VIP · Immer pünktlich" },
  { id: "c04", name: "Michael Weber",  phone: "+49 154 5960 0044", note: "" },
  { id: "c05", name: "Lisa Schmidt",   phone: "+49 155 6071 0055", note: "Kurz vorher anrufen" },
  { id: "c06", name: "Klaus Hoffmann", phone: "+49 156 7182 0066", note: "Kommt oft mit Tochter" },
  { id: "c07", name: "Julia Wagner",   phone: "+49 157 8293 0077", note: "" },
  { id: "c08", name: "Peter Schulz",   phone: "+49 158 9304 0088", note: "Stammkunde seit 2021" },
  { id: "c09", name: "Maria Fischer",  phone: "+49 159 0415 0099", note: "" },
  { id: "c10", name: "Stefan Braun",   phone: "+49 160 1526 0100", note: "Flexible Termine" },
  { id: "c11", name: "Claudia Meyer",  phone: "+49 161 2637 0111", note: "Bevorzugt donnerstags" },
  { id: "c12", name: "Tobias Klein",   phone: "+49 162 3748 0122", note: "" },
]

// 16 feste Zeitslots pro Tag
const TIMES = [
  "08:00","08:30","09:00","09:30",
  "10:00","10:30","11:00","11:30",
  "12:00","13:00","13:30","14:00",
  "14:30","15:00","15:30","16:00",
]

const NOTES = [
  "Erstbesuch", "Folgebehandlung", "", "Kurzer Termin",
  "", "Besondere Wünsche", "", "Empfehlung Familie Müller",
  "Dringlich", "", "Stammkunde", "",
  "Bitte pünktlich", "", "Farbe + Schnitt", "",
]

function toDateStr(d: Date): string {
  return d.toISOString().split("T")[0]
}

export function generateDemoAppointments() {
  const today = new Date()
  const todayStr = toDateStr(today)
  const nowMinutes = today.getHours() * 60 + today.getMinutes()

  const appointments: any[] = []
  let counter = 0

  for (let offset = -14; offset <= 6; offset++) {
    const d = new Date()
    d.setDate(today.getDate() + offset)
    const dateStr = toDateStr(d)
    const dow = d.getDay() // 0=Sun,6=Sat

    // Wochenenden überspringen – außer heute (damit Demo immer Data hat)
    if ((dow === 0 || dow === 6) && dateStr !== todayStr) continue

    TIMES.forEach((time, tIdx) => {
      const [h, m] = time.split(":").map(Number)
      const slotMinutes = h * 60 + m

      let status: "done" | "pending"
      if (offset < 0) {
        status = "done"
      } else if (offset === 0) {
        status = slotMinutes < nowMinutes - 30 ? "done" : "pending"
      } else {
        status = "pending"
      }

      const cust = DEMO_CUSTOMERS[counter % DEMO_CUSTOMERS.length]
      const emp  = DEMO_EMPLOYEES[counter % DEMO_EMPLOYEES.length]
      const svc  = DEMO_SERVICES[counter % DEMO_SERVICES.length]

      appointments.push({
        id: `demo-${counter + 1}`,
        name: cust.name,
        phone: cust.phone,
        date: dateStr,
        time,
        note: NOTES[(counter + tIdx) % NOTES.length],
        status,
        company_id: "demo",
        employee_id:   emp.id,
        employee_name: emp.name,
        employee_color: emp.color,
        employee_initials: emp.initials,
        service_name: svc.name,
      })
      counter++
    })
  }

  return appointments
}

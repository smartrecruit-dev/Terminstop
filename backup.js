#!/usr/bin/env node
/**
 * TerminStop – Datenbank-Backup Script
 * ─────────────────────────────────────
 * Exportiert alle wichtigen Tabellen als JSON-Dateien.
 *
 * Verwendung:
 *   node backup.js
 *
 * Voraussetzung: .env.local muss SUPABASE_SERVICE_ROLE_KEY enthalten.
 *
 * Die Dateien werden in ./backups/YYYY-MM-DD_HH-MM/ gespeichert.
 */

const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

// ─── .env.local manuell laden (kein dotenv nötig) ────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, ".env.local")
  if (!fs.existsSync(envPath)) {
    console.error("❌  .env.local nicht gefunden!")
    process.exit(1)
  }
  const lines = fs.readFileSync(envPath, "utf8").split("\n")
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const [key, ...rest] = trimmed.split("=")
    process.env[key.trim()] = rest.join("=").trim().replace(/^["']|["']$/g, "")
  }
}

loadEnv()

const SUPABASE_URL      = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("❌  NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt in .env.local")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

// ─── Tabellen die gesichert werden ───────────────────────────────────────────
const TABLES = ["companies", "appointments", "customers", "leads"]

// ─── Ausgabeordner ───────────────────────────────────────────────────────────
const now       = new Date()
const timestamp = now.toISOString().slice(0, 16).replace("T", "_").replace(":", "-")
const outDir    = path.join(__dirname, "backups", timestamp)

fs.mkdirSync(outDir, { recursive: true })

// ─── Backup durchführen ──────────────────────────────────────────────────────
async function backup() {
  console.log("\n📦  TerminStop Backup")
  console.log("────────────────────────────────")
  console.log(`📁  Zielordner: backups/${timestamp}\n`)

  const summary = []

  for (const table of TABLES) {
    process.stdout.write(`  ⬇️   ${table.padEnd(16)} `)

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.log(`❌  Fehler: ${error.message}`)
      summary.push({ table, rows: 0, status: "FEHLER" })
      continue
    }

    const rows = data?.length ?? 0
    const file = path.join(outDir, `${table}.json`)
    fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8")
    console.log(`✅  ${rows} Einträge`)
    summary.push({ table, rows, status: "OK" })
  }

  // Meta-Datei
  const meta = {
    created_at:  now.toISOString(),
    tables:      summary,
    supabase_url: SUPABASE_URL,
  }
  fs.writeFileSync(path.join(outDir, "_meta.json"), JSON.stringify(meta, null, 2))

  console.log("\n────────────────────────────────")
  console.log(`✅  Backup abgeschlossen: backups/${timestamp}`)

  const total = summary.reduce((s, t) => s + t.rows, 0)
  console.log(`📊  Gesamt: ${total} Datensätze aus ${TABLES.length} Tabellen\n`)
}

backup().catch((err) => {
  console.error("❌  Unerwarteter Fehler:", err)
  process.exit(1)
})

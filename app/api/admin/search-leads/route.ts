import { NextRequest, NextResponse } from "next/server"

function checkAdminAuth(req: NextRequest) {
  const secret   = (req.headers.get("x-admin-secret") || "").trim()
  const expected = (process.env.ADMIN_SECRET || "").trim()
  if (!expected) return false
  return secret === expected
}

export type Lead = {
  place_id: string
  name: string
  address: string
  phone: string
  website: string
  rating: number | null
  total_ratings: number
  maps_url: string
  status: string
}

export async function GET(req: NextRequest) {
  if (!checkAdminAuth(req)) {
    return NextResponse.json({ error: "Nicht autorisiert" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const query    = searchParams.get("query") || ""
  const city     = searchParams.get("city") || ""
  const apiKey   = process.env.GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "GOOGLE_PLACES_API_KEY nicht gesetzt" }, { status: 500 })
  }
  if (!query || !city) {
    return NextResponse.json({ error: "query und city sind erforderlich" }, { status: 400 })
  }

  const searchQuery = encodeURIComponent(`${query} ${city}`)

  try {
    // 1) Text Search → liefert place_id, name, rating, address
    const textRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchQuery}&language=de&key=${apiKey}`
    )
    const textData = await textRes.json()

    if (textData.status !== "OK" && textData.status !== "ZERO_RESULTS") {
      return NextResponse.json({ error: `Google API Fehler: ${textData.status} – ${textData.error_message || ""}` }, { status: 500 })
    }

    const results: Lead[] = []

    // 2) Für jeden Treffer → Details abrufen (Telefon + Website)
    const places = (textData.results || []).slice(0, 20)

    await Promise.all(
      places.map(async (place: any) => {
        try {
          const detailRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_phone_number,website,formatted_address,business_status,rating,user_ratings_total,url&language=de&key=${apiKey}`
          )
          const detailData = await detailRes.json()
          const d = detailData.result || {}

          results.push({
            place_id:      place.place_id,
            name:          d.name || place.name || "",
            address:       d.formatted_address || place.formatted_address || "",
            phone:         d.formatted_phone_number || "",
            website:       d.website || "",
            rating:        d.rating ?? null,
            total_ratings: d.user_ratings_total || 0,
            maps_url:      d.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            status:        d.business_status || "OPERATIONAL",
          })
        } catch {
          // einzelne Fehler überspringen
        }
      })
    )

    // Sortieren: mit Telefon zuerst, dann nach Rating
    results.sort((a, b) => {
      if (a.phone && !b.phone) return -1
      if (!a.phone && b.phone) return 1
      return (b.rating || 0) - (a.rating || 0)
    })

    return NextResponse.json({ leads: results, count: results.length })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

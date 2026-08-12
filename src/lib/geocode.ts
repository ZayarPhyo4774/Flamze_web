const LAT_LNG_PATTERN = /^(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)$/;

export function parseLatLngQuery(query: string): { lat: number; lng: number } | null {
  const match = query.trim().match(LAT_LNG_PATTERN);
  if (!match) return null;

  const lat = Number.parseFloat(match[1]);
  const lng = Number.parseFloat(match[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

  return { lat, lng };
}

export async function geocodeQuery(query: string): Promise<{ lat: number; lng: number } | null> {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const direct = parseLatLngQuery(trimmed);
  if (direct) return direct;

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&limit=1`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "FlamzeWeb/1.0",
        },
        next: { revalidate: 60 * 60 * 24 },
      }
    );

    if (!response.ok) return null;

    const results = (await response.json()) as Array<{ lat: string; lon: string }>;
    const hit = results[0];
    if (!hit) return null;

    const lat = Number.parseFloat(hit.lat);
    const lng = Number.parseFloat(hit.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    return { lat, lng };
  } catch {
    return null;
  }
}

export type MapLocation = {
  label: string;
  query: string;
};

/**
 * Extract a geocodable query (place name, address, or lat,lng) from a Google Maps URL.
 */
export function extractMapLocation(
  mapUrl: string | null | undefined,
  fallbackLabel = ""
): MapLocation | null {
  if (!mapUrl?.trim()) return null;

  const trimmed = mapUrl.trim();

  const atMatch = trimmed.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const [, lat, lng] = atMatch;
    return { label: fallbackLabel, query: `${lat},${lng}` };
  }

  if (trimmed.includes("/maps/embed")) {
    try {
      const url = new URL(trimmed);
      const q = url.searchParams.get("q");
      if (q) {
        return { label: fallbackLabel, query: q };
      }
    } catch {
      return null;
    }
    return null;
  }

  try {
    const url = new URL(trimmed);

    if (!url.hostname.includes("google")) {
      return null;
    }

    const q = url.searchParams.get("q");
    if (q) {
      return { label: fallbackLabel, query: q };
    }

    const placePath = url.pathname.match(/\/maps\/place\/([^/]+)/);
    if (placePath) {
      const place = decodeURIComponent(placePath[1].replace(/\+/g, " "));
      return { label: fallbackLabel, query: place };
    }
  } catch {
    return null;
  }

  return null;
}

/**
 * Convert a Google Maps share/link URL into an iframe embed URL when possible.
 * Admins can also paste a direct /maps/embed URL from Google Maps → Share → Embed.
 */
export function getMapEmbedUrl(mapUrl: string | null | undefined): string | null {
  if (!mapUrl?.trim()) return null;

  const trimmed = mapUrl.trim();
  if (trimmed.includes("/maps/embed")) {
    return trimmed;
  }

  const location = extractMapLocation(mapUrl);
  if (!location) return null;

  return `https://maps.google.com/maps?q=${encodeURIComponent(location.query)}&z=15&output=embed`;
}

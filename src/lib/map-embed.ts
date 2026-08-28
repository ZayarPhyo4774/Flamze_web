export type MapLocation = {
  label: string;
  query: string;
};

const SHORT_MAP_HOSTS = new Set(["maps.app.goo.gl", "goo.gl", "g.co"]);

function hostnameOf(mapUrl: string): string | null {
  try {
    return new URL(mapUrl).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

export function isGoogleMapsShortUrl(mapUrl: string): boolean {
  const host = hostnameOf(mapUrl);
  return host != null && SHORT_MAP_HOSTS.has(host);
}

function isGoogleMapsHost(mapUrl: string): boolean {
  const host = hostnameOf(mapUrl);
  if (!host) return false;
  return host.includes("google") || SHORT_MAP_HOSTS.has(host);
}

/**
 * Follow Google Maps share/short links to the canonical maps URL.
 * Short links like maps.app.goo.gl have no coordinates until resolved.
 */
export async function resolveMapUrl(mapUrl: string): Promise<string> {
  const trimmed = mapUrl.trim();
  if (!isGoogleMapsShortUrl(trimmed)) return trimmed;

  try {
    const head = await fetch(trimmed, {
      method: "HEAD",
      redirect: "manual",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FlamzeWeb/1.0)",
      },
      next: { revalidate: 60 * 60 * 24 },
    });
    const location = head.headers.get("location");
    if (location) return location;
  } catch {
    // Fall through to GET.
  }

  try {
    const response = await fetch(trimmed, {
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; FlamzeWeb/1.0)",
      },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (response.url) return response.url;
  } catch {
    return trimmed;
  }

  return trimmed;
}

/**
 * Extract a geocodable query (place name, address, or lat,lng) from a Google Maps URL.
 */
export function extractMapLocation(
  mapUrl: string | null | undefined,
  fallbackLabel = ""
): MapLocation | null {
  if (!mapUrl?.trim()) return null;

  const trimmed = mapUrl.trim();

  const placeCoords = trimmed.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (placeCoords) {
    const [, lat, lng] = placeCoords;
    return { label: fallbackLabel, query: `${lat},${lng}` };
  }

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

    if (!isGoogleMapsHost(trimmed)) {
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

export function googleMapsEmbedUrl(query: string, zoom = 16): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`;
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

  return googleMapsEmbedUrl(location.query);
}

export function getBranchMapEmbedUrl(branch: {
  mapUrl?: string | null;
  address?: string | null;
  name: string;
}): string | null {
  const fromUrl = getMapEmbedUrl(branch.mapUrl);
  if (fromUrl) return fromUrl;

  const query = branch.address?.trim() || branch.name.trim();
  if (!query) return null;
  return googleMapsEmbedUrl(query);
}

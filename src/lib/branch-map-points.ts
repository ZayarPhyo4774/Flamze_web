import { extractMapLocation, resolveMapUrl } from "@/lib/map-embed";
import { geocodeQuery } from "@/lib/geocode";

export type BranchMapPoint = {
  id: string;
  name: string;
  lat: number;
  lng: number;
};

type BranchMapInput = {
  id: string;
  name: string;
  mapUrl?: string | null;
  address?: string | null;
};

async function branchMapQuery(branch: BranchMapInput): Promise<string | null> {
  if (branch.mapUrl?.trim()) {
    const resolved = await resolveMapUrl(branch.mapUrl);
    const fromMapUrl = extractMapLocation(resolved, branch.name);
    if (fromMapUrl) return fromMapUrl.query;
  }

  const address = branch.address?.trim();
  return address || null;
}

export async function resolveBranchMapPoints(
  branches: BranchMapInput[]
): Promise<BranchMapPoint[]> {
  const points: BranchMapPoint[] = [];

  for (const branch of branches) {
    const query = await branchMapQuery(branch);
    if (!query) continue;

    const coords = await geocodeQuery(query);
    if (!coords) continue;

    points.push({
      id: branch.id,
      name: branch.name,
      lat: coords.lat,
      lng: coords.lng,
    });
  }

  return points;
}

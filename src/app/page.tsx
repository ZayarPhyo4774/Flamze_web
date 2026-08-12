
import { prisma } from "@/lib/prisma";
import { LandingClient } from "@/components/landing/LandingClient";
import { resolveBranchMapPoints } from "@/lib/branch-map-points";
import { getPublishedSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [branches, featuredMenuItems, siteContent] = await Promise.all([
    prisma.branch.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { menuItems: true } },
      },
    }),
    prisma.menuItem.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        category: { select: { id: true, slug: true, name: true, nameMy: true } },
      },
    }),
    getPublishedSiteContent(),
  ]);

  const mapPoints = await resolveBranchMapPoints(branches);

  return (
    <LandingClient
      branches={branches}
      mapPoints={mapPoints}
      featuredMenuItems={featuredMenuItems}
      siteContent={{
        landing: siteContent.landing,
        sections: siteContent.sections,
        navLinks: siteContent.navLinks,
      }}
    />
  );
}

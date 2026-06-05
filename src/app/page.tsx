
import { prisma } from "@/lib/prisma";
import { LandingClient } from "@/components/landing/LandingClient";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [branches, featuredMenuItems] = await Promise.all([
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
  ]);

  return <LandingClient branches={branches} featuredMenuItems={featuredMenuItems} />;
}

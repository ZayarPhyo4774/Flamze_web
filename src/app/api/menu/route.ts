import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const branchSlug = request.nextUrl.searchParams.get("branch");

  if (!branchSlug) {
    return NextResponse.json({ error: "branch parameter is required" }, { status: 400 });
  }

  const branch = await prisma.branch.findUnique({
    where: { slug: branchSlug },
  });

  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  const [menuItems, categories] = await Promise.all([
    prisma.menuItem.findMany({
      where: {
        isAvailable: true,
        OR: [
          { branchMenuItems: { some: { branchId: branch.id } } },
          { branchId: branch.id },
        ],
      },
      include: {
        category: {
          include: {
            parent: { select: { id: true, slug: true, name: true, nameMy: true } },
          },
        },
      },
      orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
    }),
    prisma.category.findMany({
      where: { parentId: null },
      orderBy: { sortOrder: "asc" },
      include: {
        children: { orderBy: { sortOrder: "asc" } },
      },
    }),
  ]);

  return NextResponse.json({
    branch: {
      id: branch.id,
      slug: branch.slug,
      name: branch.name,
      address: branch.address,
    },
    categories,
    menuItems,
  });
}

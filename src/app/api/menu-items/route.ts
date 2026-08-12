import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeRequest } from "@/lib/auth";
import { parseOptionalSafeHref } from "@/lib/safe-href";

export async function GET(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;
  const branchId = request.nextUrl.searchParams.get("branchId");
  const excludeBranchId = request.nextUrl.searchParams.get("excludeBranchId");
  const categoryId = request.nextUrl.searchParams.get("categoryId");

  const items = await prisma.menuItem.findMany({
    where: {
      ...(categoryId ? { categoryId } : {}),
      ...(branchId
        ? {
            OR: [
              { branchMenuItems: { some: { branchId } } },
              { branchId },
            ],
          }
        : {}),
      ...(excludeBranchId
        ? { NOT: { branchMenuItems: { some: { branchId: excludeBranchId } } } }
        : {}),
    },
    include: {
      category: { select: { id: true, slug: true, name: true, nameMy: true } },
      branchMenuItems: {
        include: { branch: { select: { id: true, name: true } } },
      },
    },
    orderBy: [{ category: { sortOrder: "asc" } }, { name: "asc" }],
  });

  const formatted = items.map((item) => ({
    ...item,
    branches: item.branchMenuItems.map((assignment) => assignment.branch),
  }));

  return NextResponse.json(formatted);
}

export async function POST(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, nameMy, description, descriptionMy, price, image, rating, branchIds, categoryId, isAvailable } = body;

    if (!name || !Array.isArray(branchIds) || branchIds.length === 0 || !categoryId || price === undefined) {
      return NextResponse.json(
        { error: "name, branchIds, categoryId, and price are required" },
        { status: 400 }
      );
    }

    const imageResult = parseOptionalSafeHref(image, "image");
    if ("error" in imageResult) {
      return NextResponse.json({ error: imageResult.error }, { status: 400 });
    }

    const item = await prisma.menuItem.create({
      data: {
        name,
        nameMy: nameMy?.trim() || null,
        description: description || null,
        descriptionMy: descriptionMy?.trim() || null,
        price: parseFloat(price),
        image: imageResult.value,
        rating: typeof rating === "number" ? Math.min(Math.max(rating, 0), 5) : 0,
        branchId: branchIds[0],
        categoryId,
        isAvailable: isAvailable ?? true,
        branchMenuItems: {
          create: branchIds.map((branchId: string) => ({ branch: { connect: { id: branchId } } })),
        },
      },
      include: {
        category: { select: { id: true, slug: true, name: true, nameMy: true } },
        branchMenuItems: { include: { branch: { select: { id: true, name: true } } } },
      },
    });

    return NextResponse.json(
      {
        ...item,
        branches: item.branchMenuItems.map((assignment) => assignment.branch),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create menu item", error);
    return NextResponse.json({ error: "Failed to create menu item" }, { status: 500 });
  }
}

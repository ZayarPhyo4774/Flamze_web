import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { authorizeRequest } from "@/lib/auth";
import { parseOptionalSafeHref } from "@/lib/safe-href";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, slug: true, name: true, nameMy: true } },
      branchMenuItems: { include: { branch: { select: { id: true, name: true } } } },
    },
  });

  if (!item) {
    return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...item,
    branches: item.branchMenuItems.map((assignment) => assignment.branch),
  });
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, nameMy, description, descriptionMy, price, image, rating, branchIds, categoryId, isAvailable } = body;

    let validatedImage: string | null | undefined = undefined;
    if (image !== undefined) {
      const imageResult = parseOptionalSafeHref(image, "image");
      if ("error" in imageResult) {
        return NextResponse.json({ error: imageResult.error }, { status: 400 });
      }
      validatedImage = imageResult.value;
    }

    const updateData: Prisma.MenuItemUpdateInput = {
      ...(name !== undefined && { name }),
      ...(nameMy !== undefined && { nameMy: nameMy?.trim() || null }),
      ...(description !== undefined && { description }),
      ...(descriptionMy !== undefined && { descriptionMy: descriptionMy?.trim() || null }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(validatedImage !== undefined && { image: validatedImage }),
      ...(rating !== undefined && { rating: Math.min(Math.max(rating, 0), 5) }),
      ...(categoryId !== undefined && { category: { connect: { id: categoryId } } }),
      ...(isAvailable !== undefined && { isAvailable }),
      ...(Array.isArray(branchIds) && branchIds.length > 0 && {
        branch: { connect: { id: branchIds[0] } },
      }),
    };

    const item = await prisma.menuItem.update({
      where: { id },
      data: updateData,
      include: {
        category: { select: { id: true, slug: true, name: true, nameMy: true } },
        branchMenuItems: { include: { branch: { select: { id: true, name: true } } } },
      },
    });

    if (Array.isArray(branchIds)) {
      const existing = await prisma.branchMenuItem.findMany({ where: { menuItemId: id } });
      const existingBranchIds = existing.map((assignment) => assignment.branchId);
      const toCreate = branchIds.filter((branchId: string) => !existingBranchIds.includes(branchId));
      const toDelete = existing.filter((assignment) => !branchIds.includes(assignment.branchId));

      if (toDelete.length > 0) {
        await prisma.branchMenuItem.deleteMany({
          where: { id: { in: toDelete.map((assignment) => assignment.id) } },
        });
      }

      if (toCreate.length > 0) {
        await prisma.branchMenuItem.createMany({
          data: toCreate.map((branchId: string) => ({ branchId, menuItemId: id })),
          skipDuplicates: true,
        });
      }
    }

    return NextResponse.json({
      ...item,
      branches: item.branchMenuItems.map((assignment) => assignment.branch),
    });
  } catch {
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    await prisma.menuItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete menu item" }, { status: 500 });
  }
}

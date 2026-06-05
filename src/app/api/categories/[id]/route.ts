import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { authorizeRequest } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { menuItems: true } } },
  });

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  return NextResponse.json(category);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, nameMy, slug, sortOrder } = body;

    const current = await prisma.category.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const categorySlug = slug?.trim() || (name ? slugify(name) : current.slug);

    if (categorySlug !== current.slug) {
      const existing = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (existing) {
        return NextResponse.json({ error: "Category slug already exists" }, { status: 409 });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(nameMy !== undefined && { nameMy: nameMy?.trim() || null }),
        ...(slug !== undefined || name !== undefined ? { slug: categorySlug } : {}),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder, 10) }),
      },
      include: { _count: { select: { menuItems: true } } },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;
  const { id } = await params;

  try {
    const itemCount = await prisma.menuItem.count({ where: { categoryId: id } });
    if (itemCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${itemCount} menu item(s). Reassign or delete them first.` },
        { status: 409 }
      );
    }

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}

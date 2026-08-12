import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { authorizeRequest } from "@/lib/auth";

type RouteParams = { params: Promise<{ id: string }> };

async function validateParentId(parentId: string | null | undefined, selfId: string) {
  if (parentId == null || parentId === "") {
    return { parentId: null as string | null };
  }

  if (parentId === selfId) {
    return { error: "Category cannot be its own parent" };
  }

  const parent = await prisma.category.findUnique({ where: { id: parentId } });
  if (!parent) {
    return { error: "Parent category not found" };
  }
  if (parent.parentId) {
    return { error: "Subcategories cannot have children (one level only)" };
  }

  const childCount = await prisma.category.count({ where: { parentId: selfId } });
  if (childCount > 0) {
    return { error: "A category with subcategories cannot become a subcategory" };
  }

  return { parentId };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;
  const { id } = await params;

  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { menuItems: true, children: true } },
      parent: { select: { id: true, name: true, slug: true } },
      children: { orderBy: { sortOrder: "asc" } },
    },
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
    const { name, nameMy, slug, sortOrder, parentId: rawParentId } = body;

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

    let parentIdUpdate: string | null | undefined = undefined;
    if (rawParentId !== undefined) {
      const parentResult = await validateParentId(rawParentId, id);
      if ("error" in parentResult && parentResult.error) {
        return NextResponse.json({ error: parentResult.error }, { status: 400 });
      }
      parentIdUpdate = parentResult.parentId;
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(nameMy !== undefined && { nameMy: nameMy?.trim() || null }),
        ...(slug !== undefined || name !== undefined ? { slug: categorySlug } : {}),
        ...(sortOrder !== undefined && { sortOrder: parseInt(sortOrder, 10) }),
        ...(parentIdUpdate !== undefined && { parentId: parentIdUpdate }),
      },
      include: {
        _count: { select: { menuItems: true, children: true } },
        parent: { select: { id: true, name: true, slug: true } },
      },
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
    const childCount = await prisma.category.count({ where: { parentId: id } });
    if (childCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete category with ${childCount} subcategory(ies). Delete or reassign them first.` },
        { status: 409 }
      );
    }

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

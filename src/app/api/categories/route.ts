import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { authorizeRequest } from "@/lib/auth";

async function validateParentId(parentId: string | null | undefined, selfId?: string) {
  if (parentId == null || parentId === "") {
    return { parentId: null as string | null };
  }

  if (selfId && parentId === selfId) {
    return { error: "Category cannot be its own parent" };
  }

  const parent = await prisma.category.findUnique({ where: { id: parentId } });
  if (!parent) {
    return { error: "Parent category not found" };
  }
  if (parent.parentId) {
    return { error: "Subcategories cannot have children (one level only)" };
  }

  return { parentId };
}

export async function GET(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { menuItems: true, children: true } },
      parent: { select: { id: true, name: true, slug: true } },
      children: {
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true, sortOrder: true },
      },
    },
  });

  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, nameMy, slug, sortOrder, parentId: rawParentId } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const categorySlug = slug?.trim() || slugify(name);

    if (!categorySlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const existing = await prisma.category.findUnique({ where: { slug: categorySlug } });
    if (existing) {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 409 });
    }

    const parentResult = await validateParentId(rawParentId);
    if ("error" in parentResult && parentResult.error) {
      return NextResponse.json({ error: parentResult.error }, { status: 400 });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        nameMy: nameMy?.trim() || null,
        slug: categorySlug,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : 0,
        parentId: parentResult.parentId,
      },
      include: {
        _count: { select: { menuItems: true, children: true } },
        parent: { select: { id: true, name: true, slug: true } },
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}

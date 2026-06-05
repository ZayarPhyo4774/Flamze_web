import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { authorizeRequest } from "@/lib/auth";

const optionalText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

export async function GET(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const branches = await prisma.branch.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { menuItems: true } },
    },
  });

  return NextResponse.json(branches);
}

export async function POST(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { name, slug, address, phone, openingHours, mapUrl } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "name is required" }, { status: 400 });
    }

    const branchSlug = slug?.trim() || slugify(name);

    if (!branchSlug) {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    const existing = await prisma.branch.findUnique({ where: { slug: branchSlug } });
    if (existing) {
      return NextResponse.json({ error: "Branch slug already exists" }, { status: 409 });
    }

    const branch = await prisma.branch.create({
      data: {
        name: name.trim(),
        slug: branchSlug,
        address: optionalText(address),
        phone: optionalText(phone),
        openingHours: optionalText(openingHours),
        mapUrl: optionalText(mapUrl),
      },
      include: { _count: { select: { menuItems: true } } },
    });

    return NextResponse.json(branch, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create branch" }, { status: 500 });
  }
}

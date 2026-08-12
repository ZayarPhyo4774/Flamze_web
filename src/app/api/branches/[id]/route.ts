import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { authorizeRequest } from "@/lib/auth";
import { parseOptionalSafeHref } from "@/lib/safe-href";

type RouteParams = { params: Promise<{ id: string }> };

const optionalText = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

export async function GET(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  const branch = await prisma.branch.findUnique({
    where: { id },
    include: { _count: { select: { menuItems: true } } },
  });

  if (!branch) {
    return NextResponse.json({ error: "Branch not found" }, { status: 404 });
  }

  return NextResponse.json(branch);
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const body = await request.json();
    const { name, slug, address, phone, openingHours, mapUrl, imageUrl } = body;

    const current = await prisma.branch.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const branchSlug = slug?.trim() || (name ? slugify(name) : current.slug);

    if (branchSlug !== current.slug) {
      const existing = await prisma.branch.findUnique({ where: { slug: branchSlug } });
      if (existing) {
        return NextResponse.json({ error: "Branch slug already exists" }, { status: 409 });
      }
    }

    let validatedMapUrl: string | null | undefined = undefined;
    if (mapUrl !== undefined) {
      const mapUrlResult = parseOptionalSafeHref(mapUrl, "mapUrl");
      if ("error" in mapUrlResult) {
        return NextResponse.json({ error: mapUrlResult.error }, { status: 400 });
      }
      validatedMapUrl = mapUrlResult.value;
    }

    let validatedImageUrl: string | null | undefined = undefined;
    if (imageUrl !== undefined) {
      const imageUrlResult = parseOptionalSafeHref(imageUrl, "imageUrl");
      if ("error" in imageUrlResult) {
        return NextResponse.json({ error: imageUrlResult.error }, { status: 400 });
      }
      validatedImageUrl = imageUrlResult.value;
    }

    const branch = await prisma.branch.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(slug !== undefined || name !== undefined ? { slug: branchSlug } : {}),
        ...(address !== undefined && { address: optionalText(address) }),
        ...(phone !== undefined && { phone: optionalText(phone) }),
        ...(openingHours !== undefined && { openingHours: optionalText(openingHours) }),
        ...(validatedMapUrl !== undefined && { mapUrl: validatedMapUrl }),
        ...(validatedImageUrl !== undefined && { imageUrl: validatedImageUrl }),
      },
      include: { _count: { select: { menuItems: true } } },
    });

    return NextResponse.json(branch);
  } catch {
    return NextResponse.json({ error: "Failed to update branch" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    await prisma.branch.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete branch" }, { status: 500 });
  }
}

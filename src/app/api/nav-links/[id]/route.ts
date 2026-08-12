import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSafeHref, clampText, CMS_TEXT_LIMITS } from "@/lib/safe-href";

type RouteParams = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    const current = await prisma.navLink.findUnique({ where: { id } });
    if (!current) {
      return NextResponse.json({ error: "Nav link not found" }, { status: 404 });
    }

    const body = await request.json();
    const href =
      body.href !== undefined
        ? String(body.href).trim()
        : current.href;

    const hrefError = assertSafeHref(href);
    if (hrefError) {
      return NextResponse.json({ error: hrefError }, { status: 400 });
    }

    const labelEn =
      body.labelEn !== undefined
        ? clampText(String(body.labelEn), CMS_TEXT_LIMITS.label)
        : current.labelEn;

    if (!labelEn) {
      return NextResponse.json({ error: "labelEn is required" }, { status: 400 });
    }

    const navLink = await prisma.navLink.update({
      where: { id },
      data: {
        labelEn,
        ...(body.labelMy !== undefined && {
          labelMy: clampText(
            body.labelMy != null ? String(body.labelMy) : null,
            CMS_TEXT_LIMITS.label
          ),
        }),
        href,
        ...(body.sortOrder !== undefined && {
          sortOrder: Number(body.sortOrder) || 0,
        }),
        ...(body.isVisible !== undefined && {
          isVisible: Boolean(body.isVisible),
        }),
      },
    });

    return NextResponse.json(navLink);
  } catch {
    return NextResponse.json({ error: "Failed to update nav link" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  const { id } = await params;

  try {
    await prisma.navLink.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete nav link" }, { status: 500 });
  }
}

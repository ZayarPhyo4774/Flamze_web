import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertSafeHref, clampText, CMS_TEXT_LIMITS } from "@/lib/safe-href";
import { ensureSiteContentSeeded } from "@/lib/site-content";

export async function GET(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  await ensureSiteContentSeeded();

  const navLinks = await prisma.navLink.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return NextResponse.json(navLinks);
}

export async function POST(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const labelEn = clampText(String(body.labelEn ?? ""), CMS_TEXT_LIMITS.label);
    const href = typeof body.href === "string" ? body.href.trim() : "";

    if (!labelEn) {
      return NextResponse.json({ error: "labelEn is required" }, { status: 400 });
    }

    const hrefError = assertSafeHref(href);
    if (hrefError) {
      return NextResponse.json({ error: hrefError }, { status: 400 });
    }

    const navLink = await prisma.navLink.create({
      data: {
        labelEn,
        labelMy: clampText(
          body.labelMy != null ? String(body.labelMy) : null,
          CMS_TEXT_LIMITS.label
        ),
        href,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) || 0 : 0,
        isVisible: body.isVisible !== undefined ? Boolean(body.isVisible) : true,
      },
    });

    return NextResponse.json(navLink, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create nav link" }, { status: 500 });
  }
}

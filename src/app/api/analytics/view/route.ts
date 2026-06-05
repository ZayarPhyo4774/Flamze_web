import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple in-memory rate limiter: allow one view per IP+branch every 30 seconds
const VIEW_RATE_LIMIT_MS = 30 * 1000;
const lastSeen = new Map<string, number>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { branchSlug, locale } = body as { branchSlug: string; locale?: string };

    if (!branchSlug) {
      return NextResponse.json({ error: "branchSlug is required" }, { status: 400 });
    }

    const branch = await prisma.branch.findUnique({ where: { slug: branchSlug } });
    if (!branch) {
      return NextResponse.json({ error: "Branch not found" }, { status: 404 });
    }

    const forwarded = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";
    const key = `${ip}:${branch.id}`;
    const now = Date.now();
    const last = lastSeen.get(key) ?? 0;
    if (now - last < VIEW_RATE_LIMIT_MS) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    lastSeen.set(key, now);

    await prisma.menuView.create({
      data: {
        branchId: branch.id,
        locale: locale ?? "en",
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to record view" }, { status: 500 });
  }
}

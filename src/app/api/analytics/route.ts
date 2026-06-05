import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeRequest } from "@/lib/auth";

// POST for recording views moved to /api/analytics/view to keep responsibilities
// separated. Requests to POST /api/analytics will return 405.
export async function POST() {
  return NextResponse.json({ error: "Method Not Allowed. POST to /api/analytics/view instead." }, { status: 405 });
}

export async function GET(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;
  const rawDays = parseInt(request.nextUrl.searchParams.get("days") ?? "7", 10);
  const days = Number.isFinite(rawDays) ? Math.min(Math.max(rawDays, 1), 90) : 7;
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const [totalViews, viewsByBranch, recentViews] = await Promise.all([
    prisma.menuView.count({ where: { createdAt: { gte: since } } }),
    prisma.menuView.groupBy({
      by: ["branchId"],
      where: { createdAt: { gte: since } },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
    prisma.menuView.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const dailyMap = new Map<string, number>();
  for (const view of recentViews) {
    const date = view.createdAt.toISOString().slice(0, 10);
    dailyMap.set(date, (dailyMap.get(date) ?? 0) + 1);
  }

  // Build full date range from `since` to today (inclusive), filling zeros
  const daysArray: { date: string; views: number }[] = [];
  const current = new Date(since);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  while (current <= today) {
    const key = current.toISOString().slice(0, 10);
    daysArray.push({ date: key, views: dailyMap.get(key) ?? 0 });
    current.setDate(current.getDate() + 1);
  }

  const branches = await prisma.branch.findMany({
    select: { id: true, name: true, slug: true },
  });
  const branchMap = Object.fromEntries(branches.map((b) => [b.id, b]));

  return NextResponse.json({
    totalViews,
    periodDays: days,
    byBranch: viewsByBranch.map((v) => ({
      branch: branchMap[v.branchId],
      views: v._count.id,
    })),
    daily: daysArray,
  });
}

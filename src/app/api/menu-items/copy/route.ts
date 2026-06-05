import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorizeRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const authError = await authorizeRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { sourceItemIds, branchId } = body;

    if (!Array.isArray(sourceItemIds) || sourceItemIds.length === 0 || !branchId) {
      return NextResponse.json(
        { error: "sourceItemIds and branchId are required" },
        { status: 400 }
      );
    }

    const assignments = sourceItemIds.map((menuItemId: string) => ({
      menuItemId,
      branchId,
    }));

    await prisma.branchMenuItem.createMany({
      data: assignments,
      skipDuplicates: true,
    });

    return NextResponse.json({ assignedCount: assignments.length }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to assign menu items" }, { status: 500 });
  }
}

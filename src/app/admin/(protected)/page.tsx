export const dynamic = "force-dynamic";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { prisma } from "@/lib/prisma";
import { UtensilsCrossed, MapPin, Flame, Eye } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [branches, itemCount, viewCount] = await Promise.all([
    prisma.branch.findMany({
      include: { _count: { select: { menuItems: true } } },
    }),
    prisma.menuItem.count(),
    prisma.menuView.count({ where: { createdAt: { gte: since } } }),
  ]);

  const stats = [
    { label: "Branches", value: branches.length, icon: MapPin, color: "text-red-400" },
    { label: "Menu Items", value: itemCount, icon: UtensilsCrossed, color: "text-amber-400" },
    { label: "Menu Views (7d)", value: viewCount, icon: Eye, color: "text-emerald-400" },
  ];

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <AdminSidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-zinc-500">Overview of your restaurant network</p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-zinc-500">{label}</span>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <p className="text-3xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Branches</h2>
            <Link
              href="/admin/branches"
              className="text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Manage & generate QR →
            </Link>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <div
                key={branch.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-white">{branch.name}</span>
                </div>
                {branch.address && (
                  <p className="mb-3 text-xs text-zinc-500">{branch.address}</p>
                )}
                <p className="text-xs text-zinc-400">{branch._count.menuItems} menu items</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

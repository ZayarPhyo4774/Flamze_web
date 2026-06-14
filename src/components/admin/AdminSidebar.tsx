"use client";

import { BarChart3, Eye, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, LayoutDashboard, UtensilsCrossed, MapPin, Home, Tags } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/branches", label: "Branches & QR", icon: MapPin },
  { href: "/admin/categories", label: "Categories", icon: Tags },
  { href: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "x-flamze-csrf": "1" },
    });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="flex w-full flex-col border-b border-zinc-800 bg-zinc-950 lg:w-64 lg:border-b-0 lg:border-r lg:min-h-screen">
      <div className="flex items-center gap-3 border-b border-zinc-800 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white-600">
           <Image
               src="/flamze-logo.png"
               alt=""
              //  width={40}
              //  height={40}
               className="h-10 w-10 shrink-0 rounded shadow-lg shadow-red-950/40 transition-transform duration-300 group-hover:scale-105"
               priority
             />         
        </div>
        <div>
          <p className="font-bold text-white">FLAMEZ</p>
          <p className="text-xs text-zinc-500">Admin Panel</p>
        </div>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-red-600/10 text-red-400"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto hidden p-3 lg:block space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <Home className="h-4 w-4" />
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-zinc-500 hover:bg-zinc-900 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export function AnalyticsStat({ label, value, icon: Icon }: { label: string; value: number | string; icon: typeof Eye }) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-zinc-500">{label}</span>
        <Icon className="h-5 w-5 text-amber-400" />
      </div>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

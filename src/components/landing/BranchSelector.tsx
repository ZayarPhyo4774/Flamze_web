"use client";

import Link from "next/link";
import { MapPin, ChevronRight, UtensilsCrossed } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { BranchSummary } from "@/lib/types";

interface BranchSelectorProps {
  branches: BranchSummary[];
}

export function BranchSelector({ branches }: BranchSelectorProps) {
  const { t } = useLocale();

  if (branches.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8 text-center text-zinc-400">
        {t.landing.noBranches}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {branches.map((branch, index) => (
        <Link
          key={branch.id}
          href={`/menu?branch=${branch.slug}`}
          className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6 transition-all duration-300 hover:border-red-500/50 hover:bg-zinc-900 hover:shadow-xl hover:shadow-red-900/10 hover:-translate-y-1"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-amber-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-red-600/10 text-red-500">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <h3 className="mb-1 text-xl font-semibold text-white group-hover:text-red-400 transition-colors">
              {branch.name}
            </h3>
            {branch.address && (
              <p className="mb-4 flex items-center gap-1.5 text-sm text-zinc-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                {branch.address}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-500">
                {branch._count?.menuItems ?? 0} {t.landing.menuItems}
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-amber-400 opacity-0 transition-opacity group-hover:opacity-100">
                {t.landing.viewMenu}
                <ChevronRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

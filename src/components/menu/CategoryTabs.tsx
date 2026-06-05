"use client";

import { cn } from "@/lib/utils";

interface CategoryTabsProps {
  categories: { slug: string; name: string }[];
  active: string;
  onChange: (slug: string) => void;
  allLabel?: string;
}

export function CategoryTabs({ categories, active, onChange, allLabel = "All" }: CategoryTabsProps) {
  return (
    <div className="sticky top-[73px] z-20 -mx-4 border-b border-zinc-800 bg-black/90 px-4 backdrop-blur-md">
      <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
        <button
          onClick={() => onChange("all")}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
            active === "all"
              ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          )}
        >
          {allLabel}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onChange(cat.slug)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
              active === cat.slug
                ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}

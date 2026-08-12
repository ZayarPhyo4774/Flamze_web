"use client";

import { cn } from "@/lib/utils";

export type CategoryTab = {
  slug: string;
  name: string;
  children?: { slug: string; name: string }[];
};

interface CategoryTabsProps {
  categories: CategoryTab[];
  active: string;
  onChange: (slug: string) => void;
  allLabel?: string;
}

export function CategoryTabs({
  categories,
  active,
  onChange,
  allLabel = "All",
}: CategoryTabsProps) {
  const activeParent = categories.find(
    (cat) =>
      cat.slug === active || cat.children?.some((child) => child.slug === active)
  );
  const subcategories = activeParent?.children ?? [];

  return (
    <div className="sticky top-[73px] z-20 -mx-4 border-b border-zinc-700/80 bg-black/95 px-4 shadow-[0_12px_40px_rgba(0,0,0,0.55)] backdrop-blur-md">
      <p className="pt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">
        Select category
      </p>

      <div
        role="tablist"
        aria-label="Menu categories"
        className="flex gap-2.5 overflow-x-auto py-3 scrollbar-hide"
      >
        <button
          type="button"
          role="tab"
          aria-selected={active === "all"}
          onClick={() => onChange("all")}
          className={cn(
            "shrink-0 rounded-xl border px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-all duration-200",
            active === "all"
              ? "border-red-500 bg-red-600 text-white shadow-[0_0_0_3px_rgba(220,38,38,0.35)]"
              : "border-zinc-600 bg-zinc-900 text-zinc-100 hover:border-red-500/70 hover:bg-zinc-800 hover:text-white"
          )}
        >
          {allLabel}
        </button>
        {categories.map((cat) => {
          const isActive =
            active === cat.slug ||
            Boolean(cat.children?.some((child) => child.slug === active));

          return (
            <button
              key={cat.slug}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(cat.slug)}
              className={cn(
                "shrink-0 rounded-xl border px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] transition-all duration-200",
                isActive
                  ? "border-red-500 bg-red-600 text-white shadow-[0_0_0_3px_rgba(220,38,38,0.35)]"
                  : "border-zinc-600 bg-zinc-900 text-zinc-100 hover:border-red-500/70 hover:bg-zinc-800 hover:text-white"
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {subcategories.length > 0 && active !== "all" && (
        <div className="border-t border-zinc-800 pb-3 pt-1">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-400/90">
            Subcategory
          </p>
          <div
            role="tablist"
            aria-label="Menu subcategories"
            className="flex gap-2 overflow-x-auto scrollbar-hide"
          >
            <button
              type="button"
              role="tab"
              aria-selected={active === activeParent!.slug}
              onClick={() => onChange(activeParent!.slug)}
              className={cn(
                "shrink-0 rounded-lg border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-200",
                active === activeParent!.slug
                  ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_0_3px_rgba(251,191,36,0.35)]"
                  : "border-zinc-600 bg-zinc-900 text-zinc-200 hover:border-amber-400/70 hover:text-white"
              )}
            >
              All {activeParent!.name}
            </button>
            {subcategories.map((child) => (
              <button
                key={child.slug}
                type="button"
                role="tab"
                aria-selected={active === child.slug}
                onClick={() => onChange(child.slug)}
                className={cn(
                  "shrink-0 rounded-lg border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] transition-all duration-200",
                  active === child.slug
                    ? "border-amber-400 bg-amber-400 text-black shadow-[0_0_0_3px_rgba(251,191,36,0.35)]"
                    : "border-zinc-600 bg-zinc-900 text-zinc-200 hover:border-amber-400/70 hover:text-white"
                )}
              >
                {child.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

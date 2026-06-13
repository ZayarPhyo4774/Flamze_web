"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLocale } from "@/context/LocaleContext";
import { getLocalizedField } from "@/i18n/translations";
import type { MenuItemWithCategory } from "@/lib/types";

type MenuData = {
  branch: { slug: string; name: string; address: string | null };
  categories: { slug: string; name: string; nameMy: string | null }[];
  menuItems: MenuItemWithCategory[];
};

function MenuWithBranch({ branchSlug }: { branchSlug: string }) {
  const { locale, t } = useLocale();

  const [data, setData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    let cancelled = false;

    void fetch(`/api/menu?branch=${branchSlug}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to load menu");
        }
        return res.json();
      })
      .then((menuData: MenuData) => {
        if (cancelled) return;
        setData(menuData);
        fetch("/api/analytics/view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ branchSlug, locale }),
        }).catch(() => {});
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [branchSlug, locale]);

  const localizedCategories = useMemo(
    () =>
      data?.categories.map((c) => ({
        slug: c.slug,
        name: getLocalizedField(locale, c.name, c.nameMy),
      })) ?? [],
    [data?.categories, locale]
  );

  const filteredItems = useMemo(() => {
    if (!data) return [];
    return data.menuItems
      .filter(
        (item) => activeCategory === "all" || item.category.slug === activeCategory
      )
      .map((item) => ({
        ...item,
        displayName: getLocalizedField(locale, item.name, item.nameMy),
        displayDescription: getLocalizedField(
          locale,
          item.description ?? "",
          item.descriptionMy
        ),
        displayCategory: getLocalizedField(
          locale,
          item.category.name,
          item.category.nameMy
        ),
      }));
  }, [data, activeCategory, locale]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4 text-center">
        <p className="text-red-400">{error ?? t.menu.error}</p>
        <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
          {t.menu.backHome}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-12">
      <div className="absolute right-4 top-4 z-40">
        <LanguageSwitcher />
      </div>

      <MenuHeader
        branchName={data.branch.name}
        branchAddress={data.branch.address}
      />

      <CategoryTabs
        categories={localizedCategories}
        active={activeCategory}
        onChange={setActiveCategory}
        allLabel={t.menu.all}
      />

      <div className="mx-auto max-w-2xl px-4 py-6">
        {filteredItems.length === 0 ? (
          <p className="py-12 text-center text-zinc-500">{t.menu.noCategory}</p>
        ) : (
          <div className="grid items-stretch gap-4 sm:grid-cols-2">
            {filteredItems.map((item, i) => (
              <div
                key={item.id}
                className="h-full animate-in fade-in duration-300"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <MenuItemCard
                  name={item.displayName}
                  description={item.displayDescription || null}
                  price={item.price}
                  image={item.image}
                  rating={item.rating}
                  categoryName={item.displayCategory}
                  noImageLabel={t.menu.noImage}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Link
        href="/"
        className="fixed bottom-6 left-4 flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-950/90 px-4 py-2 text-xs text-zinc-400 backdrop-blur-sm hover:text-white transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {t.menu.backBranches}
      </Link>
    </div>
  );
}

function MenuContent() {
  const searchParams = useSearchParams();
  const branchSlug = searchParams.get("branch") ?? "";
  const { t } = useLocale();

  if (!branchSlug) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4 text-center">
        <p className="text-red-400">{t.menu.noBranch}</p>
        <Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors">
          {t.menu.backHome}
        </Link>
      </div>
    );
  }

  return <MenuWithBranch key={branchSlug} branchSlug={branchSlug} />;
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-black">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}

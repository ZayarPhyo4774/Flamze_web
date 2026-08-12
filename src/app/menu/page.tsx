"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useMemo } from "react";
import Link from "next/link";
import { ArrowUp, Loader2 } from "lucide-react";
import { MenuHeader } from "@/components/menu/MenuHeader";
import { CategoryTabs } from "@/components/menu/CategoryTabs";
import { MenuItemCard } from "@/components/menu/MenuItemCard";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import { useLocale } from "@/context/LocaleContext";
import { getLocalizedField } from "@/i18n/translations";
import type { MenuItemWithCategory } from "@/lib/types";

type MenuCategory = {
  slug: string;
  name: string;
  nameMy: string | null;
  children?: { slug: string; name: string; nameMy: string | null }[];
};

type MenuData = {
  branch: { slug: string; name: string; address: string | null };
  categories: MenuCategory[];
  menuItems: MenuItemWithCategory[];
};

function MenuWithBranch({ branchSlug }: { branchSlug: string }) {
  const { locale, t } = useLocale();

  const [data, setData] = useState<MenuData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;
      const nearBottom = scrollY + innerHeight >= scrollHeight - 80;
      setShowScrollTop(scrollY > 300 || nearBottom);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        children: c.children?.map((child) => ({
          slug: child.slug,
          name: getLocalizedField(locale, child.name, child.nameMy),
        })),
      })) ?? [],
    [data?.categories, locale]
  );

  const filteredItems = useMemo(() => {
    if (!data) return [];

    const childSlugsByParent = new Map<string, Set<string>>();
    for (const category of data.categories) {
      childSlugsByParent.set(
        category.slug,
        new Set((category.children ?? []).map((child) => child.slug))
      );
    }

    return data.menuItems
      .filter((item) => {
        if (activeCategory === "all") return true;
        if (item.category.slug === activeCategory) return true;
        const childSlugs = childSlugsByParent.get(activeCategory);
        return childSlugs?.has(item.category.slug) ?? false;
      })
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

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label={t.menu.upToTop}
        className={`fixed bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(220,38,38,0.5)] ring-2 ring-white/20 transition-all hover:bg-red-500 hover:shadow-[0_12px_40px_rgba(220,38,38,0.6)] active:scale-95 ${
          showScrollTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
        {t.menu.upToTop}
      </button>
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

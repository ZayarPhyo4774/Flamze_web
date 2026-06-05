"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { getLocalizedField } from "@/i18n/translations";
import { formatPrice } from "@/lib/utils";
import type { MenuItemWithCategory } from "@/lib/types";

const fallbackImages = [
  "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1200&q=85",
];

interface FeaturedMenuProps {
  menuItems: MenuItemWithCategory[];
}

export function FeaturedMenu({ menuItems }: FeaturedMenuProps) {
  const { locale, t } = useLocale();

  return (
    <section id="signature" className="scroll-reveal bg-[#0F0F0F] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#FFC107]">
              {t.landing.signatureEyebrow}
            </p>
            <h2 className="text-4xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl">
              {t.landing.signatureTitle}
            </h2>
          </div>
          <Link
            href="#branches"
            className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:text-[#FFC107]"
          >
            {t.landing.viewFullMenu}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {menuItems.length === 0 ? (
          <div className="rounded border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {t.landing.noMenuItems}
            </p>
          </div>
        ) : (
          <div className="grid gap-7 pt-4 sm:grid-cols-2 lg:grid-cols-4">
            {menuItems.map((item, index) => {
              const itemName = getLocalizedField(locale, item.name, item.nameMy);
              const itemDescription = getLocalizedField(
                locale,
                item.description ?? "",
                item.descriptionMy
              );
              const categoryName = getLocalizedField(
                locale,
                item.category.name,
                item.category.nameMy
              );

              return (
                <article
                  key={item.id}
                  className="group relative rounded-lg border border-white/10 bg-[#171717] p-3 shadow-[0_22px_70px_rgba(0,0,0,0.42)] transition-all duration-300 hover:-translate-y-2 hover:border-[#FFC107]/50 hover:shadow-[0_34px_90px_rgba(0,0,0,0.58)]"
                >
                  <div className="absolute inset-x-6 top-4 h-16 rounded-full bg-[#E53935]/20 blur-2xl transition-opacity duration-300 group-hover:opacity-80" />
                  <div className="relative aspect-[5/4] overflow-hidden rounded-lg shadow-[0_18px_45px_rgba(0,0,0,0.45)] ring-1 ring-white/10 transition-transform duration-300 group-hover:-translate-y-1">
                    <Image
                      src={item.image || fallbackImages[index % fallbackImages.length]}
                      alt={itemName}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10" />
                  </div>
                  <div className="relative px-2 pb-2 pt-5">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="min-w-0 truncate text-xs font-bold uppercase tracking-[0.2em] text-[#FFC107]">
                        {categoryName}
                      </p>
                      <p className="shrink-0 rounded-full bg-[#FFC107] px-2.5 py-1 text-xs font-black text-black">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <h3 className="text-xl font-black uppercase tracking-[0.06em] text-white">
                      {itemName}
                    </h3>
                    {itemDescription && (
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-400">
                        {itemDescription}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

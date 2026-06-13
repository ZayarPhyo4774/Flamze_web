"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { BranchSummary } from "@/lib/types";

const branchImages = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85",
  "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1200&q=85",
];

const fallbackBranches: BranchSummary[] = [
  {
    id: "yangon",
    slug: "yangon",
    name: "Yangon",
    address: "An elegant dining room in the heart of the city.",
    phone: null,
    openingHours: null,
    mapUrl: null,
  },
  {
    id: "mandalay",
    slug: "mandalay",
    name: "Mandalay",
    address: "A warm premium grill house for family celebrations.",
    phone: null,
    openingHours: null,
    mapUrl: null,
  },
];

interface BranchesProps {
  branches: BranchSummary[];
}

export function Branches({ branches }: BranchesProps) {
  const { t } = useLocale();
  const visibleBranches = branches.length > 0 ? branches : fallbackBranches;

  return (
    <section id="branches" className="scroll-reveal bg-black px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#E53935]">
            {t.landing.branchesEyebrow}
          </p>
          <h2 className="text-4xl font-black uppercase tracking-[0.08em] text-white sm:text-5xl">
            {t.landing.branchesTitle}
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-400">
            {t.landing.branchesDescription}
          </p>
        </div>

        <div className={`grid gap-5 md:grid-cols-2 lg:grid-cols-3 ${visibleBranches.length === 1 ? "place-items-center" : ""}`}>
          {visibleBranches.map((branch, index) => (
            <Link
              key={branch.id}
              href={`/menu?branch=${branch.slug}`}
              className={`group overflow-hidden rounded border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[#E53935]/60 ${visibleBranches.length === 1 ? "w-full sm:w-[540px]" : "w-full"}`}
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={branchImages[index % branchImages.length]}
                  alt={`${branch.name} branch`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-2 text-[#FFC107]">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.22em]">
                    {t.landing.branchLabel}
                  </span>
                </div>
                <h3 className="text-2xl font-black uppercase tracking-[0.06em] text-white">
                  {branch.name}
                </h3>
                <p className="mt-3 min-h-12 text-sm leading-6 text-zinc-400">
                  {branch.address ?? t.landing.branchFallbackAddress}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FFC107]">
                  {t.landing.viewMenu}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

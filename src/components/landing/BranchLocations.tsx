"use client";

import Link from "next/link";
import { ChevronRight, Clock, MapPin, Navigation, Phone } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import type { BranchSummary } from "@/lib/types";

interface BranchLocationsProps {
  branches: BranchSummary[];
}

export function BranchLocations({ branches }: BranchLocationsProps) {
  const { t } = useLocale();

  if (branches.length === 0) {
    return null;
  }

  return (
    <section
      id="locations"
      className="scroll-reveal overflow-hidden bg-[#0F0F0F] px-4 py-24 sm:px-6"
    >
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#FFC107]">
            {t.landing.locationsEyebrow}
          </p>
          <h2 className="max-w-xl text-4xl font-black uppercase leading-tight tracking-[0.08em] text-white sm:text-5xl">
            {t.landing.locationsTitle}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-8 text-zinc-400">
            {t.landing.locationsDescription}
          </p>

          <div className="mt-8 overflow-hidden rounded border border-white/10 bg-black">
            <div className="relative min-h-[360px]">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:42px_42px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(229,57,53,0.32),transparent_28%),radial-gradient(circle_at_72%_70%,rgba(255,193,7,0.24),transparent_28%)]" />
              <div className="absolute left-8 right-10 top-1/2 h-1 -translate-y-1/2 rotate-[-12deg] bg-[#FFC107]/70 shadow-[0_0_28px_rgba(255,193,7,0.45)]" />
              <div className="absolute bottom-12 left-14 top-10 w-1 rotate-[18deg] bg-[#E53935]/70 shadow-[0_0_28px_rgba(229,57,53,0.45)]" />

              {(() => {
                const pinPositions =
                  branches.length === 1
                    ? ["left-1/2 top-1/2"]
                    : [
                        "left-[18%] top-[22%]",
                        "right-[18%] top-[30%]",
                        "left-[36%] bottom-[18%]",
                        "right-[28%] bottom-[24%]",
                      ];

                return branches.slice(0, 4).map((branch, index) => (
                  <Link
                    key={branch.id}
                    href={`/menu?branch=${branch.slug}`}
                    className={`absolute ${pinPositions[index] ?? pinPositions[0]} group flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full border border-[#FFC107]/60 bg-black/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-2xl shadow-black/50 backdrop-blur transition-all duration-300 hover:border-[#FFC107] hover:bg-[#FFC107] hover:text-black`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E53935] text-white">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <span className="max-w-28 truncate">{branch.name}</span>
                  </Link>
                ));
              })()}
            </div>
          </div>
        </div>

        <div className={`grid gap-4 ${branches.length === 1 ? "place-items-center" : ""}`}>
          {branches.map((branch, index) => (
            <article
              key={branch.id}
              className={`group rounded border border-white/10 bg-black p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FFC107]/60 hover:bg-[#151515] ${branches.length === 1 ? "w-full sm:w-[540px]" : "w-full"}`}
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="mb-3 flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-[#E53935] text-sm font-black text-white">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl font-black uppercase tracking-[0.06em] text-white">
                      {branch.name}
                    </h3>
                  </div>

                  <div className="space-y-3 text-sm leading-6 text-zinc-400">
                    <p className="flex gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC107]" />
                      {branch.address ?? t.landing.noLocationDetails}
                    </p>
                    {branch.openingHours && (
                      <p className="flex gap-3">
                        <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC107]" />
                        <span>
                          <span className="text-zinc-500">{t.landing.openHours}: </span>
                          {branch.openingHours}
                        </span>
                      </p>
                    )}
                    {branch.phone && (
                      <p className="flex gap-3">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#FFC107]" />
                        {branch.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 flex-col gap-3 sm:items-end">
                  {branch.mapUrl && (
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded bg-[#FFC107] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-black transition-all duration-300 hover:bg-white"
                    >
                      <Navigation className="h-4 w-4" />
                      {t.landing.directions}
                    </a>
                  )}
                  {branch.phone && (
                    <a
                      href={`tel:${branch.phone.replaceAll(" ", "")}`}
                      className="inline-flex items-center justify-center gap-2 rounded border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:border-[#E53935] hover:text-white"
                    >
                      <Phone className="h-4 w-4" />
                      {t.landing.callBranch}
                    </a>
                  )}
                  <Link
                    href={`/menu?branch=${branch.slug}`}
                    className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#FFC107] transition-colors hover:text-white"
                  >
                    {t.landing.viewMenu}
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

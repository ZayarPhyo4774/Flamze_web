"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export function CTA() {
  const { t } = useLocale();

  return (
    <section className="scroll-reveal bg-black px-4 py-20 sm:px-6">
      <div className="relative mx-auto min-h-[360px] max-w-7xl overflow-hidden rounded border border-[#FFC107]/30">
        <Image
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1800&q=85"
          alt="Hot grill and premium BBQ"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,193,7,0.22),transparent_30%)]" />
        <div className="relative z-10 flex min-h-[360px] flex-col items-start justify-center px-6 py-12 sm:px-12 lg:px-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#FFC107]">
            {t.landing.ctaEyebrow}
          </p>
          <h2 className="max-w-3xl text-4xl font-black uppercase leading-tight tracking-[0.08em] text-white sm:text-6xl">
            {t.landing.ctaTitle}
          </h2>
          <Link
            href="#branches"
            className="group mt-8 inline-flex items-center gap-2 rounded bg-[#FFC107] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-white"
          >
            {t.landing.viewFullMenu}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

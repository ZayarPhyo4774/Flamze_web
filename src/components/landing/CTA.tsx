"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { getLocalizedField } from "@/i18n/translations";
import type { LandingSectionContent } from "@/lib/types";
import { LANDING_IMAGE_DEFAULTS } from "@/lib/landing-images";

interface CTAProps {
  content?: LandingSectionContent;
}

export function CTA({ content }: CTAProps) {
  const { locale, t } = useLocale();
  const eyebrow =
    getLocalizedField(locale, content?.eyebrowEn ?? "", content?.eyebrowMy) ||
    t.landing.ctaEyebrow;
  const title =
    getLocalizedField(locale, content?.titleEn ?? "", content?.titleMy) ||
    t.landing.ctaTitle;
  const ctaLabel =
    getLocalizedField(locale, content?.ctaLabelEn ?? "", content?.ctaLabelMy) ||
    t.landing.viewFullMenu;
  const ctaHref = content?.ctaHref || "/#branches";
  const imageSrc = content?.imageUrl || LANDING_IMAGE_DEFAULTS.cta;

  return (
    <section className="scroll-reveal bg-black px-4 py-20 sm:px-6">
      <div className="relative mx-auto min-h-[360px] max-w-7xl overflow-hidden rounded border border-[#FFC107]/30">
        <Image
          src={imageSrc}
          alt="Hot grill and premium BBQ"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,193,7,0.22),transparent_30%)]" />
        <div className="relative z-10 flex min-h-[360px] flex-col items-start justify-center px-6 py-12 sm:px-12 lg:px-16">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.34em] text-[#FFC107]">
            {eyebrow}
          </p>
          <h2 className="max-w-3xl text-4xl font-black uppercase leading-tight tracking-[0.08em] text-white sm:text-6xl">
            {title}
          </h2>
          <Link
            href={ctaHref}
            className="group mt-8 inline-flex items-center gap-2 rounded bg-[#FFC107] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-white"
          >
            {ctaLabel}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

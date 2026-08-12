"use client";

import Image from "next/image";
import { Flame, Sparkles, Utensils } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { getLocalizedField } from "@/i18n/translations";
import type { LandingSectionContent } from "@/lib/types";
import { LANDING_IMAGE_DEFAULTS } from "@/lib/landing-images";

const highlights = [
  { icon: Flame, labelKey: "highlightBbq" },
  { icon: Utensils, labelKey: "highlightIngredients" },
  { icon: Sparkles, labelKey: "highlightBroths" },
] as const;

interface AboutProps {
  content?: LandingSectionContent;
}

export function About({ content }: AboutProps) {
  const { locale, t } = useLocale();
  const eyebrow =
    getLocalizedField(locale, content?.eyebrowEn ?? "", content?.eyebrowMy) ||
    t.landing.aboutEyebrow;
  const title =
    getLocalizedField(locale, content?.titleEn ?? "", content?.titleMy) ||
    t.landing.aboutTitle;
  const description =
    getLocalizedField(locale, content?.descriptionEn ?? "", content?.descriptionMy) ||
    t.landing.aboutDescription;
  const imageSrc = content?.imageUrl || LANDING_IMAGE_DEFAULTS.about;

  return (
    <section id="about" className="scroll-reveal bg-[#0F0F0F] px-4 py-24 sm:px-6">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div className="relative min-h-[420px] overflow-hidden rounded border border-white/10">
          <Image
            src={imageSrc}
            alt="Elegant restaurant dining interior"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 border-l-2 border-[#FFC107] pl-5">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#FFC107]">
              {t.landing.aboutImageEyebrow}
            </p>
            <p className="mt-2 max-w-md text-lg font-semibold text-white">
              {t.landing.aboutImageText}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.34em] text-[#FFC107]">
            {eyebrow}
          </p>
          <h2 className="text-4xl font-black uppercase leading-tight tracking-[0.08em] text-white sm:text-5xl">
            {title}
          </h2>
          <p className="mt-6 text-base leading-8 text-zinc-400">
            {description}
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.labelKey}
                  className="rounded border border-white/10 bg-white/[0.03] p-4"
                >
                  <Icon className="mb-4 h-5 w-5 text-[#E53935]" />
                  <p className="text-sm font-bold uppercase leading-6 tracking-[0.12em] text-zinc-100">
                    {t.landing[item.labelKey]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

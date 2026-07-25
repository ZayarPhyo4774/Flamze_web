"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export function Hero() {
  const { t } = useLocale();

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-end justify-center overflow-hidden px-4 py-28 text-center"
    >
      {/* <Image
        src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=2400&q=85"
        alt="Premium hotpot and BBQ table"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      /> */}
      <video
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      className="absolute insert-0 h-full w-full object-contain"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(229,57,53,0.28),transparent_36%),linear-gradient(180deg,rgba(15,15,15,0.25)_0%,#0F0F0F_100%)]" />

      <div className="relative z-10 mx-auto max-w-5xl animate-hero-fade">
        <p className="mb-5 text-xs font-bold uppercase tracking-[0.42em] text-[#FFC107]">
          {t.hero.eyebrow}
        </p>
        <h1 className="text-balance text-4xl font-black uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-3xl lg:text-4xl">
          {t.hero.title}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg font-medium tracking-[0.12em] text-zinc-200 sm:text-xl">
          {t.hero.subtitle}
        </p>

        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/menu?branch=yangon"
            className="group flex w-full items-center justify-center gap-2 rounded bg-[#FFC107] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-white sm:w-auto"
          >
            {t.hero.viewMenu}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

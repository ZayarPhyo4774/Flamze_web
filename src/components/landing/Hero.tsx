"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { useLocale } from "@/context/LocaleContext";
import { getLocalizedField } from "@/i18n/translations";
import { useMediaQuery } from "@/lib/use-media-query";
import type { LandingPageContent } from "@/lib/types";

interface HeroProps {
  content: LandingPageContent;
}

function videoMimeType(url: string) {
  const clean = url.split("?")[0]?.toLowerCase() ?? "";
  if (clean.endsWith(".webm")) return "video/webm";
  return "video/mp4";
}

export function Hero({ content }: HeroProps) {
  const { locale, t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const isMobile = useMediaQuery("(max-width: 639px)");

  const eyebrow = getLocalizedField(locale, content.eyebrowEn, content.eyebrowMy) || t.hero.eyebrow;
  const title = getLocalizedField(locale, content.titleEn, content.titleMy) || t.hero.title;
  const subtitle =
    getLocalizedField(locale, content.subtitleEn, content.subtitleMy) || t.hero.subtitle;
  const ctaLabel =
    getLocalizedField(locale, content.ctaLabelEn, content.ctaLabelMy) || t.hero.viewMenu;
  const ctaHref = content.ctaHref || "/menu?branch=yangon";

  const desktopVideoUrl = content.heroVideoUrl || "/video/hero.mp4";
  const mobileVideoUrl = content.heroVideoUrlMobile || desktopVideoUrl;
  const videoUrl = isMobile ? mobileVideoUrl : desktopVideoUrl;
  const posterUrl = isMobile
    ? content.heroPosterUrlMobile ?? content.heroPosterUrl ?? undefined
    : content.heroPosterUrl ?? undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "true");
    video.setAttribute("x5-playsinline", "true");

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Autoplay can still fail on low-power mode; poster/gradient remain visible.
        });
      }
    };

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryPlay();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [videoUrl]);

  return (
    <section
      id="home"
      className="relative flex h-[100svh] h-[100dvh] w-full items-end justify-center overflow-hidden px-4 pb-[max(5rem,env(safe-area-inset-bottom))] pt-[max(6rem,env(safe-area-inset-top))] text-center sm:min-h-[100svh] sm:py-28"
    >
      <div className="hero-media pointer-events-none" aria-hidden>
        <video
          key={videoUrl}
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterUrl}
          disablePictureInPicture
          controls={false}
          className={isMobile ? "hero-video hero-video--mobile" : "hero-video hero-video--desktop"}
        >
          <source src={videoUrl} type={videoMimeType(videoUrl)} />
        </video>
      </div>

      <div className="absolute inset-0 bg-black/35 sm:bg-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(229,57,53,0.28),transparent_36%),linear-gradient(180deg,rgba(15,15,15,0.2)_0%,rgba(15,15,15,0.55)_55%,#0F0F0F_100%)]" />

      <div className="relative z-10 mx-auto w-full max-w-5xl animate-hero-fade">
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.32em] text-[#FFC107] sm:mb-5 sm:text-xs sm:tracking-[0.42em]">
          {eyebrow}
        </p>
        <h1 className="text-balance text-3xl font-black uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base font-medium tracking-[0.08em] text-zinc-200 sm:mt-6 sm:text-xl sm:tracking-[0.12em]">
          {subtitle}
        </p>

        <div className="mt-8 flex items-center justify-center sm:mt-10">
          <Link
            href={ctaHref}
            className="group flex w-full max-w-sm items-center justify-center gap-2 rounded bg-[#FFC107] px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition-all duration-300 hover:bg-white sm:w-auto sm:max-w-none"
          >
            {ctaLabel}
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

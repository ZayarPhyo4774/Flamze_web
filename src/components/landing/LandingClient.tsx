"use client";

import { About } from "@/components/landing/About";
import { BranchLocations } from "@/components/landing/BranchLocations";
import { Branches } from "@/components/landing/Branches";
import { CTA } from "@/components/landing/CTA";
import { FeaturedMenu } from "@/components/landing/FeaturedMenu";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import type { BranchMapPoint } from "@/lib/branch-map-points";
import type { PublishedSiteContent } from "@/lib/landing-content";
import type { BranchSummary, MenuItemWithCategory } from "@/lib/types";

interface LandingClientProps {
  branches: BranchSummary[];
  mapPoints: BranchMapPoint[];
  featuredMenuItems: MenuItemWithCategory[];
  siteContent: PublishedSiteContent;
}

export function LandingClient({
  branches,
  mapPoints,
  featuredMenuItems,
  siteContent,
}: LandingClientProps) {
  const sectionMap = Object.fromEntries(
    siteContent.sections.map((section) => [section.key, section])
  );

  const renderSection = (key: string) => {
    const section = sectionMap[key];
    if (!section) return null;

    switch (key) {
      case "signature":
        return (
          <FeaturedMenu
            key={key}
            menuItems={featuredMenuItems}
            content={section}
          />
        );
      case "branches":
        return <Branches key={key} branches={branches} content={section} />;
      case "locations":
        return (
          <BranchLocations
            key={key}
            branches={branches}
            mapPoints={mapPoints}
            content={section}
          />
        );
      case "about":
        return <About key={key} content={section} />;
      case "cta":
        return <CTA key={key} content={section} />;
      case "footer":
        return (
          <Footer
            key={key}
            content={section}
            navLinks={siteContent.navLinks}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar navLinks={siteContent.navLinks} />
      <Hero content={siteContent.landing} />
      {siteContent.sections.map((section) => renderSection(section.key))}
    </main>
  );
}

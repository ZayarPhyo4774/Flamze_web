"use client";

import { About } from "@/components/landing/About";
import { BranchLocations } from "@/components/landing/BranchLocations";
import { Branches } from "@/components/landing/Branches";
import { CTA } from "@/components/landing/CTA";
import { FeaturedMenu } from "@/components/landing/FeaturedMenu";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Navbar } from "@/components/landing/Navbar";
import type { BranchSummary, MenuItemWithCategory } from "@/lib/types";

interface LandingClientProps {
  branches: BranchSummary[];
  featuredMenuItems: MenuItemWithCategory[];
}

export function LandingClient({ branches, featuredMenuItems }: LandingClientProps) {
  return (
    <main className="min-h-screen bg-[#0F0F0F] text-white">
      <Navbar />
      <Hero />
      <FeaturedMenu menuItems={featuredMenuItems} />
      <Branches branches={branches} />
      <BranchLocations branches={branches} />
      <About />
      <CTA />
      <Footer />
    </main>
  );
}

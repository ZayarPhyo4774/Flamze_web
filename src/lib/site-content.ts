import { prisma } from "@/lib/prisma";
import {
  DEFAULT_LANDING_PAGE,
  DEFAULT_LANDING_SECTIONS,
  DEFAULT_NAV_LINKS,
  LANDING_PAGE_ID,
} from "@/lib/site-content-defaults";

export async function ensureSiteContentSeeded() {
  const existing = await prisma.landingPage.findUnique({
    where: { id: LANDING_PAGE_ID },
  });

  if (!existing) {
    await prisma.landingPage.create({ data: DEFAULT_LANDING_PAGE });
  }

  for (const section of DEFAULT_LANDING_SECTIONS) {
    await prisma.landingSection.upsert({
      where: { key: section.key },
      update: {},
      create: section,
    });
  }

  const navCount = await prisma.navLink.count();
  if (navCount === 0) {
    await prisma.navLink.createMany({ data: DEFAULT_NAV_LINKS });
  }
}

export async function getPublishedSiteContent() {
  await ensureSiteContentSeeded();

  const [landing, sections, navLinks] = await Promise.all([
    prisma.landingPage.findUniqueOrThrow({ where: { id: LANDING_PAGE_ID } }),
    prisma.landingSection.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.navLink.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return {
    landing,
    sections: sections.filter((s) => s.isVisible),
    allSections: sections,
    navLinks,
  };
}

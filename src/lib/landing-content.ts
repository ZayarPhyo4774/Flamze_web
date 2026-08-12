import type {
  LandingPageContent,
  LandingSectionContent,
  NavLinkContent,
} from "@/lib/types";

export type PublishedSiteContent = {
  landing: LandingPageContent;
  sections: LandingSectionContent[];
  navLinks: NavLinkContent[];
};

export function sectionByKey(
  sections: LandingSectionContent[],
  key: string
): LandingSectionContent | undefined {
  return sections.find((section) => section.key === key);
}

import { translations } from "@/i18n/translations";

const en = translations.en;
const my = translations.my;

export const LANDING_PAGE_ID = "default";

export const DEFAULT_LANDING_PAGE = {
  id: LANDING_PAGE_ID,
  eyebrowEn: en.hero.eyebrow,
  eyebrowMy: my.hero.eyebrow,
  titleEn: en.hero.title,
  titleMy: my.hero.title,
  subtitleEn: en.hero.subtitle,
  subtitleMy: my.hero.subtitle,
  ctaLabelEn: en.hero.viewMenu,
  ctaLabelMy: my.hero.viewMenu,
  ctaHref: "/menu?branch=yangon",
  heroVideoUrl: "/video/hero.mp4",
  heroVideoUrlMobile: null as string | null,
  heroPosterUrl: null as string | null,
  heroPosterUrlMobile: null as string | null,
};

export type LandingSectionKey =
  | "signature"
  | "branches"
  | "locations"
  | "about"
  | "cta"
  | "footer";

export const DEFAULT_LANDING_SECTIONS: Array<{
  key: LandingSectionKey;
  sortOrder: number;
  isVisible: boolean;
  eyebrowEn: string | null;
  eyebrowMy: string | null;
  titleEn: string | null;
  titleMy: string | null;
  descriptionEn: string | null;
  descriptionMy: string | null;
  ctaLabelEn: string | null;
  ctaLabelMy: string | null;
  ctaHref: string | null;
  imageUrl: string | null;
}> = [
  {
    key: "signature",
    sortOrder: 10,
    isVisible: true,
    eyebrowEn: en.landing.signatureEyebrow,
    eyebrowMy: my.landing.signatureEyebrow,
    titleEn: en.landing.signatureTitle,
    titleMy: my.landing.signatureTitle,
    descriptionEn: null,
    descriptionMy: null,
    ctaLabelEn: en.landing.viewFullMenu,
    ctaLabelMy: my.landing.viewFullMenu,
    ctaHref: "/#branches",
    imageUrl: null,
  },
  {
    key: "branches",
    sortOrder: 20,
    isVisible: true,
    eyebrowEn: en.landing.branchesEyebrow,
    eyebrowMy: my.landing.branchesEyebrow,
    titleEn: en.landing.branchesTitle,
    titleMy: my.landing.branchesTitle,
    descriptionEn: en.landing.branchesDescription,
    descriptionMy: my.landing.branchesDescription,
    ctaLabelEn: null,
    ctaLabelMy: null,
    ctaHref: null,
    imageUrl: null,
  },
  {
    key: "locations",
    sortOrder: 30,
    isVisible: true,
    eyebrowEn: en.landing.locationsEyebrow,
    eyebrowMy: my.landing.locationsEyebrow,
    titleEn: en.landing.locationsTitle,
    titleMy: my.landing.locationsTitle,
    descriptionEn: en.landing.locationsDescription,
    descriptionMy: my.landing.locationsDescription,
    ctaLabelEn: null,
    ctaLabelMy: null,
    ctaHref: null,
    imageUrl: null,
  },
  {
    key: "about",
    sortOrder: 40,
    isVisible: true,
    eyebrowEn: en.landing.aboutEyebrow,
    eyebrowMy: my.landing.aboutEyebrow,
    titleEn: en.landing.aboutTitle,
    titleMy: my.landing.aboutTitle,
    descriptionEn: en.landing.aboutDescription,
    descriptionMy: my.landing.aboutDescription,
    ctaLabelEn: null,
    ctaLabelMy: null,
    ctaHref: null,
    imageUrl: null,
  },
  {
    key: "cta",
    sortOrder: 50,
    isVisible: true,
    eyebrowEn: en.landing.ctaEyebrow,
    eyebrowMy: my.landing.ctaEyebrow,
    titleEn: en.landing.ctaTitle,
    titleMy: my.landing.ctaTitle,
    descriptionEn: null,
    descriptionMy: null,
    ctaLabelEn: en.landing.viewFullMenu,
    ctaLabelMy: my.landing.viewFullMenu,
    ctaHref: "/#branches",
    imageUrl: null,
  },
  {
    key: "footer",
    sortOrder: 60,
    isVisible: true,
    eyebrowEn: null,
    eyebrowMy: null,
    titleEn: null,
    titleMy: null,
    descriptionEn: en.landing.footerDescription,
    descriptionMy: my.landing.footerDescription,
    ctaLabelEn: null,
    ctaLabelMy: null,
    ctaHref: null,
    imageUrl: null,
  },
];

export const DEFAULT_NAV_LINKS = [
  { labelEn: en.nav.home, labelMy: my.nav.home, href: "/", sortOrder: 10 },
  { labelEn: en.nav.menu, labelMy: my.nav.menu, href: "/#signature", sortOrder: 20 },
  { labelEn: en.nav.branches, labelMy: my.nav.branches, href: "/#branches", sortOrder: 30 },
  { labelEn: en.nav.locations, labelMy: my.nav.locations, href: "/#locations", sortOrder: 40 },
  { labelEn: en.nav.about, labelMy: my.nav.about, href: "/#about", sortOrder: 50 },
];

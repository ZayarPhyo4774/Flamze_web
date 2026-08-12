export type MenuItemWithCategory = {
  id: string;
  name: string;
  nameMy: string | null;
  description: string | null;
  descriptionMy: string | null;
  price: number;
  image: string | null;
  rating: number;
  branchId: string;
  categoryId: string;
  isAvailable: boolean;
  branches?: {
    id: string;
    name: string;
  }[];
  category: {
    id: string;
    slug: string;
    name: string;
    nameMy: string | null;
  };
};

export type BranchSummary = {
  id: string;
  slug: string;
  name: string;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  mapUrl: string | null;
  imageUrl: string | null;
  _count?: {
    menuItems: number;
  };
};

export type BranchFormData = {
  name: string;
  slug: string;
  address?: string;
  phone?: string;
  openingHours?: string;
  mapUrl?: string;
  imageUrl?: string;
};

export type CategoryFormData = {
  name: string;
  nameMy?: string;
  slug: string;
  sortOrder: number;
  parentId?: string | null;
};

export type NavLinkFormData = {
  labelEn: string;
  labelMy?: string;
  href: string;
  sortOrder: number;
  isVisible?: boolean;
};

export type LandingPageContent = {
  eyebrowEn: string;
  eyebrowMy: string | null;
  titleEn: string;
  titleMy: string | null;
  subtitleEn: string;
  subtitleMy: string | null;
  ctaLabelEn: string;
  ctaLabelMy: string | null;
  ctaHref: string;
  heroVideoUrl: string;
  heroVideoUrlMobile: string | null;
  heroPosterUrl: string | null;
  heroPosterUrlMobile: string | null;
};

export type LandingSectionContent = {
  id: string;
  key: string;
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
};

export type NavLinkContent = {
  id: string;
  labelEn: string;
  labelMy: string | null;
  href: string;
  sortOrder: number;
  isVisible: boolean;
};

export type MenuItemFormData = {
  name: string;
  nameMy?: string;
  description?: string;
  descriptionMy?: string;
  price: number;
  image?: string;
  rating: number;
  branchIds: string[];
  categoryId: string;
  isAvailable?: boolean;
};

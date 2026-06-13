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
};

export type CategoryFormData = {
  name: string;
  nameMy?: string;
  slug: string;
  sortOrder: number;
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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  const rounded = Math.round(price);
  const formatted = rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `MMK ${formatted}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function sanitizeAdminRedirect(path: string | null): string {
  if (path && path.startsWith("/admin") && !path.startsWith("//")) {
    return path;
  }
  return "/admin";
}

export function getMenuUrl(branchSlug: string, siteUrl?: string): string {
  const base = siteUrl ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/menu?branch=${branchSlug}`;
}

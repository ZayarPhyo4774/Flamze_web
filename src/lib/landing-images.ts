/** Default fallbacks when CMS image URLs are not set */
export const LANDING_IMAGE_DEFAULTS = {
  about:
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=85",
  cta: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1800&q=85",
  branch: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1559329007-40df8a9345d8?auto=format&fit=crop&w=1200&q=85",
  ],
} as const;

export function branchImageFallback(index: number) {
  const images = LANDING_IMAGE_DEFAULTS.branch;
  return images[index % images.length];
}

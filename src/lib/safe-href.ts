const MAX_HREF_LENGTH = 500;

/**
 * Allow relative app paths (/..., /#...) or https URLs.
 * Rejects javascript:, data:, and protocol-relative // hosts.
 */
export function isSafeHref(href: string): boolean {
  const value = href.trim();
  if (!value || value.length > MAX_HREF_LENGTH) return false;
  if (value.startsWith("//")) return false;

  const lower = value.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return false;
  }

  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "https:";
  } catch {
    return false;
  }
}

export function assertSafeHref(href: string, field = "href"): string | null {
  const trimmed = href.trim();
  if (!isSafeHref(trimmed)) {
    return `${field} must be a relative path or https URL`;
  }
  return null;
}

export function parseOptionalSafeHref(
  value: unknown,
  field: string
): { error: string } | { value: string | null } {
  if (value == null || (typeof value === "string" && !value.trim())) {
    return { value: null };
  }
  if (typeof value !== "string") {
    return { error: `${field} must be a string` };
  }
  const trimmed = value.trim();
  const hrefError = assertSafeHref(trimmed, field);
  if (hrefError) return { error: hrefError };
  return { value: trimmed };
}

export function parseRequiredSafeHref(
  value: unknown,
  field: string,
  fallback: string
): { error: string } | { value: string } {
  const raw = typeof value === "string" && value.trim() ? value.trim() : fallback;
  const hrefError = assertSafeHref(raw, field);
  if (hrefError) return { error: hrefError };
  return { value: raw };
}

export const CMS_TEXT_LIMITS = {
  short: 200,
  title: 300,
  description: 2000,
  label: 120,
} as const;

export function clampText(value: string | null | undefined, max: number): string | null {
  if (value == null) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

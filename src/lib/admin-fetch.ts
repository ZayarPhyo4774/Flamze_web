import { ADMIN_CSRF_HEADER, CSRF_COOKIE } from "@/lib/auth-constants";

export function getCsrfToken(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CSRF_COOKIE}=`));
  return match?.slice(CSRF_COOKIE.length + 1);
}

export function adminHeaders(extra?: Record<string, string>): Record<string, string> {
  const csrf = getCsrfToken();
  return {
    ...extra,
    ...(csrf ? { [ADMIN_CSRF_HEADER]: csrf } : {}),
  };
}

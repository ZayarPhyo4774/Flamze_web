import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyRequestAuth } from "@/lib/auth";

const ADMIN_PAGE_PREFIX = "/admin";
const ADMIN_LOGIN = "/admin/login";

const PUBLIC_API_ROUTES: { path: string; methods: string[] }[] = [
  { path: "/api/menu", methods: ["GET"] },
  { path: "/api/analytics/view", methods: ["POST"] },
  { path: "/api/auth/login", methods: ["POST"] },
  { path: "/api/auth/logout", methods: ["POST"] },
];

const ADMIN_API_PREFIXES = [
  "/api/branches",
  "/api/categories",
  "/api/menu-items",
  "/api/upload",
  "/api/analytics",
];

function isPublicApi(pathname: string, method: string): boolean {
  return PUBLIC_API_ROUTES.some(
    (route) => pathname === route.path && route.methods.includes(method)
  );
}

function isAdminApi(pathname: string): boolean {
  return ADMIN_API_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  const isAdminPage =
    pathname.startsWith(ADMIN_PAGE_PREFIX) && pathname !== ADMIN_LOGIN;
  const needsAuth =
    isAdminPage || (isAdminApi(pathname) && !isPublicApi(pathname, method));

  if (!needsAuth) {
    return NextResponse.next();
  }

  const authenticated = await verifyRequestAuth(request);

  if (!authenticated) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL(ADMIN_LOGIN, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/branches/:path*",
    "/api/categories/:path*",
    "/api/menu-items/:path*",
    "/api/upload",
    "/api/analytics/:path*",
  ],
};

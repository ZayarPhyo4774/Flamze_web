import { randomBytes } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_CSRF_HEADER,
  CSRF_COOKIE,
  SESSION_COOKIE,
} from "@/lib/auth-constants";

export { ADMIN_CSRF_HEADER, CSRF_COOKIE, SESSION_COOKIE } from "@/lib/auth-constants";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

function getAdminPassword() {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  return adminPassword;
}

export function generateCsrfToken() {
  return randomBytes(32).toString("hex");
}

export async function createSessionToken(csrfToken: string) {
  return new SignJWT({ role: "admin", csrf: csrfToken })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

async function getSessionPayload(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function verifySessionToken(token: string) {
  const payload = await getSessionPayload(token);
  return payload !== null;
}

export function getSessionCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge,
    path: "/",
  };
}

export function getCsrfCookieOptions(maxAge = SESSION_MAX_AGE) {
  return {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge,
    path: "/",
  };
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export async function verifyRequestAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token);
}

export async function authorizeRequest(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await getSessionPayload(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.method !== "GET") {
    const headerToken = request.headers.get(ADMIN_CSRF_HEADER);
    const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
    const jwtCsrf = typeof payload.csrf === "string" ? payload.csrf : undefined;

    if (!headerToken || !cookieToken || headerToken !== cookieToken || headerToken !== jwtCsrf) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }
  }

  return null;
}

export function verifyPassword(password: string): boolean {
  const adminPassword = getAdminPassword();

  if (password.length !== adminPassword.length) return false;

  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ adminPassword.charCodeAt(i);
  }
  return mismatch === 0;
}

export { SESSION_MAX_AGE };

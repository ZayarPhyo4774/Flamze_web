import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "flamze-admin-session";
export const ADMIN_CSRF_HEADER = "x-flamze-csrf";
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

export async function createSessionToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret());
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.role === "admin";
  } catch {
    return false;
  }
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
  if (!token || !(await verifySessionToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.method !== "GET" && request.headers.get(ADMIN_CSRF_HEADER) !== "1") {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
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

import { NextRequest, NextResponse } from "next/server";
import {
  createSessionToken,
  generateCsrfToken,
  getCsrfCookieOptions,
  getSessionCookieOptions,
  CSRF_COOKIE,
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  verifyPassword,
} from "@/lib/auth";

// Simple in-memory login rate limiter per IP
const LOGIN_ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOGIN_MAX_ATTEMPTS = 5;
const loginAttempts = new Map<string, { count: number; firstSeen: number }>();

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const key = ip.split(",")[0].trim();

    const record = loginAttempts.get(key) ?? { count: 0, firstSeen: Date.now() };
    const now = Date.now();
    if (now - record.firstSeen > LOGIN_ATTEMPT_WINDOW_MS) {
      record.count = 0;
      record.firstSeen = now;
    }

    if (record.count >= LOGIN_MAX_ATTEMPTS) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    const { password } = await request.json();

    if (!password || !verifyPassword(password)) {
      record.count += 1;
      loginAttempts.set(key, record);
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // successful login: reset attempts
    loginAttempts.delete(key);

    const csrfToken = generateCsrfToken();
    const token = await createSessionToken(csrfToken);
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE, token, getSessionCookieOptions(SESSION_MAX_AGE));
    response.cookies.set(CSRF_COOKIE, csrfToken, getCsrfCookieOptions(SESSION_MAX_AGE));

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

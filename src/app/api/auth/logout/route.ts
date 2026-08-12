import { NextResponse } from "next/server";
import {
  CSRF_COOKIE,
  SESSION_COOKIE,
  getCsrfCookieOptions,
  getSessionCookieOptions,
} from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...getSessionCookieOptions(0),
    maxAge: 0,
  });
  response.cookies.set(CSRF_COOKIE, "", {
    ...getCsrfCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

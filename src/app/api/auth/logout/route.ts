import { NextResponse } from "next/server";
import { SESSION_COOKIE, getSessionCookieOptions } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, "", {
    ...getSessionCookieOptions(0),
    maxAge: 0,
  });
  return response;
}

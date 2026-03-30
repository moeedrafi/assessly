import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { UserRole } from "@/types/user";

function decodeJwt(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url), 307);
  }

  const payload = accessToken ? decodeJwt(accessToken) : null;
  if (!payload) {
    // If access token invalid, allow request to continue
    // Client can try refresh
    return NextResponse.next();
  }

  const role = payload.role;
  const exp = payload.exp * 1000;
  const isExpired = Date.now() > exp;
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isExpired) {
    // Non-admin trying to access admin route
    if (role !== UserRole.ADMIN && isAdminRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url), 307);
    }

    // Admin trying to access student route
    if (role === UserRole.ADMIN && !isAdminRoute) {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url),
        307,
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|login|register|forgot-password|reset-password).*)",
  ],
};

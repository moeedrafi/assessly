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

const AUTH_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (!accessToken && !refreshToken) {
    if (isAuthRoute) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.url), 307);
  }

  const payload = accessToken ? decodeJwt(accessToken) : null;
  if (!payload) {
    // If access token invalid, allow request to continue
    // Client can try refresh
    if (isAuthRoute && !refreshToken) return NextResponse.next();
    return NextResponse.next();
  }

  const role = payload.role;
  const isExpired = Date.now() > payload.exp * 1000;
  const isAdminRoute = pathname.startsWith("/admin");

  if (!isExpired) {
    if (isAuthRoute) {
      const destination =
        role === UserRole.ADMIN ? "/admin/dashboard" : "/dashboard";
      return NextResponse.redirect(new URL(destination, request.url), 307);
    }

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
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};

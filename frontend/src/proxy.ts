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

  // ✅ 1. Skip middleware for auth routes
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // ✅ 2. No tokens → force login
  if (!accessToken && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url), 307);
  }

  // ✅ 3. Invalid token → allow request (client will refresh)
  const payload = accessToken ? decodeJwt(accessToken) : null;
  if (!payload) {
    return NextResponse.next();
  }

  const role = payload.role;
  const isExpired = Date.now() > payload.exp * 1000;
  const isAdminRoute = pathname.startsWith("/admin");

  // ✅ 4. Only enforce rules if token is valid
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

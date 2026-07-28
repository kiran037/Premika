import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware logic to /admin paths
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token && token.includes(".")) {
    try {
      const [dataStr] = token.split(".");
      const decodedJson = atob(dataStr.replace(/-/g, "+").replace(/_/g, "/"));
      const payload = JSON.parse(decodedJson);

      if (payload && payload.expiresAt && Date.now() < payload.expiresAt) {
        isAuthenticated = true;
      }
    } catch {
      isAuthenticated = false;
    }
  }

  const isLoginPage = pathname === "/admin/login";

  // 1. Unauthenticated admin trying to access protected dashboard -> Redirect to login
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Authenticated admin visiting login page -> Redirect to dashboard
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

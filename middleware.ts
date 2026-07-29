import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "admin_session_token";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "premika_super_secret_admin_session_key_2025";

/**
 * Verify HMAC SHA-256 token signature using Edge-compatible Web Crypto API
 */
async function verifyTokenSignature(dataStr: string, signature: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(SESSION_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      encoder.encode(dataStr)
    );
    const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    return signature === expectedSignature;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware logic to /admin paths
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  let isAuthenticated = false;

  if (token && token.includes(".")) {
    try {
      const [dataStr, signature] = token.split(".");

      if (dataStr && signature) {
        const isValidSignature = await verifyTokenSignature(dataStr, signature);

        if (isValidSignature) {
          const decodedJson = atob(dataStr.replace(/-/g, "+").replace(/_/g, "/"));
          const payload = JSON.parse(decodedJson);

          if (payload && payload.expiresAt && Date.now() < payload.expiresAt) {
            isAuthenticated = true;
          }
        }
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

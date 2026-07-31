import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService, ADMIN_COOKIE_NAME } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

const loginRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = loginRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    loginRateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const ipAddress = rawIp.trim();

    if (isRateLimited(ipAddress, 5, 60000)) {
      return NextResponse.json(
        { success: false, message: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const userAgent = req.headers.get("user-agent") || "unknown";

    const authResult = await AdminAuthService.authenticate({
      email: body.email,
      password: body.password,
      rememberMe: Boolean(body.rememberMe),
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Admin authenticated successfully",
        data: authResult.admin,
      },
      { status: 200 }
    );

    // Set HTTP-only Cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: authResult.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: authResult.maxAge,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Error in admin login route:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to authenticate admin" },
      { status: 401 }
    );
  }
}

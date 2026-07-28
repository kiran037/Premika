import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService, ADMIN_COOKIE_NAME } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    let adminId: string | undefined = undefined;

    if (token) {
      const payload = AdminAuthService.verifySessionToken(token);
      if (payload) adminId = payload.adminId;
    }

    const ipAddress = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await AdminAuthService.logoutAdmin(adminId, ipAddress, userAgent);

    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    // Destroy HTTP-only Cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: "",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (err: any) {
    console.error("Error in admin logout route:", err);
    return NextResponse.json(
      { success: false, message: "Error processing logout" },
      { status: 500 }
    );
  }
}

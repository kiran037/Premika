import { NextRequest, NextResponse } from "next/server";
import { AdminAuthService, ADMIN_COOKIE_NAME } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "Unauthenticated admin request" },
      { status: 401 }
    );
  }

  const session = AdminAuthService.verifySessionToken(token);

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired admin session token" },
      { status: 401 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      data: {
        adminId: session.adminId,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    },
    { status: 200 }
  );
}

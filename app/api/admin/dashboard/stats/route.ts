import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/services/analytics.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin request" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const range = (searchParams.get("range") || "30d") as "today" | "7d" | "30d" | "year";

    const stats = await AnalyticsService.getDashboardStats(range);

    return NextResponse.json({ success: true, data: stats }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching admin dashboard stats:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch stats" },
      { status: 500 }
    );
  }
}

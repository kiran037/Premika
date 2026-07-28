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

    const widgets = await AnalyticsService.getDashboardWidgets();

    return NextResponse.json({ success: true, data: widgets }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching admin dashboard widgets:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch widgets" },
      { status: 500 }
    );
  }
}

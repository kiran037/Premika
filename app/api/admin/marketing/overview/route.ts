import { NextRequest, NextResponse } from "next/server";
import { MarketingService } from "@/services/marketing.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await MarketingService.getMarketingOverview();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching marketing overview:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch marketing overview" },
      { status: 500 }
    );
  }
}

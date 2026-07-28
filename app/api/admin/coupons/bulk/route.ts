import { NextRequest, NextResponse } from "next/server";
import { CouponService } from "@/services/coupon.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { ids, action } = body as { ids: string[]; action: "activate" | "deactivate" | "delete" };

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "Please select at least one coupon" },
        { status: 400 }
      );
    }

    if (action === "activate") {
      const count = await CouponService.bulkUpdateStatus(ids, true);
      return NextResponse.json(
        { success: true, message: `Successfully activated ${count} coupon(s)` },
        { status: 200 }
      );
    } else if (action === "deactivate") {
      const count = await CouponService.bulkUpdateStatus(ids, false);
      return NextResponse.json(
        { success: true, message: `Successfully deactivated ${count} coupon(s)` },
        { status: 200 }
      );
    } else if (action === "delete") {
      const count = await CouponService.bulkDelete(ids);
      return NextResponse.json(
        { success: true, message: `Successfully deleted ${count} coupon(s)` },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid bulk action" },
        { status: 400 }
      );
    }
  } catch (err: any) {
    console.error("Error in bulk coupon action:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Bulk operation failed" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { CouponService } from "@/services/coupon.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const duplicated = await CouponService.duplicateCoupon(params.id);
    return NextResponse.json(
      { success: true, data: duplicated, message: "Coupon duplicated successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error duplicating coupon:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to duplicate coupon" },
      { status: 400 }
    );
  }
}

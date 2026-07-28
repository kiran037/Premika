import { NextRequest, NextResponse } from "next/server";
import { CouponService } from "@/services/coupon.service";
import { adminCouponSchema } from "@/lib/validations/admin-coupon.schema";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const coupon = await CouponService.getAdminCouponById(params.id);
    return NextResponse.json({ success: true, data: coupon }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching coupon:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch coupon" },
      { status: 404 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = adminCouponSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid coupon data",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await CouponService.updateAdminCoupon(params.id, validationResult.data);
    return NextResponse.json(
      { success: true, data: updated, message: "Coupon updated successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating coupon:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update coupon" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await CouponService.deleteAdminCoupon(params.id);
    return NextResponse.json(
      { success: true, message: "Coupon deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting coupon:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete coupon" },
      { status: 400 }
    );
  }
}

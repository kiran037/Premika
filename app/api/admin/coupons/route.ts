import { NextRequest, NextResponse } from "next/server";
import { CouponService } from "@/services/coupon.service";
import { adminCouponSchema } from "@/lib/validations/admin-coupon.schema";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || undefined;
    const isActive = searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined;
    const type = (searchParams.get("type") as "percentage" | "fixed") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    const data = await CouponService.getAdminCouponsList({
      page,
      limit,
      search,
      isActive,
      type,
      sortBy,
      sortOrder,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching coupons:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const created = await CouponService.createAdminCoupon(validationResult.data);
    return NextResponse.json(
      { success: true, data: created, message: "Coupon created successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating coupon:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create coupon" },
      { status: 400 }
    );
  }
}

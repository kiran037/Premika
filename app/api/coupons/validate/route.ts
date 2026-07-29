import { NextRequest, NextResponse } from "next/server";
import { validateCoupon } from "@/lib/coupons/validate-coupon";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, couponCode, subtotal } = body;

    const targetCode = code || couponCode;
    const numericSubtotal = Number(subtotal) || 0;

    if (!targetCode || typeof targetCode !== "string") {
      return NextResponse.json(
        {
          valid: false,
          discountAmount: 0,
          error: "Coupon code is required",
          message: "Coupon code is required",
        },
        { status: 400 }
      );
    }

    const result = await validateCoupon(targetCode, numericSubtotal);

    if (!result.valid) {
      return NextResponse.json(
        {
          valid: false,
          couponId: result.couponId,
          couponCode: result.couponCode,
          discountAmount: 0,
          error: result.message,
          message: result.message,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        valid: true,
        couponId: result.couponId,
        couponCode: result.couponCode,
        discountType: result.discountType,
        discountValue: result.discountValue,
        discountAmount: result.discountAmount,
        message: result.message,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error validating coupon:", error);
    return NextResponse.json(
      {
        valid: false,
        discountAmount: 0,
        error: error.message || "Failed to validate coupon",
        message: error.message || "Failed to validate coupon",
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { recordCouponUsage } from "@/lib/coupons/validate-coupon";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const result = await PaymentService.verifyPaymentSignature(payload);

    if (!result.isOk) {
      return NextResponse.json(
        { message: result.message || "Payment verification failed", isOk: false },
        { status: 400 }
      );
    }

    // Record coupon usage ONLY after successful payment verification
    const couponCodeOrId = payload.couponCode || payload.couponId;
    if (couponCodeOrId) {
      await recordCouponUsage(couponCodeOrId, payload.customerInfo?.id || payload.customerId).catch((err) => {
        console.error("Non-fatal error recording coupon usage:", err);
      });
    }

    return NextResponse.json(
      { message: "Payment verified successfully", isOk: true, orderId: result.orderId },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error verifying payment signature:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error during verification", isOk: false },
      { status: 500 }
    );
  }
}

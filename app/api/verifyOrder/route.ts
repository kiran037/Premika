import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { recordCouponUsage } from "@/lib/coupons/validate-coupon";
import { StoreService } from "@/services/store.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Maintenance Mode Check
    const storeSettings = await StoreService.getStoreSettings();
    if (storeSettings?.maintenanceMode) {
      return NextResponse.json(
        {
          success: false,
          message: "The store is currently under maintenance. Please try again later.",
        },
        { status: 503 }
      );
    }

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

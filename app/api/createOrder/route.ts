import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { validateCoupon } from "@/lib/coupons/validate-coupon";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let checkoutInput;
    if (body.customer && body.items) {
      checkoutInput = body;
    } else {
      const c = body.customerInfo || {};
      checkoutInput = {
        customer: {
          fullName: c.name || "Guest Customer",
          email: c.email || "",
          phone: c.phone || "",
          addressLine1: c.address?.line1 || "",
          addressLine2: c.address?.line2 || "",
          city: c.address?.city || "",
          state: c.address?.state || "",
          postalCode: c.address?.postal_code || "",
          country: c.address?.country || "IN",
        },
        items: body.cartItems || [],
        couponCode: body.couponCode,
      };
    }

    // Server-side revalidation of coupon if provided
    if (checkoutInput.couponCode && typeof checkoutInput.couponCode === "string" && checkoutInput.couponCode.trim()) {
      let serverSubtotal = 0;
      for (const item of checkoutInput.items) {
        serverSubtotal += Number(item.price || 0) * (item.quantity || 1);
      }

      const validation = await validateCoupon(checkoutInput.couponCode, serverSubtotal);
      if (!validation.valid) {
        return NextResponse.json(
          {
            error: "Coupon validation failed",
            message: validation.message || "Invalid or expired coupon code",
          },
          { status: 400 }
        );
      }
    }

    const razorpayOrder = await PaymentService.createPaymentOrder(checkoutInput as any);
    return NextResponse.json(razorpayOrder, { status: 201 });
  } catch (error: any) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      {
        error: "Payment creation failed",
        message: error.message || "Failed to create Razorpay order",
      },
      { status: 400 }
    );
  }
}

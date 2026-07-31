import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/payment.service";
import { validateCoupon } from "@/lib/coupons/validate-coupon";
import { StoreService } from "@/services/store.service";

export const dynamic = "force-dynamic";

const orderRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, maxRequests = 20, windowMs = 60000): boolean {
  const now = Date.now();
  const record = orderRateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    orderRateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count += 1;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const rawIp = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const ipAddress = rawIp.trim();

    if (isRateLimited(ipAddress, 20, 60000)) {
      return NextResponse.json(
        { success: false, message: "Too many order requests. Please try again later." },
        { status: 429 }
      );
    }

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

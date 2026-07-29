import { db } from "@/db/client";
import { coupons, couponUsage } from "@/db/schema/marketing";
import { eq } from "drizzle-orm";

export interface ValidateCouponResult {
  valid: boolean;
  couponId?: string;
  couponCode?: string;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  discountAmount: number;
  message: string;
}

/**
 * Validate a coupon code against database rules and subtotal
 */
export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<ValidateCouponResult> {
  if (!code || !code.trim()) {
    return {
      valid: false,
      discountAmount: 0,
      message: "Coupon code is required",
    };
  }

  const normalizedCode = code.trim().toUpperCase();

  const rows = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, normalizedCode))
    .limit(1);

  const coupon = rows[0];

  if (!coupon) {
    return {
      valid: false,
      discountAmount: 0,
      message: "Invalid coupon code",
    };
  }

  if (!coupon.isActive) {
    return {
      valid: false,
      couponId: coupon.id,
      couponCode: coupon.code,
      discountAmount: 0,
      message: "Coupon is inactive",
    };
  }

  const now = new Date();

  if (coupon.startsAt && new Date(coupon.startsAt) > now) {
    return {
      valid: false,
      couponId: coupon.id,
      couponCode: coupon.code,
      discountAmount: 0,
      message: "Coupon is not active yet",
    };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
    return {
      valid: false,
      couponId: coupon.id,
      couponCode: coupon.code,
      discountAmount: 0,
      message: "Coupon has expired",
    };
  }

  if (
    coupon.usageLimit !== null &&
    coupon.usageLimit !== undefined &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    return {
      valid: false,
      couponId: coupon.id,
      couponCode: coupon.code,
      discountAmount: 0,
      message: "Coupon usage limit reached",
    };
  }

  if (subtotal < (coupon.minimumOrderAmount || 0)) {
    return {
      valid: false,
      couponId: coupon.id,
      couponCode: coupon.code,
      discountAmount: 0,
      message: `Minimum order amount of ₹${coupon.minimumOrderAmount} required for this coupon`,
    };
  }

  // Calculate discount amount
  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = Math.floor((subtotal * coupon.value) / 100);
    if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
      discountAmount = coupon.maximumDiscount;
    }
  } else if (coupon.type === "fixed") {
    discountAmount = Math.min(subtotal, coupon.value);
  }

  return {
    valid: true,
    couponId: coupon.id,
    couponCode: coupon.code,
    discountType: coupon.type as "percentage" | "fixed",
    discountValue: coupon.value,
    discountAmount,
    message: `Coupon ${coupon.code} applied successfully!`,
  };
}

/**
 * Record coupon usage after successful payment verification
 */
export async function recordCouponUsage(
  couponIdOrCode: string,
  customerId?: string
): Promise<void> {
  if (!couponIdOrCode) return;

  const normalizedCode = couponIdOrCode.trim().toUpperCase();

  let coupon = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, normalizedCode))
    .then((r) => r[0]);

  if (!coupon) {
    coupon = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, couponIdOrCode))
      .then((r) => r[0]);
  }

  if (!coupon) return;

  // Increment usedCount
  await db
    .update(coupons)
    .set({
      usedCount: (coupon.usedCount || 0) + 1,
      updatedAt: new Date(),
    })
    .where(eq(coupons.id, coupon.id));

  // Insert usage record if customerId is available
  if (customerId) {
    try {
      await db.insert(couponUsage).values({
        couponId: coupon.id,
        customerId: customerId,
        usedAt: new Date(),
      });
    } catch (err) {
      console.error("Error writing coupon usage record:", err);
    }
  }
}

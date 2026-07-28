import { NextRequest } from "next/server";
import { z } from "zod";
import { CouponService } from "@/services/coupon.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

const validateCouponSchema = z.object({
  code: z.string().min(1, "Coupon code is required"),
  subtotal: z.number().nonnegative("Subtotal must be a positive number"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validationResult = validateCouponSchema.safeParse(body);

    if (!validationResult.success) {
      return errorResponse("Invalid request parameter", 400);
    }

    const { code, subtotal } = validationResult.data;
    const result = await CouponService.validateCoupon(code, subtotal);

    if (!result.valid) {
      return errorResponse(result.message || "Invalid coupon", 400);
    }

    return successResponse(
      {
        code: result.code,
        discount: result.discount,
      },
      result.message || "Coupon code applied successfully"
    );
  } catch (err: any) {
    console.error("Error validating coupon:", err);
    return errorResponse(err.message || "Failed to validate coupon", 500);
  }
}

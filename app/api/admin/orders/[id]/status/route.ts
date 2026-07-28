import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { adminOrderStatusSchema } from "@/lib/validations/admin-order.schema";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = adminOrderStatusSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid status payload",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const result = await OrderService.updateAdminOrderStatus(params.id, validationResult.data);
    return NextResponse.json({ success: true, data: result, message: "Order status updated successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to update order status" }, { status: 500 });
  }
}

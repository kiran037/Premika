import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { ids, status } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: "No orders selected" }, { status: 400 });
    }

    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "packed",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
      "refunded",
    ];

    if (!validStatuses.includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid target status" }, { status: 400 });
    }

    await OrderService.bulkAdminOrderStatusUpdate(ids, status);
    return NextResponse.json({ success: true, message: `Bulk status updated to ${status}` }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Bulk update failed" }, { status: 400 });
  }
}

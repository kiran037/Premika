import { NextRequest, NextResponse } from "next/server";
import { OrderService } from "@/services/order.service";
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
    const orderStatus = searchParams.get("orderStatus") || undefined;
    const paymentStatus = searchParams.get("paymentStatus") || undefined;
    const range = (searchParams.get("range") as any) || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    const data = await OrderService.getAdminOrdersList({
      page,
      limit,
      search,
      orderStatus,
      paymentStatus,
      range,
      sortBy,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error in admin list orders route:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to fetch orders" }, { status: 500 });
  }
}

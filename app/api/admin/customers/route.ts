import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/services/customer.service";
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
    const segment = (searchParams.get("segment") as any) || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    const data = await CustomerService.getAdminCustomersList({
      page,
      limit,
      search,
      segment,
      sortBy,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error in admin list customers route:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to fetch customers" }, { status: 500 });
  }
}

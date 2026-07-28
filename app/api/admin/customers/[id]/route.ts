import { NextRequest, NextResponse } from "next/server";
import { CustomerService } from "@/services/customer.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await CustomerService.getAdminCustomerById(params.id);
    if (!data) {
      return NextResponse.json({ success: false, message: "Customer profile not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to fetch customer profile" }, { status: 500 });
  }
}

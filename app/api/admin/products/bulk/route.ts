import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const { ids, action } = await req.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, message: "No products selected" }, { status: 400 });
    }

    if (!["activate", "deactivate", "delete"].includes(action)) {
      return NextResponse.json({ success: false, message: "Invalid bulk action" }, { status: 400 });
    }

    await ProductService.bulkAdminProductAction(ids, action);
    return NextResponse.json({ success: true, message: `Bulk ${action} executed successfully` }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Bulk action failed" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";
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

    const { field } = await req.json();
    if (!["isActive", "featured", "newArrival"].includes(field)) {
      return NextResponse.json({ success: false, message: "Invalid status field" }, { status: 400 });
    }

    const updated = await ProductService.toggleAdminProductStatus(params.id, field as any);
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to toggle status" }, { status: 500 });
  }
}

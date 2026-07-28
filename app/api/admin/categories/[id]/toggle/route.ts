import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/services/category.service";
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

    const updated = await CategoryService.toggleAdminCategoryStatus(params.id);
    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to toggle status" }, { status: 500 });
  }
}

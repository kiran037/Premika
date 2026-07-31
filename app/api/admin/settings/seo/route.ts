import { NextRequest, NextResponse } from "next/server";
import { StoreService } from "@/services/store.service";
import { globalSeoSchema } from "@/lib/validations/seo";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await StoreService.getSeoSettings();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching SEO settings:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch SEO settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = globalSeoSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid SEO settings data",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await StoreService.updateSeoSettings(validationResult.data);
    return NextResponse.json(
      { success: true, data: updated, message: "Global SEO settings updated successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating SEO settings:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update SEO settings" },
      { status: 500 }
    );
  }
}

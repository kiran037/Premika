import { NextRequest, NextResponse } from "next/server";
import { StoreService } from "@/services/store.service";
import { storeSettingsSchema } from "@/lib/validations/admin-store.schema";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await StoreService.getStoreSettings();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching store settings:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch store settings" },
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
    const validationResult = storeSettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid store settings data",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await StoreService.updateStoreSettings(validationResult.data);
    return NextResponse.json(
      { success: true, data: updated, message: "Store settings updated successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating store settings:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update store settings" },
      { status: 500 }
    );
  }
}

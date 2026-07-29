import { NextRequest, NextResponse } from "next/server";
import { DelhiverySettingsService } from "@/services/delhivery-settings.service";
import { delhiverySettingsSchema } from "@/lib/validations/admin-delhivery.schema";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await DelhiverySettingsService.getSettings();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching Delhivery settings:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch Delhivery settings" },
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
    const validationResult = delhiverySettingsSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid Delhivery settings data",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await DelhiverySettingsService.updateSettings(validationResult.data);
    return NextResponse.json(
      { success: true, data: updated, message: "Delhivery settings updated successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating Delhivery settings:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update Delhivery settings" },
      { status: 500 }
    );
  }
}

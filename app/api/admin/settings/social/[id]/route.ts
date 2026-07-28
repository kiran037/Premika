import { NextRequest, NextResponse } from "next/server";
import { StoreService } from "@/services/store.service";
import { socialLinkSchema } from "@/lib/validations/admin-store.schema";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = socialLinkSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid social link data",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await StoreService.updateSocialLink(params.id, validationResult.data);
    return NextResponse.json(
      { success: true, data: updated, message: "Social link updated successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error updating social link:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update social link" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    await StoreService.deleteSocialLink(params.id);
    return NextResponse.json(
      { success: true, message: "Social link deleted successfully" },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error deleting social link:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete social link" },
      { status: 400 }
    );
  }
}

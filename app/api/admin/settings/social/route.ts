import { NextRequest, NextResponse } from "next/server";
import { StoreService } from "@/services/store.service";
import { socialLinkSchema } from "@/lib/validations/admin-store.schema";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const data = await StoreService.getSocialLinks();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching social links:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch social links" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const created = await StoreService.createSocialLink(validationResult.data);
    return NextResponse.json(
      { success: true, data: created, message: "Social link created successfully" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating social link:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create social link" },
      { status: 500 }
    );
  }
}

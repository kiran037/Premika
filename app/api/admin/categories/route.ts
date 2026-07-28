import { NextRequest, NextResponse } from "next/server";
import { CategoryService } from "@/services/category.service";
import { adminCategorySchema } from "@/lib/validations/admin-category.schema";
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
    const isActive = searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    const data = await CategoryService.getAdminCategoriesList({
      page,
      limit,
      search,
      isActive,
      sortBy,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error in admin list categories route:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = adminCategorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid category data",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const created = await CategoryService.createAdminCategory(validationResult.data);
    return NextResponse.json({ success: true, data: created, message: "Category created successfully" }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating category:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to create category" }, { status: 500 });
  }
}

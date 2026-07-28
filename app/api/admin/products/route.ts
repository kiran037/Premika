import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/services/product.service";
import { adminProductSchema } from "@/lib/validations/admin-product.schema";
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
    const categoryId = searchParams.get("categoryId") || undefined;
    const featured = searchParams.has("featured") ? searchParams.get("featured") === "true" : undefined;
    const newArrival = searchParams.has("newArrival") ? searchParams.get("newArrival") === "true" : undefined;
    const isActive = searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined;
    const sortBy = (searchParams.get("sortBy") as any) || undefined;

    const data = await ProductService.getAdminProductsList({
      page,
      limit,
      search,
      categoryId,
      featured,
      newArrival,
      isActive,
      sortBy,
    });

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (err: any) {
    console.error("Error in admin list products route:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validationResult = adminProductSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid product data",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const created = await ProductService.createAdminProduct(validationResult.data);
    return NextResponse.json({ success: true, data: created, message: "Product created successfully" }, { status: 201 });
  } catch (err: any) {
    console.error("Error creating product:", err);
    return NextResponse.json({ success: false, message: err.message || "Failed to create product" }, { status: 500 });
  }
}

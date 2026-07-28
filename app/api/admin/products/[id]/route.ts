import { NextRequest, NextResponse } from "next/server";
import { ProductRepository } from "@/repositories/product.repository";
import { ProductService } from "@/services/product.service";
import { adminProductSchema } from "@/lib/validations/admin-product.schema";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const item = await ProductRepository.findProductBySlug(params.id);
    if (!item) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: item }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to fetch product" }, { status: 500 });
  }
}

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
    console.log(body.images);
    const validationResult = adminProductSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Invalid product payload",
          errors: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await ProductService.updateAdminProduct(params.id, validationResult.data);
    return NextResponse.json({ success: true, data: updated, message: "Product updated successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to update product" }, { status: 500 });
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

    await ProductService.deleteAdminProduct(params.id);
    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || "Failed to delete product" }, { status: 500 });
  }
}

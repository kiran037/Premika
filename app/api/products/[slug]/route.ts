import { NextRequest } from "next/server";
import { productSlugParamSchema } from "@/lib/validations/product.query";
import { ProductService } from "@/services/product.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const validationResult = productSlugParamSchema.safeParse(params);

    if (!validationResult.success) {
      return errorResponse(
        "Invalid product slug parameter",
        validationResult.error.flatten().fieldErrors,
        400
      );
    }

    const product = await ProductService.getProductBySlug(validationResult.data.slug);

    if (!product) {
      return errorResponse("Product not found", null, 404);
    }

    return successResponse(product, undefined, 200);
  } catch (error: any) {
    console.error(`GET /api/products/${params.slug} Error:`, error);
    return errorResponse("Failed to fetch product details", error?.message, 500);
  }
}

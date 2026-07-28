import { NextRequest } from "next/server";
import { getProductsQuerySchema } from "@/lib/validations/product.query";
import { ProductService } from "@/services/product.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryObj = Object.fromEntries(searchParams.entries());

    const validationResult = getProductsQuerySchema.safeParse(queryObj);

    if (!validationResult.success) {
      return errorResponse(
        "Invalid query parameters",
        validationResult.error.flatten().fieldErrors,
        400
      );
    }

    const result = await ProductService.getProducts(validationResult.data);

    return successResponse(result.items, result.pagination, 200);
  } catch (error: any) {
    console.error("GET /api/products Error:", error);
    return errorResponse("Failed to fetch products from database", error?.message, 500);
  }
}

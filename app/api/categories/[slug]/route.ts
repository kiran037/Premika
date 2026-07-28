import { NextRequest } from "next/server";
import { categorySlugParamSchema } from "@/lib/validations/category.query";
import { CategoryService } from "@/services/category.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const validationResult = categorySlugParamSchema.safeParse(params);

    if (!validationResult.success) {
      return errorResponse(
        "Invalid category slug parameter",
        validationResult.error.flatten().fieldErrors,
        400
      );
    }

    const category = await CategoryService.getCategoryBySlug(validationResult.data.slug);

    if (!category) {
      return errorResponse("Category not found", null, 404);
    }

    return successResponse(category, undefined, 200);
  } catch (error: any) {
    console.error(`GET /api/categories/${params.slug} Error:`, error);
    return errorResponse("Failed to fetch category details", error?.message, 500);
  }
}

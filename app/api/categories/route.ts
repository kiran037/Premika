import { NextRequest } from "next/server";
import { CategoryService } from "@/services/category.service";
import { successResponse, errorResponse } from "@/lib/api-response";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const categories = await CategoryService.getCategories();
    return successResponse(categories, undefined, 200);
  } catch (error: any) {
    console.error("GET /api/categories Error:", error);
    return errorResponse("Failed to fetch categories", error?.message, 500);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/services/review.service";
import { ADMIN_COOKIE_NAME, AdminAuthService } from "@/services/admin-auth.service";
import { db } from "@/db/client";
import { products } from "@/db/schema";
import { asc } from "drizzle-orm";

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
    const status = (searchParams.get("status") as any) || undefined;
    const verifiedPurchaseParam = searchParams.get("verifiedPurchase");
    const verifiedPurchase =
      verifiedPurchaseParam !== null && verifiedPurchaseParam !== ""
        ? verifiedPurchaseParam === "true"
        : undefined;
    const rating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined;
    const productId = searchParams.get("productId") || undefined;
    const sortBy = (searchParams.get("sortBy") as any) || "newest";

    const [data, stats, productsList] = await Promise.all([
      ReviewService.getReviews({
        page,
        limit,
        search,
        status,
        verifiedPurchase,
        rating,
        productId,
        sortBy,
      }),
      ReviewService.getStats(),
      db.select({ id: products.id, name: products.name }).from(products).orderBy(asc(products.name)),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: {
          items: data.items,
          pagination: data.pagination,
          stats,
          productsList,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error in GET admin reviews route:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch reviews" },
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
    const newReview = await ReviewService.createReview({
      productId: body.productId,
      customerName: body.customerName,
      rating: Number(body.rating),
      comment: body.comment,
      reviewStatus: body.reviewStatus,
      verifiedPurchase: Boolean(body.verifiedPurchase),
    });

    return NextResponse.json({ success: true, data: newReview }, { status: 201 });
  } catch (err: any) {
    console.error("Error in POST admin reviews route:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to create review" },
      { status: 400 }
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
    const { action, ids, status } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No reviews selected" },
        { status: 400 }
      );
    }

    if (action === "bulk_status") {
      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid status for bulk update" },
          { status: 400 }
        );
      }
      const result = await ReviewService.bulkUpdateStatus(ids, status);
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    }

    if (action === "bulk_delete") {
      const result = await ReviewService.bulkDelete(ids);
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, message: "Invalid bulk action" },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("Error in PUT admin reviews route:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed bulk action" },
      { status: 500 }
    );
  }
}

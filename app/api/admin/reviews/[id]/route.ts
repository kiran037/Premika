import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/services/review.service";
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

    const review = await ReviewService.getReviewById(params.id);
    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (err: any) {
    console.error("Error fetching review:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch review" },
      { status: 404 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !AdminAuthService.verifySessionToken(token)) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updated = await ReviewService.updateReview(params.id, {
      customerName: body.customerName,
      rating: body.rating !== undefined ? Number(body.rating) : undefined,
      comment: body.comment,
      reviewStatus: body.reviewStatus,
      verifiedPurchase: body.verifiedPurchase !== undefined ? Boolean(body.verifiedPurchase) : undefined,
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (err: any) {
    console.error("Error updating review:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to update review" },
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

    const deleted = await ReviewService.deleteReview(params.id);
    return NextResponse.json({ success: true, data: deleted }, { status: 200 });
  } catch (err: any) {
    console.error("Error deleting review:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Failed to delete review" },
      { status: 400 }
    );
  }
}

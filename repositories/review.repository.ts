import { db } from "@/db/client";
import { productReviews, products, productImages } from "@/db/schema";
import { eq, and, ilike, or, desc, asc, inArray, count, avg, sql } from "drizzle-orm";

export interface GetReviewsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "pending" | "approved" | "rejected";
  verifiedPurchase?: boolean;
  rating?: number;
  productId?: string;
  sortBy?: "newest" | "oldest" | "rating_high" | "rating_low";
}

export interface ReviewWithProduct {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  reviewStatus: "pending" | "approved" | "rejected";
  verifiedPurchase: boolean;
  createdAt: Date;
  product: {
    id: string;
    name: string;
    slug: string;
    image?: string;
  } | null;
}

export class ReviewRepository {
  /**
   * Find paginated reviews with product details and filters
   */
  static async findMany(params: GetReviewsParams) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      verifiedPurchase,
      rating,
      productId,
      sortBy = "newest",
    } = params;

    const offset = (page - 1) * limit;
    const conditions = [];

    if (search && search.trim() !== "") {
      const pattern = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(productReviews.customerName, pattern),
          ilike(productReviews.comment, pattern),
          ilike(products.name, pattern)
        )
      );
    }

    if (status) {
      conditions.push(eq(productReviews.reviewStatus, status));
    }

    if (verifiedPurchase !== undefined) {
      conditions.push(eq(productReviews.verifiedPurchase, verifiedPurchase));
    }

    if (rating) {
      conditions.push(eq(productReviews.rating, rating));
    }

    if (productId) {
      conditions.push(eq(productReviews.productId, productId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause;
    switch (sortBy) {
      case "oldest":
        orderByClause = asc(productReviews.createdAt);
        break;
      case "rating_high":
        orderByClause = desc(productReviews.rating);
        break;
      case "rating_low":
        orderByClause = asc(productReviews.rating);
        break;
      case "newest":
      default:
        orderByClause = desc(productReviews.createdAt);
        break;
    }

    // Query items with joined product
    const itemsRaw = await db
      .select({
        id: productReviews.id,
        productId: productReviews.productId,
        customerName: productReviews.customerName,
        rating: productReviews.rating,
        comment: productReviews.comment,
        reviewStatus: productReviews.reviewStatus,
        verifiedPurchase: productReviews.verifiedPurchase,
        createdAt: productReviews.createdAt,
        productName: products.name,
        productSlug: products.slug,
      })
      .from(productReviews)
      .leftJoin(products, eq(productReviews.productId, products.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Query total count
    const totalResult = await db
      .select({ count: count() })
      .from(productReviews)
      .leftJoin(products, eq(productReviews.productId, products.id))
      .where(whereClause);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

    const items: ReviewWithProduct[] = itemsRaw.map((r) => ({
      id: r.id,
      productId: r.productId,
      customerName: r.customerName,
      rating: r.rating,
      comment: r.comment,
      reviewStatus: r.reviewStatus,
      verifiedPurchase: r.verifiedPurchase,
      createdAt: r.createdAt,
      product: r.productName
        ? {
            id: r.productId,
            name: r.productName,
            slug: r.productSlug || r.productId,
          }
        : null,
    }));

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  /**
   * Find single review by ID with product details
   */
  static async findById(id: string): Promise<ReviewWithProduct | null> {
    const rows = await db
      .select({
        id: productReviews.id,
        productId: productReviews.productId,
        customerName: productReviews.customerName,
        rating: productReviews.rating,
        comment: productReviews.comment,
        reviewStatus: productReviews.reviewStatus,
        verifiedPurchase: productReviews.verifiedPurchase,
        createdAt: productReviews.createdAt,
        productName: products.name,
        productSlug: products.slug,
      })
      .from(productReviews)
      .leftJoin(products, eq(productReviews.productId, products.id))
      .where(eq(productReviews.id, id));

    if (!rows[0]) return null;
    const r = rows[0];

    return {
      id: r.id,
      productId: r.productId,
      customerName: r.customerName,
      rating: r.rating,
      comment: r.comment,
      reviewStatus: r.reviewStatus,
      verifiedPurchase: r.verifiedPurchase,
      createdAt: r.createdAt,
      product: r.productName
        ? {
            id: r.productId,
            name: r.productName,
            slug: r.productSlug || r.productId,
          }
        : null,
    };
  }

  /**
   * Create new review
   */
  static async create(data: {
    productId: string;
    customerName: string;
    rating: number;
    comment: string;
    reviewStatus?: "pending" | "approved" | "rejected";
    verifiedPurchase?: boolean;
  }) {
    const [newReview] = await db
      .insert(productReviews)
      .values({
        productId: data.productId,
        customerName: data.customerName.trim(),
        rating: data.rating,
        comment: data.comment.trim(),
        reviewStatus: data.reviewStatus || "approved",
        verifiedPurchase: data.verifiedPurchase ?? false,
      })
      .returning();

    return newReview;
  }

  /**
   * Update review
   */
  static async update(
    id: string,
    data: {
      customerName?: string;
      rating?: number;
      comment?: string;
      reviewStatus?: "pending" | "approved" | "rejected";
      verifiedPurchase?: boolean;
    }
  ) {
    const updatePayload: Partial<typeof productReviews.$inferInsert> = {};
    if (data.customerName !== undefined) updatePayload.customerName = data.customerName.trim();
    if (data.rating !== undefined) updatePayload.rating = data.rating;
    if (data.comment !== undefined) updatePayload.comment = data.comment.trim();
    if (data.reviewStatus !== undefined) updatePayload.reviewStatus = data.reviewStatus;
    if (data.verifiedPurchase !== undefined) updatePayload.verifiedPurchase = data.verifiedPurchase;

    const [updated] = await db
      .update(productReviews)
      .set(updatePayload)
      .where(eq(productReviews.id, id))
      .returning();

    return updated || null;
  }

  /**
   * Delete review
   */
  static async delete(id: string) {
    const [deleted] = await db
      .delete(productReviews)
      .where(eq(productReviews.id, id))
      .returning();

    return deleted || null;
  }

  /**
   * Bulk update status
   */
  static async bulkUpdateStatus(ids: string[], status: "pending" | "approved" | "rejected") {
    if (ids.length === 0) return 0;
    const updated = await db
      .update(productReviews)
      .set({ reviewStatus: status })
      .where(inArray(productReviews.id, ids))
      .returning();

    return updated.length;
  }

  /**
   * Bulk delete
   */
  static async bulkDelete(ids: string[]) {
    if (ids.length === 0) return 0;
    const deleted = await db
      .delete(productReviews)
      .where(inArray(productReviews.id, ids))
      .returning();

    return deleted.length;
  }

  /**
   * Get review summary stats for dashboard cards
   */
  static async getStats() {
    const [allCount] = await db.select({ count: count() }).from(productReviews);
    const [approvedCount] = await db
      .select({ count: count() })
      .from(productReviews)
      .where(eq(productReviews.reviewStatus, "approved"));
    const [pendingCount] = await db
      .select({ count: count() })
      .from(productReviews)
      .where(eq(productReviews.reviewStatus, "pending"));
    const [rejectedCount] = await db
      .select({ count: count() })
      .from(productReviews)
      .where(eq(productReviews.reviewStatus, "rejected"));

    const [avgRatingResult] = await db
      .select({ avgRating: avg(productReviews.rating) })
      .from(productReviews);

    const total = allCount?.count || 0;
    const approved = approvedCount?.count || 0;
    const pending = pendingCount?.count || 0;
    const rejected = rejectedCount?.count || 0;
    const averageRating = avgRatingResult?.avgRating
      ? Number.parseFloat(avgRatingResult.avgRating).toFixed(1)
      : "5.0";

    return {
      total,
      approved,
      pending,
      rejected,
      averageRating: Number.parseFloat(averageRating),
    };
  }
}

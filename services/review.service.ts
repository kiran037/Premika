import { ReviewRepository, GetReviewsParams } from "@/repositories/review.repository";

export class ReviewService {
  static async getReviews(params: GetReviewsParams) {
    return await ReviewRepository.findMany(params);
  }

  static async getReviewById(id: string) {
    if (!id) {
      throw new Error("Review ID is required");
    }
    const review = await ReviewRepository.findById(id);
    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  }

  static async getStats() {
    return await ReviewRepository.getStats();
  }

  static async createReview(data: {
    productId: string;
    customerName: string;
    rating: number;
    comment: string;
    reviewStatus?: "pending" | "approved" | "rejected";
    verifiedPurchase?: boolean;
  }) {
    if (!data.productId) {
      throw new Error("Product is required");
    }
    if (!data.customerName || data.customerName.trim().length === 0) {
      throw new Error("Customer name is required");
    }
    if (!data.comment || data.comment.trim().length === 0) {
      throw new Error("Comment is required");
    }
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    if (
      data.reviewStatus &&
      !["pending", "approved", "rejected"].includes(data.reviewStatus)
    ) {
      throw new Error("Invalid review status");
    }

    return await ReviewRepository.create({
      productId: data.productId,
      customerName: data.customerName,
      rating: Math.round(data.rating),
      comment: data.comment,
      reviewStatus: data.reviewStatus || "approved",
      verifiedPurchase: data.verifiedPurchase ?? false,
    });
  }

  static async updateReview(
    id: string,
    data: {
      customerName?: string;
      rating?: number;
      comment?: string;
      reviewStatus?: "pending" | "approved" | "rejected";
      verifiedPurchase?: boolean;
    }
  ) {
    if (!id) {
      throw new Error("Review ID is required");
    }

    if (data.customerName !== undefined && data.customerName.trim().length === 0) {
      throw new Error("Customer name cannot be empty");
    }
    if (data.comment !== undefined && data.comment.trim().length === 0) {
      throw new Error("Comment cannot be empty");
    }
    if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
      throw new Error("Rating must be between 1 and 5");
    }
    if (
      data.reviewStatus !== undefined &&
      !["pending", "approved", "rejected"].includes(data.reviewStatus)
    ) {
      throw new Error("Invalid review status");
    }

    const updated = await ReviewRepository.update(id, data);
    if (!updated) {
      throw new Error("Review not found or failed to update");
    }
    return updated;
  }

  static async deleteReview(id: string) {
    if (!id) {
      throw new Error("Review ID is required");
    }
    const deleted = await ReviewRepository.delete(id);
    if (!deleted) {
      throw new Error("Review not found or failed to delete");
    }
    return deleted;
  }

  static async bulkUpdateStatus(ids: string[], status: "pending" | "approved" | "rejected") {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("No review IDs provided");
    }
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new Error("Invalid status");
    }
    const count = await ReviewRepository.bulkUpdateStatus(ids, status);
    return { count };
  }

  static async bulkDelete(ids: string[]) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("No review IDs provided");
    }
    const count = await ReviewRepository.bulkDelete(ids);
    return { count };
  }
}

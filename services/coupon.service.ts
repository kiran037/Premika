import { CouponRepository, GetCouponsParams } from "@/repositories/coupon.repository";
import { AdminCouponInput } from "@/lib/validations/admin-coupon.schema";

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discount: number;
  message?: string;
}

export class CouponService {
  static async validateCoupon(
    code: string,
    subtotal: number
  ): Promise<CouponValidationResult> {
    if (!code || !code.trim()) {
      return { valid: false, discount: 0, message: "Coupon code is required" };
    }

    const coupon = await CouponRepository.findCouponByCode(code);

    if (!coupon) {
      return { valid: false, discount: 0, message: "Invalid coupon code" };
    }

    if (!coupon.isActive) {
      return { valid: false, discount: 0, message: "Coupon is inactive" };
    }

    const now = new Date();
    if (coupon.startsAt && new Date(coupon.startsAt) > now) {
      return { valid: false, discount: 0, message: "Coupon is not active yet" };
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < now) {
      return { valid: false, discount: 0, message: "Coupon has expired" };
    }

    if (
      coupon.usageLimit !== null &&
      coupon.usageLimit !== undefined &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return { valid: false, discount: 0, message: "Coupon usage limit reached" };
    }

    if (subtotal < (coupon.minimumOrderAmount || 0)) {
      return {
        valid: false,
        discount: 0,
        message: `Minimum order amount of Rs. ${coupon.minimumOrderAmount} required for this coupon`,
      };
    }

    let discount = 0;
    if (coupon.type === "percentage") {
      discount = Math.floor((subtotal * coupon.value) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else if (coupon.type === "fixed") {
      discount = Math.min(subtotal, coupon.value);
    }

    return {
      valid: true,
      code: coupon.code,
      discount,
      message: `Coupon ${coupon.code} applied successfully!`,
    };
  }

  static async getAdminCouponsList(params: GetCouponsParams) {
    return CouponRepository.findMany(params);
  }

  static async getAdminCouponById(id: string) {
    const coupon = await CouponRepository.findById(id);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    const usageHistory = await CouponRepository.getCouponUsageHistory(id);

    return {
      ...coupon,
      usageHistory,
    };
  }

  static async createAdminCoupon(data: AdminCouponInput) {
    const normalizedCode = data.code.trim().toUpperCase();
    const existing = await CouponRepository.findCouponByCodeAnyStatus(normalizedCode);
    if (existing) {
      throw new Error(`Coupon with code "${normalizedCode}" already exists`);
    }

    return CouponRepository.create({
      code: normalizedCode,
      name: data.name,
      description: data.description || null,
      type: data.type,
      value: data.value,
      minimumOrderAmount: data.minimumOrderAmount,
      maximumDiscount: data.maximumDiscount || null,
      usageLimit: data.usageLimit || null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive,
    });
  }

  static async updateAdminCoupon(id: string, data: AdminCouponInput) {
    const coupon = await CouponRepository.findById(id);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    const normalizedCode = data.code.trim().toUpperCase();
    if (normalizedCode !== coupon.code) {
      const existing = await CouponRepository.findCouponByCodeAnyStatus(normalizedCode);
      if (existing) {
        throw new Error(`Coupon with code "${normalizedCode}" already exists`);
      }
    }

    return CouponRepository.update(id, {
      code: normalizedCode,
      name: data.name,
      description: data.description || null,
      type: data.type,
      value: data.value,
      minimumOrderAmount: data.minimumOrderAmount,
      maximumDiscount: data.maximumDiscount || null,
      usageLimit: data.usageLimit || null,
      startsAt: data.startsAt ? new Date(data.startsAt) : null,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      isActive: data.isActive,
    });
  }

  static async deleteAdminCoupon(id: string) {
    const coupon = await CouponRepository.findById(id);
    if (!coupon) {
      throw new Error("Coupon not found");
    }
    return CouponRepository.delete(id);
  }

  static async bulkUpdateStatus(ids: string[], isActive: boolean) {
    if (!ids || ids.length === 0) {
      throw new Error("No coupon IDs provided");
    }
    return CouponRepository.bulkUpdateStatus(ids, isActive);
  }

  static async bulkDelete(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new Error("No coupon IDs provided");
    }
    return CouponRepository.bulkDelete(ids);
  }

  static async duplicateCoupon(id: string) {
    const coupon = await CouponRepository.findById(id);
    if (!coupon) {
      throw new Error("Coupon not found");
    }

    let baseCode = `${coupon.code}-COPY`;
    let counter = 1;
    let newCode = baseCode;

    while (await CouponRepository.findCouponByCodeAnyStatus(newCode)) {
      newCode = `${baseCode}${counter}`;
      counter++;
    }

    return CouponRepository.create({
      code: newCode,
      name: `${coupon.name} (Copy)`,
      description: coupon.description,
      type: coupon.type,
      value: coupon.value,
      minimumOrderAmount: coupon.minimumOrderAmount,
      maximumDiscount: coupon.maximumDiscount,
      usageLimit: coupon.usageLimit,
      usedCount: 0,
      startsAt: coupon.startsAt,
      expiresAt: coupon.expiresAt,
      isActive: false, // Default duplicated coupon to inactive so admin can review
    });
  }
}

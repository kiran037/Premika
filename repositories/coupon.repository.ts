import { db } from "@/db/client";
import { coupons, couponUsage } from "@/db/schema/marketing";
import { eq, and, ilike, or, sql, count, desc, inArray, asc } from "drizzle-orm";

export interface GetCouponsParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  type?: "percentage" | "fixed";
  sortBy?: "code" | "name" | "usedCount" | "createdAt" | "startsAt" | "expiresAt" | "value";
  sortOrder?: "asc" | "desc";
}

export class CouponRepository {
  static async findCouponByCode(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    const rows = await db
      .select()
      .from(coupons)
      .where(and(eq(coupons.code, normalizedCode), eq(coupons.isActive, true)));

    return rows[0] || null;
  }

  static async findCouponByCodeAnyStatus(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    const rows = await db
      .select()
      .from(coupons)
      .where(eq(coupons.code, normalizedCode));

    return rows[0] || null;
  }

  static async findById(id: string) {
    const rows = await db
      .select()
      .from(coupons)
      .where(eq(coupons.id, id));

    return rows[0] || null;
  }

  static async findMany(params: GetCouponsParams) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      type,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = params;

    const offset = (page - 1) * limit;

    const conditions = [];

    if (search && search.trim() !== "") {
      const searchPattern = `%${search.trim()}%`;
      conditions.push(
        or(
          ilike(coupons.code, searchPattern),
          ilike(coupons.name, searchPattern),
          ilike(coupons.description, searchPattern)
        )
      );
    }

    if (isActive !== undefined) {
      conditions.push(eq(coupons.isActive, isActive));
    }

    if (type) {
      conditions.push(eq(coupons.type, type));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByColumn;
    switch (sortBy) {
      case "code":
        orderByColumn = coupons.code;
        break;
      case "name":
        orderByColumn = coupons.name;
        break;
      case "usedCount":
        orderByColumn = coupons.usedCount;
        break;
      case "value":
        orderByColumn = coupons.value;
        break;
      case "startsAt":
        orderByColumn = coupons.startsAt;
        break;
      case "expiresAt":
        orderByColumn = coupons.expiresAt;
        break;
      case "createdAt":
      default:
        orderByColumn = coupons.createdAt;
        break;
    }

    const orderDirection = sortOrder === "asc" ? asc(orderByColumn) : desc(orderByColumn);

    const [items, totalResult] = await Promise.all([
      db
        .select()
        .from(coupons)
        .where(whereClause)
        .orderBy(orderDirection)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(coupons)
        .where(whereClause),
    ]);

    const total = totalResult[0]?.count || 0;
    const totalPages = Math.ceil(total / limit);

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

  static async create(data: typeof coupons.$inferInsert) {
    const [newCoupon] = await db
      .insert(coupons)
      .values({
        ...data,
        code: data.code.toUpperCase(),
      })
      .returning();

    return newCoupon;
  }

  static async update(id: string, data: Partial<typeof coupons.$inferInsert>) {
    const updatePayload = {
      ...data,
      ...(data.code ? { code: data.code.toUpperCase() } : {}),
      updatedAt: new Date(),
    };

    const [updated] = await db
      .update(coupons)
      .set(updatePayload)
      .where(eq(coupons.id, id))
      .returning();

    return updated || null;
  }

  static async delete(id: string) {
    const [deleted] = await db
      .delete(coupons)
      .where(eq(coupons.id, id))
      .returning();

    return deleted || null;
  }

  static async bulkUpdateStatus(ids: string[], isActive: boolean) {
    if (ids.length === 0) return 0;
    const updated = await db
      .update(coupons)
      .set({ isActive, updatedAt: new Date() })
      .where(inArray(coupons.id, ids))
      .returning();

    return updated.length;
  }

  static async bulkDelete(ids: string[]) {
    if (ids.length === 0) return 0;
    const deleted = await db
      .delete(coupons)
      .where(inArray(coupons.id, ids))
      .returning();

    return deleted.length;
  }

  static async getCouponUsageHistory(couponId: string) {
    const usage = await db
      .select()
      .from(couponUsage)
      .where(eq(couponUsage.couponId, couponId))
      .orderBy(desc(couponUsage.usedAt))
      .limit(50);

    return usage;
  }
}

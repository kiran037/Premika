import { db } from "@/db/client";
import { categories, products } from "@/db/schema";
import { eq, and, asc, desc, count, or, ilike, inArray } from "drizzle-orm";

export class CategoryRepository {
  /**
   * Find all active categories
   */
  static async findAllCategories() {
    const [categoryRecords, counts] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(eq(categories.isActive, true))
        .orderBy(asc(categories.sortOrder)),
      db
        .select({
          categoryId: products.categoryId,
          total: count(),
        })
        .from(products)
        .where(eq(products.isActive, true))
        .groupBy(products.categoryId),
    ]);

    const countsMap = new Map(counts.map((item) => [item.categoryId, Number(item.total)]));

    return categoryRecords.map((cat) => ({
      ...cat,
      productCount: countsMap.get(cat.id) || 0,
    }));
  }

  /**
   * Find category by slug or id
   */
  static async findCategoryBySlug(slugOrId: string) {
    const categoryRecord = await db
      .select()
      .from(categories)
      .where(
        and(
          eq(categories.isActive, true),
          eq(categories.slug, slugOrId)
        )
      )
      .then((rows) => rows[0] || null);

    if (!categoryRecord) return null;

    const productCountResult = await db
      .select({ total: count() })
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          eq(products.categoryId, categoryRecord.id)
        )
      );

    return {
      ...categoryRecord,
      productCount: Number(productCountResult[0]?.total || 0),
    };
  }

  /**
   * Admin: Search, filter, sort, and paginate categories with product count
   */
  static async getAdminCategories(query: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: "sortOrder" | "name_asc" | "newest" | "productCount";
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      const term = `%${query.search.trim()}%`;
      conditions.push(
        or(
          ilike(categories.name, term),
          ilike(categories.slug, term),
          ilike(categories.description, term)
        )
      );
    }

    if (query.isActive !== undefined) {
      conditions.push(eq(categories.isActive, query.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (query.sortBy) {
      case "name_asc":
        orderBy = asc(categories.name);
        break;
      case "newest":
        orderBy = desc(categories.createdAt);
        break;
      case "sortOrder":
      default:
        orderBy = asc(categories.sortOrder);
        break;
    }

    const [totalResult, records] = await Promise.all([
      db
        .select({ totalCount: count() })
        .from(categories)
        .where(whereClause),
      db
        .select()
        .from(categories)
        .where(whereClause)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
    ]);

    const total = Number(totalResult[0]?.totalCount || 0);

    if (total === 0 || records.length === 0) {
      return {
        items: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }

    const catIds = records.map((c) => c.id);
    let countsMap = new Map<string, number>();

    if (catIds.length > 0) {
      const counts = await db
        .select({
          categoryId: products.categoryId,
          total: count(),
        })
        .from(products)
        .where(inArray(products.categoryId, catIds))
        .groupBy(products.categoryId);

      countsMap = new Map(counts.map((item) => [item.categoryId, Number(item.total)]));
    }

    const items = records.map((cat) => ({
      ...cat,
      productCount: countsMap.get(cat.id) || 0,
    }));

    if (query.sortBy === "productCount") {
      items.sort((a, b) => b.productCount - a.productCount);
    }

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  static async findAdminCategoryById(id: string) {
    const record = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .then((rows) => rows[0] || null);

    if (!record) return null;

    const countRes = await db
      .select({ total: count() })
      .from(products)
      .where(eq(products.categoryId, id));

    return {
      ...record,
      productCount: Number(countRes[0]?.total || 0),
    };
  }

  static async createAdminCategory(data: any) {
    const [created] = await db.insert(categories).values(data).returning();
    return created;
  }

  static async updateAdminCategory(id: string, data: any) {
    const [updated] = await db
      .update(categories)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  static async toggleCategoryStatus(id: string) {
    const current = await this.findAdminCategoryById(id);
    if (!current) throw new Error("Category not found");

    const [updated] = await db
      .update(categories)
      .set({
        isActive: !current.isActive,
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();
    return updated;
  }

  static async deleteAdminCategory(id: string) {
    const [deleted] = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    return deleted;
  }

  static async bulkAdminCategoryAction(ids: string[], action: "activate" | "deactivate" | "delete") {
    if (ids.length === 0) return { affected: 0 };

    if (action === "activate") {
      const updated = await db
        .update(categories)
        .set({ isActive: true, updatedAt: new Date() })
        .where(inArray(categories.id, ids))
        .returning();
      return { affected: updated.length };
    } else if (action === "deactivate") {
      const updated = await db
        .update(categories)
        .set({ isActive: false, updatedAt: new Date() })
        .where(inArray(categories.id, ids))
        .returning();
      return { affected: updated.length };
    } else if (action === "delete") {
      const deleted = await db
        .delete(categories)
        .where(inArray(categories.id, ids))
        .returning();
      return { affected: deleted.length };
    }

    return { affected: 0 };
  }
}

import { db } from "@/db/client";
import { categories, products, productImages } from "@/db/schema";
import { eq, and, asc, desc, count, or, ilike, inArray } from "drizzle-orm";

export class CategoryRepository {
  /**
   * Find all active categories
   */
  static async findAllCategories() {
    const categoryRecords = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder));

    // Get product count per category
    const categoryIds = categoryRecords.map((c) => c.id);
    let countsMap = new Map<string, number>();

    if (categoryIds.length > 0) {
      const counts = await db
        .select({
          categoryId: products.categoryId,
          total: count(),
        })
        .from(products)
        .where(eq(products.isActive, true))
        .groupBy(products.categoryId);

      countsMap = new Map(counts.map((item) => [item.categoryId, Number(item.total)]));
    }

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
      conditions.push(or(ilike(categories.name, term), ilike(categories.slug, term))!);
    }

    if (typeof query.isActive === "boolean") {
      conditions.push(eq(categories.isActive, query.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause = asc(categories.sortOrder);
    if (query.sortBy === "name_asc") orderByClause = asc(categories.name);
    else if (query.sortBy === "newest") orderByClause = desc(categories.createdAt);

    const [rawCategories, [{ total }]] = await Promise.all([
      db.select().from(categories).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset),
      db.select({ total: count() }).from(categories).where(whereClause),
    ]);

    const catIds = rawCategories.map((c) => c.id);
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

    let items = rawCategories.map((cat) => ({
      ...cat,
      productCount: countsMap.get(cat.id) || 0,
    }));

    if (query.sortBy === "productCount") {
      items.sort((a, b) => b.productCount - a.productCount);
    }

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Admin: Find single category by ID with attached products list
   */
  static async findAdminCategoryById(id: string) {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const condition = isUuid ? or(eq(categories.id, id), eq(categories.slug, id)) : eq(categories.slug, id);

    const categoryRecord = await db.select().from(categories).where(condition).then((r) => r[0] || null);

    if (!categoryRecord) return null;

    const attachedProducts = await db
      .select({
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        isActive: products.isActive,
        featured: products.featured,
        newArrival: products.newArrival,
        createdAt: products.createdAt,
      })
      .from(products)
      .where(eq(products.categoryId, categoryRecord.id))
      .orderBy(desc(products.createdAt));

    return {
      category: categoryRecord,
      productCount: attachedProducts.length,
      products: attachedProducts,
    };
  }

  /**
   * Admin: Create category record
   */
  static async createAdminCategory(payload: any) {
    const [created] = await db
      .insert(categories)
      .values({
        name: payload.name,
        slug: payload.slug.toLowerCase().trim(),
        description: payload.description || null,
        image: payload.image || null,
        isActive: payload.isActive ?? true,
        sortOrder: payload.sortOrder || 0,
        metaTitle: payload.metaTitle || null,
        metaDescription: payload.metaDescription || null,
        keywords: payload.keywords || null,
        canonicalUrl: payload.canonicalUrl || null,
        ogImage: payload.ogImage || null,
        noIndex: Boolean(payload.noIndex),
      })
      .returning();

    return created;
  }

  /**
   * Admin: Update category record
   */
  static async updateAdminCategory(id: string, payload: any) {
    const [updated] = await db
      .update(categories)
      .set({
        name: payload.name,
        slug: payload.slug.toLowerCase().trim(),
        description: payload.description || null,
        image: payload.image || null,
        isActive: payload.isActive,
        sortOrder: payload.sortOrder,
        metaTitle: payload.metaTitle || null,
        metaDescription: payload.metaDescription || null,
        keywords: payload.keywords || null,
        canonicalUrl: payload.canonicalUrl || null,
        ogImage: payload.ogImage || null,
        noIndex: Boolean(payload.noIndex),
        updatedAt: new Date(),
      })
      .where(eq(categories.id, id))
      .returning();

    return updated;
  }

  /**
   * Admin: Toggle category status
   */
  static async toggleCategoryStatus(id: string) {
    const cat = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .then((r) => r[0]);

    if (!cat) throw new Error("Category not found");

    const [updated] = await db
      .update(categories)
      .set({ isActive: !cat.isActive, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    return updated;
  }

  /**
   * Admin: Safe Delete Category with product constraint verification
   */
  static async deleteAdminCategory(id: string) {
    const [{ total }] = await db
      .select({ total: count() })
      .from(products)
      .where(eq(products.categoryId, id));

    if (Number(total) > 0) {
      throw new Error(
        `Cannot delete category. There are ${total} product(s) assigned to this category. Please reassign or delete the products first.`
      );
    }

    const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();
    return deleted;
  }

  /**
   * Admin: Bulk action on categories (activate, deactivate, safe delete)
   */
  static async bulkAdminCategoryAction(ids: string[], action: "activate" | "deactivate" | "delete") {
    if (!ids || ids.length === 0) return;

    if (action === "activate") {
      await db
        .update(categories)
        .set({ isActive: true, updatedAt: new Date() })
        .where(inArray(categories.id, ids));
    } else if (action === "deactivate") {
      await db
        .update(categories)
        .set({ isActive: false, updatedAt: new Date() })
        .where(inArray(categories.id, ids));
    } else if (action === "delete") {
      // Safe check for each ID
      for (const id of ids) {
        const [{ total }] = await db
          .select({ total: count() })
          .from(products)
          .where(eq(products.categoryId, id));

        if (Number(total) > 0) {
          throw new Error(
            `Cannot delete one or more selected categories. Some categories still contain products.`
          );
        }
      }
      await db.delete(categories).where(inArray(categories.id, ids));
    }
  }
}

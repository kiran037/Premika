import { db } from "@/db/client";
import {
  products,
  categories,
  productImages,
  productSizes,
  productHeights,
  productReviews,
  familyProducts,
  productFamilies,
} from "@/db/schema";
import { GetProductsQuery } from "@/lib/validations/product.query";
import { eq, and, or, ilike, gte, lte, desc, asc, inArray, count } from "drizzle-orm";

export interface ProductWithRelations {
  product: typeof products.$inferSelect;
  category: typeof categories.$inferSelect | null;
  images: (typeof productImages.$inferSelect)[];
  sizes: (typeof productSizes.$inferSelect)[];
  heights: (typeof productHeights.$inferSelect)[];
  reviews: (typeof productReviews.$inferSelect)[];
  family: {
    id: string;
    name: string;
    slug: string;
    role: string;
  } | null;
}

export class ProductRepository {
  /**
   * Build WHERE clause filters based on options
   */
  private static buildWhereClause(filters: GetProductsQuery) {
    const conditions = [eq(products.isActive, true)];

    if (filters.search) {
      const searchTerm = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(products.name, searchTerm),
          ilike(products.shortDescription, searchTerm),
          ilike(products.longDescription, searchTerm)
        )!
      );
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(products.featured, filters.featured));
    }

    if (filters.newArrival !== undefined) {
      conditions.push(eq(products.newArrival, filters.newArrival));
    }

    if (filters.inStock !== undefined) {
      conditions.push(
        eq(products.stockStatus, filters.inStock ? "in_stock" : "out_of_stock")
      );
    }

    if (filters.minPrice !== undefined) {
      conditions.push(gte(products.price, filters.minPrice));
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(lte(products.price, filters.maxPrice));
    }

    return and(...conditions);
  }

  /**
   * Find paginated products matching filters
   */
  static async findProducts(
    filters: GetProductsQuery,
    categoryIds?: string[]
  ): Promise<{ items: ProductWithRelations[]; total: number }> {
    const whereClause = this.buildWhereClause(filters);

    let finalWhere = whereClause;
    if (categoryIds && categoryIds.length > 0) {
      finalWhere = and(whereClause, inArray(products.categoryId, categoryIds));
    }

    // Determine sorting
    let orderBy;
    switch (filters.sort) {
      case "price-low":
        orderBy = asc(products.price);
        break;
      case "price-high":
        orderBy = desc(products.price);
        break;
      case "name":
        orderBy = asc(products.name);
        break;
      case "newest":
        orderBy = desc(products.createdAt);
        break;
      case "featured":
      default:
        orderBy = desc(products.featured);
        break;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const offset = (page - 1) * limit;

    // Total count query
    const totalResult = await db
      .select({ totalCount: count() })
      .from(products)
      .where(finalWhere);

    const total = Number(totalResult[0]?.totalCount || 0);

    if (total === 0) {
      return { items: [], total: 0 };
    }

    // Fetch product records
    const productRecords = await db
      .select()
      .from(products)
      .where(finalWhere)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const productIds = productRecords.map((p) => p.id);

    // Batch fetch relations to prevent N+1 queries
    const [allCategories, allImages, allSizes, allHeights, allReviews, allFamilyLinks] =
      await Promise.all([
        db.select().from(categories),
        productIds.length > 0
          ? db
              .select()
              .from(productImages)
              .where(inArray(productImages.productId, productIds))
              .orderBy(asc(productImages.sortOrder))
          : Promise.resolve([]),
        productIds.length > 0
          ? db
              .select()
              .from(productSizes)
              .where(inArray(productSizes.productId, productIds))
              .orderBy(asc(productSizes.sortOrder))
          : Promise.resolve([]),
        productIds.length > 0
          ? db
              .select()
              .from(productHeights)
              .where(inArray(productHeights.productId, productIds))
              .orderBy(asc(productHeights.sortOrder))
          : Promise.resolve([]),
        productIds.length > 0
          ? db
              .select()
              .from(productReviews)
              .where(inArray(productReviews.productId, productIds))
          : Promise.resolve([]),
        productIds.length > 0
          ? db
              .select({
                productId: familyProducts.productId,
                role: familyProducts.role,
                familyId: productFamilies.id,
                familyName: productFamilies.name,
                familySlug: productFamilies.slug,
              })
              .from(familyProducts)
              .innerJoin(
                productFamilies,
                eq(familyProducts.familyId, productFamilies.id)
              )
              .where(inArray(familyProducts.productId, productIds))
          : Promise.resolve([]),
      ]);

    const categoryMap = new Map(allCategories.map((c) => [c.id, c]));

    const items: ProductWithRelations[] = productRecords.map((p) => {
      const familyLink = allFamilyLinks.find((f) => f.productId === p.id);
      return {
        product: p,
        category: categoryMap.get(p.categoryId) || null,
        images: allImages.filter((img) => img.productId === p.id),
        sizes: allSizes.filter((s) => s.productId === p.id),
        heights: allHeights.filter((h) => h.productId === p.id),
        reviews: allReviews.filter((r) => r.productId === p.id),
        family: familyLink
          ? {
              id: familyLink.familyId,
              name: familyLink.familyName,
              slug: familyLink.familySlug,
              role: familyLink.role,
            }
          : null,
      };
    });

    return { items, total };
  }

  /**
   * Find single product by slug or id with all relations
   */
  static async findProductBySlug(slugOrId: string): Promise<ProductWithRelations | null> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

    const condition = isUuid
      ? and(
          eq(products.isActive, true),
          or(eq(products.slug, slugOrId), eq(products.id, slugOrId))
        )
      : and(
          eq(products.isActive, true),
          eq(products.slug, slugOrId)
        );

    const productRecord = await db
      .select()
      .from(products)
      .where(condition)
      .then((rows) => rows[0]);

    if (!productRecord) return null;

    const [categoryRecord, images, sizes, heights, reviews, familyLink] = await Promise.all([
      db
        .select()
        .from(categories)
        .where(eq(categories.id, productRecord.categoryId))
        .then((rows) => rows[0] || null),
      db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, productRecord.id))
        .orderBy(asc(productImages.sortOrder)),
      db
        .select()
        .from(productSizes)
        .where(eq(productSizes.productId, productRecord.id))
        .orderBy(asc(productSizes.sortOrder)),
      db
        .select()
        .from(productHeights)
        .where(eq(productHeights.productId, productRecord.id))
        .orderBy(asc(productHeights.sortOrder)),
      db
        .select()
        .from(productReviews)
        .where(eq(productReviews.productId, productRecord.id)),
      db
        .select({
          role: familyProducts.role,
          familyId: productFamilies.id,
          familyName: productFamilies.name,
          familySlug: productFamilies.slug,
        })
        .from(familyProducts)
        .innerJoin(
          productFamilies,
          eq(familyProducts.familyId, productFamilies.id)
        )
        .where(eq(familyProducts.productId, productRecord.id))
        .then((rows) => rows[0] || null),
    ]);

    return {
      product: productRecord,
      category: categoryRecord,
      images,
      sizes,
      heights,
      reviews,
      family: familyLink
        ? {
            id: familyLink.familyId,
            name: familyLink.familyName,
            slug: familyLink.familySlug,
            role: familyLink.role,
          }
        : null,
    };
  }

  /**
   * Admin: List products with search, filters, sorting, and pagination
   */
  static async getAdminProducts(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    featured?: boolean;
    newArrival?: boolean;
    isActive?: boolean;
    sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc";
  }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (query.search) {
      const term = `%${query.search.trim()}%`;
      conditions.push(or(ilike(products.name, term), ilike(products.slug, term), ilike(products.sku, term))!);
    }

    if (query.categoryId) {
      conditions.push(eq(products.categoryId, query.categoryId));
    }

    if (typeof query.featured === "boolean") {
      conditions.push(eq(products.featured, query.featured));
    }

    if (typeof query.newArrival === "boolean") {
      conditions.push(eq(products.newArrival, query.newArrival));
    }

    if (typeof query.isActive === "boolean") {
      conditions.push(eq(products.isActive, query.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderByClause = desc(products.createdAt);
    if (query.sortBy === "oldest") orderByClause = asc(products.createdAt);
    else if (query.sortBy === "price_asc") orderByClause = asc(products.price);
    else if (query.sortBy === "price_desc") orderByClause = desc(products.price);
    else if (query.sortBy === "name_asc") orderByClause = asc(products.name);

    const [rawProducts, [{ total }]] = await Promise.all([
      db.select().from(products).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset),
      db.select({ total: count() }).from(products).where(whereClause),
    ]);

    const allCategories = await db.select().from(categories);
    const categoryMap = new Map(allCategories.map((c) => [c.id, c]));

    const productIds = rawProducts.map((p) => p.id);

    let allImages: any[] = [];
    if (productIds.length > 0) {
      allImages = await db.select().from(productImages).where(inArray(productImages.productId, productIds));
    }

    const items = rawProducts.map((p) => ({
      product: p,
      category: categoryMap.get(p.categoryId) || null,
      images: allImages.filter((img) => img.productId === p.id),
    }));

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  /**
   * Admin: Atomic product creation with images, sizes, and heights
   */
  static async createAdminProduct(payload: any) {
    return await db.transaction(async (tx) => {
      const [product] = await tx
        .insert(products)
        .values({
          categoryId: payload.categoryId,
          name: payload.name,
          slug: payload.slug.toLowerCase().trim(),
          sku: payload.sku || null,
          productType: payload.productType || "top",
          gender: payload.gender || "women",
          price: payload.price,
          compareAtPrice: payload.compareAtPrice || null,
          costPrice: payload.costPrice || null,
          shortDescription: payload.shortDescription || null,
          longDescription: payload.longDescription || null,
          fabric: payload.fabric || null,
          featured: payload.featured || false,
          newArrival: payload.newArrival || false,
          hasHeightOptions: payload.hasHeightOptions || false,
          isActive: payload.isActive ?? true,
          metaTitle: payload.metaTitle || null,
          metaDescription: payload.metaDescription || null,
          keywords: payload.keywords || null,
          canonicalUrl: payload.canonicalUrl || null,
          ogImage: payload.ogImage || null,
          noIndex: Boolean(payload.noIndex),
        })
        .returning();

      // Insert images
      if (payload.images && payload.images.length > 0) {
        await tx.insert(productImages).values(
          payload.images.map((url: string, index: number) => ({
            productId: product.id,
            image: url,
            sortOrder: index,
            isPrimary: index === 0,
          }))
        );
      }

      // Insert sizes
      if (payload.sizes && payload.sizes.length > 0) {
        await tx.insert(productSizes).values(
          payload.sizes.map((s: any, index: number) => ({
            productId: product.id,
            size: s.size,
            stock: s.stock || 10,
            isAvailable: s.isAvailable ?? true,
            sortOrder: index,
          }))
        );
      }

      // Insert heights
      if (payload.heights && payload.heights.length > 0) {
        await tx.insert(productHeights).values(
          payload.heights.map((h: any, index: number) => ({
            productId: product.id,
            label: h.label,
            value: h.value,
            isDefault: h.isDefault || false,
            sortOrder: index,
          }))
        );
      }

      return product;
    });
  }

  /**
   * Admin: Atomic product update with relations
   */
  static async updateAdminProduct(id: string, payload: any) {
    return await db.transaction(async (tx) => {
      const [updated] = await tx
        .update(products)
        .set({
          categoryId: payload.categoryId,
          name: payload.name,
          slug: payload.slug.toLowerCase().trim(),
          sku: payload.sku || null,
          productType: payload.productType,
          gender: payload.gender,
          price: payload.price,
          compareAtPrice: payload.compareAtPrice || null,
          costPrice: payload.costPrice || null,
          shortDescription: payload.shortDescription || null,
          longDescription: payload.longDescription || null,
          fabric: payload.fabric || null,
          featured: payload.featured,
          newArrival: payload.newArrival,
          hasHeightOptions: payload.hasHeightOptions,
          isActive: payload.isActive,
          metaTitle: payload.metaTitle || null,
          metaDescription: payload.metaDescription || null,
          keywords: payload.keywords || null,
          canonicalUrl: payload.canonicalUrl || null,
          ogImage: payload.ogImage || null,
          noIndex: Boolean(payload.noIndex),
          updatedAt: new Date(),
        })
        .where(eq(products.id, id))
        .returning();

      if (payload.images) {
        await tx.delete(productImages).where(eq(productImages.productId, id));
        if (payload.images.length > 0) {
          await tx.insert(productImages).values(
            payload.images.map((url: string, index: number) => ({
              productId: id,
              image: url,
              sortOrder: index,
              isPrimary: index === 0,
            }))
          );
        }
      }

      if (payload.sizes) {
        await tx.delete(productSizes).where(eq(productSizes.productId, id));
        if (payload.sizes.length > 0) {
          await tx.insert(productSizes).values(
            payload.sizes.map((s: any, index: number) => ({
              productId: id,
              size: s.size,
              stock: s.stock || 10,
              isAvailable: s.isAvailable ?? true,
              sortOrder: index,
            }))
          );
        }
      }

      if (payload.heights) {
        await tx.delete(productHeights).where(eq(productHeights.productId, id));
        if (payload.heights.length > 0) {
          await tx.insert(productHeights).values(
            payload.heights.map((h: any, index: number) => ({
              productId: id,
              label: h.label,
              value: h.value,
              isDefault: h.isDefault || false,
              sortOrder: index,
            }))
          );
        }
      }

      return updated;
    });
  }

  /**
   * Admin: Quick toggle status flag (isActive, featured, newArrival)
   */
  static async toggleProductField(id: string, field: "isActive" | "featured" | "newArrival") {
    const prod = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((r) => r[0]);

    if (!prod) throw new Error("Product not found");

    const newValue = !prod[field];

    const [updated] = await db
      .update(products)
      .set({ [field]: newValue, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();

    return updated;
  }

  /**
   * Admin: Delete product record
   */
  static async deleteAdminProduct(id: string) {
    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
    return deleted;
  }

  /**
   * Admin: Bulk action on product IDs (activate, deactivate, delete)
   */
  static async bulkAdminProductAction(ids: string[], action: "activate" | "deactivate" | "delete") {
    if (!ids || ids.length === 0) return;

    if (action === "activate") {
      await db
        .update(products)
        .set({ isActive: true, updatedAt: new Date() })
        .where(inArray(products.id, ids));
    } else if (action === "deactivate") {
      await db
        .update(products)
        .set({ isActive: false, updatedAt: new Date() })
        .where(inArray(products.id, ids));
    } else if (action === "delete") {
      await db.delete(products).where(inArray(products.id, ids));
    }
  }
}

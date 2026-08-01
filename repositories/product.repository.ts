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
import { eq, and, asc, desc, count, or, ilike, inArray, sql } from "drizzle-orm";
import { GetProductsQuery, getProductsQuerySchema } from "@/lib/validations/product.query";

type Product = typeof products.$inferSelect;
type Category = typeof categories.$inferSelect;
type ProductImage = typeof productImages.$inferSelect;
type ProductSize = typeof productSizes.$inferSelect;
type ProductHeight = typeof productHeights.$inferSelect;
type ProductReview = typeof productReviews.$inferSelect;

export interface ProductWithRelations {
  product: Product;
  category: Category | null;
  images: ProductImage[];
  sizes: ProductSize[];
  heights: ProductHeight[];
  reviews: ProductReview[];
  family?: {
    id: string;
    name: string;
    slug: string;
    role: string;
  };
}

export class ProductRepository {
  private static buildWhereClause(filters: GetProductsQuery) {
    const conditions = [eq(products.isActive, true)];

    if (filters.search) {
      const searchTerm = `%${filters.search.trim()}%`;
      conditions.push(
        or(
          ilike(products.name, searchTerm),
          ilike(products.shortDescription, searchTerm),
          ilike(products.fabric, searchTerm)
        )!
      );
    }

    if (filters.featured !== undefined) {
      conditions.push(eq(products.featured, filters.featured));
    }

    if (filters.newArrival !== undefined) {
      conditions.push(eq(products.newArrival, filters.newArrival));
    }

    if (filters.minPrice !== undefined) {
      conditions.push(sql`${products.price} >= ${filters.minPrice}`);
    }

    if (filters.maxPrice !== undefined) {
      conditions.push(sql`${products.price} <= ${filters.maxPrice}`);
    }

    return and(...conditions);
  }

  /**
   * Find paginated products with all relations
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

    // Batch fetch relations
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
          : undefined,
      };
    });

    return { items, total };
  }

  /**
   * Find single product by slug or id
   */
  static async findProductBySlug(slugOrId: string): Promise<ProductWithRelations | null> {
    const productRecord = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.isActive, true),
          or(eq(products.slug, slugOrId), eq(products.id, slugOrId))
        )
      )
      .then((rows) => rows[0] || null);

    if (!productRecord) {
      return null;
    }

    const { items } = await this.findProducts(getProductsQuerySchema.parse({ page: 1, limit: 1 }));
    const fullProduct = items.find((i) => i.product.id === productRecord.id);

    return fullProduct || {
      product: productRecord,
      category: null,
      images: [],
      sizes: [],
      heights: [],
      reviews: [],
    };
  }

  /**
   * Admin: Search, filter, sort, and paginate products
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
      conditions.push(
        or(
          ilike(products.name, term),
          ilike(products.sku, term),
          ilike(products.slug, term)
        )
      );
    }

    if (query.categoryId) {
      conditions.push(eq(products.categoryId, query.categoryId));
    }

    if (query.featured !== undefined) {
      conditions.push(eq(products.featured, query.featured));
    }

    if (query.newArrival !== undefined) {
      conditions.push(eq(products.newArrival, query.newArrival));
    }

    if (query.isActive !== undefined) {
      conditions.push(eq(products.isActive, query.isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    let orderBy;
    switch (query.sortBy) {
      case "oldest":
        orderBy = asc(products.createdAt);
        break;
      case "price_asc":
        orderBy = asc(products.price);
        break;
      case "price_desc":
        orderBy = desc(products.price);
        break;
      case "name_asc":
        orderBy = asc(products.name);
        break;
      case "newest":
      default:
        orderBy = desc(products.createdAt);
        break;
    }

    const totalResult = await db
      .select({ totalCount: count() })
      .from(products)
      .where(whereClause);

    const total = Number(totalResult[0]?.totalCount || 0);

    if (total === 0) {
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

    const productRecords = await db
      .select()
      .from(products)
      .where(whereClause)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const productIds = productRecords.map((p) => p.id);

    const [allCategories, allImages, allSizes] = await Promise.all([
      db.select().from(categories),
      productIds.length > 0
        ? db
            .select()
            .from(productImages)
            .where(inArray(productImages.productId, productIds))
            .orderBy(asc(productImages.sortOrder))
        : [],
      productIds.length > 0
        ? db
            .select()
            .from(productSizes)
            .where(inArray(productSizes.productId, productIds))
            .orderBy(asc(productSizes.sortOrder))
        : [],
    ]);

    const categoryMap = new Map(allCategories.map((c) => [c.id, c]));

    const items = productRecords.map((p) => {
      const pImages = allImages.filter((img) => img.productId === p.id);
      const pSizes = allSizes.filter((s) => s.productId === p.id);
      const totalStock = pSizes.reduce((acc, curr) => acc + (curr.stock || 0), 0);

      return {
        ...p,
        category: categoryMap.get(p.categoryId) || null,
        primaryImage: pImages[0]?.image || null,
        totalStock,
      };
    });

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

  static async createAdminProduct(data: any) {
    const { images = [], sizes = [], heights = [], ...productData } = data;

    const [createdProduct] = await db
      .insert(products)
      .values(productData)
      .returning();

    if (images.length > 0) {
      await db.insert(productImages).values(
        images.map((imgUrl: string, idx: number) => ({
          productId: createdProduct.id,
          image: imgUrl,
          sortOrder: idx,
        }))
      );
    }

    if (sizes.length > 0) {
      await db.insert(productSizes).values(
        sizes.map((s: any, idx: number) => ({
          productId: createdProduct.id,
          size: s.size,
          stock: s.stock ?? 10,
          isAvailable: s.isAvailable ?? true,
          sortOrder: idx,
        }))
      );
    }

    if (heights.length > 0) {
      await db.insert(productHeights).values(
        heights.map((h: any, idx: number) => ({
          productId: createdProduct.id,
          label: h.label,
          value: h.value,
          isDefault: h.isDefault ?? false,
          sortOrder: idx,
        }))
      );
    }

    return createdProduct;
  }

  static async updateAdminProduct(id: string, data: any) {
    const { images, sizes, heights, ...productData } = data;

    const [updatedProduct] = await db
      .update(products)
      .set({
        ...productData,
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    if (images !== undefined) {
      await db.delete(productImages).where(eq(productImages.productId, id));
      if (images.length > 0) {
        await db.insert(productImages).values(
          images.map((imgUrl: string, idx: number) => ({
            productId: id,
            image: imgUrl,
            sortOrder: idx,
          }))
        );
      }
    }

    if (sizes !== undefined) {
      await db.delete(productSizes).where(eq(productSizes.productId, id));
      if (sizes.length > 0) {
        await db.insert(productSizes).values(
          sizes.map((s: any, idx: number) => ({
            productId: id,
            size: s.size,
            stock: s.stock ?? 10,
            isAvailable: s.isAvailable ?? true,
            sortOrder: idx,
          }))
        );
      }
    }

    if (heights !== undefined) {
      await db.delete(productHeights).where(eq(productHeights.productId, id));
      if (heights.length > 0) {
        await db.insert(productHeights).values(
          heights.map((h: any, idx: number) => ({
            productId: id,
            label: h.label,
            value: h.value,
            isDefault: h.isDefault ?? false,
            sortOrder: idx,
          }))
        );
      }
    }

    return updatedProduct;
  }

  static async toggleProductField(id: string, field: "isActive" | "featured" | "newArrival") {
    const existing = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .then((rows) => rows[0] || null);

    if (!existing) throw new Error("Product not found");

    const [updated] = await db
      .update(products)
      .set({
        [field]: !existing[field],
        updatedAt: new Date(),
      })
      .where(eq(products.id, id))
      .returning();

    return updated;
  }

  static async deleteAdminProduct(id: string) {
    const [deleted] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return deleted;
  }

  static async bulkAdminProductAction(ids: string[], action: "activate" | "deactivate" | "delete") {
    if (ids.length === 0) return { affected: 0 };

    if (action === "activate") {
      const updated = await db
        .update(products)
        .set({ isActive: true, updatedAt: new Date() })
        .where(inArray(products.id, ids))
        .returning();
      return { affected: updated.length };
    } else if (action === "deactivate") {
      const updated = await db
        .update(products)
        .set({ isActive: false, updatedAt: new Date() })
        .where(inArray(products.id, ids))
        .returning();
      return { affected: updated.length };
    } else if (action === "delete") {
      const deleted = await db
        .delete(products)
        .where(inArray(products.id, ids))
        .returning();
      return { affected: deleted.length };
    }

    return { affected: 0 };
  }
}

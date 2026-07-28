import {
  ProductRepository,
  ProductWithRelations,
} from "@/repositories/product.repository";
import { CategoryRepository } from "@/repositories/category.repository";
import { GetProductsInput, getProductsQuerySchema } from "@/lib/validations/product.query";
import { Product, SizeOption, HeightOption, Review } from "@/types";

export class ProductService {
  // TODO: Admin Panel - Future Integration (Admin Product CRUD: createProduct, updateProduct, deleteProduct, toggleStock)

  /**
   * Format repository product output to match Product frontend interface
   */
  public static formatProductResponse(item: ProductWithRelations): Product {
    const p = item.product;

    const formattedImages =
      item.images.length > 0
        ? item.images.map((img) => img.image)
        : ["/placeholder.svg"];

    const formattedSizes: SizeOption[] = item.sizes.map((s) => ({
      label: s.size,
      inStock: s.isAvailable,
    }));

    const formattedHeights: HeightOption[] = item.heights.map((h) => ({
      label: h.label,
      value: h.value,
      default: h.isDefault,
    }));

    const formattedReviews: Review[] = item.reviews.map((r) => ({
      name: r.customerName,
      date: r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "",
      rating: r.rating,
      comment: r.comment,
    }));

    return {
      id: p.slug || p.id,
      name: p.name,
      price: p.price,
      shortDescription: p.shortDescription || "",
      longDescription: p.longDescription || "",
      images: formattedImages,
      category: item.category?.slug || item.category?.name?.toLowerCase() || "clothing",
      inStock: p.stockStatus === "in_stock",
      sizes: formattedSizes,
      heights: formattedHeights.length > 0 ? formattedHeights : undefined,
      reviews: formattedReviews,
      gender: p.gender,
      hasHeightOption: p.hasHeightOptions,
      isCombo: p.productType === "set",
      featured: p.featured,
      newArrival: p.newArrival,
    };
  }

  /**
   * Get paginated products with filters
   */
  static async getProducts(inputQuery: GetProductsInput = {}) {
    const query = getProductsQuerySchema.parse(inputQuery);

    let categoryIds: string[] | undefined;

    if (query.category) {
      const cat = await CategoryRepository.findCategoryBySlug(query.category);
      if (cat) {
        categoryIds = [cat.id];
      } else {
        // Category specified but not found -> return empty set
        return {
          items: [],
          pagination: {
            page: query.page || 1,
            limit: query.limit || 20,
            total: 0,
            totalPages: 0,
          },
        };
      }
    }

    const { items, total } = await ProductRepository.findProducts(query, categoryIds);
    const formattedItems = items.map((item) => this.formatProductResponse(item));

    const page = query.page || 1;
    const limit = query.limit || 20;

    return {
      items: formattedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 0,
      },
    };
  }

  /**
   * Get single product by slug
   */
  static async getProductBySlug(slug: string): Promise<Product | null> {
    const item = await ProductRepository.findProductBySlug(slug);
    if (!item) return null;
    return this.formatProductResponse(item);
  }

  /**
   * Admin: List products with search, filters, sorting, and pagination
   */
  static async getAdminProductsList(query: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    featured?: boolean;
    newArrival?: boolean;
    isActive?: boolean;
    sortBy?: "newest" | "oldest" | "price_asc" | "price_desc" | "name_asc";
  }) {
    return await ProductRepository.getAdminProducts(query);
  }

  /**
   * Admin: Create product with relations
   */
  static async createAdminProduct(payload: any) {
    return await ProductRepository.createAdminProduct(payload);
  }

  /**
   * Admin: Update product with relations
   */
  static async updateAdminProduct(id: string, payload: any) {
    return await ProductRepository.updateAdminProduct(id, payload);
  }

  /**
   * Admin: Toggle status field (isActive, featured, newArrival)
   */
  static async toggleAdminProductStatus(id: string, field: "isActive" | "featured" | "newArrival") {
    return await ProductRepository.toggleProductField(id, field);
  }

  /**
   * Admin: Delete product by ID
   */
  static async deleteAdminProduct(id: string) {
    return await ProductRepository.deleteAdminProduct(id);
  }

  /**
   * Admin: Bulk action on product IDs
   */
  static async bulkAdminProductAction(ids: string[], action: "activate" | "deactivate" | "delete") {
    return await ProductRepository.bulkAdminProductAction(ids, action);
  }
}

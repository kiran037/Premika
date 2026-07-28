import { CategoryRepository } from "@/repositories/category.repository";

export class CategoryService {
  /**
   * Get all active categories
   */
  static async getCategories() {
    return await CategoryRepository.findAllCategories();
  }

  /**
   * Get category details by slug
   */
  static async getCategoryBySlug(slug: string) {
    return await CategoryRepository.findCategoryBySlug(slug);
  }

  /**
   * Admin: List categories with search, filters, sorting, and product counts
   */
  static async getAdminCategoriesList(query: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    sortBy?: "sortOrder" | "name_asc" | "newest" | "productCount";
  }) {
    return await CategoryRepository.getAdminCategories(query);
  }

  /**
   * Admin: Get category by ID for edit/view
   */
  static async getAdminCategoryById(id: string) {
    return await CategoryRepository.findAdminCategoryById(id);
  }

  /**
   * Admin: Create category
   */
  static async createAdminCategory(payload: any) {
    return await CategoryRepository.createAdminCategory(payload);
  }

  /**
   * Admin: Update category
   */
  static async updateAdminCategory(id: string, payload: any) {
    return await CategoryRepository.updateAdminCategory(id, payload);
  }

  /**
   * Admin: Toggle category status
   */
  static async toggleAdminCategoryStatus(id: string) {
    return await CategoryRepository.toggleCategoryStatus(id);
  }

  /**
   * Admin: Safe Delete category
   */
  static async deleteAdminCategory(id: string) {
    return await CategoryRepository.deleteAdminCategory(id);
  }

  /**
   * Admin: Bulk action on categories
   */
  static async bulkAdminCategoryAction(ids: string[], action: "activate" | "deactivate" | "delete") {
    return await CategoryRepository.bulkAdminCategoryAction(ids, action);
  }
}

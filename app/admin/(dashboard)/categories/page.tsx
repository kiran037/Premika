"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  FolderTree,
  Package,
  Layers,
} from "lucide-react";
import {
  AdminButton,
  AdminCard,
  AdminTable,
  AdminBadge,
  ConfirmDialog,
} from "@/components/admin";
import { toast } from "react-hot-toast";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("sortOrder");

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Safe Delete Modal State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (isActiveFilter !== "all") params.set("isActive", isActiveFilter);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/categories?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setCategories(json.data.items || []);
        setTotal(json.data.total || 0);
        setTotalPages(json.data.totalPages || 1);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch {
      toast.error("Error loading categories");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, isActiveFilter, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/categories/${id}/toggle`, { method: "PATCH" });
      const json = await res.json();

      if (json.success) {
        toast.success("Category status updated");
        fetchCategories();
      } else {
        toast.error(json.message || "Failed to update status");
      }
    } catch {
      toast.error("Error toggling category status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${deleteTargetId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        toast.success("Category deleted successfully");
        setDeleteTargetId(null);
        fetchCategories();
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Error deleting category");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkAction = async (action: "activate" | "deactivate" | "delete") => {
    if (selectedIds.length === 0) return;
    setIsBulkLoading(true);
    try {
      const res = await fetch("/api/admin/categories/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(`Bulk ${action} completed`);
        setSelectedIds([]);
        fetchCategories();
      } else {
        toast.error(json.message || "Bulk action failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Error running bulk operation");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((c) => c.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 w-full mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Category Management</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Organize collections, display orders, and product groupings ({total} total categories)
          </p>
        </div>
        <Link href="/admin/categories/new">
          <AdminButton className="flex items-center gap-2 bg-[#B67B5C] hover:bg-[#8B5A3C] text-white">
            <Plus size={16} />
            <span>Add New Category</span>
          </AdminButton>
        </Link>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search category name or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
            />
          </div>

          {/* Active Filter */}
          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="all">Status: All</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="sortOrder">Sort: Display Order</option>
            <option value="name_asc">Sort: Name (A-Z)</option>
            <option value="productCount">Sort: Product Count</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>

        {/* Selected Bulk Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-[#B67B5C]/10 border border-[#B67B5C]/30 p-2.5 rounded-xl text-xs">
            <span className="font-semibold text-[#B67B5C]">
              {selectedIds.length} category(ies) selected
            </span>
            <div className="flex items-center gap-2">
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("activate")}
                isLoading={isBulkLoading}
              >
                Bulk Activate
              </AdminButton>
              <AdminButton
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("deactivate")}
                isLoading={isBulkLoading}
              >
                Bulk Deactivate
              </AdminButton>
              <AdminButton
                size="sm"
                variant="danger"
                onClick={() => handleBulkAction("delete")}
                isLoading={isBulkLoading}
              >
                Bulk Delete
              </AdminButton>
            </div>
          </div>
        )}
      </div>

      {/* Category Table */}
      <AdminCard title="Categories Table" description={`Showing ${categories.length} of ${total} categories`}>
        <AdminTable
          headers={[
            <input
              key="select-all"
              type="checkbox"
              checked={selectedIds.length > 0 && selectedIds.length === categories.length}
              onChange={toggleSelectAll}
              className="rounded text-[#B67B5C]"
            />,
            "Category",
            "Slug",
            "Products",
            "Sort Order",
            "Status",
            "Actions",
          ]}
          isEmpty={!isLoading && categories.length === 0}
          emptyText="No categories found matching your search"
        >
          {categories.map((c) => {
            const thumb = c.image || "/placeholder.svg";

            return (
              <tr key={c.id} className="hover:bg-stone-50 text-xs">
                <td className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggleSelectOne(c.id)}
                    className="rounded text-[#B67B5C]"
                  />
                </td>

                {/* Thumbnail + Name */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative flex-shrink-0">
                      <Image src={thumb} alt={c.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{c.name}</p>
                      {c.description && <p className="text-[11px] text-stone-400 truncate max-w-xs">{c.description}</p>}
                    </div>
                  </div>
                </td>

                {/* Slug */}
                <td className="px-6 py-3 font-mono text-stone-600">{c.slug}</td>

                {/* Product Count */}
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-800 rounded-full font-bold text-[11px]">
                    <Package size={12} className="text-[#B67B5C]" />
                    <span>{c.productCount} products</span>
                  </span>
                </td>

                {/* Sort Order */}
                <td className="px-6 py-3 font-semibold text-stone-700">{c.sortOrder}</td>

                {/* Active Toggle Switch */}
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleToggleStatus(c.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition ${c.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                  >
                    {c.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>{c.isActive ? "Active" : "Inactive"}</span>
                  </button>
                </td>

                {/* Actions */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/categories/${c.id}`} title="View Category Details">
                      <button className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg">
                        <Eye size={15} />
                      </button>
                    </Link>

                    <Link href={`/admin/categories/${c.id}/edit`} title="Edit Category">
                      <button className="p-1.5 text-stone-500 hover:text-[#B67B5C] hover:bg-[#B67B5C]/10 rounded-lg">
                        <Edit size={15} />
                      </button>
                    </Link>

                    <a
                      href={`/clothing?category=${c.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Preview Customer Category Page"
                      className="p-1.5 text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <ExternalLink size={15} />
                    </a>

                    <button
                      onClick={() => setDeleteTargetId(c.id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </AdminTable>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 px-2 text-xs">
            <span className="text-stone-500">
              Page {page} of {totalPages} ({total} categories)
            </span>
            <div className="flex items-center gap-2">
              <AdminButton
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </AdminButton>
              <AdminButton
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </AdminButton>
            </div>
          </div>
        )}
      </AdminCard>

      {/* Safe Delete Confirm Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? The system will verify that no products are assigned to this category before completing deletion."
        confirmLabel="Delete Category"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
}

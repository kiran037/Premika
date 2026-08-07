"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  Star,
  Sparkles,
} from "lucide-react";
import {
  AdminButton,
  AdminCard,
  AdminTable,
  AdminBadge,
  ConfirmDialog,
  EmptyState,
} from "@/components/admin";
import { toast } from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");
  const [newArrivalFilter, setNewArrivalFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  // Selection & Bulk State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Delete Dialog State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const json = await res.json();
      if (json.success) setCategories(json.data || []);
    } catch {
      console.error("Failed to load categories");
    }
  };

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", "10");
      if (search) params.set("search", search);
      if (categoryId) params.set("categoryId", categoryId);
      if (isActiveFilter !== "all") params.set("isActive", isActiveFilter);
      if (featuredFilter !== "all") params.set("featured", featuredFilter);
      if (newArrivalFilter !== "all") params.set("newArrival", newArrivalFilter);
      if (sortBy) params.set("sortBy", sortBy);

      const res = await fetch(`/api/admin/products?${params.toString()}`);
      const json = await res.json();

      if (json.success) {
        setProducts(json.data.items || []);
        setTotal(json.data.total || 0);
        setTotalPages(json.data.totalPages || 1);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch {
      toast.error("Error loading products");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, categoryId, isActiveFilter, featuredFilter, newArrivalFilter, sortBy]);

  const handleToggleStatus = async (id: string, field: "isActive" | "featured" | "newArrival") => {
    try {
      const res = await fetch(`/api/admin/products/${id}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(`Updated ${field}`);
        fetchProducts();
      } else {
        toast.error(json.message || "Failed to update status");
      }
    } catch {
      toast.error("Error toggling product field");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${deleteTargetId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Product deleted successfully");
        setDeleteTargetId(null);
        fetchProducts();
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch {
      toast.error("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleBulkAction = async (action: "activate" | "deactivate" | "delete") => {
    if (selectedIds.length === 0) return;
    setIsBulkLoading(true);
    try {
      const res = await fetch("/api/admin/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });
      const json = await res.json();

      if (json.success) {
        toast.success(`Bulk ${action} completed`);
        setSelectedIds([]);
        fetchProducts();
      } else {
        toast.error(json.message || "Bulk action failed");
      }
    } catch {
      toast.error("Error running bulk operation");
    } finally {
      setIsBulkLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === products.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(products.map((item) => item.id || item.product?.id));
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
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900">Product Catalog Management</h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage, edit, feature, and organize Premika products catalog ({total} total products)
          </p>
        </div>
        <Link href="/admin/products/new">
          <AdminButton className="flex items-center gap-2 bg-[#B67B5C] hover:bg-[#8B5A3C] text-white">
            <Plus size={16} />
            <span>Add New Product</span>
          </AdminButton>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, slug, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#B67B5C]"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Active Status */}
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
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A-Z</option>
          </select>
        </div>

        {/* Selected Bulk Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between bg-[#B67B5C]/10 border border-[#B67B5C]/30 p-2.5 rounded-xl text-xs">
            <span className="font-semibold text-[#B67B5C]">
              {selectedIds.length} product(s) selected
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

      {/* Product Table */}
      <AdminCard title="Products Table" description={`Showing ${products.length} of ${total} products`}>
        <AdminTable
          headers={[
            <input
              key="select-all"
              type="checkbox"
              checked={selectedIds.length > 0 && selectedIds.length === products.length}
              onChange={toggleSelectAll}
              className="rounded text-[#B67B5C]"
            />,
            "Product",
            "Category",
            "Price",
            "Featured",
            "New Arrival",
            "Active",
            "Actions",
          ]}
          isEmpty={!isLoading && products.length === 0}
          emptyText="No products found matching your filters"
        >
          {products.map((item) => {
            const pId = item.id || item.product?.id;
            const pName = item.name || item.product?.name || "Untitled Product";
            const pSlug = item.slug || item.product?.slug || "";
            const pPrice = item.price ?? item.product?.price ?? 0;
            const pFeatured = item.featured ?? item.product?.featured ?? false;
            const pNewArrival = item.newArrival ?? item.product?.newArrival ?? false;
            const pIsActive = item.isActive ?? item.product?.isActive ?? false;
            const pCategory = item.category || null;
            const primaryImg = item.primaryImage || item.images?.[0]?.image || "/placeholder.svg";

            return (
              <tr key={pId} className="hover:bg-stone-50 text-xs">
                <td className="px-6 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(pId)}
                    onChange={() => toggleSelectOne(pId)}
                    className="rounded text-[#B67B5C]"
                  />
                </td>

                {/* Image + Name */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 relative flex-shrink-0">
                      <Image src={primaryImg} alt={pName} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{pName}</p>
                      <p className="text-[10px] text-stone-400 font-mono">Slug: {pSlug}</p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-6 py-3 font-medium text-stone-700">
                  {pCategory ? pCategory.name : "Uncategorized"}
                </td>

                {/* Price */}
                <td className="px-6 py-3 font-bold text-stone-900">
                  ₹{pPrice.toLocaleString()}
                </td>

                {/* Featured Toggle */}
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleToggleStatus(pId, "featured")}
                    className={`p-1 rounded-md transition ${pFeatured ? "text-amber-500 bg-amber-50" : "text-stone-300 hover:text-stone-500"
                      }`}
                    title="Toggle Featured"
                  >
                    <Star size={16} fill={pFeatured ? "currentColor" : "none"} />
                  </button>
                </td>

                {/* New Arrival Toggle */}
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleToggleStatus(pId, "newArrival")}
                    className={`p-1 rounded-md transition ${pNewArrival ? "text-purple-600 bg-purple-50" : "text-stone-300 hover:text-stone-500"
                      }`}
                    title="Toggle New Arrival"
                  >
                    <Sparkles size={16} />
                  </button>
                </td>

                {/* Active Toggle */}
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleToggleStatus(pId, "isActive")}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold transition ${pIsActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                      }`}
                  >
                    {pIsActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    <span>{pIsActive ? "Active" : "Inactive"}</span>
                  </button>
                </td>

                {/* Action Buttons */}
                <td className="px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${pId}`} title="View Product Details">
                      <button className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg">
                        <Eye size={15} />
                      </button>
                    </Link>

                    <Link href={`/admin/products/${pId}/edit`} title="Edit Product">
                      <button className="p-1.5 text-stone-500 hover:text-[#B67B5C] hover:bg-[#B67B5C]/10 rounded-lg">
                        <Edit size={15} />
                      </button>
                    </Link>

                    <a
                      href={`/${pSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Preview Storefront Page"
                      className="p-1.5 text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                    >
                      <ExternalLink size={15} />
                    </a>

                    <button
                      onClick={() => setDeleteTargetId(pId)}
                      className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Product"
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
              Page {page} of {totalPages} ({total} items)
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

      {/* Delete Confirm Modal */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product? This action cannot be undone."
        confirmLabel="Delete Product"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
}

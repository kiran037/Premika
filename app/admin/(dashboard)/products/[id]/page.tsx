"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Edit,
  Trash2,
  ExternalLink,
  Star,
  Sparkles,
  CheckCircle,
  XCircle,
  Tag,
  Package,
  Layers,
} from "lucide-react";
import { AdminCard, AdminButton, AdminBadge, ConfirmDialog } from "@/components/admin";
import { toast } from "react-hot-toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("/placeholder.svg");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
          if (json.data.images && json.data.images.length > 0) {
            setActiveImage(json.data.images[0].image);
          }
        } else {
          toast.error("Product not found");
        }
      } catch {
        toast.error("Failed to load product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        toast.success("Product deleted");
        router.push("/admin/products");
      } else {
        toast.error(json.message || "Delete failed");
      }
    } catch {
      toast.error("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto p-8 space-y-4 animate-pulse">
        <div className="h-12 bg-stone-200 rounded-xl" />
        <div className="h-64 bg-stone-200 rounded-xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-md mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Product Not Found</h2>
        <Link href="/admin/products">
          <AdminButton variant="outline">Return to Products</AdminButton>
        </Link>
      </div>
    );
  }

  const { product, category, images, sizes, heights, reviews } = data;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <Link href="/admin/products">
            <button className="p-2 rounded-xl text-stone-600 hover:bg-stone-100">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-900">{product.name}</h1>
              {product.isActive ? (
                <AdminBadge variant="green">Active</AdminBadge>
              ) : (
                <AdminBadge variant="red">Inactive</AdminBadge>
              )}
            </div>
            <p className="text-xs text-stone-500 font-mono">ID: {product.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={`/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-200 rounded-xl text-xs text-stone-700 hover:bg-stone-50"
          >
            <ExternalLink size={14} />
            <span>Preview Storefront</span>
          </a>

          <Link href={`/admin/products/${product.id}/edit`}>
            <AdminButton size="sm" className="bg-[#B67B5C] hover:bg-[#8B5A3C] text-white flex items-center gap-1.5">
              <Edit size={14} />
              <span>Edit Product</span>
            </AdminButton>
          </Link>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Images Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-4/5 bg-stone-100 rounded-2xl overflow-hidden border border-stone-200">
            <Image src={activeImage} alt={product.name} fill className="object-cover" />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {images.map((img: any, idx: number) => (
              <button
                key={img.id || idx}
                onClick={() => setActiveImage(img.image)}
                className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                  activeImage === img.image ? "border-[#B67B5C]" : "border-stone-200"
                }`}
              >
                <Image src={img.image} alt={`Thumb ${idx}`} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Meta & Details */}
        <div className="md:col-span-2 space-y-6">
          <AdminCard title="Product Overview" description="Core details and pricing metrics">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Category</span>
                <span className="font-bold text-stone-900">{category?.name || "Uncategorized"}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Price</span>
                <span className="font-bold text-emerald-600 text-sm">₹{product.price.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">MSRP</span>
                <span className="text-stone-600">
                  {product.compareAtPrice ? `₹${product.compareAtPrice.toLocaleString()}` : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">SKU</span>
                <span className="font-mono text-stone-700">{product.sku || "N/A"}</span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Type / Gender</span>
                <span className="capitalize text-stone-700">
                  {product.productType} ({product.gender})
                </span>
              </div>
              <div>
                <span className="text-stone-400 block font-semibold uppercase">Fabric</span>
                <span className="text-stone-700">{product.fabric || "N/A"}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-3">
              {product.featured && <AdminBadge variant="amber">Featured</AdminBadge>}
              {product.newArrival && <AdminBadge variant="indigo">New Arrival</AdminBadge>}
              {product.hasHeightOptions && <AdminBadge variant="blue">Has Height Options</AdminBadge>}
            </div>
          </AdminCard>

          {/* Sizes & Inventory */}
          <AdminCard title="Size Variants & Inventory" description="Available sizes and stock count">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {sizes.map((s: any) => (
                <div key={s.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div className="flex items-center justify-between font-bold text-stone-900">
                    <span>Size {s.size}</span>
                    <span className="text-emerald-600">{s.stock} in stock</span>
                  </div>
                  <span className="text-[10px] text-stone-400 block mt-1">
                    {s.isAvailable ? "Available for order" : "Out of stock"}
                  </span>
                </div>
              ))}
            </div>
          </AdminCard>

          {/* Descriptions */}
          <AdminCard title="Descriptions" description="Product copy text">
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-stone-400 font-semibold uppercase block mb-1">Short Summary</span>
                <p className="text-stone-700">{product.shortDescription || "No short description provided."}</p>
              </div>
              <div>
                <span className="text-stone-400 font-semibold uppercase block mb-1">Long Description</span>
                <p className="text-stone-700 leading-relaxed">{product.longDescription || "No long description provided."}</p>
              </div>
            </div>
          </AdminCard>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to permanently delete this product?"
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
      />
    </div>
  );
}

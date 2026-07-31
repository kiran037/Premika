"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, EyeOff } from "lucide-react";
import { AdminCard, AdminButton, AdminInput } from "@/components/admin";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { toast } from "react-hot-toast";

export interface ProductFormProps {
  title: string;
  subtitle?: string;
  initialData?: any;
  categories: any[];
  onSubmit: (payload: any) => Promise<void>;
  isSubmitting: boolean;
  backUrl?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  title,
  subtitle,
  initialData,
  categories,
  onSubmit,
  isSubmitting,
  backUrl = "/admin/products",
}) => {
  // Basic Fields
  const [name, setName] = useState(initialData?.product?.name || "");
  const [slug, setSlug] = useState(initialData?.product?.slug || "");
  const [sku, setSku] = useState(initialData?.product?.sku || "");
  const [categoryId, setCategoryId] = useState(
    initialData?.product?.categoryId || (categories[0]?.id || "")
  );
  const [productType, setProductType] = useState<"top" | "bottom" | "set">(
    initialData?.product?.productType || "top"
  );
  const [gender, setGender] = useState<"men" | "women" | "unisex">(
    initialData?.product?.gender || "women"
  );

  // Pricing
  const [price, setPrice] = useState(initialData?.product?.price ? String(initialData.product.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialData?.product?.compareAtPrice ? String(initialData.product.compareAtPrice) : ""
  );
  const [costPrice, setCostPrice] = useState(
    initialData?.product?.costPrice ? String(initialData.product.costPrice) : ""
  );

  // Copy
  const [shortDescription, setShortDescription] = useState(initialData?.product?.shortDescription || "");
  const [longDescription, setLongDescription] = useState(initialData?.product?.longDescription || "");
  const [fabric, setFabric] = useState(initialData?.product?.fabric || "");

  // Flags
  const [featured, setFeatured] = useState(Boolean(initialData?.product?.featured));
  const [newArrival, setNewArrival] = useState(Boolean(initialData?.product?.newArrival));
  const [hasHeightOptions, setHasHeightOptions] = useState(Boolean(initialData?.product?.hasHeightOptions));
  const [isActive, setIsActive] = useState(
    typeof initialData?.product?.isActive === "boolean" ? initialData.product.isActive : true
  );

  // SEO State
  const [metaTitle, setMetaTitle] = useState(initialData?.product?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.product?.metaDescription || "");
  const [keywords, setKeywords] = useState(initialData?.product?.keywords || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.product?.canonicalUrl || "");
  const [ogImage, setOgImage] = useState(initialData?.product?.ogImage || "");
  const [noIndex, setNoIndex] = useState(Boolean(initialData?.product?.noIndex));

  // Arrays
  const [images, setImages] = useState<string[]>(
    initialData?.images && initialData.images.length > 0
      ? initialData.images.map((i: any) => i.image)
      : [""]
  );

  const [sizes, setSizes] = useState<{ size: string; stock: number; isAvailable: boolean }[]>(
    initialData?.sizes && initialData.sizes.length > 0
      ? initialData.sizes.map((s: any) => ({ size: s.size, stock: s.stock, isAvailable: s.isAvailable }))
      : [
        { size: "S", stock: 10, isAvailable: true },
        { size: "M", stock: 10, isAvailable: true },
        { size: "L", stock: 10, isAvailable: true },
        { size: "XL", stock: 10, isAvailable: true },
      ]
  );

  const [heights, setHeights] = useState<{ label: string; value: string; isDefault: boolean }[]>(
    initialData?.heights && initialData.heights.length > 0
      ? initialData.heights.map((h: any) => ({ label: h.label, value: h.value, isDefault: h.isDefault }))
      : [
        { label: "Short (5'0\" - 5'3\")", value: "short", isDefault: false },
        { label: "Regular (5'4\" - 5'7\")", value: "regular", isDefault: true },
        { label: "Tall (5'8\"+)", value: "tall", isDefault: false },
      ]
  );

  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, categoryId]);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !slug) {
      toast.error("Please fill in required fields (Product Name and Slug)");
      return;
    }

    if (!price || isNaN(Number(price))) {
      toast.error("Please enter a valid price");
      return;
    }

    const filteredImages = images.filter((img) => img.trim() !== "");
    if (filteredImages.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    const payload = {
      name,
      slug,
      sku: sku || undefined,
      categoryId,
      productType,
      gender,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      costPrice: costPrice ? Number(costPrice) : undefined,
      shortDescription: shortDescription || undefined,
      longDescription: longDescription || undefined,
      fabric: fabric || undefined,
      featured,
      newArrival,
      hasHeightOptions,
      isActive,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      keywords: keywords || undefined,
      canonicalUrl: canonicalUrl || undefined,
      ogImage: ogImage || undefined,
      noIndex,
      images: filteredImages,
      sizes,
      heights: hasHeightOptions ? heights : [],
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full pb-20">
      {/* Action Bar Header */}
      <div className="sticky top-4 z-30 -mx-8 px-8 py-3 bg-stone-100">
        <div className="flex items-center justify-between rounded-[28px] border border-stone-200 bg-white px-6 py-4 shadow-lg">
          <div className="flex items-center gap-3">
            <Link href={backUrl}>
              <button type="button" className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-stone-900">{title}</h1>
              {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={backUrl}>
              <AdminButton type="button" variant="outline" size="sm">
                Cancel
              </AdminButton>
            </Link>
            <AdminButton
              type="submit"
              size="sm"
              className="bg-[#B67B5C] hover:bg-[#8B5A3C] text-white flex items-center gap-2"
              isLoading={isSubmitting}
            >
              <Save size={16} />
              <span>Save Product</span>
            </AdminButton>
          </div>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 2/3 Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Basic Information */}
          <AdminCard title="Basic Information" description="Product title, URL slug, and descriptions">
            <div className="space-y-4">
              <AdminInput
                label="Product Name *"
                placeholder="e.g. Tanya Cotton Kurti"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AdminInput
                  label="URL Slug *"
                  placeholder="tanya-cotton-kurti"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                />
                <AdminInput
                  label="SKU Code"
                  placeholder="PRM-KRT-001"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary for product cards and checkout lists..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Full Product Details</label>
                <textarea
                  rows={6}
                  placeholder="Detailed specifications, weave details, styling recommendations..."
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                />
              </div>
            </div>
          </AdminCard>

          {/* Product Gallery Images */}
          <AdminCard title="Product Media & Gallery" description="Manage gallery images for product listing and detail pages">
            <ImageUploader
              images={images}
              onChange={(urls) => setImages(urls)}
            />
          </AdminCard>

          {/* Sizes & Variants */}
          <AdminCard title="Size Variants & Stock" description="Manage inventory and availability per size option">
            <div className="space-y-3">
              {sizes.map((s, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="w-12 text-xs font-bold text-stone-800">{s.size}</span>
                  <input
                    type="number"
                    value={s.stock}
                    onChange={(e) => {
                      const copy = [...sizes];
                      copy[index].stock = Number(e.target.value);
                      setSizes(copy);
                    }}
                    placeholder="Stock"
                    className="w-24 px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-xs"
                  />
                  <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={s.isAvailable}
                      onChange={(e) => {
                        const copy = [...sizes];
                        copy[index].isAvailable = e.target.checked;
                        setSizes(copy);
                      }}
                      className="rounded text-[#B67B5C]"
                    />
                    <span>Available</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setSizes(sizes.filter((_, i) => i !== index))}
                    className="ml-auto text-stone-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <AdminButton
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSizes([...sizes, { size: "XXL", stock: 10, isAvailable: true }])}
                className="mt-2"
              >
                <Plus size={14} className="mr-1" />
                <span>Add Size Variant</span>
              </AdminButton>
            </div>
          </AdminCard>

          {/* Product SEO Settings */}
          <AdminCard
            title="Search Engine Optimization (SEO)"
            description="Manage product meta title, meta description, canonical URL, and custom social sharing cards"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">SEO Meta Title</label>
                  <span className={`text-[10px] ${metaTitle.length > 60 ? "text-amber-600 font-bold" : "text-stone-400"}`}>
                    {metaTitle.length} / 60 chars (Recommended: 50–60)
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted Silk Kurta Set | Premika"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#B67B5C] text-stone-900"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">SEO Meta Description</label>
                  <span className={`text-[10px] ${metaDescription.length > 160 ? "text-amber-600 font-bold" : "text-stone-400"}`}>
                    {metaDescription.length} / 160 chars (Recommended: 150–160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder="Shop timeless handcrafted silk kurta sets crafted with premium fabric and elegant detailing."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                />
              </div>

              <AdminInput
                label="Keywords (Comma separated)"
                placeholder="kurta set, silk kurta, ethnic wear, womens apparel"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />

              <AdminInput
                label="Canonical URL Override"
                placeholder="https://premika.shop/products/silk-kurta-set"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
              />

              <SingleImageUploader
                bucket="products"
                folder="seo"
                value={ogImage}
                onChange={(url) => setOgImage(url)}
                label="Custom Open Graph Image (OG Image)"
                description="Custom preview image for social sharing links (WhatsApp, Facebook, LinkedIn)."
                aspectRatio="landscape"
              />
            </div>
          </AdminCard>
        </div>

        {/* Right 1/3 Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          {/* Organization & Category */}
          <AdminCard title="Organization" description="Category and type settings">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Product Type</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                >
                  <option value="top">Top / Upper Wear</option>
                  <option value="bottom">Bottom / Lower Wear</option>
                  <option value="set">Co-ord / Set</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                >
                  <option value="women">Women</option>
                  <option value="men">Men</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Fabric Specification</label>
                <input
                  type="text"
                  placeholder="e.g. Pure Chanderi Silk"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                />
              </div>
            </div>
          </AdminCard>

          {/* Pricing */}
          <AdminCard title="Pricing & MSRP" description="Price figures and cost breakdown">
            <div className="space-y-4">
              <AdminInput
                label="Selling Price (INR) *"
                type="number"
                placeholder="1999"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
              <AdminInput
                label="Compare at Price (MSRP)"
                type="number"
                placeholder="2999"
                value={compareAtPrice}
                onChange={(e) => setCompareAtPrice(e.target.value)}
              />
              <AdminInput
                label="Cost Price (Internal)"
                type="number"
                placeholder="800"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
              />
            </div>
          </AdminCard>

          {/* Status & Promotional Flags */}
          <AdminCard title="Status & Badges" description="Visibility flags and badges">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
                <span className="text-xs font-semibold text-stone-900">Active Status</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#B67B5C] focus:ring-[#B67B5C]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
                <span className="text-xs font-semibold text-stone-900">Featured Badge</span>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded text-[#B67B5C] focus:ring-[#B67B5C]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
                <span className="text-xs font-semibold text-stone-900">New Arrival Badge</span>
                <input
                  type="checkbox"
                  checked={newArrival}
                  onChange={(e) => setNewArrival(e.target.checked)}
                  className="rounded text-[#B67B5C] focus:ring-[#B67B5C]"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer select-none">
                <span className="text-xs font-semibold text-stone-900">Height Customization</span>
                <input
                  type="checkbox"
                  checked={hasHeightOptions}
                  onChange={(e) => setHasHeightOptions(e.target.checked)}
                  className="rounded text-[#B67B5C] focus:ring-[#B67B5C]"
                />
              </label>
            </div>
          </AdminCard>

          {/* Search Engine Indexing */}
          <AdminCard title="Search Engine Indexing" description="Control search engine crawling for this product">
            <label className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={noIndex}
                onChange={(e) => setNoIndex(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <EyeOff size={14} className="text-amber-600" />
                  <span>Hide from Search Engines (noindex)</span>
                </span>
                <p className="text-[10px] text-stone-600 mt-0.5">
                  Instructs search robots not to index this product page.
                </p>
              </div>
            </label>
          </AdminCard>
        </div>
      </div>
    </form>
  );
};

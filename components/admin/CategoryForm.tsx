"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Globe, EyeOff } from "lucide-react";
import { AdminCard, AdminButton, AdminInput } from "@/components/admin";
import { SingleImageUploader } from "./SingleImageUploader";
import { toast } from "react-hot-toast";

export interface CategoryFormProps {
  title: string;
  subtitle?: string;
  initialData?: any;
  onSubmit: (payload: any) => Promise<void>;
  isSubmitting: boolean;
  backUrl?: string;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  title,
  subtitle,
  initialData,
  onSubmit,
  isSubmitting,
  backUrl = "/admin/categories",
}) => {
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [isActive, setIsActive] = useState(
    typeof initialData?.isActive === "boolean" ? initialData.isActive : true
  );
  const [sortOrder, setSortOrder] = useState(
    typeof initialData?.sortOrder === "number" ? initialData.sortOrder : 0
  );

  // SEO State
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [keywords, setKeywords] = useState(initialData?.keywords || "");
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl || "");
  const [ogImage, setOgImage] = useState(initialData?.ogImage || "");
  const [noIndex, setNoIndex] = useState(Boolean(initialData?.noIndex));

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
      toast.error("Please fill in required fields (Category Name and Slug)");
      return;
    }

    const payload = {
      name,
      slug,
      description: description || undefined,
      image: image || undefined,
      isActive,
      sortOrder: Number(sortOrder) || 0,
      metaTitle: metaTitle || undefined,
      metaDescription: metaDescription || undefined,
      keywords: keywords || undefined,
      canonicalUrl: canonicalUrl || undefined,
      ogImage: ogImage || undefined,
      noIndex,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full pb-20">
      {/* Action Header */}
      <div className="flex items-center justify-between rounded-[28px] border border-stone-200 bg-white px-6 py-4 shadow-sm mb-6">
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
            <span>Save Category</span>
          </AdminButton>
        </div>
      </div>

      {/* 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 2/3 Column */}
        <div className="lg:col-span-8 space-y-6">
          <AdminCard title="Basic Information" description="Category title, URL slug, and description">
            <div className="space-y-4">
              <AdminInput
                label="Category Name *"
                placeholder="e.g. Sarees & Ethnic Wear"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />

              <AdminInput
                label="URL Slug *"
                placeholder="sarees-ethnic-wear"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the apparel styles in this collection..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                />
              </div>
            </div>
          </AdminCard>

          {/* Category Banner Image */}
          <AdminCard title="Category Banner Image" description="Upload a hero banner or thumbnail for this category">
            <SingleImageUploader
              bucket="categories"
              folder="categories"
              value={image}
              onChange={(url) => setImage(url)}
              label="Category Banner Image"
              description="PNG, JPG, or WEBP up to 5MB. Will be saved to Supabase categories storage."
            />
          </AdminCard>

          {/* Category SEO Settings */}
          <AdminCard
            title="Search Engine Optimization (SEO)"
            description="Manage category meta titles, meta descriptions, canonical URL, and social sharing cards"
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
                  placeholder="e.g. Designer Sarees & Indian Ethnic Wear | Premika"
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
                  placeholder="Explore our curated collection of handcrafted silk sarees, kurtis, and ethnic ensembles."
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full p-3 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C]"
                />
              </div>

              <AdminInput
                label="Keywords (Comma separated)"
                placeholder="sarees, ethnic wear, silk sarees, kurtis"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />

              <AdminInput
                label="Canonical URL Override"
                placeholder="https://premika.shop/category/sarees"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
              />

              <SingleImageUploader
                bucket="categories"
                folder="seo"
                value={ogImage}
                onChange={(url) => setOgImage(url)}
                label="Custom Open Graph Image (OG Image)"
                description="Specific image for social media sharing cards on WhatsApp, Facebook, and Twitter."
                aspectRatio="landscape"
              />
            </div>
          </AdminCard>
        </div>

        {/* Right 1/3 Sidebar Column */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 self-start">
          <AdminCard title="Status & Sorting" description="Visibility and display ordering">
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200 cursor-pointer select-none">
                <span className="text-xs font-semibold text-stone-900">Active Status</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded text-[#B67B5C] focus:ring-[#B67B5C]"
                />
              </label>

              <AdminInput
                label="Sort Order Index"
                type="number"
                placeholder="0"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
              />
            </div>
          </AdminCard>

          {/* Robots Indexing Settings */}
          <AdminCard title="Search Engine Indexing" description="Control search robot crawling for this category">
            <label className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-200/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={noIndex}
                onChange={(e) => setNoIndex(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <div>
                <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                  <EyeOff size={14} className="text-amber-600" />
                  <span>Exclude from Search Engines (noindex)</span>
                </span>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Instructs search engines like Google not to index this category page.
                </p>
              </div>
            </label>
          </AdminCard>
        </div>
      </div>
    </form>
  );
};

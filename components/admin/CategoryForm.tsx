"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { AdminCard, AdminButton, AdminInput } from "@/components/admin";
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
    };

    onSubmit(payload);
  };

  const isValidUrl = image.startsWith("http://") || image.startsWith("https://") || image.startsWith("/");

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
          <AdminCard title="Category Banner Image" description="Category hero or thumbnail image URL">
            <div className="space-y-4">
              <AdminInput
                label="Image URL"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />

              <div className="relative w-full h-72 bg-stone-100 rounded-[28px] overflow-hidden border border-stone-200 flex items-center justify-center">
                {isValidUrl && image ? (
                  <Image src={image} alt={name || "Preview"} fill className="object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-stone-400 text-xs">
                    <ImageIcon size={32} />
                    <span className="mt-2 text-xs">Image Preview Card</span>
                  </div>
                )}
              </div>
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
        </div>
      </div>
    </form>
  );
};

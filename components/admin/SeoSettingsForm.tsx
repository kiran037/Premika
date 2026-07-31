import React, { useState, useEffect } from "react";
import { AdminInput } from "./AdminInput";
import { AdminButton } from "./AdminButton";
import { SingleImageUploader } from "./SingleImageUploader";
import { globalSeoSchema, GlobalSeoInput } from "@/lib/validations/seo";
import { Globe, Search, Share2, Shield, Eye } from "lucide-react";

export interface SeoSettingsFormProps {
  initialData: GlobalSeoInput | null;
  onSave: (data: GlobalSeoInput) => Promise<void>;
  isLoading?: boolean;
}

export const SeoSettingsForm: React.FC<SeoSettingsFormProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<GlobalSeoInput>({
    siteName: "Premika",
    titleTemplate: "%s | Premika",
    defaultMetaTitle: "Premika | Premium Ethnic Wear",
    defaultMetaDescription: "Prem se bana, Premika ke liye. Thoughtfully crafted Indian ethnic wear.",
    defaultKeywords: "ethnic wear, sarees, kurtis, indian fashion, premika",
    defaultOgImage: "",
    twitterHandle: "@premika_store",
    googleVerification: "",
    bingVerification: "",
    defaultRobots: "index, follow",
    canonicalDomain: "https://premika.shop",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        siteName: initialData.siteName || "",
        titleTemplate: initialData.titleTemplate || "",
        defaultMetaTitle: initialData.defaultMetaTitle || "",
        defaultMetaDescription: initialData.defaultMetaDescription || "",
        defaultKeywords: initialData.defaultKeywords || "",
        defaultOgImage: initialData.defaultOgImage || "",
        twitterHandle: initialData.twitterHandle || "",
        googleVerification: initialData.googleVerification || "",
        bingVerification: initialData.bingVerification || "",
        defaultRobots: initialData.defaultRobots || "index, follow",
        canonicalDomain: initialData.canonicalDomain || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = globalSeoSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    await onSave(validation.data);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-stone-100 pb-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Globe size={18} className="text-[#B67B5C]" />
          <span>Global Search Engine Optimization (SEO) & Social Sharing</span>
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Configure default search engine meta titles, site templates, Open Graph social sharing cards, and webmaster verification tags.
        </p>
      </div>

      {/* Global Meta Configuration */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
          <Search size={14} className="text-[#B67B5C]" />
          <span>Meta Identity & Default Title Rules</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput
            label="Site Name"
            name="siteName"
            placeholder="Premika"
            value={formData.siteName || ""}
            onChange={handleChange}
            error={errors.siteName}
          />

          <AdminInput
            label="Title Template"
            name="titleTemplate"
            placeholder="%s | Premika"
            value={formData.titleTemplate || ""}
            onChange={handleChange}
            error={errors.titleTemplate}
          />

          <AdminInput
            label="Default Meta Title"
            name="defaultMetaTitle"
            placeholder="Premika | Premium Ethnic Wear"
            value={formData.defaultMetaTitle || ""}
            onChange={handleChange}
            error={errors.defaultMetaTitle}
          />

          <AdminInput
            label="Canonical Domain"
            name="canonicalDomain"
            placeholder="https://premika.shop"
            value={formData.canonicalDomain || ""}
            onChange={handleChange}
            error={errors.canonicalDomain}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Default Meta Description
          </label>
          <textarea
            name="defaultMetaDescription"
            rows={3}
            placeholder="Thoughtfully crafted Indian ethnic wear designed with care and intention."
            value={formData.defaultMetaDescription || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#B67B5C]/20 focus:border-[#B67B5C] text-stone-900 placeholder:text-stone-400 outline-none transition"
          />
          {errors.defaultMetaDescription && (
            <p className="text-[11px] text-red-600 font-medium mt-1">
              {errors.defaultMetaDescription}
            </p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Default Global Keywords (Comma separated)
          </label>
          <textarea
            name="defaultKeywords"
            rows={2}
            placeholder="ethnic wear, sarees, kurtis, indian fashion, premika"
            value={formData.defaultKeywords || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#B67B5C]/20 focus:border-[#B67B5C] text-stone-900 placeholder:text-stone-400 outline-none transition"
          />
          {errors.defaultKeywords && (
            <p className="text-[11px] text-red-600 font-medium mt-1">
              {errors.defaultKeywords}
            </p>
          )}
        </div>
      </div>

      {/* Social Media Sharing & OpenGraph */}
      <div className="pt-4 border-t border-stone-100 space-y-4">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
          <Share2 size={14} className="text-[#B67B5C]" />
          <span>Social Media Sharing (Open Graph & Twitter Cards)</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SingleImageUploader
            bucket="store"
            folder="seo"
            label="Default Open Graph Image (OG Image)"
            description="Recommended resolution: 1200x630px (WEBP or PNG) for Facebook, WhatsApp & LinkedIn previews."
            value={formData.defaultOgImage || ""}
            onChange={(url) => {
              setFormData((prev) => ({ ...prev, defaultOgImage: url }));
              if (errors.defaultOgImage) {
                setErrors((prev) => {
                  const copy = { ...prev };
                  delete copy.defaultOgImage;
                  return copy;
                });
              }
            }}
            aspectRatio="landscape"
          />

          <div className="space-y-4">
            <AdminInput
              label="Twitter / X Handle"
              name="twitterHandle"
              placeholder="@premika_store"
              value={formData.twitterHandle || ""}
              onChange={handleChange}
              error={errors.twitterHandle}
            />

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Default Robots Indexing Directive
              </label>
              <select
                name="defaultRobots"
                value={formData.defaultRobots || "index, follow"}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs border border-stone-200 rounded-xl focus:ring-2 focus:ring-[#B67B5C]/20 focus:border-[#B67B5C] text-stone-900 outline-none transition bg-white"
              >
                <option value="index, follow">Index, Follow (Recommended for Production)</option>
                <option value="noindex, follow">No Index, Follow (Hide from Search Engines)</option>
                <option value="index, nofollow">Index, No Follow</option>
                <option value="noindex, nofollow">No Index, No Follow (Block All Bots)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Webmaster Search Engine Verification */}
      <div className="pt-4 border-t border-stone-100 space-y-4">
        <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
          <Shield size={14} className="text-[#B67B5C]" />
          <span>Webmaster & Search Engine Verification Meta Tags</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AdminInput
            label="Google Search Console Verification Tag"
            name="googleVerification"
            placeholder="e.g. google-site-verification=abc123xyz..."
            value={formData.googleVerification || ""}
            onChange={handleChange}
            error={errors.googleVerification}
          />

          <AdminInput
            label="Bing Webmaster Verification Tag"
            name="bingVerification"
            placeholder="e.g. 1234567890ABCDEF..."
            value={formData.bingVerification || ""}
            onChange={handleChange}
            error={errors.bingVerification}
          />
        </div>
      </div>

      <div className="flex justify-end pt-2 border-t border-stone-100">
        <AdminButton type="submit" variant="primary" size="md" isLoading={isLoading}>
          Save SEO Settings
        </AdminButton>
      </div>
    </form>
  );
};

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AdminInput } from "./AdminInput";
import { AdminButton } from "./AdminButton";
import { storeSettingsSchema, StoreSettingsInput } from "@/lib/validations/admin-store.schema";
import { Building, Mail, Phone, Image as ImageIcon, AlertTriangle, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

export interface StoreSettingsFormProps {
  initialData: StoreSettingsInput | null;
  onSave: (data: StoreSettingsInput) => Promise<void>;
  isLoading?: boolean;
}

export const StoreSettingsForm: React.FC<StoreSettingsFormProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<StoreSettingsInput>({
    storeName: "Premika",
    storeEmail: "contact@premika.shop",
    storePhone: "",
    logo: "",
    favicon: "",
    maintenanceMode: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        storeName: initialData.storeName || "",
        storeEmail: initialData.storeEmail || "",
        storePhone: initialData.storePhone || "",
        logo: initialData.logo || "",
        favicon: initialData.favicon || "",
        maintenanceMode: initialData.maintenanceMode ?? false,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    const validation = storeSettingsSchema.safeParse(formData);

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
      <div className="border-b border-stone-100 pb-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Building size={18} className="text-[#B67B5C]" />
          <span>General Store Information & Branding</span>
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Manage identity, contact email, and branding assets for your store.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput
          label="Store Name *"
          name="storeName"
          placeholder="Premika"
          value={formData.storeName}
          onChange={handleChange}
          error={errors.storeName}
        />

        <AdminInput
          label="Primary Store Email *"
          name="storeEmail"
          type="email"
          placeholder="contact@premika.shop"
          value={formData.storeEmail}
          onChange={handleChange}
          error={errors.storeEmail}
        />

        <AdminInput
          label="Store Contact Phone"
          name="storePhone"
          placeholder="+91 98765 43210"
          value={formData.storePhone || ""}
          onChange={handleChange}
          error={errors.storePhone}
        />

        {/* Read-Only Configuration Info */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Currency (Display)</label>
            <input
              type="text"
              disabled
              value="INR (₹)"
              className="w-full px-3.5 py-2 text-xs border border-stone-200 bg-stone-100 rounded-xl font-semibold text-stone-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Timezone (Fixed)</label>
            <input
              type="text"
              disabled
              value="Asia/Kolkata (IST)"
              className="w-full px-3.5 py-2 text-xs border border-stone-200 bg-stone-100 rounded-xl font-semibold text-stone-600 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Branding Image Assets */}
      <div className="pt-4 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Store Logo */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-800">Store Logo URL</label>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
              {formData.logo ? (
                <Image src={formData.logo} alt="Store Logo" fill className="object-contain p-1" />
              ) : (
                <ImageIcon size={24} className="text-stone-400" />
              )}
            </div>
            <div className="flex-1">
              <input
                type="url"
                name="logo"
                placeholder="https://images.unsplash.com/..."
                value={formData.logo || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
              />
              <p className="text-[11px] text-stone-400 mt-1">Recommended format: PNG or SVG (transparent background)</p>
            </div>
          </div>
        </div>

        {/* Store Favicon */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-stone-800">Favicon URL</label>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
              {formData.favicon ? (
                <Image src={formData.favicon} alt="Favicon" fill className="object-contain p-2" />
              ) : (
                <ImageIcon size={24} className="text-stone-400" />
              )}
            </div>
            <div className="flex-1">
              <input
                type="url"
                name="favicon"
                placeholder="https://.../favicon.ico"
                value={formData.favicon || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
              />
              <p className="text-[11px] text-stone-400 mt-1">Recommended size: 32x32px or 64x64px ICO/PNG</p>
            </div>
          </div>
        </div>
      </div>

      {/* Maintenance Mode Toggle */}
      <div className="pt-4 border-t border-stone-100 flex items-start gap-4 p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
        <input
          type="checkbox"
          id="maintenanceMode"
          name="maintenanceMode"
          checked={formData.maintenanceMode}
          onChange={handleChange}
          className="w-5 h-5 rounded text-amber-600 focus:ring-amber-500 border-stone-300 mt-0.5"
        />
        <div className="flex-1">
          <label htmlFor="maintenanceMode" className="text-xs font-bold text-stone-900 flex items-center gap-1.5 cursor-pointer">
            <AlertTriangle size={14} className="text-amber-600" />
            <span>Enable Maintenance Mode</span>
          </label>
          <p className="text-[11px] text-stone-600 mt-0.5">
            When active, a maintenance page notification will be shown to public store visitors while administrators retain access.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <AdminButton type="submit" variant="primary" size="md" isLoading={isLoading}>
          Save Store Settings
        </AdminButton>
      </div>
    </form>
  );
};

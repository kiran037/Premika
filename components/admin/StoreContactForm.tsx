import React, { useState, useEffect } from "react";
import { AdminInput } from "./AdminInput";
import { AdminButton } from "./AdminButton";
import { storeContactsSchema, StoreContactsInput } from "@/lib/validations/admin-store.schema";
import { MapPin, Mail, Phone, Clock, Map } from "lucide-react";

export interface StoreContactFormProps {
  initialData: StoreContactsInput | null;
  onSave: (data: StoreContactsInput) => Promise<void>;
  isLoading?: boolean;
}

export const StoreContactForm: React.FC<StoreContactFormProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<StoreContactsInput>({
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    supportEmail: "",
    supportPhone: "",
    businessHours: "",
    googleMapsUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        address: initialData.address || "",
        city: initialData.city || "",
        state: initialData.state || "",
        country: initialData.country || "India",
        postalCode: initialData.postalCode || "",
        supportEmail: initialData.supportEmail || "",
        supportPhone: initialData.supportPhone || "",
        businessHours: initialData.businessHours || "",
        googleMapsUrl: initialData.googleMapsUrl || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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
    const validation = storeContactsSchema.safeParse(formData);

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
          <MapPin size={18} className="text-[#B67B5C]" />
          <span>Contact Information & Business Details</span>
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Store physical address, customer support channels, and store operating hours.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput
          label="Customer Support Email"
          name="supportEmail"
          type="email"
          placeholder="support@premika.shop"
          value={formData.supportEmail || ""}
          onChange={handleChange}
          error={errors.supportEmail}
        />

        <AdminInput
          label="Customer Support Phone"
          name="supportPhone"
          placeholder="+91 98765 43210"
          value={formData.supportPhone || ""}
          onChange={handleChange}
          error={errors.supportPhone}
        />
      </div>

      <div className="space-y-4 pt-2 border-t border-stone-100">
        <AdminInput
          label="Street Address"
          name="address"
          placeholder="e.g. 123 Fashion Street, Suite 400"
          value={formData.address || ""}
          onChange={handleChange}
          error={errors.address}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <AdminInput
            label="City"
            name="city"
            placeholder="Mumbai"
            value={formData.city || ""}
            onChange={handleChange}
            error={errors.city}
          />

          <AdminInput
            label="State / Province"
            name="state"
            placeholder="Maharashtra"
            value={formData.state || ""}
            onChange={handleChange}
            error={errors.state}
          />

          <AdminInput
            label="Postal Code"
            name="postalCode"
            placeholder="400001"
            value={formData.postalCode || ""}
            onChange={handleChange}
            error={errors.postalCode}
          />

          <AdminInput
            label="Country"
            name="country"
            placeholder="India"
            value={formData.country || "India"}
            onChange={handleChange}
            error={errors.country}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <Clock size={12} className="text-[#B67B5C]" />
            <span>Business Hours</span>
          </label>
          <textarea
            name="businessHours"
            rows={3}
            placeholder="e.g. Monday - Saturday: 10:00 AM - 8:00 PM IST&#10;Sunday: Closed"
            value={formData.businessHours || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
            <Map size={12} className="text-[#B67B5C]" />
            <span>Google Maps Location URL</span>
          </label>
          <textarea
            name="googleMapsUrl"
            rows={3}
            placeholder="https://maps.google.com/..."
            value={formData.googleMapsUrl || ""}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <AdminButton type="submit" variant="primary" size="md" isLoading={isLoading}>
          Save Contact Details
        </AdminButton>
      </div>
    </form>
  );
};

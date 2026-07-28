import React, { useState, useEffect } from "react";
import { AdminModal } from "./AdminModal";
import { AdminInput } from "./AdminInput";
import { AdminButton } from "./AdminButton";
import { adminCouponSchema, AdminCouponInput } from "@/lib/validations/admin-coupon.schema";
import { Tag, Percent, DollarSign, Calendar, Info } from "lucide-react";

export interface CouponFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AdminCouponInput) => Promise<void>;
  initialData?: Partial<AdminCouponInput> & { id?: string } | null;
  isSubmitting?: boolean;
}

export const CouponForm: React.FC<CouponFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<Partial<AdminCouponInput>>({
    code: "",
    name: "",
    description: "",
    type: "percentage",
    value: 10,
    minimumOrderAmount: 0,
    maximumDiscount: null,
    usageLimit: null,
    startsAt: "",
    expiresAt: "",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code || "",
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type || "percentage",
        value: initialData.value ?? 10,
        minimumOrderAmount: initialData.minimumOrderAmount ?? 0,
        maximumDiscount: initialData.maximumDiscount ?? null,
        usageLimit: initialData.usageLimit ?? null,
        startsAt: initialData.startsAt
          ? new Date(initialData.startsAt).toISOString().slice(0, 16)
          : "",
        expiresAt: initialData.expiresAt
          ? new Date(initialData.expiresAt).toISOString().slice(0, 16)
          : "",
        isActive: initialData.isActive ?? true,
      });
    } else {
      setFormData({
        code: "",
        name: "",
        description: "",
        type: "percentage",
        value: 10,
        minimumOrderAmount: 0,
        maximumDiscount: null,
        usageLimit: null,
        startsAt: "",
        expiresAt: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "code") {
      setFormData((prev) => ({ ...prev, code: value.toUpperCase() }));
    } else if (["value", "minimumOrderAmount", "maximumDiscount", "usageLimit"].includes(name)) {
      const numVal = value === "" ? null : Number(value);
      setFormData((prev) => ({ ...prev, [name]: numVal }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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

    const payload = {
      ...formData,
      maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : null,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      startsAt: formData.startsAt ? new Date(formData.startsAt).toISOString() : null,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null,
    };

    const validation = adminCouponSchema.safeParse(payload);

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

    await onSubmit(validation.data);
  };

  const title = initialData?.id ? "Edit Coupon" : "Create New Coupon";

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AdminInput
            label="Coupon Code *"
            name="code"
            placeholder="e.g. FESTIVE20"
            value={formData.code || ""}
            onChange={handleChange}
            error={errors.code}
            helperText="Uppercase alphanumeric characters only"
          />

          <AdminInput
            label="Coupon Title / Name *"
            name="name"
            placeholder="e.g. Festive Sale 20% Off"
            value={formData.name || ""}
            onChange={handleChange}
            error={errors.name}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows={2}
            placeholder="Internal description or terms for this coupon..."
            value={formData.description || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Discount Type *
            </label>
            <select
              name="type"
              value={formData.type || "percentage"}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
            >
              <option value="percentage">Percentage Discount (%)</option>
              <option value="fixed">Fixed Amount Discount (₹)</option>
            </select>
          </div>

          <AdminInput
            label={formData.type === "percentage" ? "Percentage Value (%) *" : "Fixed Discount Amount (₹) *"}
            name="value"
            type="number"
            min={1}
            max={formData.type === "percentage" ? 100 : undefined}
            placeholder={formData.type === "percentage" ? "10" : "500"}
            value={formData.value ?? ""}
            onChange={handleChange}
            error={errors.value}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <AdminInput
            label="Min Order Amount (₹)"
            name="minimumOrderAmount"
            type="number"
            min={0}
            placeholder="0"
            value={formData.minimumOrderAmount ?? 0}
            onChange={handleChange}
            error={errors.minimumOrderAmount}
          />

          {formData.type === "percentage" && (
            <AdminInput
              label="Max Discount (₹)"
              name="maximumDiscount"
              type="number"
              min={0}
              placeholder="No limit"
              value={formData.maximumDiscount ?? ""}
              onChange={handleChange}
              error={errors.maximumDiscount}
              helperText="Cap for % discount"
            />
          )}

          <AdminInput
            label="Total Usage Limit"
            name="usageLimit"
            type="number"
            min={1}
            placeholder="Unlimited"
            value={formData.usageLimit ?? ""}
            onChange={handleChange}
            error={errors.usageLimit}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              name="startsAt"
              value={formData.startsAt || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
            />
            {errors.startsAt && <p className="text-xs text-red-600 mt-1">{errors.startsAt}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Expiry Date & Time
            </label>
            <input
              type="datetime-local"
              name="expiresAt"
              value={formData.expiresAt || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B67B5C]"
            />
            {errors.expiresAt && <p className="text-xs text-red-600 mt-1">{errors.expiresAt}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <input
            type="checkbox"
            id="coupon-active"
            name="isActive"
            checked={formData.isActive ?? true}
            onChange={handleChange}
            className="w-4 h-4 rounded text-[#B67B5C] focus:ring-[#B67B5C] border-stone-300"
          />
          <label htmlFor="coupon-active" className="text-xs font-medium text-stone-800 cursor-pointer">
            Coupon Status: <span className={formData.isActive ? "text-emerald-600 font-bold" : "text-stone-500 font-bold"}>{formData.isActive ? "Active (Available for checkout)" : "Inactive"}</span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
          <AdminButton type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AdminButton>
          <AdminButton type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            {initialData?.id ? "Update Coupon" : "Create Coupon"}
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
};

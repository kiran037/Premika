import React, { useState, useEffect } from "react";
import { AdminInput } from "./AdminInput";
import { AdminButton } from "./AdminButton";
import { delhiverySettingsSchema, DelhiverySettingsInput } from "@/lib/validations/admin-delhivery.schema";
import { Truck, CheckCircle2 } from "lucide-react";

export interface DelhiverySettingsFormProps {
  initialData: DelhiverySettingsInput | null;
  onSave: (data: DelhiverySettingsInput) => Promise<void>;
  isLoading?: boolean;
}

export const DelhiverySettingsForm: React.FC<DelhiverySettingsFormProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<DelhiverySettingsInput>({
    pickupName: "Premika Main Warehouse",
    pickupPhone: "+91 98765 43210",
    pickupEmail: "shipping@premika.shop",
    pickupAddressLine1: "123 Fashion Hub, Sector 5",
    pickupAddressLine2: "Industrial Area",
    pickupCity: "Mumbai",
    pickupState: "Maharashtra",
    pickupPincode: "400001",
    pickupCountry: "India",
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        pickupName: initialData.pickupName || "",
        pickupPhone: initialData.pickupPhone || "",
        pickupEmail: initialData.pickupEmail || "",
        pickupAddressLine1: initialData.pickupAddressLine1 || "",
        pickupAddressLine2: initialData.pickupAddressLine2 || "",
        pickupCity: initialData.pickupCity || "",
        pickupState: initialData.pickupState || "",
        pickupPincode: initialData.pickupPincode || "",
        pickupCountry: initialData.pickupCountry || "India",
        isActive: initialData.isActive ?? true,
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
    const validation = delhiverySettingsSchema.safeParse(formData);

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
          <Truck size={18} className="text-[#B67B5C]" />
          <span>Delhivery Logistics & Pickup Location Settings</span>
        </h3>
        <p className="text-xs text-stone-500 mt-1">
          Configure pickup warehouse address and contact details used for Delhivery order dispatching and shipping labels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdminInput
          label="Warehouse / Pickup Location Name *"
          name="pickupName"
          placeholder="Premika Main Warehouse"
          value={formData.pickupName}
          onChange={handleChange}
          error={errors.pickupName}
        />

        <AdminInput
          label="Pickup Contact Phone *"
          name="pickupPhone"
          placeholder="+91 98765 43210"
          value={formData.pickupPhone}
          onChange={handleChange}
          error={errors.pickupPhone}
        />

        <AdminInput
          label="Pickup Contact Email *"
          name="pickupEmail"
          type="email"
          placeholder="shipping@premika.shop"
          value={formData.pickupEmail}
          onChange={handleChange}
          error={errors.pickupEmail}
        />

        <AdminInput
          label="Pickup Country *"
          name="pickupCountry"
          placeholder="India"
          value={formData.pickupCountry}
          onChange={handleChange}
          error={errors.pickupCountry}
        />

        <AdminInput
          label="Pickup Address Line 1 *"
          name="pickupAddressLine1"
          placeholder="123 Fashion Hub, Sector 5"
          value={formData.pickupAddressLine1}
          onChange={handleChange}
          error={errors.pickupAddressLine1}
        />

        <AdminInput
          label="Pickup Address Line 2 (Optional)"
          name="pickupAddressLine2"
          placeholder="Industrial Area / Landmark"
          value={formData.pickupAddressLine2 || ""}
          onChange={handleChange}
          error={errors.pickupAddressLine2}
        />

        <AdminInput
          label="City *"
          name="pickupCity"
          placeholder="Mumbai"
          value={formData.pickupCity}
          onChange={handleChange}
          error={errors.pickupCity}
        />

        <AdminInput
          label="State *"
          name="pickupState"
          placeholder="Maharashtra"
          value={formData.pickupState}
          onChange={handleChange}
          error={errors.pickupState}
        />

        <AdminInput
          label="Pincode *"
          name="pickupPincode"
          placeholder="400001"
          value={formData.pickupPincode}
          onChange={handleChange}
          error={errors.pickupPincode}
        />
      </div>

      {/* Active Shipping Integration Toggle */}
      <div className="pt-4 border-t border-stone-100 flex items-start gap-4 p-4 rounded-xl bg-stone-50 border border-stone-200">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          className="w-5 h-5 rounded text-[#B67B5C] focus:ring-[#B67B5C] border-stone-300 mt-0.5"
        />
        <div className="flex-1">
          <label htmlFor="isActive" className="text-xs font-bold text-stone-900 flex items-center gap-1.5 cursor-pointer">
            <CheckCircle2 size={14} className="text-[#B67B5C]" />
            <span>Enable Delhivery Shipping Integration</span>
          </label>
          <p className="text-[11px] text-stone-600 mt-0.5">
            When enabled, Delhivery pickup location settings are active and available for automatic dispatch label creation.
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <AdminButton type="submit" variant="primary" size="md" isLoading={isLoading}>
          Save Delhivery Settings
        </AdminButton>
      </div>
    </form>
  );
};

"use client";

import React, { useState, useEffect } from "react";
import { AdminModal, AdminButton, AdminInput } from "@/components/admin";
import { adminShipmentCreateSchema } from "@/lib/validations/admin-shipment.schema";
import { toast } from "react-hot-toast";
import { Package, Truck, Info, AlertCircle } from "lucide-react";

export interface ShipmentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: any;
  onSuccess: () => void;
}

export const ShipmentCreateModal: React.FC<ShipmentCreateModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onSuccess,
}) => {
  const { order, customer, address, items } = orderData || {};

  // Form states
  const [weight, setWeight] = useState<string>("0.5");
  const [length, setLength] = useState<string>("10");
  const [width, setWidth] = useState<string>("10");
  const [height, setHeight] = useState<string>("10");
  const [packageCount, setPackageCount] = useState<string>("1");
  const [pickupLocationId, setPickupLocationId] = useState<string>("");
  const [pickupLocations, setPickupLocations] = useState<Array<{ id: string; name: string; city: string }>>([]);
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Initialize prefilled fields when modal opens
  useEffect(() => {
    if (isOpen && order) {
      setInvoiceNumber(order.orderNumber || "");
      const today = new Date().toISOString().split("T")[0];
      setInvoiceDate(today);

      // Fetch warehouse pickup settings
      const fetchPickupSettings = async () => {
        try {
          const res = await fetch("/api/admin/settings/delhivery");
          const json = await res.json();
          if (json.success && json.data) {
            const loc = json.data;
            setPickupLocations([
              {
                id: loc.id || "primary_warehouse",
                name: loc.pickupName || "Primary Warehouse",
                city: loc.pickupCity || "Warehouse",
              },
            ]);
            setPickupLocationId(loc.id || "primary_warehouse");
          } else {
            setPickupLocations([
              { id: "primary_warehouse", name: "Primary Warehouse", city: "Default" },
            ]);
            setPickupLocationId("primary_warehouse");
          }
        } catch {
          setPickupLocations([
            { id: "primary_warehouse", name: "Primary Warehouse", city: "Default" },
          ]);
          setPickupLocationId("primary_warehouse");
        }
      };

      fetchPickupSettings();
    }
  }, [isOpen, order]);

  if (!isOpen || !orderData) return null;

  const totalQuantity = (items || []).reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
  const formattedAddress = [address?.addressLine1, address?.addressLine2, address?.city, address?.state, address?.postalCode]
    .filter(Boolean)
    .join(", ");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setApiError(null);

    const payload = {
      weight: parseFloat(weight),
      length: parseFloat(length),
      width: parseFloat(width),
      height: parseFloat(height),
      packageCount: parseInt(packageCount, 10),
      pickupLocationId,
      invoiceNumber,
      invoiceDate,
    };

    const validation = adminShipmentCreateSchema.safeParse(payload);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}/shipment/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });

      const json = await res.json();

      if (json.success) {
        toast.success(json.message || "Delhivery shipment created successfully!");
        onSuccess();
        onClose();
      } else {
        setApiError(json.message || "Failed to create shipment with Delhivery.");
        toast.error(json.message || "Failed to create shipment");
      }
    } catch (err: any) {
      console.error("Error creating shipment:", err);
      setApiError(err.message || "Network error while calling shipment creation API.");
      toast.error("Error creating Delhivery shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Delhivery Shipment"
      description={`Enter package dimensions and pickup details for Order ${order.orderNumber}`}
    >
      <form onSubmit={handleSubmit} className="space-y-5 max-h-[80vh] overflow-y-auto pr-1">
        {/* API Error Alert */}
        {apiError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-bold block">Delhivery Dispatch Error</span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {/* Read-Only Order Summary */}
        <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <div className="flex items-center gap-1.5 font-bold text-stone-900">
              <Info size={14} className="text-[#B67B5C]" />
              <span>Order Summary</span>
            </div>
            <span className="font-mono bg-stone-200 text-stone-800 px-2 py-0.5 rounded font-bold">
              ₹{(order.total).toLocaleString("en-IN")} • Pre-Paid
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-700">
            <div>
              <span className="text-stone-400 block font-semibold text-[10px] uppercase">Customer</span>
              <span className="font-bold text-stone-900">
                {customer?.firstName} {customer?.lastName || ""}
              </span>
              <span className="block text-stone-500">{address?.phone || customer?.phone}</span>
            </div>

            <div>
              <span className="text-stone-400 block font-semibold text-[10px] uppercase">Shipping Address</span>
              <span className="font-medium text-stone-900 line-clamp-2">{formattedAddress || "N/A"}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-200">
            <span className="text-stone-400 block font-semibold text-[10px] uppercase mb-1">
              Items ({items?.length || 0} product types, {totalQuantity} total qty)
            </span>
            <div className="space-y-1">
              {(items || []).map((item: any) => (
                <div key={item.id} className="flex justify-between text-stone-800 font-medium">
                  <span className="truncate max-w-[220px]">
                    {item.productName} {item.size ? `(Size: ${item.size})` : ""}
                  </span>
                  <span className="font-semibold text-stone-900">× {item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editable Package Details */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
            <Package size={14} className="text-[#B67B5C]" />
            <span>Package Specifications & Dimensions</span>
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Weight (kg) *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="0.5"
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C] ${
                  fieldErrors.weight ? "border-red-500" : "border-stone-300"
                }`}
              />
              {fieldErrors.weight && <p className="text-[10px] text-red-600 mt-1">{fieldErrors.weight}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Length (cm) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="10"
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C] ${
                  fieldErrors.length ? "border-red-500" : "border-stone-300"
                }`}
              />
              {fieldErrors.length && <p className="text-[10px] text-red-600 mt-1">{fieldErrors.length}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Width (cm) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="10"
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C] ${
                  fieldErrors.width ? "border-red-500" : "border-stone-300"
                }`}
              />
              {fieldErrors.width && <p className="text-[10px] text-red-600 mt-1">{fieldErrors.width}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Height (cm) *</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="10"
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C] ${
                  fieldErrors.height ? "border-red-500" : "border-stone-300"
                }`}
              />
              {fieldErrors.height && <p className="text-[10px] text-red-600 mt-1">{fieldErrors.height}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Package Count *</label>
              <input
                type="number"
                min="1"
                value={packageCount}
                onChange={(e) => setPackageCount(e.target.value)}
                placeholder="1"
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C] ${
                  fieldErrors.packageCount ? "border-red-500" : "border-stone-300"
                }`}
              />
              {fieldErrors.packageCount && (
                <p className="text-[10px] text-red-600 mt-1">{fieldErrors.packageCount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Pickup Location *</label>
              <select
                value={pickupLocationId}
                onChange={(e) => setPickupLocationId(e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C] ${
                  fieldErrors.pickupLocationId ? "border-red-500" : "border-stone-300"
                }`}
              >
                {pickupLocations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} ({loc.city})
                  </option>
                ))}
              </select>
              {fieldErrors.pickupLocationId && (
                <p className="text-[10px] text-red-600 mt-1">{fieldErrors.pickupLocationId}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Invoice Number *</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="e.g. ORD-2026-1001"
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C] ${
                  fieldErrors.invoiceNumber ? "border-red-500" : "border-stone-300"
                }`}
              />
              {fieldErrors.invoiceNumber && (
                <p className="text-[10px] text-red-600 mt-1">{fieldErrors.invoiceNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Invoice Date *</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className={`w-full px-3 py-2 bg-white border rounded-xl text-xs text-stone-900 focus:outline-none focus:border-[#B67B5C] ${
                  fieldErrors.invoiceDate ? "border-red-500" : "border-stone-300"
                }`}
              />
              {fieldErrors.invoiceDate && (
                <p className="text-[10px] text-red-600 mt-1">{fieldErrors.invoiceDate}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition disabled:opacity-50"
          >
            Cancel
          </button>

          <AdminButton
            type="submit"
            isLoading={isSubmitting}
            disabled={isSubmitting}
            className="bg-[#B67B5C] hover:bg-[#8B5A3C] text-white flex items-center gap-2"
          >
            <Truck size={14} />
            <span>Generate Delhivery Waybill</span>
          </AdminButton>
        </div>
      </form>
    </AdminModal>
  );
};

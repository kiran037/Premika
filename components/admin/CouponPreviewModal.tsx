import React, { useState } from "react";
import { AdminModal } from "./AdminModal";
import { AdminButton } from "./AdminButton";
import { Copy, Check, Tag, Calendar, ShieldCheck, AlertCircle, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";

export interface CouponPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: {
    id: string;
    code: string;
    name: string;
    description?: string | null;
    type: "percentage" | "fixed";
    value: number;
    minimumOrderAmount?: number | null;
    maximumDiscount?: number | null;
    usageLimit?: number | null;
    usedCount: number;
    startsAt?: string | null;
    expiresAt?: string | null;
    isActive: boolean;
  } | null;
}

export const CouponPreviewModal: React.FC<CouponPreviewModalProps> = ({
  isOpen,
  onClose,
  coupon,
}) => {
  const [copied, setCopied] = useState(false);
  const [testSubtotal, setTestSubtotal] = useState(2500);

  if (!coupon) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    toast.success(`Copied ${coupon.code} to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate discount for test subtotal
  let testDiscount = 0;
  let validationMessage = "";
  const now = new Date();
  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < now;
  const isNotStarted = coupon.startsAt && new Date(coupon.startsAt) > now;
  const isLimitReached = coupon.usageLimit && coupon.usedCount >= coupon.usageLimit;

  if (!coupon.isActive) {
    validationMessage = "Coupon is currently inactive";
  } else if (isExpired) {
    validationMessage = "Coupon has expired";
  } else if (isNotStarted) {
    validationMessage = "Coupon start date is in the future";
  } else if (isLimitReached) {
    validationMessage = "Maximum usage limit reached";
  } else if (testSubtotal < (coupon.minimumOrderAmount || 0)) {
    validationMessage = `Cart subtotal is less than minimum required (₹${coupon.minimumOrderAmount})`;
  } else {
    if (coupon.type === "percentage") {
      testDiscount = Math.floor((testSubtotal * coupon.value) / 100);
      if (coupon.maximumDiscount && testDiscount > coupon.maximumDiscount) {
        testDiscount = coupon.maximumDiscount;
      }
    } else {
      testDiscount = Math.min(testSubtotal, coupon.value);
    }
  }

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title="Coupon Card & Simulator">
      <div className="space-y-5">
        {/* Promotional Card Preview */}
        <div className="relative overflow-hidden bg-stone-900 text-white rounded-2xl p-5 border border-stone-800 shadow-xl">
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#B67B5C]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 bg-[#B67B5C] text-white text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full">
                <Tag size={10} />
                <span>{coupon.type === "percentage" ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}</span>
              </span>
              <h4 className="text-lg font-bold text-white pt-1">{coupon.name}</h4>
              {coupon.description && (
                <p className="text-xs text-stone-300 max-w-sm">{coupon.description}</p>
              )}
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition border border-stone-700 shadow-xs"
              title="Copy code"
            >
              <span>{coupon.code}</span>
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 flex flex-wrap items-center justify-between text-[11px] text-stone-400 gap-2">
            <div className="flex items-center gap-2">
              <span>Min Order: ₹{coupon.minimumOrderAmount || 0}</span>
              {coupon.maximumDiscount && <span>• Max Discount: ₹{coupon.maximumDiscount}</span>}
            </div>
            <div className="flex items-center gap-1 text-stone-300">
              <Calendar size={12} />
              <span>
                {coupon.expiresAt
                  ? `Expires: ${new Date(coupon.expiresAt).toLocaleDateString()}`
                  : "No Expiry"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Discount Calculator Test */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
              <ShoppingCart size={14} className="text-[#B67B5C]" />
              <span>Simulate Customer Order Subtotal (₹)</span>
            </label>
            <span className="text-xs font-mono text-stone-500 font-semibold">₹{testSubtotal}</span>
          </div>

          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={testSubtotal}
            onChange={(e) => setTestSubtotal(Number(e.target.value))}
            className="w-full accent-[#B67B5C]"
          />

          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-medium">
            <span className="text-stone-600">Calculated Discount:</span>
            {validationMessage ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1 text-[11px]">
                <AlertCircle size={12} />
                <span>{validationMessage}</span>
              </span>
            ) : (
              <span className="text-emerald-600 font-bold text-sm">
                - ₹{testDiscount.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2">
          <AdminButton variant="outline" size="sm" onClick={onClose}>
            Close Preview
          </AdminButton>
        </div>
      </div>
    </AdminModal>
  );
};

"use client";

import { useState, Suspense } from "react";
import { toast } from "react-hot-toast";
import {
  Truck,
  CreditCard,
  Tag,
  Percent,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import Link from "next/link";

const SummaryContent = () => {
  const cart = useCart();
  const items = cart.items;
  const [couponInputCode, setCouponInputCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Calculate pricing
  const subtotal = items.reduce((total, item: any) => {
    const itemPrice = item.isOnSale
      ? item.originalPrice || item.price
      : item.price;
    return total + Number(itemPrice) * (item.quantity || 1);
  }, 0);

  // Calculate sale discount
  const saleDiscount = items.reduce((total, item: any) => {
    if (item.isOnSale && item.originalPrice && item.originalPrice > item.price) {
      const discount = (item.originalPrice - item.price) * (item.quantity || 1);
      return total + discount;
    }
    return total;
  }, 0);

  const cartSubtotal = items.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );

  const couponDiscount = cart.discountAmount || (cart.appliedCoupon ? cart.appliedCoupon.discountAmount : 0);
  const totalDiscount = saleDiscount + couponDiscount;
  const totalPrice = Math.max(0, Math.floor(cartSubtotal - couponDiscount));

  const handleApplyCoupon = async () => {
    if (!couponInputCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    setIsApplyingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponInputCode.trim(),
          subtotal: cartSubtotal,
        }),
      });

      const data = await res.json();

      if (data.valid) {
        cart.applyCoupon({
          couponId: data.couponId,
          couponCode: data.couponCode,
          discountType: data.discountType,
          discountValue: data.discountValue,
          discountAmount: data.discountAmount,
        });
        toast.success(data.message || `Coupon ${data.couponCode} applied successfully!`);
        setCouponInputCode("");
      } else {
        toast.error(data.error || data.message || "Invalid coupon code");
      }
    } catch (err) {
      console.error("Error validating coupon:", err);
      toast.error("Failed to validate coupon");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    cart.removeCoupon();
    toast.success("Coupon removed");
  };

  if (items.length === 0) {
    return null;
  }

  const appliedCoupon = cart.appliedCoupon;

  return (
    <div className="mt-4 sm:mt-6 lg:mt-0">
      {/* Order Summary Card */}
      <div className="bg-white rounded-xl px-4 py-5 sm:px-5 sm:py-6 md:px-6 md:py-7 lg:px-7 lg:py-8 sticky top-4 sm:top-6 z-10 shadow-xs hover:shadow-md border border-primary/20 transition-all duration-300">
        <h2 className="text-lg sm:text-xl font-bold text-foreground mb-4 sm:mb-5 tracking-tight">
          Order Summary
        </h2>

        {/* Price Breakdown */}
        <div className="space-y-3.5 mb-5 sm:mb-6">
          {/* Subtotal */}
          <div className="flex justify-between text-foreground text-sm sm:text-base font-medium">
            <span>
              Subtotal (
              {items.reduce((total, item) => total + (item.quantity || 1), 0)}{" "}
              {items.reduce(
                (total, item) => total + (item.quantity || 1),
                0
              ) === 1
                ? "item"
                : "items"}
              )
            </span>
            <Currency value={cartSubtotal} />
          </div>

          {/* Sale Discount */}
          {saleDiscount > 0 && (
            <div className="flex justify-between text-red-600 text-sm sm:text-base font-medium">
              <div className="flex items-center space-x-1.5">
                <Percent size={14} className="flex-shrink-0" />
                <span className="text-xs sm:text-sm font-semibold">
                  Sale Discount
                </span>
              </div>
              <span className="text-sm sm:text-base font-bold flex items-center">
                - <Currency value={saleDiscount} />
              </span>
            </div>
          )}

          {/* Applied Coupon */}
          {appliedCoupon && (
            <div className="flex justify-between text-emerald-700 text-sm sm:text-base font-medium">
              <div className="flex items-center space-x-1.5">
                <Tag size={14} className="text-emerald-700" />
                <span className="font-semibold text-xs sm:text-sm">
                  Coupon {appliedCoupon.couponCode} (
                  {appliedCoupon.discountType === "percentage"
                    ? `${appliedCoupon.discountValue}% OFF`
                    : `₹${appliedCoupon.discountValue} OFF`}
                  )
                </span>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  aria-label="Remove coupon"
                  className="text-red-500 hover:text-red-700 ml-1.5 text-base leading-none p-1 rounded hover:bg-red-50 focus:outline-none"
                  title="Remove Coupon"
                >
                  ×
                </button>
              </div>
              <span className="flex items-center font-bold">
                - <Currency value={couponDiscount} />
              </span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between text-foreground text-sm sm:text-base font-medium">
            <div className="flex items-center space-x-1.5">
              <Truck size={15} className="text-primary" />
              <span>Shipping</span>
            </div>
            <span className="text-emerald-700 font-bold text-xs sm:text-sm uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
              FREE
            </span>
          </div>

          {/* Total */}
          <div className="border-t border-stone-200 pt-4">
            <div className="flex justify-between text-base sm:text-lg md:text-xl font-bold text-foreground">
              <span>Total</span>
              <Currency value={totalPrice} />
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-emerald-700 font-semibold mt-1">
                <span>Total Savings</span>
                <Currency value={totalDiscount} />
              </div>
            )}
          </div>
        </div>

        <Link href="/checkout" className="block">
          <Button
            className="w-full mb-4 py-3 text-sm sm:text-base font-bold bg-foreground text-background hover:bg-secondary rounded-lg transition-colors shadow-xs hover:shadow-md"
          >
            Proceed to Checkout
          </Button>
        </Link>

        {/* Security & Trust Indicators */}
        <div className="space-y-2 text-xs sm:text-sm text-muted-foreground mb-5">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4 text-primary flex-shrink-0" />
            <span>Multiple secure payment options accepted</span>
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="border-t border-stone-200 pt-4">
          <h3 className="text-xs sm:text-sm font-semibold text-foreground mb-2.5 flex items-center space-x-2">
            <Tag className="h-4 w-4 text-primary" />
            <span>Have a promo code?</span>
          </h3>
          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
            <input
              type="text"
              placeholder="ENTER PROMO CODE"
              value={couponInputCode}
              onChange={(e) => setCouponInputCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyCoupon();
                }
              }}
              className="flex-1 px-3 py-2 text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-[#B67B5C] uppercase text-stone-900 placeholder:text-stone-400 font-mono"
            />
            <Button
              type="button"
              onClick={handleApplyCoupon}
              disabled={!couponInputCode.trim() || isApplyingCoupon}
              className="bg-foreground text-background hover:bg-secondary transition-colors text-xs sm:text-sm px-4 py-2 font-bold rounded-lg w-full xs:w-auto"
            >
              {isApplyingCoupon ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </div>

      {/* Savings Summary */}

    </div>
  );
};

const Summary = () => {
  return (
    <Suspense fallback={<div>Loading cart summary...</div>}>
      <SummaryContent />
    </Suspense>
  );
};

export default Summary;

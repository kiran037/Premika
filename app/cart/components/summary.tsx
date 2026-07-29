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
      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:px-6 lg:py-8 sticky top-4 sm:top-6 z-10 shadow-sm border border-gray-100">
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-secondary mb-3 sm:mb-4 md:mb-5 lg:mb-6">
          Order Summary
        </h2>

        {/* Price Breakdown */}
        <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 md:mb-6">
          {/* Subtotal */}
          <div className="flex justify-between text-foreground text-sm sm:text-base">
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
            <div className="flex justify-between text-red-600 text-sm sm:text-base">
              <div className="flex items-center space-x-1">
                <Percent size={12} className="sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-sm">
                  Sale Discount
                </span>
              </div>
              <span className="text-sm sm:text-base flex items-center">
                - <Currency value={saleDiscount} />
              </span>
            </div>
          )}

          {/* Applied Coupon */}
          {appliedCoupon && (
            <div className="flex justify-between text-green-600 text-sm sm:text-base">
              <div className="flex items-center space-x-1">
                <Tag size={14} className="sm:w-4 sm:h-4" />
                <span>
                  Coupon {appliedCoupon.couponCode} (
                  {appliedCoupon.discountType === "percentage"
                    ? `${appliedCoupon.discountValue}% OFF`
                    : `₹${appliedCoupon.discountValue} OFF`}
                  )
                </span>
                <button
                  onClick={handleRemoveCoupon}
                  aria-label="Remove coupon"
                  className="text-red-500 hover:text-red-700 ml-1 sm:ml-2 text-lg leading-none p-1 min-w-[28px] min-h-[28px] inline-flex items-center justify-center rounded focus:outline-none focus:ring-1 focus:ring-red-500"
                  title="Remove Coupon"
                >
                  ×
                </button>
              </div>
              <span className="flex items-center">
                - <Currency value={couponDiscount} />
              </span>
            </div>
          )}

          {/* Shipping */}
          <div className="flex justify-between text-foreground text-sm sm:text-base">
            <div className="flex items-center space-x-1">
              <Truck size={14} className="sm:w-4 sm:h-4" />
              <span>Shipping</span>
            </div>
            <span className="text-green-600 font-medium">FREE</span>
          </div>

          {/* Total */}
          <div className="border-t border-background pt-3 sm:pt-4">
            <div className="flex justify-between text-base sm:text-lg md:text-xl font-extrabold text-foreground">
              <span>Total</span>
              <Currency value={totalPrice} />
            </div>
            {totalDiscount > 0 && (
              <div className="flex justify-between text-xs sm:text-sm text-green-600 mt-1">
                <span>You saved</span>
                <Currency value={totalDiscount} />
              </div>
            )}
          </div>
        </div>

        <Link href="/checkout" className="block">
          <Button
            className="w-full mb-3 sm:mb-4 py-2 sm:py-3 text-sm sm:text-base md:text-lg bg-foreground text-background hover:bg-secondary transition-colors"
          >
            Proceed to Checkout
          </Button>
        </Link>

        {/* Security & Trust Indicators */}
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-foreground mb-4 sm:mb-5 md:mb-6">
          <div className="flex items-center space-x-2">
            <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
            <span>Multiple payment options accepted</span>
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="border-t border-background pt-3 sm:pt-4">
          <h3 className="text-sm sm:text-base font-medium text-foreground mb-2 sm:mb-3 flex items-center space-x-2">
            <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Have a promo code?</span>
          </h3>
          <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={couponInputCode}
              onChange={(e) => setCouponInputCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleApplyCoupon();
                }
              }}
              className="flex-1 px-2 sm:px-3 py-2 text-xs sm:text-sm border border-background rounded-md focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent uppercase"
            />
            <Button
              onClick={handleApplyCoupon}
              variant="outline"
              size="sm"
              disabled={!couponInputCode.trim() || isApplyingCoupon}
              className="hover:bg-primary hover:text-background transition-colors border border-foreground text-xs sm:text-sm px-3 py-2 w-full xs:w-auto"
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

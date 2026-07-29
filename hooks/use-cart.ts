import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { CartStore, CartItem, ComboSelections } from "@/types";
import {
  generateCartItemId,
  areComboSelectionsEqual,
  sanitizeCartState,
} from "@/lib/cart/cart-utils";

export interface AppliedCouponInfo {
  couponId?: string;
  couponCode: string;
  discountType: "percentage" | "fixed" | string;
  discountValue: number;
  discountAmount: number;
}

export interface CouponStoreState {
  appliedCoupon: AppliedCouponInfo | null;
  couponId: string | null;
  couponCode: string | null;
  discountType: string | null;
  discountValue: number | null;
  discountAmount: number | null;

  applyCoupon: (couponData: AppliedCouponInfo) => void;
  removeCoupon: () => void;
}

export type FullCartStore = CartStore & CouponStoreState;

const recalculateDiscount = (
  items: CartItem[],
  currentCoupon: AppliedCouponInfo | null
): AppliedCouponInfo | null => {
  if (!currentCoupon) return null;
  const newSubtotal = items.reduce(
    (total, item) => total + (item.price || 0) * (item.quantity || 1),
    0
  );
  if (newSubtotal <= 0) return null;

  let newDiscountAmount = 0;
  if (currentCoupon.discountType === "percentage") {
    newDiscountAmount = Math.floor((newSubtotal * currentCoupon.discountValue) / 100);
  } else {
    newDiscountAmount = Math.min(newSubtotal, currentCoupon.discountValue);
  }

  return {
    ...currentCoupon,
    discountAmount: newDiscountAmount,
  };
};

const useCart = create<FullCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponId: null,
      couponCode: null,
      discountType: null,
      discountValue: null,
      discountAmount: null,

      applyCoupon: (couponData) => {
        set({
          appliedCoupon: couponData,
          couponId: couponData.couponId || null,
          couponCode: couponData.couponCode,
          discountType: couponData.discountType,
          discountValue: couponData.discountValue,
          discountAmount: couponData.discountAmount,
        });
      },

      removeCoupon: () => {
        set({
          appliedCoupon: null,
          couponId: null,
          couponCode: null,
          discountType: null,
          discountValue: null,
          discountAmount: null,
        });
      },

      addItem: (data) => {
        const currentItems = get().items;
        const baseId = data.id || data.productId || data.slug || "product";

        // Compute unique variant ID
        const variantId = generateCartItemId(
          baseId,
          data.selectedSize,
          data.selectedHeight,
          data.comboSelections
        );

        // Check for existing variant in cart
        const existingIndex = currentItems.findIndex((item) => {
          if (item.id === variantId) return true;

          if (item.isCombo && data.isCombo) {
            return (
              item.id === baseId &&
              areComboSelectionsEqual(item.comboSelections, data.comboSelections)
            );
          }

          return (
            (item.id === baseId || item.productId === baseId) &&
            item.selectedSize === data.selectedSize &&
            item.selectedHeight === data.selectedHeight
          );
        });

        const addQty = Math.max(1, data.quantity || 1);
        let updatedItems: CartItem[];

        if (existingIndex !== -1) {
          updatedItems = [...currentItems];
          const existingItem = updatedItems[existingIndex];
          const newQuantity = (existingItem.quantity || 1) + addQty;

          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQuantity,
          };

          if (data.isCombo) {
            toast.success(`Updated quantity to ${newQuantity} for ${data.name}`);
          } else {
            const sizeInfo = data.selectedSize ? ` (Size: ${data.selectedSize}` : "";
            const heightInfo = data.selectedHeight ? `, Height: ${data.selectedHeight})` : sizeInfo ? ")" : "";
            toast.success(`Updated quantity to ${newQuantity} for ${data.name}${sizeInfo}${heightInfo}`);
          }
        } else {
          const newItem: CartItem = {
            ...data,
            id: variantId,
            productId: baseId,
            slug: data.slug || baseId,
            quantity: addQty,
            images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ["/placeholder.svg"],
          };

          updatedItems = [...currentItems, newItem];

          if (data.isCombo) {
            toast.success(`${data.name} added to cart`);
          } else {
            const sizeInfo = data.selectedSize ? ` (Size: ${data.selectedSize}` : "";
            const heightInfo = data.selectedHeight ? `, Height: ${data.selectedHeight})` : sizeInfo ? ")" : "";
            toast.success(`${data.name}${sizeInfo}${heightInfo} added to cart`);
          }
        }

        const updatedCoupon = recalculateDiscount(updatedItems, get().appliedCoupon);

        set({
          items: updatedItems,
          appliedCoupon: updatedCoupon,
          couponId: updatedCoupon?.couponId || null,
          couponCode: updatedCoupon?.couponCode || null,
          discountType: updatedCoupon?.discountType || null,
          discountValue: updatedCoupon?.discountValue || null,
          discountAmount: updatedCoupon?.discountAmount || null,
        });

        return true;
      },

      removeItem: (id, selectedSize, selectedHeight, comboSelections) => {
        const currentItems = get().items;
        const updatedItems = currentItems.filter((item) => {
          if (item.id === id) return false;

          if (item.isCombo && comboSelections) {
            if (
              (item.id === id || item.productId === id) &&
              areComboSelectionsEqual(item.comboSelections, comboSelections)
            ) {
              return false;
            }
          }

          if (
            (item.id === id || item.productId === id) &&
            selectedSize !== undefined &&
            item.selectedSize === selectedSize &&
            (selectedHeight === undefined || item.selectedHeight === selectedHeight)
          ) {
            return false;
          }

          return true;
        });

        const updatedCoupon = recalculateDiscount(updatedItems, get().appliedCoupon);

        set({
          items: updatedItems,
          appliedCoupon: updatedCoupon,
          couponId: updatedCoupon?.couponId || null,
          couponCode: updatedCoupon?.couponCode || null,
          discountType: updatedCoupon?.discountType || null,
          discountValue: updatedCoupon?.discountValue || null,
          discountAmount: updatedCoupon?.discountAmount || null,
        });

        toast.success("Item removed from cart");
      },

      updateQuantity: (
        id,
        selectedSize,
        selectedHeight,
        newQuantity,
        comboSelections
      ) => {
        const currentItems = get().items;
        const targetQuantity = newQuantity !== undefined ? newQuantity : 1;

        if (targetQuantity <= 0) {
          get().removeItem(id, selectedSize, selectedHeight, comboSelections);
          return;
        }

        const updatedItems = currentItems.map((item) => {
          const isTarget =
            item.id === id ||
            ((item.productId === id || item.id === id) &&
              (item.isCombo
                ? areComboSelectionsEqual(item.comboSelections, comboSelections)
                : item.selectedSize === selectedSize &&
                  (selectedHeight === undefined || item.selectedHeight === selectedHeight)));

          return isTarget ? { ...item, quantity: targetQuantity } : item;
        });

        const updatedCoupon = recalculateDiscount(updatedItems, get().appliedCoupon);

        set({
          items: updatedItems,
          appliedCoupon: updatedCoupon,
          couponId: updatedCoupon?.couponId || null,
          couponCode: updatedCoupon?.couponCode || null,
          discountType: updatedCoupon?.discountType || null,
          discountValue: updatedCoupon?.discountValue || null,
          discountAmount: updatedCoupon?.discountAmount || null,
        });

        toast.success(`Quantity updated to ${targetQuantity}`);
      },

      removeAll: () => {
        set({
          items: [],
          appliedCoupon: null,
          couponId: null,
          couponCode: null,
          discountType: null,
          discountValue: null,
          discountAmount: null,
        });
        toast.success("All items removed from cart");
      },

      getTotalQuantity: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 1), 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + (item.price || 0) * (item.quantity || 1), 0);
      },
    }),
    {
      name: "guest-cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.items) {
          state.items = sanitizeCartState(state.items);
        }
      },
    }
  )
);

export default useCart;

import { create } from "zustand";
import { persist, createJSONStorage, StateStorage } from "zustand/middleware";
import { CheckoutStore, CheckoutData } from "@/types";

const dummyStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const useCheckout = create<CheckoutStore>()(
  persist(
    (set, get) => ({
      checkoutData: null,

      // Set checkout data
      setCheckoutData: (data: CheckoutData) => set({ checkoutData: data }),

      // Get checkout data
      getCheckoutData: () => get().checkoutData,

      // Clear checkout data (after successful payment)
      clearCheckoutData: () => set({ checkoutData: null }),

      // Check if checkout data exists
      hasCheckoutData: () => !!get().checkoutData,
    }),
    {
      name: "checkout-storage",
      storage: createJSONStorage(() => {
        if (typeof window !== "undefined") {
          return sessionStorage;
        }
        return dummyStorage;
      }),
    }
  )
);

export default useCheckout;

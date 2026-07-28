import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import toast from "react-hot-toast";
import { WishlistStore, WishlistItem } from "@/types";
import { sanitizeWishlistState } from "@/lib/wishlist/wishlist-utils";

const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: WishlistItem) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.id === product.id);

        if (exists) {
          toast.error(`${product.name} is already in your wishlist`);
          return;
        }

        const newItem: WishlistItem = {
          ...product,
          images: Array.isArray(product.images) && product.images.length > 0 ? product.images : ["/placeholder.svg"],
        };

        set({ items: [...currentItems, newItem] });
        toast.success(`Added ${product.name} to wishlist`);
      },

      removeItem: (id: string) => {
        const currentItems = get().items;
        const targetItem = currentItems.find((item) => item.id === id);
        const updatedItems = currentItems.filter((item) => item.id !== id);

        set({ items: updatedItems });
        if (targetItem) {
          toast.success(`Removed ${targetItem.name} from wishlist`);
        }
      },

      toggleWishlist: (product: WishlistItem) => {
        const currentItems = get().items;
        const exists = currentItems.some((item) => item.id === product.id);

        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (id: string) => {
        return get().items.some((item) => item.id === id);
      },

      removeAll: () => {
        set({ items: [] });
        toast.success("Wishlist cleared");
      },

      getTotalItems: () => {
        return get().items.length;
      },
    }),
    {
      name: "guest-wishlist-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state && state.items) {
          state.items = sanitizeWishlistState(state.items);
        }
      },
    }
  )
);

export default useWishlist;

import { create } from "zustand";
import { SizeChartModalStore, ProductType } from "@/types";

const useSizeChartModal = create<SizeChartModalStore>((set) => ({
  isOpen: false,
  productType: "female",
  onOpen: (type: ProductType = "female") => set({ isOpen: true, productType: type }),
  onClose: () => set({ isOpen: false, productType: "female" }),
}));

export default useSizeChartModal;

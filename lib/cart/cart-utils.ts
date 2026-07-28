import { CartItem, ComboSelections, SizeOption, HeightOption } from "@/types";

/**
 * Compare two combo selections objects
 */
export const areComboSelectionsEqual = (
  sel1?: ComboSelections,
  sel2?: ComboSelections
): boolean => {
  if (!sel1 && !sel2) return true;
  if (!sel1 || !sel2) return false;
  const keys1 = Object.keys(sel1);
  const keys2 = Object.keys(sel2);
  if (keys1.length !== keys2.length) return false;
  return keys1.every(
    (key) =>
      sel2[key] &&
      sel1[key].size === sel2[key].size &&
      sel1[key].height === sel2[key].height
  );
};

/**
 * Generate a deterministic unique variant ID for a cart item
 */
export const generateCartItemId = (
  productIdOrSlug: string,
  selectedSize?: string,
  selectedHeight?: string,
  comboSelections?: ComboSelections
): string => {
  if (comboSelections && Object.keys(comboSelections).length > 0) {
    const comboKey = Object.entries(comboSelections)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v.size || ""}-${v.height || ""}`)
      .join("|");
    return `${productIdOrSlug}__combo__${comboKey}`;
  }

  const parts = [productIdOrSlug];
  if (selectedSize) parts.push(selectedSize);
  if (selectedHeight) parts.push(selectedHeight);
  return parts.join("__");
};

/**
 * Validate product selections before adding to cart
 */
export const validateCartSelection = (
  product: {
    inStock: boolean;
    sizes?: SizeOption[];
    heights?: HeightOption[];
    isCombo?: boolean;
    comboItems?: any[];
  },
  selection: {
    selectedSize?: string;
    selectedHeight?: string;
    comboSelections?: ComboSelections;
  }
): { isValid: boolean; error?: string } => {
  if (!product.inStock) {
    return { isValid: false, error: "Product is out of stock" };
  }

  if (product.isCombo) {
    if (!selection.comboSelections || Object.keys(selection.comboSelections).length === 0) {
      return { isValid: false, error: "Please select sizes for all combo items" };
    }
    return { isValid: true };
  }

  if (product.sizes && product.sizes.length > 0) {
    if (!selection.selectedSize) {
      return { isValid: false, error: "Please select a size" };
    }

    const sizeOpt = product.sizes.find((s) => s.label === selection.selectedSize);
    if (!sizeOpt) {
      return { isValid: false, error: "Selected size is invalid" };
    }
    if (!sizeOpt.inStock) {
      return { isValid: false, error: "Selected size is out of stock" };
    }
  }

  if (product.heights && product.heights.length > 0 && !selection.selectedHeight) {
    return { isValid: false, error: "Please select a height range" };
  }

  return { isValid: true };
};

/**
 * Sanitize and validate raw state restored from localStorage
 */
export const sanitizeCartState = (rawItems: any[]): CartItem[] => {
  if (!Array.isArray(rawItems)) return [];

  return rawItems.filter((item) => {
    return (
      item &&
      typeof item === "object" &&
      typeof item.name === "string" &&
      typeof item.price === "number" &&
      !isNaN(item.price) &&
      typeof item.quantity === "number" &&
      item.quantity > 0
    );
  });
};

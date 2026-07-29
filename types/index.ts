export interface SizeOption {
  label: string;
  inStock: boolean;
}

export interface HeightOption {
  label: string;
  value: string;
  default?: boolean;
}

export interface Review {
  name: string;
  date: string;
  rating: number;
  comment: string;
}

export interface ComboItemConfig {
  id: string;
  name: string;
  type?: ProductType;
  sizes?: SizeOption[];
  heights?: HeightOption[];
}

export interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  imageUrl?: string | null;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  shortDescription: string;
  longDescription: string;
  images: string[];
  category: string;
  inStock: boolean;
  sizes?: SizeOption[];
  reviews: Review[];
  heights?: HeightOption[];
  gender?: string;
  hasHeightOption?: boolean;
  isCombo?: boolean;
  comboItems?: ComboItemConfig[];
  featured?: boolean;
  isFeatured?: boolean;
  newArrival?: boolean;
  createdAt?: string;
  categoryId?: string;
}

export interface DiscountedPriceResult {
  originalPrice: number;
  discountedPrice: number;
  isOnSale: boolean;
  discount: number;
}

export interface ComboSelectionItem {
  size: string;
  height?: string;
}

export type ComboSelections = Record<string, ComboSelectionItem>;

export interface CartItem {
  id: string;
  productId?: string;
  name: string;
  slug?: string;
  price: number;
  images: string[];
  category?: string;
  quantity: number;
  selectedSize?: string;
  selectedHeight?: string;
  isCombo?: boolean;
  comboSelections?: ComboSelections;
  shortDescription?: string;
  longDescription?: string;
  description?: string;
  isOnSale?: boolean;
  originalPrice?: number;
  discount?: number;
}

export interface CartStore {
  items: CartItem[];
  addItem: (data: Omit<CartItem, "id" | "quantity"> & { id?: string; quantity?: number }) => boolean;
  removeItem: (
    id: string,
    selectedSize?: string,
    selectedHeight?: string,
    comboSelections?: ComboSelections
  ) => void;
  updateQuantity: (
    id: string,
    selectedSize?: string,
    selectedHeight?: string,
    newQuantity?: number,
    comboSelections?: ComboSelections
  ) => void;
  removeAll: () => void;
  getTotalQuantity: () => number;
  getSubtotal: () => number;
}

export interface CustomerAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: CustomerAddress;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount?: number;
}

export interface OrderData {
  orderId: string;
  paymentId?: string;
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  orderSummary: OrderSummary;
}

export interface CheckoutData {
  customerInfo: CustomerInfo;
  cartItems: CartItem[];
  orderSummary: OrderSummary;
}

export interface CheckoutStore {
  checkoutData: CheckoutData | null;
  setCheckoutData: (data: CheckoutData) => void;
  getCheckoutData: () => CheckoutData | null;
  clearCheckoutData: () => void;
  hasCheckoutData: () => boolean;
}

export type ProductType = "female" | "male" | "combo";

export interface SizeChartModalStore {
  isOpen: boolean;
  productType: ProductType;
  onOpen: (type?: ProductType) => void;
  onClose: () => void;
}

export interface NavItem {
  name: string;
  link: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  slug?: string;
  price: number;
  originalPrice?: number;
  isOnSale?: boolean;
  discount?: number;
  images: string[];
  category?: string;
  inStock: boolean;
  shortDescription?: string;
  sizes?: SizeOption[];
  heights?: HeightOption[];
  isCombo?: boolean;
  comboItems?: ComboItemConfig[];
}

export interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleWishlist: (product: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  removeAll: () => void;
  getTotalItems: () => number;
}

export interface RazorpayOptions {
  key: string | undefined;
  amount?: number;
  currency?: string;
  name: string;
  description: string;
  image: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => Promise<void>;
  error?: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: Record<string, string>;
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

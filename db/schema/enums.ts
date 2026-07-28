import { pgEnum } from "drizzle-orm/pg-core";

// ----------------------
// Product
// ----------------------

export const genderEnum = pgEnum("gender", [
    "men",
    "women",
    "unisex",
]);

export const productTypeEnum = pgEnum("product_type", [
    "top",
    "bottom",
    "set",
]);

export const productStatusEnum = pgEnum("product_status", [
    "draft",
    "active",
    "archived",
]);

export const stockStatusEnum = pgEnum("stock_status", [
    "in_stock",
    "low_stock",
    "out_of_stock",
]);

// ----------------------
// Orders
// ----------------------

export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "confirmed",
    "processing",
    "packed",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
    "refunded",
]);

// ----------------------
// Payments
// ----------------------

export const paymentMethodEnum = pgEnum("payment_method", [
    "cod",
    "razorpay",
    "upi",
    "card",
    "net_banking",
    "wallet",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
    "pending",
    "paid",
    "failed",
    "refunded",
    "partially_refunded",
]);

// ----------------------
// Shipment
// ----------------------

export const shipmentStatusEnum = pgEnum("shipment_status", [
    "pending",
    "booked",
    "picked_up",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "failed",
    "returned",
]);

// ----------------------
// Coupon
// ----------------------

export const couponTypeEnum = pgEnum("coupon_type", [
    "percentage",
    "fixed",
]);

// ----------------------
// Admin
// ----------------------

export const adminRoleEnum = pgEnum("admin_role", [
    "super_admin",
    "admin",
    "manager",
    "staff",
]);

// ----------------------
// Address
// ----------------------

export const addressTypeEnum = pgEnum("address_type", [
    "home",
    "office",
    "other",
]);

// ----------------------
// Banner
// ----------------------

export const bannerPositionEnum = pgEnum("banner_position", [
    "hero",
    "homepage",
    "category",
    "popup",
]);

// ----------------------
// Reviews
// ----------------------

export const reviewStatusEnum = pgEnum("review_status", [
    "pending",
    "approved",
    "rejected",
]);

// ----------------------
// Activity Logs
// ----------------------

export const activityActionEnum = pgEnum("activity_action", [
    "create",
    "update",
    "delete",
    "login",
    "logout",
]);
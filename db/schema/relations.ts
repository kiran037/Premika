import { relations } from "drizzle-orm";

import {
    categories,
    sizeCharts,
    products,
    productImages,
    productSizes,
    productHeights,
    productReviews,
    productFamilies,
    familyProducts,
} from "./product";

import {
    orders,
    orderItems,
    payments,
    paymentTransactions,
    shipments,
    shipmentTracking,
} from "./order";

import {
    customers,
    customerAddresses,
    wishlists,
    wishlistItems,
    carts,
    cartItems,
} from "./customer";

import {
    coupons,
    couponUsage,
    banners,
    newsletterSubscribers,
} from "./marketing";

import {
    admins,
    adminActivityLogs,
} from "./admin";


// ======================================================
// Categories
// ======================================================

export const categoriesRelations = relations(
    categories,
    ({ many }) => ({
        products: many(products),
    })
);

// ======================================================
// Size Charts
// ======================================================

export const sizeChartsRelations = relations(
    sizeCharts,
    ({ many }) => ({
        products: many(products),
    })
);

// ======================================================
// Products
// ======================================================

export const productsRelations = relations(
    products,
    ({ one, many }) => ({
        category: one(categories, {
            fields: [products.categoryId],
            references: [categories.id],
        }),

        sizeChart: one(sizeCharts, {
            fields: [products.sizeChartId],
            references: [sizeCharts.id],
        }),

        images: many(productImages),

        sizes: many(productSizes),

        heights: many(productHeights),

        reviews: many(productReviews),

        familyLinks: many(familyProducts),
    })
);

// ======================================================
// Product Images
// ======================================================

export const productImagesRelations = relations(
    productImages,
    ({ one }) => ({
        product: one(products, {
            fields: [productImages.productId],
            references: [products.id],
        }),
    })
);

// ======================================================
// Product Sizes
// ======================================================

export const productSizesRelations = relations(
    productSizes,
    ({ one }) => ({
        product: one(products, {
            fields: [productSizes.productId],
            references: [products.id],
        }),
    })
);

// ======================================================
// Product Heights
// ======================================================

export const productHeightsRelations = relations(
    productHeights,
    ({ one }) => ({
        product: one(products, {
            fields: [productHeights.productId],
            references: [products.id],
        }),
    })
);

// ======================================================
// Product Reviews
// ======================================================

export const productReviewsRelations = relations(
    productReviews,
    ({ one }) => ({
        product: one(products, {
            fields: [productReviews.productId],
            references: [products.id],
        }),
    })
);

// ======================================================
// Product Families
// ======================================================

export const productFamiliesRelations = relations(
    productFamilies,
    ({ many }) => ({
        products: many(familyProducts),
    })
);

// ======================================================
// Family Products
// ======================================================

export const familyProductsRelations = relations(
    familyProducts,
    ({ one }) => ({
        family: one(productFamilies, {
            fields: [familyProducts.familyId],
            references: [productFamilies.id],
        }),

        product: one(products, {
            fields: [familyProducts.productId],
            references: [products.id],
        }),
    })
);


// ======================================================
// Customers
// ======================================================

export const customersRelations = relations(
    customers,
    ({ many }) => ({
        addresses: many(customerAddresses),

        wishlists: many(wishlists),

        carts: many(carts),
    })
);

// ======================================================
// Customer Addresses
// ======================================================

export const customerAddressesRelations = relations(
    customerAddresses,
    ({ one }) => ({
        customer: one(customers, {
            fields: [customerAddresses.customerId],
            references: [customers.id],
        }),
    })
);

// ======================================================
// Wishlists
// ======================================================

export const wishlistsRelations = relations(
    wishlists,
    ({ one, many }) => ({
        customer: one(customers, {
            fields: [wishlists.customerId],
            references: [customers.id],
        }),

        items: many(wishlistItems),
    })
);

// ======================================================
// Wishlist Items
// ======================================================

export const wishlistItemsRelations = relations(
    wishlistItems,
    ({ one }) => ({
        wishlist: one(wishlists, {
            fields: [wishlistItems.wishlistId],
            references: [wishlists.id],
        }),

        product: one(products, {
            fields: [wishlistItems.productId],
            references: [products.id],
        }),
    })
);

// ======================================================
// Carts
// ======================================================

export const cartsRelations = relations(
    carts,
    ({ one, many }) => ({
        customer: one(customers, {
            fields: [carts.customerId],
            references: [customers.id],
        }),

        items: many(cartItems),
    })
);

// ======================================================
// Cart Items
// ======================================================

export const cartItemsRelations = relations(
    cartItems,
    ({ one }) => ({
        cart: one(carts, {
            fields: [cartItems.cartId],
            references: [carts.id],
        }),

        product: one(products, {
            fields: [cartItems.productId],
            references: [products.id],
        }),

        size: one(productSizes, {
            fields: [cartItems.productSizeId],
            references: [productSizes.id],
        }),

        height: one(productHeights, {
            fields: [cartItems.productHeightId],
            references: [productHeights.id],
        }),
    })
);


// ======================================================
// Orders
// ======================================================

export const ordersRelations = relations(
    orders,
    ({ one, many }) => ({
        customer: one(customers, {
            fields: [orders.customerId],
            references: [customers.id],
        }),

        items: many(orderItems),

        payments: many(payments),

        shipments: many(shipments),
    })
);

// ======================================================
// Order Items
// ======================================================

export const orderItemsRelations = relations(
    orderItems,
    ({ one }) => ({
        order: one(orders, {
            fields: [orderItems.orderId],
            references: [orders.id],
        }),

        product: one(products, {
            fields: [orderItems.productId],
            references: [products.id],
        }),

        size: one(productSizes, {
            fields: [orderItems.productSizeId],
            references: [productSizes.id],
        }),

        height: one(productHeights, {
            fields: [orderItems.productHeightId],
            references: [productHeights.id],
        }),
    })
);

// ======================================================
// Payments
// ======================================================

export const paymentsRelations = relations(
    payments,
    ({ one, many }) => ({
        order: one(orders, {
            fields: [payments.orderId],
            references: [orders.id],
        }),

        transactions: many(paymentTransactions),
    })
);

// ======================================================
// Payment Transactions
// ======================================================

export const paymentTransactionsRelations = relations(
    paymentTransactions,
    ({ one }) => ({
        payment: one(payments, {
            fields: [paymentTransactions.paymentId],
            references: [payments.id],
        }),
    })
);

// ======================================================
// Shipments
// ======================================================

export const shipmentsRelations = relations(
    shipments,
    ({ one, many }) => ({
        order: one(orders, {
            fields: [shipments.orderId],
            references: [orders.id],
        }),

        trackingHistory: many(shipmentTracking),
    })
);

// ======================================================
// Shipment Tracking
// ======================================================

export const shipmentTrackingRelations = relations(
    shipmentTracking,
    ({ one }) => ({
        shipment: one(shipments, {
            fields: [shipmentTracking.shipmentId],
            references: [shipments.id],
        }),
    })
);

// ======================================================
// Coupons
// ======================================================

export const couponsRelations = relations(
    coupons,
    ({ many }) => ({
        usages: many(couponUsage),
    })
);

// ======================================================
// Coupon Usage
// ======================================================

export const couponUsageRelations = relations(
    couponUsage,
    ({ one }) => ({
        coupon: one(coupons, {
            fields: [couponUsage.couponId],
            references: [coupons.id],
        }),

        customer: one(customers, {
            fields: [couponUsage.customerId],
            references: [customers.id],
        }),
    })
);

// ======================================================
// Banners
// ======================================================

export const bannersRelations = relations(
    banners,
    () => ({})
);

// ======================================================
// Newsletter Subscribers
// ======================================================

export const newsletterSubscribersRelations = relations(
    newsletterSubscribers,
    () => ({})
);

// ======================================================
// Admins
// ======================================================

export const adminsRelations = relations(
    admins,
    ({ many }) => ({
        activityLogs: many(adminActivityLogs),
    })
);

// ======================================================
// Admin Activity Logs
// ======================================================

export const adminActivityLogsRelations = relations(
    adminActivityLogs,
    ({ one }) => ({
        admin: one(admins, {
            fields: [adminActivityLogs.adminId],
            references: [admins.id],
        }),
    })
);
import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

import {
    orderStatusEnum,
} from "./enums";

import { customers } from "./customer";
import {
    products,
    productSizes,
    productHeights,
} from "./product";

import { shipmentStatusEnum } from "./enums";

// ======================================================
// Orders
// ======================================================

export const orders = pgTable(
    "orders",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        customerId: uuid("customer_id")
            .references(() => customers.id, {
                onDelete: "restrict",
            })
            .notNull(),

        orderNumber: varchar("order_number", {
            length: 50,
        }).notNull().unique(),

        status: orderStatusEnum("status")
            .default("pending")
            .notNull(),

        subtotal: integer("subtotal").notNull(),

        discount: integer("discount")
            .default(0)
            .notNull(),

        shippingCharge: integer("shipping_charge")
            .default(0)
            .notNull(),

        tax: integer("tax")
            .default(0)
            .notNull(),

        total: integer("total").notNull(),

        notes: text("notes"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        customerIdx: index("orders_customer_idx").on(
            table.customerId
        ),

        statusIdx: index("orders_status_idx").on(
            table.status
        ),

        orderNumberIdx: index("orders_number_idx").on(
            table.orderNumber
        ),
    })
);

// ======================================================
// Order Items
// ======================================================

export const orderItems = pgTable(
    "order_items",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        orderId: uuid("order_id")
            .references(() => orders.id, {
                onDelete: "cascade",
            })
            .notNull(),

        productId: uuid("product_id")
            .references(() => products.id, {
                onDelete: "restrict",
            })
            .notNull(),

        productSizeId: uuid("product_size_id").references(
            () => productSizes.id,
            {
                onDelete: "set null",
            }
        ),

        productHeightId: uuid("product_height_id").references(
            () => productHeights.id,
            {
                onDelete: "set null",
            }
        ),

        productName: varchar("product_name", {
            length: 255,
        }).notNull(),

        productSku: varchar("product_sku", {
            length: 100,
        }),

        quantity: integer("quantity")
            .notNull(),

        unitPrice: integer("unit_price")
            .notNull(),

        totalPrice: integer("total_price")
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        orderIdx: index("order_items_order_idx").on(
            table.orderId
        ),

        productIdx: index("order_items_product_idx").on(
            table.productId
        ),
    })
);


import {
    paymentMethodEnum,
    paymentStatusEnum,
} from "./enums";


// ======================================================
// Payments
// ======================================================

export const payments = pgTable(
    "payments",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        orderId: uuid("order_id")
            .references(() => orders.id, {
                onDelete: "cascade",
            })
            .notNull(),

        paymentMethod: paymentMethodEnum("payment_method")
            .notNull(),

        status: paymentStatusEnum("status")
            .default("pending")
            .notNull(),

        amount: integer("amount")
            .notNull(),

        gateway: varchar("gateway", {
            length: 100,
        }),

        gatewayOrderId: varchar("gateway_order_id", {
            length: 255,
        }),

        gatewayPaymentId: varchar("gateway_payment_id", {
            length: 255,
        }),

        gatewaySignature: text("gateway_signature"),

        transactionReference: varchar("transaction_reference", {
            length: 255,
        }),

        paidAt: timestamp("paid_at"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        orderIdx: index("payments_order_idx").on(
            table.orderId
        ),

        statusIdx: index("payments_status_idx").on(
            table.status
        ),

        gatewayPaymentIdx: index(
            "payments_gateway_payment_idx"
        ).on(table.gatewayPaymentId),
    })
);

// ======================================================
// Payment Transactions
// ======================================================

export const paymentTransactions = pgTable(
    "payment_transactions",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        paymentId: uuid("payment_id")
            .references(() => payments.id, {
                onDelete: "cascade",
            })
            .notNull(),

        status: paymentStatusEnum("status")
            .notNull(),

        amount: integer("amount")
            .notNull(),

        gatewayResponse: text("gateway_response"),

        errorCode: varchar("error_code", {
            length: 100,
        }),

        errorMessage: text("error_message"),

        transactionTime: timestamp("transaction_time")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        paymentIdx: index(
            "payment_transactions_payment_idx"
        ).on(table.paymentId),

        statusIdx: index(
            "payment_transactions_status_idx"
        ).on(table.status),
    })
);

// ======================================================
// Shipments
// ======================================================

export const shipments = pgTable(
    "shipments",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        orderId: uuid("order_id")
            .references(() => orders.id, {
                onDelete: "cascade",
            })
            .notNull(),

        status: shipmentStatusEnum("status")
            .default("pending")
            .notNull(),

        courierName: varchar("courier_name", {
            length: 150,
        }),

        trackingNumber: varchar("tracking_number", {
            length: 255,
        }),

        trackingUrl: text("tracking_url"),

        shippedAt: timestamp("shipped_at"),

        deliveredAt: timestamp("delivered_at"),

        estimatedDeliveryAt: timestamp(
            "estimated_delivery_at"
        ),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        orderIdx: index("shipments_order_idx").on(
            table.orderId
        ),

        statusIdx: index("shipments_status_idx").on(
            table.status
        ),

        trackingIdx: index("shipments_tracking_idx").on(
            table.trackingNumber
        ),
    })
);

// ======================================================
// Shipment Tracking History
// ======================================================

export const shipmentTracking = pgTable(
    "shipment_tracking",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        shipmentId: uuid("shipment_id")
            .references(() => shipments.id, {
                onDelete: "cascade",
            })
            .notNull(),

        status: shipmentStatusEnum("status")
            .notNull(),

        location: varchar("location", {
            length: 255,
        }),

        description: text("description"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        shipmentIdx: index(
            "shipment_tracking_shipment_idx"
        ).on(table.shipmentId),

        statusIdx: index(
            "shipment_tracking_status_idx"
        ).on(table.status),
    })
);
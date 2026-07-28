import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    integer,
    index,
} from "drizzle-orm/pg-core";

import { addressTypeEnum } from "./enums";
import { products, productHeights, productSizes } from "./product";

// ======================================================
// Customers
// ======================================================

export const customers = pgTable(
    "customers",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        firstName: varchar("first_name", {
            length: 100,
        }).notNull(),

        lastName: varchar("last_name", {
            length: 100,
        }),

        email: varchar("email", {
            length: 255,
        }).notNull().unique(),

        phone: varchar("phone", {
            length: 20,
        }).unique(),

        passwordHash: text("password_hash"),

        avatar: text("avatar"),

        isEmailVerified: boolean("is_email_verified")
            .default(false)
            .notNull(),

        isPhoneVerified: boolean("is_phone_verified")
            .default(false)
            .notNull(),

        isActive: boolean("is_active")
            .default(true)
            .notNull(),

        lastLoginAt: timestamp("last_login_at"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        emailIdx: index("customers_email_idx").on(
            table.email
        ),

        phoneIdx: index("customers_phone_idx").on(
            table.phone
        ),
    })
);

// ======================================================
// Customer Addresses
// ======================================================

export const customerAddresses = pgTable(
    "customer_addresses",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        customerId: uuid("customer_id")
            .references(() => customers.id, {
                onDelete: "cascade",
            })
            .notNull(),

        type: addressTypeEnum("type")
            .default("home")
            .notNull(),

        fullName: varchar("full_name", {
            length: 150,
        }).notNull(),

        phone: varchar("phone", {
            length: 20,
        }).notNull(),

        addressLine1: varchar("address_line_1", {
            length: 255,
        }).notNull(),

        addressLine2: varchar("address_line_2", {
            length: 255,
        }),

        landmark: varchar("landmark", {
            length: 255,
        }),

        city: varchar("city", {
            length: 100,
        }).notNull(),

        state: varchar("state", {
            length: 100,
        }).notNull(),

        country: varchar("country", {
            length: 100,
        })
            .default("India")
            .notNull(),

        postalCode: varchar("postal_code", {
            length: 20,
        }).notNull(),

        isDefault: boolean("is_default")
            .default(false)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        customerIdx: index("customer_addresses_customer_idx").on(
            table.customerId
        ),
    })
);

// ======================================================
// Wishlists
// ======================================================

export const wishlists = pgTable(
    "wishlists",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        customerId: uuid("customer_id")
            .references(() => customers.id, {
                onDelete: "cascade",
            })
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        customerIdx: index("wishlists_customer_idx").on(
            table.customerId
        ),
    })
);

// ======================================================
// Wishlist Items
// ======================================================

export const wishlistItems = pgTable(
    "wishlist_items",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        wishlistId: uuid("wishlist_id")
            .references(() => wishlists.id, {
                onDelete: "cascade",
            })
            .notNull(),

        productId: uuid("product_id")
            .references(() => products.id, {
                onDelete: "cascade",
            })
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        wishlistIdx: index("wishlist_items_wishlist_idx").on(
            table.wishlistId
        ),

        productIdx: index("wishlist_items_product_idx").on(
            table.productId
        ),
    })
);

// ======================================================
// Carts
// ======================================================

export const carts = pgTable(
    "carts",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        customerId: uuid("customer_id").references(() => customers.id, {
            onDelete: "cascade",
        }),

        sessionId: varchar("session_id", {
            length: 255,
        }),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        customerIdx: index("carts_customer_idx").on(
            table.customerId
        ),

        sessionIdx: index("carts_session_idx").on(
            table.sessionId
        ),
    })
);

// ======================================================
// Cart Items
// ======================================================

export const cartItems = pgTable(
    "cart_items",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        cartId: uuid("cart_id")
            .references(() => carts.id, {
                onDelete: "cascade",
            })
            .notNull(),

        productId: uuid("product_id")
            .references(() => products.id, {
                onDelete: "cascade",
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

        quantity: integer("quantity")
            .default(1)
            .notNull(),

        unitPrice: integer("unit_price").notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        cartIdx: index("cart_items_cart_idx").on(
            table.cartId
        ),

        productIdx: index("cart_items_product_idx").on(
            table.productId
        ),

        sizeIdx: index("cart_items_size_idx").on(
            table.productSizeId
        ),

        heightIdx: index("cart_items_height_idx").on(
            table.productHeightId
        ),
    })
);
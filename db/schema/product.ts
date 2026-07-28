import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    boolean,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

import {
    genderEnum,
    productTypeEnum,
    productStatusEnum,
    stockStatusEnum,
    reviewStatusEnum,
} from "./enums";

// ===============================
// Categories
// ===============================

export const categories = pgTable(
    "categories",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        name: varchar("name", { length: 100 }).notNull(),

        slug: varchar("slug", { length: 120 }).notNull().unique(),

        description: text("description"),

        image: text("image"),

        isActive: boolean("is_active").default(true).notNull(),

        sortOrder: integer("sort_order").default(0).notNull(),

        createdAt: timestamp("created_at").defaultNow().notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        slugIdx: index("categories_slug_idx").on(table.slug),
    })
);

// ===============================
// Size Charts
// ===============================

export const sizeCharts = pgTable(
    "size_charts",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        name: varchar("name", { length: 50 }).notNull(),

        image: text("image").notNull(),

        description: text("description"),

        createdAt: timestamp("created_at").defaultNow().notNull(),
    },
    (table) => ({
        nameIdx: index("size_chart_name_idx").on(table.name),
    })
);

// ===============================
// Products
// ===============================

export const products = pgTable(
    "products",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        categoryId: uuid("category_id")
            .references(() => categories.id, {
                onDelete: "restrict",
            })
            .notNull(),

        sizeChartId: uuid("size_chart_id").references(
            () => sizeCharts.id,
            {
                onDelete: "set null",
            }
        ),

        slug: varchar("slug", { length: 200 }).notNull().unique(),

        name: varchar("name", { length: 200 }).notNull(),

        sku: varchar("sku", { length: 100 }).unique(),

        productType: productTypeEnum("product_type").notNull(),

        gender: genderEnum("gender").default("women").notNull(),

        status: productStatusEnum("status")
            .default("active")
            .notNull(),

        stockStatus: stockStatusEnum("stock_status")
            .default("in_stock")
            .notNull(),

        shortDescription: text("short_description"),

        longDescription: text("long_description"),

        fabric: varchar("fabric", { length: 120 }),

        price: integer("price").notNull(),

        compareAtPrice: integer("compare_at_price"),

        costPrice: integer("cost_price"),

        featured: boolean("featured")
            .default(false)
            .notNull(),

        newArrival: boolean("new_arrival")
            .default(false)
            .notNull(),

        hasHeightOptions: boolean("has_height_options")
            .default(false)
            .notNull(),

        isActive: boolean("is_active")
            .default(true)
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
        slugIdx: index("products_slug_idx").on(table.slug),

        categoryIdx: index("products_category_idx").on(
            table.categoryId
        ),

        typeIdx: index("products_type_idx").on(
            table.productType
        ),

        statusIdx: index("products_status_idx").on(
            table.status
        ),
    })
);

// ===============================
// Product Images
// ===============================

export const productImages = pgTable(
    "product_images",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        productId: uuid("product_id")
            .references(() => products.id, {
                onDelete: "cascade",
            })
            .notNull(),

        image: text("image").notNull(),

        alt: varchar("alt", { length: 255 }),

        sortOrder: integer("sort_order")
            .default(0)
            .notNull(),

        isPrimary: boolean("is_primary")
            .default(false)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        productIdx: index("product_images_product_idx").on(
            table.productId
        ),
    })
);

// ===============================
// Product Sizes
// ===============================

export const productSizes = pgTable(
    "product_sizes",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        productId: uuid("product_id")
            .references(() => products.id, {
                onDelete: "cascade",
            })
            .notNull(),

        size: varchar("size", { length: 20 }).notNull(),

        stock: integer("stock")
            .default(0)
            .notNull(),

        reservedStock: integer("reserved_stock")
            .default(0)
            .notNull(),

        isAvailable: boolean("is_available")
            .default(true)
            .notNull(),

        sortOrder: integer("sort_order")
            .default(0)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        productIdx: index("product_sizes_product_idx").on(
            table.productId
        ),

        sizeIdx: index("product_sizes_size_idx").on(
            table.size
        ),
    })
);

// ===============================
// Product Heights
// ===============================

export const productHeights = pgTable(
    "product_heights",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        productId: uuid("product_id")
            .references(() => products.id, {
                onDelete: "cascade",
            })
            .notNull(),

        label: varchar("label", { length: 100 }).notNull(),

        value: varchar("value", { length: 100 }).notNull(),

        isDefault: boolean("is_default")
            .default(false)
            .notNull(),

        sortOrder: integer("sort_order")
            .default(0)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        productIdx: index("product_heights_product_idx").on(
            table.productId
        ),
    })
);

// ===============================
// Product Reviews
// ===============================

export const productReviews = pgTable(
    "product_reviews",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        productId: uuid("product_id")
            .references(() => products.id, {
                onDelete: "cascade",
            })
            .notNull(),

        customerName: varchar("customer_name", {
            length: 120,
        }).notNull(),

        rating: integer("rating").notNull(),

        comment: text("comment").notNull(),

        reviewStatus: reviewStatusEnum("review_status")
            .default("approved")
            .notNull(),

        verifiedPurchase: boolean("verified_purchase")
            .default(false)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        productIdx: index("product_reviews_product_idx").on(
            table.productId
        ),
    })
);

// ===============================
// Product Families
// Example:
// Tanya
// ├── Tanya Kurti
// ├── Tanya Salwar
// └── Tanya Set
// ===============================

export const productFamilies = pgTable(
    "product_families",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        name: varchar("name", {
            length: 150,
        }).notNull(),

        slug: varchar("slug", {
            length: 180,
        }).notNull().unique(),

        description: text("description"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        slugIdx: index("product_families_slug_idx").on(
            table.slug
        ),
    })
);

// ===============================
// Family Products
// ===============================

export const familyProducts = pgTable(
    "family_products",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        familyId: uuid("family_id")
            .references(() => productFamilies.id, {
                onDelete: "cascade",
            })
            .notNull(),

        productId: uuid("product_id")
            .references(() => products.id, {
                onDelete: "cascade",
            })
            .notNull(),

        role: productTypeEnum("role").notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        familyIdx: index("family_products_family_idx").on(
            table.familyId
        ),

        productIdx: index("family_products_product_idx").on(
            table.productId
        ),
    })
);
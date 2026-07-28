import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

// ======================================================
// Store Settings
// ======================================================

export const storeSettings = pgTable(
    "store_settings",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        storeName: varchar("store_name", {
            length: 255,
        }).notNull(),

        storeEmail: varchar("store_email", {
            length: 255,
        }).notNull(),

        storePhone: varchar("store_phone", {
            length: 30,
        }),

        logo: text("logo"),

        favicon: text("favicon"),

        currency: varchar("currency", {
            length: 10,
        })
            .default("INR")
            .notNull(),

        timezone: varchar("timezone", {
            length: 100,
        })
            .default("Asia/Kolkata")
            .notNull(),

        maintenanceMode: boolean("maintenance_mode")
            .default(false)
            .notNull(),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    }
);

// ======================================================
// Contact Information
// ======================================================

export const storeContacts = pgTable(
    "store_contacts",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        address: text("address"),

        city: varchar("city", {
            length: 100,
        }),

        state: varchar("state", {
            length: 100,
        }),

        country: varchar("country", {
            length: 100,
        }),

        postalCode: varchar("postal_code", {
            length: 20,
        }),

        supportEmail: varchar("support_email", {
            length: 255,
        }),

        supportPhone: varchar("support_phone", {
            length: 30,
        }),

        businessHours: text("business_hours"),

        googleMapsUrl: text("google_maps_url"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    }
);

// ======================================================
// Social Links
// ======================================================

export const socialLinks = pgTable(
    "social_links",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        platform: varchar("platform", {
            length: 100,
        }).notNull(),

        url: text("url").notNull(),

        icon: varchar("icon", {
            length: 100,
        }),

        isActive: boolean("is_active")
            .default(true)
            .notNull(),

        sortOrder: varchar("sort_order", {
            length: 10,
        })
            .default("0")
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
        platformIdx: index("social_links_platform_idx").on(
            table.platform
        ),

        activeIdx: index("social_links_active_idx").on(
            table.isActive
        ),
    })
);
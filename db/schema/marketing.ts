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
    couponTypeEnum,
    bannerPositionEnum,
} from "./enums";

import { customers } from "./customer";

// ======================================================
// Coupons
// ======================================================

export const coupons = pgTable(
    "coupons",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        code: varchar("code", {
            length: 50,
        })
            .notNull()
            .unique(),

        name: varchar("name", {
            length: 150,
        }).notNull(),

        description: text("description"),

        type: couponTypeEnum("type").notNull(),

        value: integer("value").notNull(),

        minimumOrderAmount: integer("minimum_order_amount")
            .default(0)
            .notNull(),

        maximumDiscount: integer("maximum_discount"),

        usageLimit: integer("usage_limit"),

        usedCount: integer("used_count")
            .default(0)
            .notNull(),

        startsAt: timestamp("starts_at"),

        expiresAt: timestamp("expires_at"),

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
        codeIdx: index("coupons_code_idx").on(
            table.code
        ),

        activeIdx: index("coupons_active_idx").on(
            table.isActive
        ),
    })
);

// ======================================================
// Coupon Usage
// ======================================================

export const couponUsage = pgTable(
    "coupon_usage",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        couponId: uuid("coupon_id")
            .references(() => coupons.id, {
                onDelete: "cascade",
            })
            .notNull(),

        customerId: uuid("customer_id")
            .references(() => customers.id, {
                onDelete: "cascade",
            })
            .notNull(),

        usedAt: timestamp("used_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        couponIdx: index("coupon_usage_coupon_idx").on(
            table.couponId
        ),

        customerIdx: index("coupon_usage_customer_idx").on(
            table.customerId
        ),
    })
);

// ======================================================
// Banners
// ======================================================

export const banners = pgTable(
    "banners",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        title: varchar("title", {
            length: 255,
        }).notNull(),

        subtitle: text("subtitle"),

        image: text("image").notNull(),

        mobileImage: text("mobile_image"),

        buttonText: varchar("button_text", {
            length: 100,
        }),

        buttonUrl: text("button_url"),

        position: bannerPositionEnum("position")
            .notNull(),

        sortOrder: integer("sort_order")
            .default(0)
            .notNull(),

        isActive: boolean("is_active")
            .default(true)
            .notNull(),

        startsAt: timestamp("starts_at"),

        endsAt: timestamp("ends_at"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),

        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => ({
        positionIdx: index("banners_position_idx").on(
            table.position
        ),

        activeIdx: index("banners_active_idx").on(
            table.isActive
        ),
    })
);

// ======================================================
// Newsletter Subscribers
// ======================================================

export const newsletterSubscribers = pgTable(
    "newsletter_subscribers",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        email: varchar("email", {
            length: 255,
        })
            .notNull()
            .unique(),

        isSubscribed: boolean("is_subscribed")
            .default(true)
            .notNull(),

        subscribedAt: timestamp("subscribed_at")
            .defaultNow()
            .notNull(),

        unsubscribedAt: timestamp("unsubscribed_at"),
    },
    (table) => ({
        emailIdx: index(
            "newsletter_subscribers_email_idx"
        ).on(table.email),
    })
);
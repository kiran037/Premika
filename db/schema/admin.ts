import {
    pgTable,
    uuid,
    varchar,
    text,
    boolean,
    timestamp,
    index,
} from "drizzle-orm/pg-core";

import {
    adminRoleEnum,
    activityActionEnum,
} from "./enums";

// ======================================================
// Admin Users
// ======================================================

export const admins = pgTable(
    "admins",
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
        })
            .notNull()
            .unique(),

        passwordHash: text("password_hash").notNull(),

        avatar: text("avatar"),

        role: adminRoleEnum("role")
            .default("staff")
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
        emailIdx: index("admins_email_idx").on(
            table.email
        ),

        roleIdx: index("admins_role_idx").on(
            table.role
        ),
    })
);

// ======================================================
// Admin Activity Logs
// ======================================================

export const adminActivityLogs = pgTable(
    "admin_activity_logs",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        adminId: uuid("admin_id")
            .references(() => admins.id, {
                onDelete: "set null",
            }),

        action: activityActionEnum("action")
            .notNull(),

        entity: varchar("entity", {
            length: 100,
        }).notNull(),

        entityId: uuid("entity_id"),

        description: text("description"),

        ipAddress: varchar("ip_address", {
            length: 45,
        }),

        userAgent: text("user_agent"),

        createdAt: timestamp("created_at")
            .defaultNow()
            .notNull(),
    },
    (table) => ({
        adminIdx: index("admin_activity_logs_admin_idx").on(
            table.adminId
        ),

        actionIdx: index("admin_activity_logs_action_idx").on(
            table.action
        ),

        entityIdx: index("admin_activity_logs_entity_idx").on(
            table.entity
        ),
    })
);
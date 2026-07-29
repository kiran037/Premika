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
// Delhivery Shipping Settings / Pickup Location
// ======================================================

export const delhiverySettings = pgTable(
    "delhivery_settings",
    {
        id: uuid("id").defaultRandom().primaryKey(),

        pickupName: varchar("pickup_name", {
            length: 255,
        }).notNull(),

        pickupPhone: varchar("pickup_phone", {
            length: 30,
        }).notNull(),

        pickupEmail: varchar("pickup_email", {
            length: 255,
        }).notNull(),

        pickupAddressLine1: text("pickup_address_line1").notNull(),

        pickupAddressLine2: text("pickup_address_line2"),

        pickupCity: varchar("pickup_city", {
            length: 100,
        }).notNull(),

        pickupState: varchar("pickup_state", {
            length: 100,
        }).notNull(),

        pickupPincode: varchar("pickup_pincode", {
            length: 20,
        }).notNull(),

        pickupCountry: varchar("pickup_country", {
            length: 100,
        })
            .default("India")
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
        activeIdx: index("delhivery_settings_active_idx").on(
            table.isActive
        ),
        pincodeIdx: index("delhivery_settings_pincode_idx").on(
            table.pickupPincode
        ),
    })
);

export type DelhiverySettings = typeof delhiverySettings.$inferSelect;
export type NewDelhiverySettings = typeof delhiverySettings.$inferInsert;

import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ======================================================
// Global SEO Settings
// ======================================================

export const seoSettings = pgTable("seo_settings", {
  id: uuid("id").defaultRandom().primaryKey(),

  siteName: varchar("site_name", { length: 255 }),

  titleTemplate: varchar("title_template", { length: 255 }),

  defaultMetaTitle: varchar("default_meta_title", { length: 255 }),

  defaultMetaDescription: text("default_meta_description"),

  defaultKeywords: text("default_keywords"),

  defaultOgImage: text("default_og_image"),

  twitterHandle: varchar("twitter_handle", { length: 100 }),

  googleVerification: varchar("google_verification", { length: 255 }),

  bingVerification: varchar("bing_verification", { length: 255 }),

  defaultRobots: varchar("default_robots", { length: 100 })
    .default("index, follow")
    .notNull(),

  canonicalDomain: varchar("canonical_domain", { length: 255 }),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export type SeoSettings = typeof seoSettings.$inferSelect;
export type NewSeoSettings = typeof seoSettings.$inferInsert;

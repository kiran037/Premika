import { z } from "zod";

// ======================================================
// Global SEO Validation Schema
// ======================================================

export const globalSeoSchema = z.object({
  siteName: z.string().max(255).optional().or(z.literal("")),
  titleTemplate: z.string().max(255).optional().or(z.literal("")),
  defaultMetaTitle: z.string().max(255).optional().or(z.literal("")),
  defaultMetaDescription: z.string().optional().or(z.literal("")),
  defaultKeywords: z.string().optional().or(z.literal("")),
  defaultOgImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  twitterHandle: z.string().max(100).optional().or(z.literal("")),
  googleVerification: z.string().max(255).optional().or(z.literal("")),
  bingVerification: z.string().max(255).optional().or(z.literal("")),
  defaultRobots: z.string().max(100).default("index, follow"),
  canonicalDomain: z.string().max(255).optional().or(z.literal("")),
});

export type GlobalSeoInput = z.infer<typeof globalSeoSchema>;

// ======================================================
// Product SEO Validation Schema
// ======================================================

export const productSeoSchema = z.object({
  metaTitle: z.string().max(255).optional().or(z.literal("")),
  metaDescription: z.string().optional().or(z.literal("")),
  keywords: z.string().optional().or(z.literal("")),
  canonicalUrl: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
  noIndex: z.boolean().default(false),
});

export type ProductSeoInput = z.infer<typeof productSeoSchema>;

// ======================================================
// Category SEO Validation Schema
// ======================================================

export const categorySeoSchema = z.object({
  metaTitle: z.string().max(255).optional().or(z.literal("")),
  metaDescription: z.string().optional().or(z.literal("")),
  keywords: z.string().optional().or(z.literal("")),
  canonicalUrl: z.string().optional().or(z.literal("")),
  ogImage: z.string().optional().or(z.literal("")),
  noIndex: z.boolean().default(false),
});

export type CategorySeoInput = z.infer<typeof categorySeoSchema>;

CREATE TABLE "seo_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_name" varchar(255),
	"title_template" varchar(255),
	"default_meta_title" varchar(255),
	"default_meta_description" text,
	"default_keywords" text,
	"default_og_image" text,
	"twitter_handle" varchar(100),
	"google_verification" varchar(255),
	"bing_verification" varchar(255),
	"default_robots" varchar(100) DEFAULT 'index, follow' NOT NULL,
	"canonical_domain" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "keywords" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "og_image" text;--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "no_index" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "meta_title" varchar(255);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "keywords" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "canonical_url" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "og_image" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "no_index" boolean DEFAULT false;
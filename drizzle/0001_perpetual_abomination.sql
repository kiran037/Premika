CREATE TABLE "delhivery_settings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pickup_name" varchar(255) NOT NULL,
	"pickup_phone" varchar(30) NOT NULL,
	"pickup_email" varchar(255) NOT NULL,
	"pickup_address_line1" text NOT NULL,
	"pickup_address_line2" text,
	"pickup_city" varchar(100) NOT NULL,
	"pickup_state" varchar(100) NOT NULL,
	"pickup_pincode" varchar(20) NOT NULL,
	"pickup_country" varchar(100) DEFAULT 'India' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "delhivery_settings_active_idx" ON "delhivery_settings" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "delhivery_settings_pincode_idx" ON "delhivery_settings" USING btree ("pickup_pincode");
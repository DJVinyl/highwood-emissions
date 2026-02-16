CREATE TYPE "public"."site_type" AS ENUM('WELL', 'PROCESSING_PLANT', 'REFINERY');--> statement-breakpoint
CREATE TABLE "commands" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"command_name" varchar(255) NOT NULL,
	"metadata" jsonb,
	"started_at" timestamp NOT NULL,
	"ended_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"site_id" uuid NOT NULL,
	"reading" real NOT NULL,
	"taken_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"site_type" "site_type" NOT NULL,
	"emission_limit" real NOT NULL,
	"total_emissions_to_date" real DEFAULT 0 NOT NULL,
	"coordinates" jsonb NOT NULL,
	"is_compliant" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "site_id_idx" ON "measurements" USING btree ("site_id");
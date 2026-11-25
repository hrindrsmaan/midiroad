CREATE TABLE "rate_limit" (
	"key" text PRIMARY KEY NOT NULL,
	"count" integer NOT NULL,
	"reset_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shared_beat" (
	"id" text PRIMARY KEY NOT NULL,
	"parent_id" text,
	"data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriber" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"source" text NOT NULL,
	"last_source" text NOT NULL,
	"ref" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"landing_path" text,
	"signups" integer DEFAULT 1 NOT NULL,
	"downloads" integer DEFAULT 0 NOT NULL,
	"last_download_at" timestamp,
	"unsubscribed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriber_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "shared_beat" ADD CONSTRAINT "shared_beat_parent_id_shared_beat_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."shared_beat"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "shared_beat_parent_id_idx" ON "shared_beat" USING btree ("parent_id");
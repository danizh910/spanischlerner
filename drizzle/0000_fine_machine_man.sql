CREATE TABLE "pattern_progress" (
	"device_key" text NOT NULL,
	"pattern_id" text NOT NULL,
	"ease" real NOT NULL,
	"interval" integer NOT NULL,
	"due" timestamp with time zone NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pattern_progress_device_key_pattern_id_pk" PRIMARY KEY("device_key","pattern_id")
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"device_key" text NOT NULL,
	"word_id" text NOT NULL,
	"ease" real NOT NULL,
	"interval" integer NOT NULL,
	"due" timestamp with time zone NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "progress_device_key_word_id_pk" PRIMARY KEY("device_key","word_id")
);

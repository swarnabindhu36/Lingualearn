CREATE TYPE "public"."user_role" AS ENUM('STUDENT', 'ADMIN', 'RESEARCHER');--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128),
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"icon" varchar(64) DEFAULT 'Award' NOT NULL,
	"criteria" varchar(255) DEFAULT '',
	"unlocked_status" boolean DEFAULT false NOT NULL,
	"unlocked_date" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"action" varchar(255) NOT NULL,
	"details" text,
	"ip_address" varchar(128) DEFAULT '127.0.0.1',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"title" varchar(255) NOT NULL,
	"source_language" varchar(64) DEFAULT 'English' NOT NULL,
	"target_language" varchar(64) DEFAULT 'Telugu' NOT NULL,
	"subject" varchar(128) DEFAULT 'Operating Systems' NOT NULL,
	"difficulty" varchar(32) DEFAULT 'INTERMEDIATE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_cases" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"subject" varchar(128) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"source_language" varchar(64) DEFAULT 'English' NOT NULL,
	"target_language" varchar(64) NOT NULL,
	"question" text NOT NULL,
	"reference_answer" text NOT NULL,
	"direct_translation" text NOT NULL,
	"context_aware_response" text NOT NULL,
	"expected_terms" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evaluation_reviews" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"case_id" varchar(128) NOT NULL,
	"evaluator_id" varchar(128) NOT NULL,
	"evaluator_name" varchar(255) NOT NULL,
	"method" varchar(64) DEFAULT 'COMPARISON' NOT NULL,
	"direct_semantic_score" integer NOT NULL,
	"direct_technical_score" integer NOT NULL,
	"direct_terminology_score" integer NOT NULL,
	"direct_fluency_score" integer NOT NULL,
	"direct_quality_score" integer NOT NULL,
	"context_semantic_score" integer NOT NULL,
	"context_technical_score" integer NOT NULL,
	"context_terminology_score" integer NOT NULL,
	"context_fluency_score" integer NOT NULL,
	"context_quality_score" integer NOT NULL,
	"flags" jsonb,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "few_shot_examples" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"source_language" varchar(64) DEFAULT 'English' NOT NULL,
	"target_language" varchar(64) NOT NULL,
	"subject" varchar(128) NOT NULL,
	"difficulty" varchar(32) DEFAULT 'INTERMEDIATE' NOT NULL,
	"question" text NOT NULL,
	"expected_style" text NOT NULL,
	"terminology_guidance" text NOT NULL,
	"response_snippet" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"conversation_id" varchar(128) NOT NULL,
	"role" varchar(32) NOT NULL,
	"content" text NOT NULL,
	"structured_response" jsonb,
	"source_language" varchar(64) DEFAULT 'English' NOT NULL,
	"target_language" varchar(64) DEFAULT 'Telugu' NOT NULL,
	"subject" varchar(128) DEFAULT 'Operating Systems' NOT NULL,
	"difficulty" varchar(32) DEFAULT 'INTERMEDIATE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "progress" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"subject" varchar(128) NOT NULL,
	"questions_asked" integer DEFAULT 0 NOT NULL,
	"quizzes_completed" integer DEFAULT 0 NOT NULL,
	"correct_answers" integer DEFAULT 0 NOT NULL,
	"total_answers" integer DEFAULT 0 NOT NULL,
	"mastery" integer DEFAULT 0 NOT NULL,
	"last_activity" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quiz_attempts" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"quiz_id" varchar(128) NOT NULL,
	"topic" varchar(255) DEFAULT '',
	"subject" varchar(128) DEFAULT '',
	"language" varchar(64) DEFAULT '',
	"score" integer NOT NULL,
	"total_questions" integer NOT NULL,
	"percentage" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"weak_topics" jsonb,
	"completion_status" varchar(64) DEFAULT 'COMPLETED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "quizzes" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"user_id" varchar(128) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"subject" varchar(128) NOT NULL,
	"language" varchar(64) NOT NULL,
	"difficulty" varchar(32) NOT NULL,
	"question_count" integer NOT NULL,
	"type" varchar(32) DEFAULT 'MCQ' NOT NULL,
	"questions" jsonb NOT NULL,
	"score" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "terminology" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"english_term" varchar(255) NOT NULL,
	"language" varchar(64) NOT NULL,
	"preferred_translation" varchar(255) NOT NULL,
	"alternative_translations" jsonb,
	"do_not_translate" boolean DEFAULT true NOT NULL,
	"subject" varchar(128) NOT NULL,
	"explanation" text NOT NULL,
	"explanation_en" text,
	"technical_meaning" text,
	"technical_meaning_en" text,
	"technical_example" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_learning_progress" (
	"user_id" varchar(128) PRIMARY KEY NOT NULL,
	"questions_asked" integer DEFAULT 0 NOT NULL,
	"topics_learned" jsonb NOT NULL,
	"languages_used" jsonb NOT NULL,
	"current_streak_days" integer DEFAULT 1 NOT NULL,
	"last_active_date" varchar(32) NOT NULL,
	"achievements" jsonb NOT NULL,
	"total_quizzes_taken" integer DEFAULT 0 NOT NULL,
	"average_quiz_score" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" varchar(128) PRIMARY KEY NOT NULL,
	"bio" text,
	"current_college" varchar(255),
	"year_of_study" varchar(64),
	"specialization" varchar(255),
	"preferred_difficulty" varchar(32) DEFAULT 'INTERMEDIATE',
	"interests" jsonb,
	"notification_preferences" jsonb,
	"student_id" varchar(128),
	"department" varchar(255),
	"degree" varchar(128),
	"semester" varchar(64),
	"cgpa_target" varchar(64),
	"career_goal" varchar(255),
	"preferred_languages_coding" jsonb,
	"daily_study_goal_minutes" integer DEFAULT 30,
	"github_username" varchar(128),
	"linkedin_url" varchar(255),
	"portfolio_url" varchar(255),
	"state_or_region" varchar(128),
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(128) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'STUDENT' NOT NULL,
	"preferred_language" varchar(64) DEFAULT 'Telugu' NOT NULL,
	"preferred_difficulty" varchar(32) DEFAULT 'INTERMEDIATE' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "achievements" ADD CONSTRAINT "achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluation_reviews" ADD CONSTRAINT "evaluation_reviews_case_id_evaluation_cases_id_fk" FOREIGN KEY ("case_id") REFERENCES "public"."evaluation_cases"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "progress" ADD CONSTRAINT "progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_quizzes_id_fk" FOREIGN KEY ("quiz_id") REFERENCES "public"."quizzes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_learning_progress" ADD CONSTRAINT "user_learning_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "achievements_user_idx" ON "achievements" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "conversations_user_idx" ON "conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "eval_cases_subj_lang_idx" ON "evaluation_cases" USING btree ("subject","target_language");--> statement-breakpoint
CREATE INDEX "eval_reviews_case_idx" ON "evaluation_reviews" USING btree ("case_id");--> statement-breakpoint
CREATE INDEX "messages_conv_idx" ON "messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "progress_user_idx" ON "progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_user_idx" ON "quiz_attempts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "quiz_attempts_quiz_idx" ON "quiz_attempts" USING btree ("quiz_id");--> statement-breakpoint
CREATE INDEX "quizzes_user_idx" ON "quizzes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "terminology_subj_lang_idx" ON "terminology" USING btree ("subject","language");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");
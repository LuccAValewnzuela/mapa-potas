DROP INDEX "events_user_id_occurred_at_idx";--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "only_one_pota" UNIQUE("user_id","occurred_at");
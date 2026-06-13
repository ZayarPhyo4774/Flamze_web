-- Migration: add rating column to MenuItem
-- Non-destructive: adds column with default 0
ALTER TABLE "MenuItem" ADD COLUMN IF NOT EXISTS "rating" integer NOT NULL DEFAULT 0;

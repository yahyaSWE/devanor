-- Add an "active" flag to tutorials so admins can hide a video from customers
-- without deleting it.
ALTER TABLE "Tutorial" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

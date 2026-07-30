-- Plain-text initial login password, so it can be included in a welcome email.
-- Cleared once the user sets their own password.
ALTER TABLE "User" ADD COLUMN "tempPassword" TEXT;

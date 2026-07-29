-- Admin-only renewal reminder on licenses (e.g. for perpetual ones), a marker
-- so the reminder email is sent only once, and an optional employee phone.
ALTER TABLE "License" ADD COLUMN "reminderAt" TIMESTAMP(3);
ALTER TABLE "License" ADD COLUMN "reminderSentAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "phone" TEXT;

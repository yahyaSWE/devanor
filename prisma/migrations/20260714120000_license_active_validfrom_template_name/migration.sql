-- Licenses can be deactivated (hidden from the portal) and carry a validity
-- start date. Email templates get a display name so several can coexist.
ALTER TABLE "License" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "License" ADD COLUMN "validFrom" TIMESTAMP(3);

ALTER TABLE "EmailTemplate" ADD COLUMN "name" TEXT NOT NULL DEFAULT 'Welcome';

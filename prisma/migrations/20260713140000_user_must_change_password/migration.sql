-- Force newly created accounts to change their password on first login.
-- Existing accounts are exempted (set to false); the column defaults to true so
-- every future prisma.user.create gets it automatically.
ALTER TABLE "User" ADD COLUMN "mustChangePassword" BOOLEAN NOT NULL DEFAULT true;
UPDATE "User" SET "mustChangePassword" = false;

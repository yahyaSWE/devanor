-- Track which downloads/tutorials/licenses each customer has already seen, plus
-- an updatedAt on those tables so edits re-flag an item as "new".

-- updatedAt columns (backfill existing rows from createdAt, then require).
ALTER TABLE "Download" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "Download" SET "updatedAt" = "createdAt";
ALTER TABLE "Download" ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "Tutorial" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "Tutorial" SET "updatedAt" = "createdAt";
ALTER TABLE "Tutorial" ALTER COLUMN "updatedAt" SET NOT NULL;

ALTER TABLE "License" ADD COLUMN "updatedAt" TIMESTAMP(3);
UPDATE "License" SET "updatedAt" = "createdAt";
ALTER TABLE "License" ALTER COLUMN "updatedAt" SET NOT NULL;

-- Per-user "seen" records.
CREATE TYPE "ItemType" AS ENUM ('DOWNLOAD', 'TUTORIAL', 'LICENSE');

CREATE TABLE "ItemView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" "ItemType" NOT NULL,
    "itemId" TEXT NOT NULL,
    "seenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemView_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ItemView_userId_itemType_itemId_key" ON "ItemView"("userId", "itemType", "itemId");
CREATE INDEX "ItemView_userId_itemType_idx" ON "ItemView"("userId", "itemType");

ALTER TABLE "ItemView" ADD CONSTRAINT "ItemView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable: add optional job title / role to users (shown to support)
ALTER TABLE "User" ADD COLUMN "title" TEXT;

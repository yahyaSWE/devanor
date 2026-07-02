/*
  Warnings:

  - You are about to drop the column `module` on the `License` table. All the data in the column will be lost.
  - You are about to drop the column `moduleId` on the `License` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `License` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `LicenseModule` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ContractType" AS ENUM ('PERPETUAL', 'SUBSCRIPTION', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "LockType" AS ENUM ('SUPER_FLOATING', 'NODE_LOCKED');

-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_moduleId_fkey";

-- AlterTable
ALTER TABLE "License" DROP COLUMN "module",
DROP COLUMN "moduleId",
DROP COLUMN "type",
ADD COLUMN     "contractType" "ContractType" NOT NULL DEFAULT 'PERPETUAL',
ADD COLUMN     "keyFileName" TEXT,
ADD COLUMN     "keyMimeType" TEXT,
ADD COLUMN     "keySize" INTEGER,
ADD COLUMN     "keyStoredName" TEXT,
ADD COLUMN     "lockType" "LockType",
ADD COLUMN     "macIds" TEXT[],
ADD COLUMN     "permanent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "version" TEXT;

-- AlterTable
ALTER TABLE "LicenseModule" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "welcomeEmailSentAt" TIMESTAMP(3);

-- DropEnum
DROP TYPE "LicenseType";

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LicenseToLicenseModule" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LicenseToLicenseModule_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_key_key" ON "EmailTemplate"("key");

-- CreateIndex
CREATE INDEX "_LicenseToLicenseModule_B_index" ON "_LicenseToLicenseModule"("B");

-- AddForeignKey
ALTER TABLE "_LicenseToLicenseModule" ADD CONSTRAINT "_LicenseToLicenseModule_A_fkey" FOREIGN KEY ("A") REFERENCES "License"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LicenseToLicenseModule" ADD CONSTRAINT "_LicenseToLicenseModule_B_fkey" FOREIGN KEY ("B") REFERENCES "LicenseModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

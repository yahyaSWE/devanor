-- User: per-person deactivation + ZGS portal credentials
ALTER TABLE "User" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN "zgsUsername" TEXT;
ALTER TABLE "User" ADD COLUMN "zgsTempPassword" TEXT;

-- Client: address
ALTER TABLE "Client" ADD COLUMN "address" TEXT;

-- LicenseModule catalog (created once, not tied to a company)
CREATE TABLE "LicenseModule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LicenseType" NOT NULL DEFAULT 'LICENSE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LicenseModule_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "LicenseModule_name_key" ON "LicenseModule"("name");

-- License: optional link to a catalog module
ALTER TABLE "License" ADD COLUMN "moduleId" TEXT;
ALTER TABLE "License" ADD CONSTRAINT "License_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "LicenseModule"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- PasswordResetToken (hashed, one-time)
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

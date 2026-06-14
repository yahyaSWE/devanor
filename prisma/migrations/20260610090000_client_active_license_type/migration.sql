-- Client active flag (companies can be deactivated)
ALTER TABLE "Client" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

-- License type: ordinary license vs maintenance entry
CREATE TYPE "LicenseType" AS ENUM ('LICENSE', 'MAINTENANCE');
ALTER TABLE "License" ADD COLUMN "type" "LicenseType" NOT NULL DEFAULT 'LICENSE';

-- Let admins hide a document from customers without deleting it.
ALTER TABLE "Download" ADD COLUMN "active" BOOLEAN NOT NULL DEFAULT true;

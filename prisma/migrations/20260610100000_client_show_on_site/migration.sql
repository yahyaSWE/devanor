-- Toggle whether a company appears in the public "Our Clients" section
ALTER TABLE "Client" ADD COLUMN "showOnSite" BOOLEAN NOT NULL DEFAULT true;

-- Downloads and tutorials can now target several companies and/or specific
-- employees (union). No rows in either table = visible to all customers.

CREATE TABLE "_DownloadClients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DownloadClients_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX "_DownloadClients_B_index" ON "_DownloadClients"("B");
ALTER TABLE "_DownloadClients" ADD CONSTRAINT "_DownloadClients_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DownloadClients" ADD CONSTRAINT "_DownloadClients_B_fkey" FOREIGN KEY ("B") REFERENCES "Download"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_DownloadUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_DownloadUsers_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX "_DownloadUsers_B_index" ON "_DownloadUsers"("B");
ALTER TABLE "_DownloadUsers" ADD CONSTRAINT "_DownloadUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Download"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_DownloadUsers" ADD CONSTRAINT "_DownloadUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_TutorialClients" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TutorialClients_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX "_TutorialClients_B_index" ON "_TutorialClients"("B");
ALTER TABLE "_TutorialClients" ADD CONSTRAINT "_TutorialClients_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_TutorialClients" ADD CONSTRAINT "_TutorialClients_B_fkey" FOREIGN KEY ("B") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "_TutorialUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TutorialUsers_AB_pkey" PRIMARY KEY ("A","B")
);
CREATE INDEX "_TutorialUsers_B_index" ON "_TutorialUsers"("B");
ALTER TABLE "_TutorialUsers" ADD CONSTRAINT "_TutorialUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Tutorial"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "_TutorialUsers" ADD CONSTRAINT "_TutorialUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Carry the existing single-company targeting over to the new tables.
INSERT INTO "_DownloadClients" ("A","B")
SELECT "clientId", "id" FROM "Download" WHERE "clientId" IS NOT NULL;

INSERT INTO "_TutorialClients" ("A","B")
SELECT "clientId", "id" FROM "Tutorial" WHERE "clientId" IS NOT NULL;

ALTER TABLE "Download" DROP CONSTRAINT IF EXISTS "Download_clientId_fkey";
ALTER TABLE "Download" DROP COLUMN "clientId";

ALTER TABLE "Tutorial" DROP CONSTRAINT IF EXISTS "Tutorial_clientId_fkey";
ALTER TABLE "Tutorial" DROP COLUMN "clientId";

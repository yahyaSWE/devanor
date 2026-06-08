import { PrismaClient } from "@prisma/client";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  // Write a private download file
  const dir = path.join(process.cwd(), "storage", "uploads");
  await mkdir(dir, { recursive: true });
  const storedName = "test-license.txt";
  const content = "DEVANOR TEST LICENSE FILE\nseat=5\n";
  await writeFile(path.join(dir, storedName), content);

  await prisma.download.create({
    data: {
      title: "E3.Series License File (test)",
      description: "Your activation license for E3.Series.",
      category: "License",
      fileName: "e3-license.txt",
      storedName,
      mimeType: "text/plain",
      size: Buffer.byteLength(content),
      clientId: null,
    },
  });

  await prisma.tutorial.create({
    data: {
      title: "Portal-only: Advanced Automation",
      description: "Gated walkthrough for signed-in customers.",
      level: "Advanced",
      url: "https://example.com/advanced-automation",
      clientId: null,
    },
  });

  const client = await prisma.client.findFirst();
  if (client) {
    await prisma.license.create({
      data: {
        clientId: client.id,
        module: "E3.Schematic + E3.Cable",
        seats: 5,
        status: "ACTIVE",
        expiresAt: new Date("2027-01-01"),
      },
    });
    console.log("Seeded license for client:", client.name);
  }

  console.log("Test data seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

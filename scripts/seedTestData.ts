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
      // No companies/employees selected = visible to all customers.
    },
  });

  await prisma.tutorial.create({
    data: {
      title: "Portal-only: Advanced Automation",
      description: "Gated walkthrough for signed-in customers.",
      level: "Advanced",
      url: "https://example.com/advanced-automation",
      // No companies/employees selected = visible to all customers.
    },
  });

  const client = await prisma.client.findFirst();
  if (client) {
    await prisma.license.create({
      data: {
        clientId: client.id,
        contractType: "PERPETUAL",
        lockType: "NODE_LOCKED",
        version: "2026",
        macIds: ["00:11:22:33:44:55"],
        seats: 5,
        status: "ACTIVE",
        permanent: false,
        expiresAt: new Date("2027-01-01"),
        modules: {
          connectOrCreate: [
            { where: { name: "E3.Schematic" }, create: { name: "E3.Schematic" } },
            { where: { name: "E3.Cable" }, create: { name: "E3.Cable" } },
          ],
        },
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

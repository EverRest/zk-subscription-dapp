import { getAllSubscriptionSchemas } from "../services/metadata/metadataService";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  try {
    const dataPath = path.join(__dirname, "seed-data.json");
    const rawData = await fs.readFile(dataPath, "utf-8");
    const seedData = JSON.parse(rawData);
    const subscriptions = getAllSubscriptionSchemas();

    console.log("Subscriptions seeded:", subscriptions);

    const categories = await prisma.category.createMany({
      data: seedData.categories,
    });

    console.log("Categories seeded:", categories);
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

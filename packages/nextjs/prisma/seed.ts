import { getAllSubscriptionSchemas } from "../services/metadata/metadataService";
import { PrismaClient } from "@prisma/client";
import * as fs from "fs/promises";
import * as path from "path";

const prisma = new PrismaClient();

async function seedCategories() {
  const dataPath = path.join(__dirname, "seed-data.json");
  const rawData = await fs.readFile(dataPath, "utf-8");
  const seedData = JSON.parse(rawData);
  console.log(seedData);
  console.log("🌱 Seeding Categories...");
  for (const category of seedData.categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: category,
      create: category,
    });
  }

  console.log("✅ Categories seeded successfully!");
}

async function seedSubscriptions() {
  const subscriptions = getAllSubscriptionSchemas();
  console.log("🌱 Seeding Subscriptions...");
  for (const subscription of subscriptions) {
    await prisma.subscription.upsert({
      where: { id: subscription.id, code: subscription.code },
      update: {
        id: subscription.id,
        code: subscription.code,
        name: subscription.name,
      },
      create: {
        id: subscription.id,
        code: subscription.code,
        name: subscription.name,
      },
    });
  }

  console.log("✅ Subscriptions seeded successfully!");
}

async function main() {
  await seedCategories();
  await seedSubscriptions();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

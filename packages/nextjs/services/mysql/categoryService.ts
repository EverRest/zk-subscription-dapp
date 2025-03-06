import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllCategories = () => {
  return prisma.category.findMany();
};

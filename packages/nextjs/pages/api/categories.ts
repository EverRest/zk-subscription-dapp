import { NextApiRequest, NextApiResponse } from "next";
import { getAllCategories } from "~~/services/mysql/categoryService";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const categories = await getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
    });
  }
}

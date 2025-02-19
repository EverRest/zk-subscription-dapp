import { NextApiRequest, NextApiResponse } from "next";
import { getAllSchemas } from "~~/services/metadata/metadataService";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const schemas = getAllSchemas();
    res.status(200).json(schemas);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : null,
    });
  }
}

import * as fs from "fs";
import path from "path";

const metadataDir = path.join(process.cwd(), "..", "..", "storage", "metadata");

export const getAllSchemas = () => {
  const files = fs.readdirSync(metadataDir);
  return files
    .filter(file => file.endsWith(".json"))
    .map(file => {
      const filePath = path.join(metadataDir, file);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      console.log(fileContent);
      return JSON.parse(fileContent);
    });
};

export const getSchemaByName = (name: string) => {
  const schemas = getAllSchemas();
  return schemas.find(schema => schema.name === name);
};

export const getSchemaByCode = (code: string) => {
  const schemas = getAllSchemas();
  return schemas.find(schema => schema.code === code);
};

export const getAllSubscriptionSchemas = () => {
  const schemas = getAllSchemas();
  return schemas.filter(schema => schema.tier);
};

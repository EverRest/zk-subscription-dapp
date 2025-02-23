import dotenv from "dotenv";
import path from "path";

dotenv.config();

const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
};

export const config = {
  pinataApiKey: getEnvVar("PINATA_API_KEY"),
  pinataSecretApiKey: getEnvVar("PINATA_SECRET_API_KEY"),
  pinataDomain: getEnvVar("PINATA_DOMAIN"),
  pinataImagePathPattern: `https://${process.env.PINATA_DOMAIN}/ipfs/`,
  imageExtensions: ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp"],
  metadataDir: path.join(__dirname, "../../../storage/metadata"),
  emailHost: getEnvVar("EMAIL_HOST"),
  emailPort: parseInt(getEnvVar("EMAIL_PORT")),
  emailUser: getEnvVar("EMAIL_USER"),
  emailPass: getEnvVar("EMAIL_PASS"),
  emailRecipient: getEnvVar("EMAIL_RECIPIENT"),
};

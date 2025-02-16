import dotenv from "dotenv";

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
};

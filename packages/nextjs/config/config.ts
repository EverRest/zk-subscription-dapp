import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const config = {
  pinata: {
    apiKey: process.env.PINATA_API_KEY,
    secretApiKey: process.env.PINATA_SECRET_API_KEY,
    domain: process.env.PINATA_DOMAIN,
    imagePathPattern: `https://${process.env.PINATA_DOMAIN}/ipfs/`,
  },
  file: {
    extensions: ["png", "jpg", "jpeg", "gif", "bmp", "tiff", "webp"],
    metadataDir: path.join(__dirname, "../../../storage/metadata"),
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    recipient: process.env.EMAIL_RECIPIENT,
  },
  socials: {
    tiktok: process.env.TIKTOK_ACCOUNT,
    facebook: process.env.FACEBOOK_ACCOUNT,
    instagram: process.env.INSTAGRAM_ACCOUNT,
    twitter: process.env.TWITTER_ACCOUNT,
    linkedin: process.env.LINKEDIN_ACCOUNT,
    telegram: process.env.TELEGRAM_ACCOUNT,
    discord: process.env.DISCORD_ACCOUNT,
  },
};

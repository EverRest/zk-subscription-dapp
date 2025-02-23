require('dotenv').config({path: './packages/nextjs/.env'});
const path = require('path');

module.exports = {
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
    pinataImagePathPattern: `https://${process.env.PINATA_DOMAIN}/ipfs/`,
    imageExtensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'],
    metadataDir: path.join(__dirname, "./../storage/metadata"),
    imgDir: path.join(__dirname, "./../storage/img"),
};
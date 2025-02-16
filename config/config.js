require('dotenv').config();
const path = require('path');

module.exports = {
    pinataApiKey: process.env.PINATA_API_KEY,
    pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY,
    imageExtensions: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'],
    metadataDir: path.join(__dirname, "./../storage/metadata"),
    imgDir: path.join(__dirname, "./../storage/img")
};
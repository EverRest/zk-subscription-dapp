const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const { flattenMetadata } = require('../utils/utils');
const { pinataApiKey, pinataSecretApiKey } = require('../config/config');
const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey);

const uploadFileToPinata = async (filePath, fileName, metadata) => {
    const readableStreamForFile = fs.createReadStream(filePath);
    const options = {
        pinataMetadata: {
            name: fileName,
            keyvalues: flattenMetadata(metadata)
        }
    };
    try {
        const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
        console.log(`File uploaded: ${filePath}`);
        console.log(`IPFS Hash: ${result.IpfsHash}`);
        return result.IpfsHash;
    } catch (error) {
        console.error(`Error uploading file: ${filePath}`, error);
        throw error;
    }
};

const updateMetadataOnPinata = async (ipfsHash, metadata) => {
    const options = {
        pinataMetadata: {
            keyvalues: flattenMetadata(metadata)
        }
    };
    try {
        await pinata.hashMetadata(ipfsHash, options);
        console.log(`IPFS hash: ${ipfsHash}`);
    } catch (error) {
        console.error(`Error updating metadata for IPFS hash: ${ipfsHash}`, error);
        throw error;
    }
};

const checkFileOnPinata = async (filters) => {
    try {
        return await pinata.pinList(filters);
    } catch (error) {
        console.error(`Error checking file on Pinata:`, error);
        throw error;
    }
};

module.exports = {
    uploadFileToPinata,
    updateMetadataOnPinata,
    checkFileOnPinata
};
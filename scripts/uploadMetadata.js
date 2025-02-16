require('dotenv').config();
const pinataSDK = require("@pinata/sdk");
const fs = require("fs");
const path = require("path");
const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'webp'];

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_SECRET_API_KEY;
const pinata = new pinataSDK(pinataApiKey, pinataSecretApiKey);

const flattenMetadata = (metadata) => {
    const flattened = {};
    for (const key in metadata) {
        if (typeof metadata[key] === 'object' && !Array.isArray(metadata[key])) {
            const nested = flattenMetadata(metadata[key]);
            for (const nestedKey in nested) {
                flattened[`${key}.${nestedKey}`] = nested[nestedKey];
            }
        } else {
            flattened[key] = JSON.stringify(metadata[key]);
        }
    }
    return flattened;
};

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
        console.log(`Metadata updated for IPFS hash: ${ipfsHash}`);
    } catch (error) {
        console.error(`Error updating metadata for IPFS hash: ${ipfsHash}`, error);
        throw error;
    }
};

const processSchemas = async () => {
    const metadataDir = path.join(__dirname, "../storage/metadata");
    const imgDir = path.join(__dirname, "../storage/img");

    const schemaFiles = fs.readdirSync(metadataDir).filter(file => file.endsWith('.json'));

    for (const schemaFile of schemaFiles) {
        const schemaPath = path.join(metadataDir, schemaFile);
        const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
        const imageName = `${schema.code.toLowerCase()}`;

        let imagePath;
        for (const ext of imageExtensions) {
            const potentialPath = path.join(imgDir, `${imageName}.${ext}`);
            if (fs.existsSync(potentialPath)) {
                imagePath = potentialPath;
                break;
            }
        }

        if (!imagePath) {
            console.error(`Image not found for schema: ${schemaFile}`);
            continue;
        }

        try {
            const filters = {
                status: 'pinned',
                metadata: {
                    name: `${imageName}.${path.extname(imagePath).slice(1)}`
                }
            };
            const result = await pinata.pinList(filters);
            if (result.rows.length > 0) {
                console.log(`File already exists on Pinata: ${result.rows[0].ipfs_pin_hash}`);
                const existingMetadata = result.rows[0].metadata.keyvalues;
                const newMetadata = flattenMetadata(schema);
                if (JSON.stringify(existingMetadata) !== JSON.stringify(newMetadata)) {
                    await updateMetadataOnPinata(result.rows[0].ipfs_pin_hash, schema);
                }
                fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
                console.log(`Schema updated with existing IPFS hash: ${schemaFile}`);
                continue;
            } else {
                console.log(`File does not exist on Pinata, uploading...`);
            }
        } catch (error) {
            console.error(`Error checking file on Pinata:`, error);
        }

        try {
            const fullFileName = `${imageName}.${path.extname(imagePath).slice(1)}`;
            console.log(`Uploading image for schema: ${schemaFile}`, imagePath, imageName);
            const ipfsHash = await uploadFileToPinata(imagePath, fullFileName, schema);
            fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
            console.log(`Schema updated: ${schemaFile}`);
        } catch (error) {
            console.error(`Failed to upload image for schema: ${schemaFile}`, error);
        }
    }
};

processSchemas().catch((error) => {
    console.error("Error processing schemas", error);
});
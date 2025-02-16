const fs = require("fs");
const path = require("path");
const { metadataDir, imgDir, imageExtensions } = require('../config/config');
const { uploadFileToPinata, updateMetadataOnPinata, checkFileOnPinata } = require('../services/pinataService');
const { flattenMetadata, findImagePath } = require('../utils/utils');

const processSchemas = async () => {
    const schemaFiles = fs.readdirSync(metadataDir).filter(file => file.endsWith('.json'));

    for (const schemaFile of schemaFiles) {
        const schemaPath = path.join(metadataDir, schemaFile);
        const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
        const imageName = `${schema.code.toLowerCase()}`;

        const imagePath = findImagePath(imgDir, imageName, imageExtensions);
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
            const result = await checkFileOnPinata(filters);
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
            schema.image = `https://ipfs.io/ipfs/${ipfsHash}`;
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
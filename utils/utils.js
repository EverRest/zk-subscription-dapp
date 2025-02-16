const fs = require("fs");
const path = require("path");

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

const findImagePath = (imgDir, imageName, imageExtensions) => {
    for (const ext of imageExtensions) {
        const potentialPath = path.join(imgDir, `${imageName}.${ext}`);
        if (fs.existsSync(potentialPath)) {
            return potentialPath;
        }
    }
    return null;
};

module.exports = {
    flattenMetadata,
    findImagePath
};
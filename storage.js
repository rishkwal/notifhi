const { SpheronClient } = require("@spheron/storage");
const { ProtocolEnum } = require("@spheron/storage");
require('dotenv').config()
const token = process.env.SPH_TOKEN;
const client = new SpheronClient({ token });
const uploadToSpheron = async (filePath) => {
    const res =
        await client.upload(filePath, {
            protocol: ProtocolEnum.IPFS,
            name: "ImageUpload",
            onUploadInitiated: (uploadId) => {
                console.log(`Upload with id ${uploadId} started...`);
            },
            onChunkUploaded: (uploadedSize, totalSize) => {
                currentlyUploaded += uploadedSize;
                console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
            },
        });
 
    console.log(res);
}

module.exports = {
    uploadToSpheron
};
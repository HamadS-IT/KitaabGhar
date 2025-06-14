const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const fs = require("fs");
require("dotenv").config();

// Initialize Cloudflare R2 S3 client
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT, // Cloudflare R2 URL
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
  tls: { minVersion: "TLSv1.2" }, // Force TLS 1.2
});

const generateUniqueFilename = (originalName) => {
  const timestamp = Date.now(); // Add current time
  const randomString = crypto.randomUUID(); // Unique ID
  const extension = originalName.split(".").pop(); // Get file extension
  return `${timestamp}-${randomString}.${extension}`;
};

// Function to upload files to Cloudflare R2
const uploadToR2 = async (filePath, folder, fileName, contentType) => {
  try {
    const fileStream = fs.createReadStream(filePath);

    let destination = generateUniqueFilename(fileName)

    const uploadParams = {
      Bucket: process.env.R2_BUCKET_NAME,
      Key: `${folder}/${destination}`,
      Body: fileStream,
      ContentType: contentType,
      ACL: "public-read",
    };

    await s3.send(new PutObjectCommand(uploadParams));
    return `${process.env.R2_ENDPOINT_V2}/${folder}/${destination}`;
  } catch (error) {
    console.error("Cloudflare R2 Upload Error:", error);
    throw error;
  }
};

module.exports = { uploadToR2 };

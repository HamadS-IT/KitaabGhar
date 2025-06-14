const { google } = require('googleapis');
const fs = require('fs');

// Load the service account key
const KEYFILEPATH = './src/config/epageify-ebfde84cce08.json';
const SCOPES = ['https://www.googleapis.com/auth/drive.file'];

const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
});

const drive = google.drive({ version: 'v3', auth });

/**
 * Uploads a file to Google Drive.
 * @param {string} filePath - The local path of the file to upload.
 * @param {string} fileName - The name to give the file on Google Drive.
 * @returns {Promise<string>} - The public URL of the uploaded file.
 */
async function uploadFile(filePath, fileName) {
    try {
        const fileMetadata = { name: fileName };
        const media = {
            mimeType: 'application/pdf',
            body: fs.createReadStream(filePath),
        };

        const response = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id',
        });

        const fileId = response.data.id;

        // Make the file public
        await drive.permissions.create({
            fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone',
            },
        });

        // Generate a public URL
        const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
        console.log(`File uploaded successfully. File URL: ${fileUrl}`);
        return fileUrl;
    } catch (error) {
        console.error('Error uploading file to Google Drive:', error.message);
        throw error;
    }
}

async function deleteFile(fileURL) {
    try{
        // Delete file from Google Drive
        const drive = google.drive({ version: 'v3', auth });

        await drive.files.delete({ fileId: fileURL });
        console.log('File deleted from Google Drive');
    
    }catch (error) {
        console.error('Error while deleting file from Google Drive:', error.message);
        throw error;
    }
}

module.exports = { uploadFile,deleteFile };

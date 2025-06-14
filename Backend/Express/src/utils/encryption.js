const crypto = require('crypto');
const fs = require('fs');
const axios = require('axios');
const { promisify } = require('util');
const stream = require('stream');

const pipeline = promisify(stream.pipeline);


const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Must be 32 characters (256 bits)
const IV_LENGTH = 16; // AES uses a 16-byte initialization vector

// Encrypt a file
// const encryptFile = (filePath, outputPath) => {
//     const iv = crypto.randomBytes(IV_LENGTH);
//     const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

//     const input = fs.createReadStream(filePath);
//     const output = fs.createWriteStream(outputPath);

//     output.write(iv);

//     input.pipe(cipher).pipe(output);
// };

const encryptFile = async (filePath, outputPath, KEY) => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(KEY), iv);
    
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(outputPath);
    
    output.write(iv);

    return new Promise((resolve, reject) => {
        input.pipe(cipher).pipe(output);
        
        output.on('finish', resolve);
        output.on('error', reject);
        input.on('error', reject);
    });
};


// Decrypt a file
const downloadFile = async (url, outputPath) => {
    try {
        //const fileId = url.split('id=')[1]; // Extract file ID from URL
        const directDownloadUrl = url;
        
        const response = await axios({
            url: directDownloadUrl,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0',
            },
        });
        
        const writer = fs.createWriteStream(outputPath);
        await pipeline(response.data, writer);
    
    } catch (error) {
        console.error('Error downloading file:', error);
        throw error;
    }
};

const decryptFile = async (filePathOrUrl, encryptedPath, outputPath) => {
    let localFilePath = encryptedPath;

    console.log(filePathOrUrl);
    
    if (filePathOrUrl.startsWith('http')) {
        await downloadFile(filePathOrUrl, encryptedPath);
    }
    
    return new Promise((resolve, reject) => {
        const input = fs.createReadStream(localFilePath);
        const iv = Buffer.alloc(IV_LENGTH);
        input.read(iv);

        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        const output = fs.createWriteStream(outputPath);
        
        pipeline(input, decipher, output)
            .then(() => {
                console.log('Decryption completed:', outputPath);
                if (filePathOrUrl.startsWith('http')) {
                    fs.unlinkSync(localFilePath); // Cleanup downloaded file
                }
                resolve();
            })
            .catch((error) => {
                console.error('Decryption error:', error);
                reject(error);
            });
    });
};

const decryptWebFile = async (encryptedFilePath, outputPath, KEY) => {
    const input = fs.createReadStream(encryptedFilePath);
    const output = fs.createWriteStream(outputPath);

    // Read the IV from the beginning of the file
    const iv = await new Promise((resolve, reject) => {
        input.once('readable', () => {
            const iv = input.read(IV_LENGTH);
            if (iv) resolve(iv);
            else reject(new Error('Failed to read IV'));
        });
    });

    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(KEY), iv);

    return new Promise((resolve, reject) => {
        input.pipe(decipher).pipe(output);
        
        output.on('finish', resolve);
        output.on('error', reject);
        input.on('error', reject);
    });
};


module.exports = { encryptFile, decryptFile, decryptWebFile };

const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const Book = require('../models/Book');
const User = require('../models/User');
const { encryptFile, decryptFile, decryptWebFile } = require('../utils/encryption');
const { uploadFile, deleteFile } = require('../utils/googleDrive');
const { uploadToR2 } = require("../utils/cloudflare");
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // Global encryption key from .env

// Multer configuration for handling file uploads, including book cover
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = file.fieldname === 'cover' ? 'uploads/covers/' : 'uploads/';
        cb(null, uploadDir); // Separate directory for book covers
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const upload = multer({ storage });


// // Add a Book (Publisher/Admin)
// router.post('/add', [authMiddleware, upload.fields([{ name: 'file' }, { name: 'cover' }])], async (req, res) => {
//     const { title, author, description, price, language, vectorDB } = req.body;
//     const uploadedBy = req.user.id; // Use the authenticated user's ID

//     try {
//         // Ensure only publishers or admins can add books
//         if (req.user.role !== 'publisher' && req.user.role !== 'admin') {
//             return res.status(403).json({ error: 'Only publishers or admins can add books.' });
//         }

//         // Process book file
//         const filePath = req.files.file[0].path;
//         const encryptedPath = path.join(__dirname, `../../temp/${Date.now()}-encrypted.pdf`);

//         const formData = new FormData();
//         formData.append('file', fs.createReadStream(filePath));

       
//         let vector_db_path = '';
//         if (vectorDB === 'Yes'){
//             const fastApiResponse = await axios.post('http://localhost:8000/vectorize', formData, {
//                 headers: { ...formData.getHeaders() }
//             });

//             vector_db_path = fastApiResponse.data.vector_db_path;
//         }
        
        
//         await encryptFile(filePath, encryptedPath, ENCRYPTION_KEY);

//         // Upload encrypted book file to Google Drive
//         const fileUrl = await uploadToR2(encryptedPath, 'books',`${title}.pdf`, "application/pdf");

//         // Process book cover
//         let coverUrl = null;
//         if (req.files.cover && req.files.cover.length > 0) {
//             const coverPath = req.files.cover[0].path;
//             coverUrl = await uploadToR2(coverPath, 'covers', `${title}-cover.jpg`, "image/jpeg");
//         }

        
//         // Save book details in the database
//         const newBook = new Book({
//             title,
//             author,
//             description,
//             price,
//             language,
//             fileUrl,
//             coverUrl, // Save cover URL
//             uploadedBy,
//             vectorDB,
//             vectorDBPath: vector_db_path,
//         });

//         await newBook.save();



//         // Clean up temporary files
//         fs.unlinkSync(filePath);
//         fs.unlinkSync(encryptedPath);

//         if (coverUrl) fs.unlinkSync(req.files.cover[0].path);

//         res.status(201).json({ message: 'Book added successfully.', book: newBook });
//     } catch (error) {
//         console.error('Error in Add Book Endpoint:', error.message);
//         res.status(500).json({ error: 'Failed to add book.', details: error.message });
//     }
// });





// Add a Book (Publisher/Admin)
router.post('/add', [authMiddleware, upload.fields([{ name: 'file' }, { name: 'cover' }])], async (req, res) => {
    const { title, author, description, price, language, vectorDB } = req.body;
    const uploadedBy = req.user.id; // Use the authenticated user's ID

    try {
        // Ensure only publishers or admins can add books
        if (req.user.role !== 'publisher' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Only publishers or admins can add books.' });
        }

        // Process book file
        const filePath = req.files.file[0].path;
        const processedPath = path.join(__dirname, `../../temp/${Date.now()}-processed.pdf`);
        const encryptedPath = path.join(__dirname, `../../temp/${Date.now()}-encrypted.pdf`);

        // First process the PDF
        const processFormData = new FormData();
        processFormData.append('file', fs.createReadStream(filePath));
        
        // Call the process-pdf endpoint
        const processResponse = await axios.post('http://localhost:8000/process-pdf', processFormData, {
            headers: { ...processFormData.getHeaders() },
            responseType: 'stream'
        });

        // Save the processed PDF to a temporary file
        const processedFileWriteStream = fs.createWriteStream(processedPath);
        processResponse.data.pipe(processedFileWriteStream);

        // Wait for the file to finish writing
        await new Promise((resolve, reject) => {
            processedFileWriteStream.on('finish', resolve);
            processedFileWriteStream.on('error', reject);
        });

        // Now encrypt the processed file instead of the original
        await encryptFile(processedPath, encryptedPath, ENCRYPTION_KEY);

        // Upload encrypted book file to Google Drive
        const fileUrl = await uploadToR2(encryptedPath, 'books', `${title}.pdf`, "application/pdf");

        // Process vector DB if needed (using the processed PDF)
        let vector_db_path = '';
        if (vectorDB === 'Yes') {
            const vectorFormData = new FormData();
            vectorFormData.append('file', fs.createReadStream(filePath));
            
            const fastApiResponse = await axios.post('http://localhost:8000/vectorize', vectorFormData, {
                headers: { ...vectorFormData.getHeaders() }
            });
            vector_db_path = fastApiResponse.data.vector_db_path;
        }

        // Process book cover
        let coverUrl = null;
        if (req.files.cover && req.files.cover.length > 0) {
            const coverPath = req.files.cover[0].path;
            coverUrl = await uploadToR2(coverPath, 'covers', `${title}-cover.jpg`, "image/jpeg");
        }

        // Save book details in the database
        const newBook = new Book({
            title,
            author,
            description,
            price,
            language,
            fileUrl,
            coverUrl, // Save cover URL
            uploadedBy,
            vectorDB,
            vectorDBPath: vector_db_path,
        });

        await newBook.save();

        // Clean up temporary files
        fs.unlinkSync(filePath);
        fs.unlinkSync(processedPath);
        fs.unlinkSync(encryptedPath);
        if (coverUrl) fs.unlinkSync(req.files.cover[0].path);

        res.status(201).json({ message: 'Book added successfully.', book: newBook });
    } catch (error) {
        console.error('Error in Add Book Endpoint:', error.message);
        res.status(500).json({ error: 'Failed to add book.', details: error.message });
    }
});




//Fetch All Books
router.get("/getAllBooks", async (req, res) => {
    try {
      const books = await Book.find().select("-fileUrl").select("-vectorDBPath").sort({ createdAt: -1 });
      return res.json({books});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
});

//Fetch Book By ID
router.get("/getBookByID/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const book = await Book.findById(id).select("-fileUrl").select("-vectorDBPath");
      return res.json({book});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
});



const IV_LENGTH = 16; // Length of IV for AES-256-CBC encryption


router.get("/getBookFile/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        // Download the encrypted book from Google Drive
        const response = await axios.get(book.fileUrl, { responseType: 'stream' });

        const encryptedFilePath = path.join(__dirname, `../../temp/${Date.now()}-encrypted.pdf`);
        const decryptedFilePath = path.join(__dirname, `../../temp/${Date.now()}-decrypted.pdf`);

        const writer = fs.createWriteStream(encryptedFilePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        // Decrypt the book
        await decryptWebFile(encryptedFilePath, decryptedFilePath, ENCRYPTION_KEY);

        // Stream the decrypted book to the browser
        res.setHeader('Content-Type', 'application/pdf');
        const fileStream = fs.createReadStream(decryptedFilePath);
        fileStream.pipe(res);

        // Clean up temporary files
        fileStream.on('end', () => {
            fs.unlinkSync(encryptedFilePath);
            fs.unlinkSync(decryptedFilePath);
        });

    } catch (error) {
        console.error('Error in Get Book File Endpoint:', error.message);
        res.status(500).json({ error: 'Failed to get book file.', details: error.message });
    }
});


// Fetch Recently Added Books
router.get('/recent', async (req, res) => {
    try {
        const recentBooks = await Book.find().select("-fileUrl").select("-vectorDBPath").sort({ createdAt: -1 }).limit(4);
        res.json({ recentBooks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch recently added books.', details: error.message });
    }
});

// Fetch Purchased Books (User)
router.get('/purchased', authMiddleware, async (req, res) => {
    const userId  = req.user.id

    try {
        const user = await User.findById(userId).populate('purchasedBooks');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ purchasedBooks: user.purchasedBooks });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch purchased books.', details: error.message });
    }
});

// Download a Book
router.post('/download/:bookId',authMiddleware, async (req, res) => {
    const { bookId } = req.params;
    const { deviceID } = req.body; // Sent by the mobile app

    try {
        // Fetch book details
        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ error: 'Book not found.' });
        
        const user = await User.findById(req.user.id);
        
        
        if (user.downloadedBooks.some((b) => 
            b.bookId.toString() === bookId && new Date(b.expiryDate) > new Date()
        )) {
            return res.status(400).json({ error: 'Book already downloaded on a device.' });
        }
        
        // console.log(bookId);
        // console.log(user.downloadedBooks[0].bookId.toString())
        // console.log(bookId)
        // console.log(user.downloadedBooks[0].bookId.toString() === bookId)
        // Decrypt the file from Google Drive using the global key
        const decryptedPath = path.join(__dirname, `../../temp/${bookId}-decrypted.pdf`);
        const encryptedPath = path.join(__dirname, `../../temp/${bookId}-encrypted.pdf`);
        await decryptFile(book.fileUrl, encryptedPath, decryptedPath);

        // Generate device-specific key
        const fillString = (str, char) => str.padStart((32 + str.length) / 2, char).padEnd(32, char);
        const deviceKey = fillString(deviceID,'H');

        // Re-encrypt with device-specific key
        const reEncryptedPath = path.join(__dirname, `../../temp/${bookId}-device-encrypted.pdf`);
        await encryptFile(decryptedPath, reEncryptedPath, deviceKey);

        if (!fs.existsSync(reEncryptedPath)) {
            return res.status(404).json({ error: `${reEncryptedPath} not found on server` });
        }

        // **Ensures correct file size is sent**
        const stats = fs.statSync(reEncryptedPath);
        res.setHeader('Content-Disposition', `attachment; filename="${book.title}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Transfer-Encoding', 'chunked'); // Forces streaming

        const fileStream = fs.createReadStream(reEncryptedPath);
        fileStream.pipe(res);

        // Find the book in downloadedBooks
        const existingBook = user.downloadedBooks.find((b) => b.bookId.toString() === bookId);

        if (existingBook) {
            // Update the expiry date if the book is already downloaded
            existingBook.expiryDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
        } else {
            // Add a new record if the book is not already downloaded
            user.downloadedBooks.push({ bookId, expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) });
        }

        // Save the updated user record
        await user.save();


        fs.unlinkSync(decryptedPath);
        fs.unlinkSync(reEncryptedPath);

        
    } catch (error) {
        res.status(500).json({ error: 'Failed to process the file', details: error.message });
        console.log(error.message);
    }
});

router.post('/downloaded/delete/:bookId', authMiddleware, async (req, res) => {
    const { bookId } = req.params;
    const userId = req.user.id;

    try {
        // Remove the book from user's downloadedBooks list
        await User.updateOne({ _id: userId }, { $pull: { downloadedBooks: { bookId } } });

        res.json({ message: "Book deleted successfully. It can now be re-downloaded on another device." });
    } catch (error) {
        res.status(500).json({ error: "Failed to update database after book deletion", details: error.message });
    }
});


// Delete a Book
router.delete('/delete/:bookId',authMiddleware, async (req, res) => {
    const { bookId } = req.params;
    const userId = req.user.id;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found!!!' });
        }

        const user = await User.findById(userId);
        if (!user || (user.role !== 'admin' && user._id.toString() !== book.uploadedBy.toString())) {
            return res.status(403).json({ error: 'Unauthorized: Only the admin or the uploader can delete this book!!!' });
        }

        // deleteFile(book.fileUrl.split('id=')[1]);

        // Remove book from the database
        await Book.findByIdAndDelete(bookId);
        console.log('Book deleted from database');

        res.status(200).json({ message: 'Book deleted successfully.' });
    } catch (error) {
        console.error('Error in Delete Book Endpoint:', error.message);
        res.status(500).json({ error: 'Failed to delete book!!!', details: error.message });
    }
});

//update book --admin
router.put("/updateBook", authMiddleware, async (req, res) => {
    try {
      const { bookid } = req.headers;
      await Book.findByIdAndUpdate(bookid, {
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        description: req.body.description,
        language: req.body.language,
      });
  
      return res.json({
        status: "Success",
        message: "Book Updated successfully!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });

// Add a Book to User's Purchased Books
router.post('/purchase/:bookId',authMiddleware, async (req, res) => {
    const   { bookId } = req.params;
    const     userId   = req.user.id;

    try {
        // Validate user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Validate book
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found.' });
        }

        // Check if the book is already purchased
        if (user.purchasedBooks.includes(bookId)) {
            return res.status(400).json({ error: 'Book already purchased.' });
        }

        // Add the book to the user's purchasedBooks
        user.purchasedBooks.push(bookId);
        await user.save();

        res.status(200).json({ message: 'Book added to purchased books.', purchasedBooks: user.purchasedBooks });
    } catch (error) {
        console.error('Error in Add to Purchased Books Endpoint:', error.message);
        res.status(500).json({ error: 'Failed to add book to purchased books.', details: error.message });
    }
});


// Route to get the books of a publisher
router.get("/getPublisherBooks", authMiddleware ,async (req, res) => {
    try {
        const uploadedBy   = req.user.id;
        const books = await Book.find({ uploadedBy }).select("-fileUrl").select("-vectorDBPath").sort({ createdAt: -1 }); // Filter by userId
        return res.json({
            status: "Success",
            data: books,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred" });
    }
});

module.exports = router;

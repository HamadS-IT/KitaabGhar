const express = require('express');
const axios = require('axios');
const Book = require('../models/Book');
const QuestionAnswer = require('../models/QuestionAnswer'); // MongoDB model for Q&A
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

// Ask a Question about a Book
router.post('/ask', authMiddleware, async (req, res) => {
    const { question, bookId } = req.body;
    const userId = req.user.id; // Authenticated user ID

    if (!question || !bookId) {
        return res.status(400).json({ error: 'Question and bookId are required.' });
    }

    try {
        // --- STEP 1: Retrieve the Vector Store Path from MongoDB ---
        const book = await Book.findById(bookId);
        if (!book || !book.vectorDBPath) {
            return res.status(404).json({ error: 'Book not found or embeddings not generated.' });
        }

        // --- STEP 2: Send Question & VectorDB Path to FastAPI ---
        const fastApiResponse = await axios.post('http://localhost:8000/ask', { 
            question, 
            vectorDBPath: book.vectorDBPath 
        });

        const { answer, page_numbers } = fastApiResponse.data;

        // --- STEP 3: Save Question & Answer in MongoDB ---
        const newQA = new QuestionAnswer({
            userId,
            bookId,
            question,
            answer,
            pageNumbers: page_numbers
        });

        await newQA.save();

        res.status(200).json({ 
            message: 'Question processed successfully.',
            question,
            answer,
            pageNumbers: page_numbers
        });
    } catch (error) {
        console.error('Error in Ask Question Endpoint:', error.message);
        res.status(500).json({ error: 'Failed to process question.', details: error.message });
    }
});

// Fetch past Q&A history for a book
router.get('/ask/history/:bookId', authMiddleware, async (req, res) => {
    const userId = req.user.id; // Authenticated user ID
    const { bookId } = req.params;

    try {
        // Fetch Q&A history for this user and book
        const history = await QuestionAnswer.find({ userId, bookId });

        res.status(200).json({ history });
    } catch (error) {
        console.error('Error fetching question history:', error.message);
        res.status(500).json({ error: 'Failed to retrieve history.', details: error.message });
    }
});

module.exports = router;

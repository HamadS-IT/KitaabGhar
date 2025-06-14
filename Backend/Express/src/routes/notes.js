const express = require('express');
const Note = require('../models/Note');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/addNote', authMiddleware , async (req, res) => {
    
    const { bookId, currentPage, noteTitle, noteContent } = req.body;
    const userId = req.user.id;
  
    try {
      const newNote = new Note({
        userId,
        bookId,
        currentPage,
        noteTitle,
        noteContent,
      });
  
      await newNote.save();
      res.status(201).json({ message: 'Note added successfully', note: newNote });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to add note' });
    }
  });
  


router.get("/getNotes/:bookId", authMiddleware ,async (req, res) => {
    try {

        const userId = req.user.id;
        const { bookId } = req.params;
  
        const notes = await Note.find({ userId, bookId }).sort({ createdAt: -1 });
  
        res.status(200).json({ notes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });
  

router.put('/updateNote', authMiddleware, async (req, res) => {
    const { noteID, noteTitle, noteContent } = req.body;
    
    if (!noteID || !noteTitle || !noteContent) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
  
      const updatedNote = await Note.findOneAndUpdate(
        { _id : noteID },
        { noteTitle, noteContent },
        { new: true }
      );
  
      if (!updatedNote) {
        return res.status(404).json({ message: 'Note not found' });
      }
      
      res.json({ message: 'Note updated successfully', updatedNote });
    } catch (err) {
      console.error("Error updating note:", err.message);
      res.status(500).json({ error: err.message });
    }
  });
  

router.delete('/deleteNote', authMiddleware, async (req, res) => {
    const { noteID } = req.body;
    console.log(noteID);
    try {
      const deletedNote = await Note.findOneAndDelete({ _id : noteID });
      if (!deletedNote) return res.status(404).json({ message: 'Note not found' });
      
      res.json({ message: 'Note deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
});
  

module.exports = router;

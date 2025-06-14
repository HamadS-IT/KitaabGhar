// models/Note.js
const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId       : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId       : { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  currentPage  : { type: Number,required: true },
  timestamp    : { type: Date, default: Date.now },
  noteTitle    : { type: String, required: true  },
  noteContent  : { type: String, required: true,},
});

module.exports = mongoose.model('Note', noteSchema);
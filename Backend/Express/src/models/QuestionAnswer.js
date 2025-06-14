const mongoose = require('mongoose');

const QuestionAnswerSchema = new mongoose.Schema({
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    question: { type: String, required: true },
    answer:   { type: String, required: true },
    pageNumbers: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('QuestionAnswer', QuestionAnswerSchema);

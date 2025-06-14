const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({

    title       : { type: String, required: true },
    author      : { type: String, required: true },
    description : { type: String, required: true },
    price       : { type: String, required: true },
    language    : { type: String, required: true },
    fileUrl     : { type: String, required: true },
    coverUrl    : { type: String },
    uploadedBy  : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt   : { type: Date, default: Date.now },
    vectorDB    : { type: String, default: 'No' },
    vectorDBPath: { type: String, default: '' },

});



module.exports = mongoose.model("Book", BookSchema);

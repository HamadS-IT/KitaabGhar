const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name             : { type: String, required: true },
  email            : { type: String, required: true, unique: true },
  password         : { type: String, required: true },
  role             : { type: String, enum: ['user', 'publisher', 'admin'], default: 'user' },
  deviceId         : { type: String, default: null },
  address          : { type: String, default: null },
  purchasedBooks   : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  profilePic       : { type: String, default: null },
  securityQuestion : {
      question     : { type: String, required: true },
      answer       : { type: String, required: true },
  },
  downloadedBooks: [
      {
          bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
          downloadDate: { type: Date, default: Date.now },
          expiryDate: { type: Date, default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) } // Auto expire after 90 days
      }
  ],
  favourite: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
  ],
  cart: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Book",
    },
  ],
  orders: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Order",
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);

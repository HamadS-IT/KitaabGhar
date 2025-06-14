const express = require('express');
const User = require("../models/User");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//add to cart
router.put("/addToCart", authMiddleware, async (req, res) => {
  try {
    const id  = req.user.id
    const { bookid } = req.headers;
    const userData = await User.findById(id);
    const isBookFavorited = userData.cart.includes(bookid);
    if (isBookFavorited) {
      return res.json({
        status: "Success",
        message: "Book is already in cart",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { cart: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book added to cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get cart of a particular user
router.get("/getUserCart", authMiddleware, async (req, res) => {
  try {
    const id  = req.user.id
    const userData = await User.findById(id).populate({path:"cart",select: "-fileUrl -vectorDBPath"});
    const cart = userData.cart.reverse();

    return res.json({
      status: "Success",
      data: cart,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//remove from cart
router.put("/removeFromCart/:bookid", authMiddleware, async (req, res) => {
  try {
    const { bookid } = req.params;
    const id  = req.user.id
    await User.findByIdAndUpdate(id, {
      $pull: { cart: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book removed from cart",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});
module.exports = router;

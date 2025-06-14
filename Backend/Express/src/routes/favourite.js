const express = require('express');
const User = require("../models/User");
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//add favourite book to user model
router.put("/addToFavourite", authMiddleware, async (req, res) => {
  try {

    const id  = req.user.id
    const { bookid } = req.headers;
    const userData = await User.findById(id);
    const isBookFavorited = userData.favourite.includes(bookid);
    if (isBookFavorited) {
      return res.json({
        status: "Success",
        message: "Book is already in favourites",
      });
    }
    await User.findByIdAndUpdate(id, {
      $push: { favourite: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book added to favourites",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get Favourite books of a particular user
router.get("/getFavouriteBooks", authMiddleware, async (req, res) => {
  try {
    const id  = req.user.id
    const userData = await User.findById(id).populate({path:"favourite", select: "-fileUrl -vectorDBPath"}).select("-fileUrl -vectorDBPath");
    const favouriteBooks = userData.favourite;
    return res.json({
      status: "Success",
      data: favouriteBooks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//remove from favourites
router.put("/removeFromFavourite", authMiddleware, async (req, res) => {
  try {
    const id  = req.user.id
    const { bookid } = req.headers;
    await User.findByIdAndUpdate(id, {
      $pull: { favourite: bookid },
    });

    return res.json({
      status: "Success",
      message: "Book removed from favourites",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});
module.exports = router;

const express = require('express');
const User = require("../models/User");
const authMiddleware = require('../middleware/authMiddleware');
const Book = require("../models/Book");
const Order = require("../models/order");

const router = express.Router();

//place order
router.post("/placeOrder", authMiddleware, async (req, res) => {
  try {
    const id  = req.user.id
    const { order } = req.body;
    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();
      //saving Order in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });
      //clearing cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get order history of particular user
router.get("/getOrderHistory", authMiddleware, async (req, res) => {
  try {
    const id  = req.user.id
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book", select: "-fileUrl -vectorDBPath"},
    });

    const ordersData = userData.orders.reverse();
    return res.json({
      status: "Success",
      data: ordersData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//get-all-orders ---admin
router.get("/getAllOrders", authMiddleware, async (req, res) => {
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
        select: "-fileUrl -vectorDBPath"
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.json({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

//update order --admin
router.put("/updateStatus/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate user
    const user = await User.findById(req.body.userId.toString());
    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    
    if (req.body.status === "Approved"){
      // Validate book
      const book = await Book.findById(req.body.bookId.toString());
      if (!book) {
          return res.status(404).json({ error: 'Book not found.' });
      }

      // Check if the book is already purchased
      if (user.purchasedBooks.includes(req.body.bookId.toString())) {
          
      }else{

      // Add the book to the user's purchasedBooks
      user.purchasedBooks.push(req.body.bookId.toString());
      await user.save();

    }}
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.json({
      status: "Success",
      message: "Status Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});
module.exports = router;

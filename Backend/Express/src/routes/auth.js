const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware'); // Import middleware

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { name, email, password, role, profilePic, question, answer, address } = req.body;
    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered!!!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            address,
            profilePic: profilePic || null,
            securityQuestion: {
                question: question,
                answer: await bcrypt.hash(answer, 10),
            },
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password, deviceID } = req.body;
    console.log(req.body);
    try {

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Email is not registered.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid Email or Password.' });

        // Check for device switch
        if (user.deviceId && user.deviceId !== deviceID) {
            return res.status(403).json({ error: 'Already logged in from another device.' });
        }

        // Update device ID
        user.deviceId = deviceID;
        await user.save();

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '90d' });
        res.json({ token, role: user.role, name: user.name, profilePic:user.profilePic, id: user._id });
    } catch (error) {
        res.status(500).json({ error: 'Unexpected Error: Try again after some time.', details: error.message });
    }
});

// Reset Password Using Security Question
router.post('/reset-password', async (req, res) => {
    const { email, answer, newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found!!!' });

        const isAnswerMatch = await bcrypt.compare(answer, user.securityQuestion.answer);
        if (!isAnswerMatch) return res.status(401).json({ error: 'Security answer is incorrect!!!' });

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Password reset failed!!!', details: error.message });
    }
});

// Logout
router.get('/logout', authMiddleware, async (req, res) => {
    const email = req.user.email;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found!!!' });

        user.deviceId = null;
        await user.save();

        res.json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Logout failed!!!', details: error.message });
    }
});

router.get('/getKey', authMiddleware, (req, res) => {
    const encryptionKey = process.env.ENCRYPTION_KEY;
    res.json({ encryptionKey });
});


router.get('/downloadedBooks', authMiddleware, async (req, res) => {
    try {
        const userId  = req.user.id;
    
        // Find user and select only downloadedBooks field
        const user = await User.findById(userId).select("downloadedBooks");
    
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        // Extract book IDs
        const downloadedBookIds = user.downloadedBooks.map(book => book.bookId);
    
        res.status(200).json({ downloadedBooks: downloadedBookIds });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
      }
});

//Get Users (individual) Profile Data
router.get("/getUserData", authMiddleware, async (req, res) => {
    try {
        
      const userId  = req.user.id;
  
      const data = await User.findById(userId);
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ message: "An error occurred" });
    }
  });

//Update address
router.put("/updateUserAddress", authMiddleware, async (req, res) => {
    try {
      const userId  = req.user.id;
      const { address } = req.body;
      await User.findByIdAndUpdate(userId, { address });
      return res.status(200).json({
        status: "Success",
        message: "Address updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "An error occurred" });
    }
  });


module.exports = router;

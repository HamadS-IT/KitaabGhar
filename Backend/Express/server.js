const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/database');


dotenv.config();

const app = express();

app.use(express.json());
app.use(cors()); // Allows all origins (use with caution)


// Connect to MongoDB
connectDB();


const authRoutes = require('./src/routes/auth');
app.use('/api/v1/auth', authRoutes);


const bookRoutes = require('./src/routes/books');
app.use('/api/v1/books', bookRoutes);


const semanticSearchRoutes = require('./src/routes/questionsAnswers');
app.use('/api/v1/semanticSearch', semanticSearchRoutes);


const noteRoutes = require('./src/routes/notes');
app.use('/api/v1/notes', noteRoutes);


const cartRoutes = require("./src/routes/cart");
app.use("/api/v1/cart", cartRoutes);


const favouriteRoutes = require("./src/routes/favourite");
app.use("/api/v1/favourite", favouriteRoutes);


const orderRoutes = require("./src/routes/order");
app.use("/api/v1/order", orderRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

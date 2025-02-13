const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const placeRoutes = require('./routes/placeRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Use the placeRoutes for the /places endpoint
app.use('/api', placeRoutes);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
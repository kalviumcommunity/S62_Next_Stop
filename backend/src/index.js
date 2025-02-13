// index.js
const express = require('express');
const app = express();
const connectDataBase = require('./config/database');
const userRoute = require('./routes/userRoute');

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to the database
connectDataBase();

// Mount the user route on the /api/users path
app.use('/users', userRoute);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

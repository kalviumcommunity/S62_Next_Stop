if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config();
  }
  
  const express = require("express");
  const mongoose = require("mongoose");
  const cors = require("cors");
  const connectDatabase = require("./DB/database.js");
  const routes = require("./routes/router.js");
  const authRoutes = require("./routes/authRoutes");
  const userRoutes = require("./routes/userRoutes"); // Import user routes
  
  const app = express();
  
  app.use(express.json());
  app.use(cors());
  
  const PORT = process.env.PORT || 8080;
  
  // Use Routes
  app.use("/api", routes);
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes); // Add user routes
  
  // Health Check Route
  app.get("/ping", (req, res) => res.send("pong"));
  
  // Database Connection Status Route
  app.get("/", (req, res) => {
    const status = mongoose.connection.readyState === 1 ? "Connected" : "Not Connected";
    res.send({ status });
  });
  
  // Start Server
  app.listen(PORT, () => {
    connectDatabase();
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
  
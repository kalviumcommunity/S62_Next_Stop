if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDatabase = require("./DB/database.js");
const routes = require("./routes/router.js");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// CLIENT_ORIGIN can be a comma-separated list; if unset, all origins are allowed.
const origins = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN.split(",").map((o) => o.trim())
  : true;

app.use(express.json());
app.use(cors({ origin: origins }));

const PORT = process.env.PORT || 8080;

// Routes
app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/ping", (req, res) => res.send("pong"));

// Database connection status
app.get("/", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "Connected" : "Not Connected";
  res.send({ status });
});

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Start server (skipped when this file is imported, e.g. by tests)
if (require.main === module) {
  connectDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}

module.exports = app;

require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const connectDatabase = require("./DB/database.js");
const routes = require("./routes/router.js");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const tripRoutes = require("./routes/tripRoutes");
const memoryRoutes = require("./routes/memoryRoutes");
const socialRoutes = require("./routes/socialRoutes");
const badgeRoutes = require("./routes/badgeRoutes");

const app = express();

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://localhost:3001"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
}));

const PORT = process.env.PORT || 8000;

app.use("/api", routes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/badges", badgeRoutes);

app.get("/ping", (req, res) => res.send("pong"));
app.get("/", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "Connected" : "Not Connected";
  res.send({ status });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to database:", err);
  process.exit(1);
});

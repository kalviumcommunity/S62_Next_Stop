const mongoose = require("mongoose");

const connectDatabase = async () => {
  // DB_URI is the expected name; DB_URL is accepted too (older .env files use it).
  const DB_URI = process.env.DB_URI || process.env.DB_URL;

  if (!DB_URI) {
    console.error("🔥 ERROR: DB_URI is missing. Copy backend/.env.example to backend/.env and set it.");
    process.exit(1);
  }

  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("🔥 MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;

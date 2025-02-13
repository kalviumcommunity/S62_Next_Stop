const mongoose = require("mongoose");

const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  console.error("🔥 ERROR: DB_URI is missing. Check your .env file.");
  process.exit(1);
}

const connectDatabase = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("🔥 MongoDB Connection Error:", error);
    process.exit(1);
  }
};

module.exports = connectDatabase;

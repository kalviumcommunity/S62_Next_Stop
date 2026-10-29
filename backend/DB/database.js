const mongoose = require("mongoose");

const connectDatabase = async () => {
  // DB_URI is the expected name; DB_URL is accepted too (older .env files use it).
  const DB_URI = process.env.DB_URI || process.env.DB_URL;

  if (!DB_URI) {
    console.error("🔥 ERROR: DB_URI is missing. Copy backend/.env.example to backend/.env and set it.");
    process.exit(1);
  }
const DB_URI = process.env.DB_URI;
const LOCAL_DB_URI = "mongodb://localhost:27017/nextstop"; // Fallback for local development

if (!DB_URI) {
  console.error("🔥 ERROR: DB_URI is missing. Check your .env file.");
  console.log("💡 TIP: For local development, you can use: mongodb://localhost:27017/yourdb");
  process.exit(1);
}

  try {
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("🔥 MongoDB Connection Error:", error.message);
    process.exit(1);
    console.log("🔄 Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(DB_URI);
    console.log("✅ MongoDB Atlas Connected Successfully!");
  } catch (atlasError) {
    console.error("❌ MongoDB Atlas Connection Failed:", atlasError.message);

    // Try local MongoDB as fallback
    console.log("🔄 Trying local MongoDB as fallback...");
    try {
      await mongoose.connect(LOCAL_DB_URI);
      console.log("✅ Local MongoDB Connected (Development Mode)");
      console.log("💡 TIP: Install MongoDB locally or fix Atlas credentials for production");
    } catch (localError) {
      console.error("❌ Local MongoDB also failed:", localError.message);
      console.log("\n🔧 TROUBLESHOOTING STEPS:");
      console.log("1. Check MongoDB Atlas credentials in .env file");
      console.log("2. Verify network access in Atlas dashboard");
      console.log("3. Ensure database user has read/write permissions");
      console.log("4. Install MongoDB locally: https://docs.mongodb.com/manual/installation/");
      console.log("5. Or use MongoDB Atlas free tier: https://cloud.mongodb.com");
      process.exit(1);
    }
  }
};

module.exports = connectDatabase;

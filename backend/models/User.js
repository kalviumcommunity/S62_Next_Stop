const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  earnedAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Invalid email format"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  bio: { type: String, maxlength: 200, default: "" },
  avatarUrl: { type: String, default: "" },
  badges: [badgeSchema],
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

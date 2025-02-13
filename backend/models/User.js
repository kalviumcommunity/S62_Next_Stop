const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true, match: [/.+\@.+\..+/, "Invalid email format"] },
  password: { type: String, required: [true, "Password is required"], minlength: [6, "Password must be at least 6 characters long"] },
});

module.exports = mongoose.model("User", UserSchema);

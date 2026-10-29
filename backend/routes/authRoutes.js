const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Secret Key (Store in .env)
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// ✅ Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ msg: "Password must be at least 6 characters long" });
  }

  try {
    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword });
    await user.save();

    console.log("✅ User registered successfully:", email);
    return res.status(201).json({ msg: "User registered successfully. Please login." });
  } catch (error) {
    console.error("🔥 Signup Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ Login attempt: User not found -", email);
      return res.status(400).json({ msg: "Invalid Credentials - user not found. Please sign up first." });
    }

    // Compare entered password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Login attempt: Wrong password for -", email);
      return res.status(400).json({ msg: "Invalid Credentials - password is incorrect." });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

    console.log("✅ Login successful:", email);
    res.json({ msg: "Login successful", token });
  } catch (error) {
    console.error("🔥 Login Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;

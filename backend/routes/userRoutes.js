const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");

const router = express.Router();

// ✅ Validation Middleware
const validateUser = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// 🟢 Register User API (POST /api/users/register)
router.post("/register", validateUser, async (req, res) => {
  // 🛑 Check Validation Errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;

    // 🔍 Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // ✅ Save New User
    const newUser = new User({ name, email, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;

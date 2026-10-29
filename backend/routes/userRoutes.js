const express = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Place = require("../models/itemModel");
const Trip = require("../models/Trip");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get current user profile
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Update user profile
router.put("/me", protect, async (req, res) => {
  try {
    const { name, email, bio, avatarUrl } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { name, email, bio, avatarUrl },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Get User Statistics & Dashboard Data
router.get("/me/stats", protect, async (req, res) => {
  try {
    const places = await Place.find({ user: req.userId });
    const trips = await Trip.find({ user: req.userId });

    const stats = {
      totalPlaces: places.length,
      visitedPlaces: places.filter(p => p.visited).length,
      wishlistPlaces: places.filter(p => !p.visited).length,
      favoriteCount: places.filter(p => p.favorite).length,
      
      // Category breakdown
      categories: {
        beach: places.filter(p => p.category === "beach").length,
        mountain: places.filter(p => p.category === "mountain").length,
        city: places.filter(p => p.category === "city").length,
        historical: places.filter(p => p.category === "historical").length,
        nature: places.filter(p => p.category === "nature").length,
        cultural: places.filter(p => p.category === "cultural").length,
        adventure: places.filter(p => p.category === "adventure").length,
        other: places.filter(p => p.category === "other").length,
      },

      // Trip statistics
      tripCount: trips.length,
      activeTrips: trips.filter(t => t.status === "ongoing").length,
      plannedTrips: trips.filter(t => t.status === "planned").length,
      completedTrips: trips.filter(t => t.status === "completed").length,
      
      // Recent activity
      recentPlaces: places.slice(-5).reverse(),
      upcomingTrips: trips
        .filter(t => t.status === "planned")
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 3),

      // Average rating
      averageRating: places.filter(p => p.rating).length > 0
        ? (places.filter(p => p.rating).reduce((sum, p) => sum + p.rating, 0) / places.filter(p => p.rating).length).toFixed(1)
        : 0,

    // ✅ Save New User (password hashed, same as /api/auth/signup)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: { _id: newUser._id, name: newUser.name, email: newUser.email },
    });
      // Financial statistics
      totalBudget: trips.reduce((sum, trip) => sum + (Number(trip.budget) || 0), 0),
      totalSpent: trips.reduce((sum, trip) => sum + (Number(trip.totalSpent) || 0), 0),
    };

    res.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;

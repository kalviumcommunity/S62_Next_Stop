const express = require("express");
const router = express.Router();
const Trip = require("../models/Trip");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ Create Trip
router.post("/", authMiddleware, async (req, res) => {
  const { name, description, startDate, endDate, budget, totalSpent, destination, status, notes, itinerary } = req.body;

  try {
    if (!name || !startDate || !endDate) {
      return res.status(400).json({ msg: "Name, startDate, and endDate are required" });
    }

    const trip = new Trip({
      name,
      description,
      startDate,
      endDate,
      budget: budget || 0,
      totalSpent: totalSpent || 0,
      destination,
      notes,
      itinerary: Array.isArray(itinerary) ? itinerary : [],
      status: status || "planned",
      user: req.userId,
    });

    await trip.save();
    console.log("✅ Trip created:", name);
    res.status(201).json({ msg: "Trip created successfully", trip });
  } catch (error) {
    console.error("🔥 Trip Creation Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// ✅ Get All Trips for User
router.get("/", authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.userId })
      .populate("places")
      .sort({ createdAt: -1 });

    res.json({ trips });
  } catch (error) {
    console.error("🔥 Get Trips Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// ✅ Get Single Trip
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, user: req.userId }).populate("places");

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    res.json(trip);
  } catch (error) {
    console.error("🔥 Get Trip Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// ✅ Update Trip
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    ).populate("places");

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    console.log("✅ Trip updated:", trip.name);
    res.json({ msg: "Trip updated successfully", trip });
  } catch (error) {
    console.error("🔥 Trip Update Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// ✅ Delete Trip
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, user: req.userId });

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    console.log("✅ Trip deleted:", trip.name);
    res.json({ msg: "Trip deleted successfully" });
  } catch (error) {
    console.error("🔥 Trip Delete Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// ✅ Add Place to Trip
router.post("/:tripId/places/:placeId", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.userId });

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    if (!trip.places.includes(req.params.placeId)) {
      trip.places.push(req.params.placeId);
      await trip.save();
    }

    res.json({ msg: "Place added to trip", trip });
  } catch (error) {
    console.error("🔥 Add Place to Trip Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// ✅ Remove Place from Trip
router.delete("/:tripId/places/:placeId", authMiddleware, async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.tripId, user: req.userId });

    if (!trip) {
      return res.status(404).json({ msg: "Trip not found" });
    }

    trip.places = trip.places.filter(id => id.toString() !== req.params.placeId);
    await trip.save();

    res.json({ msg: "Place removed from trip", trip });
  } catch (error) {
    console.error("🔥 Remove Place from Trip Error:", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;

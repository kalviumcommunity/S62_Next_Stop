const express = require("express");
const Place = require("../models/itemModel.js");
const protect = require("../middleware/authMiddleware.js");

const router = express.Router();

// ✅ Add a New Place
router.post("/new-places", protect, async (req, res) => {
    try {
        const { name, location, description, visited } = req.body;

        if (!name || !location) {
            return res.status(400).json({ message: "Name and location are required" });
        }

        const newPlace = new Place({ name, location, description, visited });
        await newPlace.save();

        res.status(201).json({ message: "Place added successfully", place: newPlace });
    } catch (error) {
        console.error("Error adding place:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// ✅ Get All Places
router.get("/", protect, async (req, res) => {
    try {
        const places = await Place.find();
        res.status(200).json(places);
    } catch (error) {
        console.error("Error fetching places:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

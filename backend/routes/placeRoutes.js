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

// ✅ Get All Places with Advanced Filtering and Sorting
router.get("/", protect, async (req, res) => {
    try {
        const {
            search,
            searchType = "all",
            category,
            visited,
            favorite,
            rating,
            sortBy = "name",
            sortOrder = "asc"
        } = req.query;

        let query = {};

        // Build search query based on searchType
        if (search) {
            const searchRegex = new RegExp(search, 'i'); // Case-insensitive search
            switch (searchType) {
                case "name":
                    query.name = searchRegex;
                    break;
                case "location":
                    query.location = searchRegex;
                    break;
                case "description":
                    query.description = searchRegex;
                    break;
                case "all":
                default:
                    query.$or = [
                        { name: searchRegex },
                        { location: searchRegex },
                        { description: searchRegex }
                    ];
                    break;
            }
        }

        // Add filters
        if (category) query.category = category;
        if (visited !== undefined && visited !== "") query.visited = visited === "true";
        if (favorite !== undefined && favorite !== "") query.favorite = favorite === "true";
        if (rating) query.rating = { $gte: parseInt(rating) };

        // Build sort object
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

        const places = await Place.find(query).sort(sortOptions);
        res.status(200).json({ places, total: places.length });
    } catch (error) {
        console.error("Error fetching places:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;

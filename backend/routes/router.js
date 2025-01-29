const express = require('express');
const Place = require('../models/itemModel'); 
const router = express.Router();

// ✅ Get all places
router.get('/places', async (req, res) => {
    try {
        const places = await Place.find();  
        return res.status(200).json(places);
    } catch (err) {
        console.error("Error fetching places:", err);
        return res.status(500).json({ message: err.message });
    }
});

// ✅ Add a new place
router.post('/new-places', async (req, res) => {
    try {
        const { name, location, description,visited } = req.body;

        if (!name || !location || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPlace = new Place({ name, location, description,visited });  
        const savedPlace = await newPlace.save();  
        return res.status(201).json({ message: "Place added successfully", savedPlace });
    } catch (err) {
        console.error("Error adding place:", err);
        return res.status(500).json({ message: err.message });
    }
});

// ✅ Update place
router.put('/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedPlace = await Place.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedPlace) {
            return res.status(404).json({ message: "Place not found or no changes made" });
        }
        return res.status(200).json({ message: "Place updated successfully", updatedPlace });
    } catch (err) {
        console.error("Error updating place:", err);
        return res.status(500).json({ message: err.message });
    }
});

// ✅ Delete place
router.delete('/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPlace = await Place.findByIdAndDelete(id);

        if (!deletedPlace) {
            return res.status(404).json({ message: "Place not found" });
        }
        return res.status(200).json({ message: "Place deleted successfully", deletedPlace });
    } catch (err) {
        console.error("Error deleting place:", err);
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;

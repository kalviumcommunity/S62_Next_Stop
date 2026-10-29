const express = require("express");
const mongoose = require("mongoose");
const Place = require("../models/itemModel");

const router = express.Router();

const PLACE_FIELDS = ["name", "location", "description", "imageUrl", "status", "visited", "favorite"];
const REVIEW_FIELDS = ["author", "rating", "comment"];

const pick = (obj = {}, keys) =>
  keys.reduce((acc, k) => (obj[k] !== undefined ? { ...acc, [k]: obj[k] } : acc), {});

const validId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid place id" });
  }
  next();
};

const handleError = (res, err, label) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message).join(", ");
    return res.status(400).json({ message });
  }
  console.error(`Error ${label}:`, err);
  return res.status(500).json({ message: "Something went wrong" });
};

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ✅ Get all places   GET /api/places?status=visited&q=paris&favorite=true
router.get("/places", async (req, res) => {
  try {
    const { status, q, favorite } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (favorite === "true") filter.favorite = true;
    if (q) {
      const rx = new RegExp(escapeRegex(q), "i");
      filter.$or = [{ name: rx }, { location: rx }];
    }
    const places = await Place.find(filter).sort({ updatedAt: -1 });
    return res.status(200).json(places);
  } catch (err) {
    return handleError(res, err, "fetching places");
  }
});

// ✅ Get one place
router.get("/places/:id", validId, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    return res.status(200).json(place);
  } catch (err) {
    return handleError(res, err, "fetching place");
  }
});

// ✅ Add a new place (/new-places is the original route, kept for compatibility)
const createPlace = async (req, res) => {
  try {
    const place = await Place.create(pick(req.body, PLACE_FIELDS));
    return res.status(201).json({ message: "Place added successfully", savedPlace: place });
  } catch (err) {
    return handleError(res, err, "adding place");
  }
};
router.post("/places", createPlace);
router.post("/new-places", createPlace);

// ✅ Update place
router.put("/places/:id", validId, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    place.set(pick(req.body, PLACE_FIELDS));
    await place.save();
    return res.status(200).json({ message: "Place updated successfully", updatedPlace: place });
  } catch (err) {
    return handleError(res, err, "updating place");
  }
});

// ✅ Delete place
router.delete("/places/:id", validId, async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) return res.status(404).json({ message: "Place not found" });
    return res.status(200).json({ message: "Place deleted successfully", deletedPlace });
  } catch (err) {
    return handleError(res, err, "deleting place");
const express = require('express');
const Place = require('../models/itemModel');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// GET /api/places - get all places with filters
router.get('/places', protect, async (req, res) => {
  try {
    const { visited, search, category } = req.query;
    let query = { user: req.userId };

    if (visited !== undefined) query.visited = visited === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }
    if (category) query.category = category;

    const places = await Place.find(query).sort({ createdAt: -1 });
    return res.status(200).json({ places });
  } catch (err) {
    console.error('Error fetching places:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/places/recommendations - tag-based recommendations
router.get('/places/recommendations', protect, async (req, res) => {
  try {
    const allPlaces = await Place.find({ user: req.userId });
    const categoryCount = allPlaces.reduce((acc, place) => {
      acc[place.category] = (acc[place.category] || 0) + 1;
      return acc;
    }, {});

    const sortedCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);

    const recommended = await Place.find({
      user: req.userId,
      visited: false,
      category: { $in: sortedCategories.slice(0, 2) },
    }).sort({ rating: -1, createdAt: -1 }).limit(6);

    return res.status(200).json({
      recommended,
      preferences: { topCategories: sortedCategories, totalSaved: allPlaces.length },
    });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/places/hidden-gems - unvisited places added long ago (forgotten gems)
router.get('/places/hidden-gems', protect, async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Unvisited places that are old, or have low rating, or rarely-explored categories
    const hiddenCategories = ['nature', 'historical', 'adventure', 'cultural'];

    const gems = await Place.find({
      user: req.userId,
      visited: false,
      $or: [
        { createdAt: { $lt: sixMonthsAgo } },
        { category: { $in: hiddenCategories } },
      ],
    }).sort({ createdAt: 1 }).limit(10);

    // If not enough old gems, fill with any unvisited places with hidden categories
    let result = gems;
    if (result.length < 4) {
      const extras = await Place.find({
        user: req.userId,
        visited: false,
        _id: { $nin: result.map(g => g._id) },
      }).sort({ createdAt: 1 }).limit(10 - result.length);
      result = [...result, ...extras];
    }

    return res.status(200).json({ gems: result });
  } catch (err) {
    console.error('Error fetching hidden gems:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /api/places/:id - get a single place
router.get('/places/:id', protect, async (req, res) => {
  try {
    const place = await Place.findOne({ _id: req.params.id, user: req.userId });
    if (!place) return res.status(404).json({ message: 'Place not found' });
    return res.status(200).json(place);
  } catch (err) {
    console.error('Error fetching place:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/places - add a new place
router.post('/places', protect, async (req, res) => {
  try {
    const { name, location, description, visited, category, rating, imageUrl, notes } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: 'Name and location are required' });
    }

    const newPlace = new Place({
      name, location, description,
      visited: visited || false,
      category: category || 'other',
      rating, imageUrl, notes,
      user: req.userId,
    });

    const savedPlace = await newPlace.save();
    return res.status(201).json({ message: 'Place added successfully', place: savedPlace });
  } catch (err) {
    console.error('Error adding place:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT /api/places/:id - update a place
router.put('/places/:id', protect, async (req, res) => {
  try {
    const updatedPlace = await Place.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPlace) return res.status(404).json({ message: 'Place not found' });
    return res.status(200).json({ message: 'Place updated successfully', place: updatedPlace });
  } catch (err) {
    console.error('Error updating place:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/places/:id - delete a place
router.delete('/places/:id', protect, async (req, res) => {
  try {
    const deletedPlace = await Place.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!deletedPlace) return res.status(404).json({ message: 'Place not found' });
    return res.status(200).json({ message: 'Place deleted successfully' });
  } catch (err) {
    console.error('Error deleting place:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Reviews (stored inside each place). Each returns the updated place.
const withPlace = (fn) => async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: "Place not found" });
    const earlyResponse = fn(place, req, res);
    if (earlyResponse) return earlyResponse;
    await place.save();
    return res.status(200).json(place);
  } catch (err) {
    return handleError(res, err, "saving review");
  }
};

const findReview = (place, req, res) => {
  const review = place.reviews.id(req.params.reviewId);
  if (!review) res.status(404).json({ message: "Review not found" });
  return review;
};

router.post(
  "/places/:id/reviews",
  validId,
  withPlace((place, req) => {
    place.reviews.push(pick(req.body, REVIEW_FIELDS));
  })
);

router.put(
  "/places/:id/reviews/:reviewId",
  validId,
  withPlace((place, req, res) => {
    const review = findReview(place, req, res);
    if (!review) return res;
    review.set(pick(req.body, REVIEW_FIELDS));
  })
);

router.delete(
  "/places/:id/reviews/:reviewId",
  validId,
  withPlace((place, req, res) => {
    const review = findReview(place, req, res);
    if (!review) return res;
    review.deleteOne();
  })
);

module.exports = router;

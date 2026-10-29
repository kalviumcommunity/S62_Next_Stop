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

module.exports = router;

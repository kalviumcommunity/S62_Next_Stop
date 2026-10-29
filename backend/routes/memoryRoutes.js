const express = require('express');
const router = express.Router();
const Memory = require('../models/Memory');
const Place = require('../models/itemModel');
const protect = require('../middleware/authMiddleware');

// GET /api/memories/:placeId - get all memories for a place
router.get('/:placeId', protect, async (req, res) => {
  try {
    const place = await Place.findOne({ _id: req.params.placeId, user: req.userId });
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const memories = await Memory.find({ place: req.params.placeId, user: req.userId })
      .sort({ createdAt: -1 });
    res.json({ memories });
  } catch (err) {
    console.error('Error fetching memories:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST /api/memories - add a new memory
router.post('/', protect, async (req, res) => {
  try {
    const { imageUrl, caption, notes, placeId } = req.body;

    if (!imageUrl || !placeId) {
      return res.status(400).json({ message: 'Image URL and place are required' });
    }

    const place = await Place.findOne({ _id: placeId, user: req.userId });
    if (!place) return res.status(404).json({ message: 'Place not found' });

    const memory = new Memory({
      imageUrl,
      caption: caption || '',
      notes: notes || '',
      place: placeId,
      user: req.userId,
    });

    await memory.save();
    res.status(201).json({ message: 'Memory saved!', memory });
  } catch (err) {
    console.error('Error saving memory:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE /api/memories/:id - delete a memory
router.delete('/:id', protect, async (req, res) => {
  try {
    const memory = await Memory.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!memory) return res.status(404).json({ message: 'Memory not found' });
    res.json({ message: 'Memory deleted' });
  } catch (err) {
    console.error('Error deleting memory:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

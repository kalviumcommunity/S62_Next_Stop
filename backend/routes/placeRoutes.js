const express = require('express');
const Place = require('../models/Place');

const router = express.Router();

router.post('/places', async (req, res) => {
  const { name, location, description, visited } = req.body;

  if (!name || !location) {
    return res.status(400).json({ error: 'Name and location are required' });
  }

  if (name.length < 3) {
    return res.status(400).json({ error: 'Name must be at least 3 characters long' });
  }

  if (location.length < 5) {
    return res.status(400).json({ error: 'Location must be at least 5 characters long' });
  }

  try {
    const place = new Place({
      name,
      location,
      description,
      visited
    });

    await place.save();

    res.status(201).json({ message: 'Place created successfully', place });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Server error while creating place' });
  }
});

module.exports = router;
